"use client";

import { Loading } from "@/components/Loading";
import { useProgram } from "@/lib/hooks/useProgram";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { PublicKey } from "@solana/web3.js";
import { Repo } from "@/lib/data/repo";
import ProposedTable from "@/components/repo/tables/ProposedTable";
import ApprovedTable from "@/components/repo/tables/ApprovedTable";

enum TableType {
  approved = "Approved",
  proposed = "Proposed",
}

export default function Repos() {
  const { client } = useProgram();
  const [tableType, setTableType] = useState(TableType.approved);
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
      <div className="flex flex-row justify-between">
        <Link className="self-start btn-primary" href={"/repos/propose"}>
          Propose repo
        </Link>
        <select
          className="border-white bg-black text-center"
          name="select"
          onChange={(e) =>
            setTableType(
              Object.values(TableType).find(
                (target) => target === e.target.value
              )!
            )
          }
        >
          <option>{TableType.approved}</option>
          <option>{TableType.proposed}</option>
        </select>
      </div>
      {tableType === TableType.proposed && client && (
        <ProposedTable
          repos={repos.filter((e) => !e.approved)}
          refetch={refetchItem}
          client={client}
        />
      )}
      {tableType === TableType.approved && client && (
        <ApprovedTable
          repos={repos.filter((e) => e.approved)}
          refetch={refetchItem}
          client={client}
        />
      )}
      {loading && <Loading text="Fetching from blockchain" />}
    </div>
  );
}
