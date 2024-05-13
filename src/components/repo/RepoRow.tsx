import { Repo } from "@/lib/data/repo";
import { SmartContract } from "@/lib/smart-contract";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { PublicKey } from "@solana/web3.js";
import { VoteAction } from "./Vote";

export const RepoRow = ({
  repo,
  client,
  refetch,
}: {
  repo: Repo;
  client: SmartContract;
  refetch: () => void;
}) => {
  return (
    <tr>
      <td>
        <div className="flex items-center">
          <span className="mr-2">{repo.name}</span>
          <a
            target="blank"
            href={`https://github.com/${repo.owner}/${repo.name}`}
          >
            <OpenInNewIcon fontSize="small" />
          </a>
        </div>
      </td>
      <td>{repo.owner}</td>
      <td>{repo.branch}</td>
      <td>{repo.votes.toNumber()}</td>
      <td>
        <VoteAction client={client} repo={repo} refetch={refetch} />
      </td>
    </tr>
  );
};
