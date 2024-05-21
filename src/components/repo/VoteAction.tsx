import { Repo } from "@/lib/data/repo";
import { SmartContract } from "@/lib/smart-contract";
import ThumbUpOutline from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUp from "@mui/icons-material/ThumbUpAlt";
import ThumbDownOutline from "@mui/icons-material/ThumbDownOffAlt";
import ThumbDown from "@mui/icons-material/ThumbDownAlt";
import { useCallback, useEffect, useState } from "react";
import { Vote, VoteType } from "@/lib/data/vote";
import { useProgramStore } from "../providers/SmartContractProvider";
import { useLoading } from "@/lib/hooks/useLoading";

export const VoteAction = ({
  repo,
  refetch,
}: {
  repo: Repo;
  refetch: () => void;
}) => {
  const { client } = useProgramStore();
  const { sign, query, confirmation, loading } = useLoading();
  const [vote, setVote] = useState<Vote | null>();

  const fetch = useCallback(async () => {
    if (!client) return;
    const vote = await query(() => client.query.getVote(repo));
    setVote(vote);
  }, [client, repo]);

  useEffect(() => {
    fetch();
  }, [fetch, repo]);

  const onVote = async (voteType: VoteType) => {
    if (!client) return;
    const tx = await sign(() => client.instructions.vote(repo, voteType));
    if (!tx) return;
    await confirmation(tx, refetch);
  };

  const controllers = (
    <>
      <button onClick={() => onVote(VoteType.up)}>
        {vote?.voteType === VoteType.up ? <ThumbUp /> : <ThumbUpOutline />}
      </button>
      <button onClick={() => onVote(VoteType.down)}>
        {vote?.voteType === VoteType.down ? (
          <ThumbDown />
        ) : (
          <ThumbDownOutline />
        )}
      </button>
    </>
  );

  return <div className="flex gap-4">{loading ? loading : controllers}</div>;
};
