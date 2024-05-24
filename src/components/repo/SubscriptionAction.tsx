import { Repo } from "@/lib/data/repo";
import { Dispatch, SetStateAction, useCallback, useEffect } from "react";
import { Loading } from "../Loading";
import { Subscription } from "@/lib/data/subscription";
import { Button } from "../Button";
import { useSessionStore } from "../providers/SessionProvider";
import { Fetchers } from "@/utils/fetchers";
import { TxnSignature } from "@/lib/smart-contract/txn_signature";
import { useProgramStore } from "../providers/SmartContractProvider";
import { useLoading } from "@/lib/hooks/useLoading";
import { isValidException } from "@/lib/exceptions";
import { useNotify } from "@/lib/hooks/useNotify";

export const SubscriptionAction = ({
  repo,
  subscription,
  refetch,
  setSubscription,
}: {
  repo: Repo;
  subscription?: Subscription;
  refetch: () => void;
  setSubscription: Dispatch<SetStateAction<Subscription | undefined>>;
}) => {
  const { query, sign, confirmation, loading } = useLoading();
  const session = useSessionStore((selector) => selector.session);
  const notify = useNotify();
  const { client } = useProgramStore();

  const fetch = useCallback(async () => {
    if (!client || !session) return;
    const sub = await query(() =>
      client.query.getSubscription(session.user.github.id, repo)
    );
    setSubscription(sub);
  }, [client, repo, session, setSubscription]);

  useEffect(() => {
    fetch();
  }, [fetch, repo]);

  const onSubscribe = async (): Promise<TxnSignature | undefined> => {
    if (!session || !client) return;
    const { payload } = await Fetchers.GET(`/subscription`);

    const tx = await sign(() =>
      client.instructions.subscribe(
        repo,
        session.user.github.id,
        payload.coupon
      )
    );
    if (!tx) return;
    await confirmation(tx, () => tx.wait(refetch));
  };

  const onClaim = async () => {
    if (!session || !client || !subscription) return;
    const { payload, coupon, error } = await query<any>(() =>
      Fetchers.POST([
        "/subscription/claim",
        { repo, subscribedAt: subscription.subscribedAt.toNumber() },
      ])
    );
    if (isValidException(error)) {
      notify("warning", error.msg);
      return;
    }
    const tx = await sign(() =>
      client.instructions.claim(repo, payload, coupon)
    );
    if (!tx) return;
    await confirmation(tx, refetch);
  };

  const controllers = subscription ? (
    <Button onClick={onClaim}>Claim</Button>
  ) : (
    <Button onClick={onSubscribe}>Subscribe</Button>
  );

  return <div className="flex gap-4">{loading ? loading : controllers}</div>;
};
