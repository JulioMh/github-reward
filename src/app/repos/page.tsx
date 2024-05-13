"use client";

import { Loading } from "@/components/Loading";
import { useProgram } from "@/lib/hooks/useProgram";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { RepoRow } from "@/components/repo/RepoRow";
import { PublicKey } from "@solana/web3.js";
import { Repo } from "@/lib/data/repo";

export default function Repos() {
  const { client } = useProgram();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetch = useCallback(async () => {
    if (!client) return;
    const repos = await client.query.getRepos();
    setRepos(repos);
    setLoading(false);
  }, [client]);

  useEffect(() => {
    fetch();
  }, [client, fetch]);

  const refetchItem = async (publicKey: PublicKey, index: number) => {
    if (!client) return;
    const newRepo = await client.query.refetchRepo(publicKey);
    setRepos(repos.map((repo, i) => (i === index ? newRepo : repo)));
  };

  return (
    <div className="flex flex-col items-stretch mt-16 gap-8">
      <Link className="self-start btn-primary" href={"/repos/propose"}>
        Propose repo
      </Link>
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
              refetch={() => refetchItem(repo.publicKey, i)}
            />
          ))}
        </tbody>
      </table>
      {loading && <Loading text="Fetching from blockchain" />}
    </div>
  );
}
