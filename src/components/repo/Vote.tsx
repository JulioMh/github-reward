import { Repo } from "@/lib/data/repo";
import { SmartContract } from "@/lib/smart-contract";
import ThumbUpOutline from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUp from "@mui/icons-material/ThumbUpAlt";
import ThumbDownOutline from "@mui/icons-material/ThumbDownOffAlt";
import ThumbDown from "@mui/icons-material/ThumbDownAlt";
import { useCallback, useEffect, useState } from "react";
import { Vote, VoteType } from "@/lib/data/vote";
import { useNotify } from "@/lib/hooks/useNotify";
import { Loading } from "../Loading";

export const VoteAction = ({
  client,
  repo,
  refetch,
}: {
  client: SmartContract;
  repo: Repo;
  refetch: () => void;
}) => {
  const [vote, setVote] = useState<Vote | null>();
  const [waiting, setWaiting] = useState(false);
  const notify = useNotify();

  const fetch = useCallback(async () => {
    if (!client) return;
    const vote = await client.query.getVote(repo);
    setVote(vote);
  }, [client, repo]);

  useEffect(() => {
    fetch();
  }, [fetch, repo]);

  const onVote = async (voteType: VoteType) => {
    setWaiting(true);
    const tx = await client.instructions.voteRepo(repo, voteType);
    await tx.wait(() => {
      setWaiting(false);
      refetch();
    });
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

  return (
    <div className="flex gap-4">
      {waiting ? <Loading text="Waiting" /> : controllers}
    </div>
  );
};
