import { Repo } from "@/lib/data/repo";
import { SmartContract } from "@/lib/smart-contract";
import ThumbUpOutline from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUp from "@mui/icons-material/ThumbUpAlt";
import ThumbDownOutline from "@mui/icons-material/ThumbDownOffAlt";
import ThumbDown from "@mui/icons-material/ThumbDownAlt";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Vote, VoteType } from "@/lib/data/vote";
import { useNotify } from "@/lib/hooks/useNotify";
import { Loading } from "../Loading";
import { Subscription } from "@/lib/data/subscription";
import { Button } from "../Button";
import { useSessionStore } from "../SessionProvider";
import { Fetchers } from "@/utils/fetchers";

export const SubscriptionAction = ({
  client,
  repo,
  subscription,
  refetch,
  setSubscription,
}: {
  client: SmartContract;
  repo: Repo;
  subscription?: Subscription;
  refetch: () => void;
  setSubscription: Dispatch<SetStateAction<Subscription | undefined>>;
}) => {
  const session = useSessionStore((selector) => selector.session);
  const [waiting, setWaiting] = useState(false);
  const notify = useNotify();

  const fetch = useCallback(async () => {
    if (!client || !session) return;
    setWaiting(true);
    const sub = await client.query.getSubscription(
      session.user.github.id,
      repo
    );
    console.log(sub);
    setSubscription(sub);
    setWaiting(false);
  }, [client, repo, session, setSubscription]);

  useEffect(() => {
    fetch();
  }, [fetch, repo]);

  const onSubscribe = async () => {
    if (!session) return;
    setWaiting(true);
    const { payload } = await Fetchers.GET(`/repos/subscription`);

    const tx = await client.instructions.subscribe(
      repo,
      session.user.github.id,
      payload.coupon
    );

    await tx.wait(() => {
      setWaiting(false);
      refetch();
    });
  };

  const controllers = subscription ? (
    <Button>Claim</Button>
  ) : (
    <Button onClick={onSubscribe}>Subscribe</Button>
  );

  return (
    <div className="flex gap-4">
      {waiting ? <Loading text="Waiting" /> : controllers}
    </div>
  );
};
