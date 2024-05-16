"use client";

import { RepoRow } from "@/components/repo/tables/RepoRow";
import { PublicKey } from "@solana/web3.js";
import { Repo } from "@/lib/data/repo";
import { SmartContract } from "@/lib/smart-contract";

export default function ProposedTable({
  repos,
  client,
  refetch,
}: {
  repos: Repo[];
  client: SmartContract;
  refetch: (publicKey: PublicKey, index: number) => void;
}) {
  return (
    <table className="table-auto self-center w-full border-separate border-spacing-2">
      <thead className="text-left">
        <tr>
          <th>Name</th>
          <th>Owner</th>
          <th>Branch</th>
          <th>Votes</th>
        </tr>
      </thead>
      <tbody>
        {repos.map((repo, i) => (
          <RepoRow
            key={i}
            client={client!}
            repo={repo}
            refetch={() => refetch(repo.publicKey, i)}
          />
        ))}
      </tbody>
    </table>
  );
}
