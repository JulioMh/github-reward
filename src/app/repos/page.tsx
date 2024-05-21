"use client";

import { Loading } from "@/components/Loading";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { PublicKey } from "@solana/web3.js";
import { Repo } from "@/lib/data/repo";
import ProposedTable from "@/components/repo/tables/ProposedTable";
import ApprovedTable from "@/components/repo/tables/ApprovedTable";
import { useProgramStore } from "@/components/providers/SmartContractProvider";
import { useLoading } from "@/lib/hooks/useLoading";
import { useSearchParams } from "next/navigation";

export enum TableType {
  approved = "Approved",
  proposed = "Proposed",
}

const fromStringToTableType = (value: string | null): TableType => {
  return (
    Object.values(TableType).find(
      (target) => target.toLowerCase() === value?.toLowerCase()
    ) ?? TableType.approved
  );
};

export default function Repos() {
  const { client } = useProgramStore();
  const { query, loading } = useLoading();
  const params = useSearchParams();
  const table = params.get("table");
  const [tableType, setTableType] = useState(fromStringToTableType(table));
  const [repos, setRepos] = useState<Repo[]>([]);

  const fetch = useCallback(async () => {
    if (!client) return;
    const repos = await query(() => client.query.getRepos());
    setRepos(repos);
  }, [client]);

  useEffect(() => {
    fetch();
  }, [client, fetch]);

  const refetchItem = async (publicKey: PublicKey, index: number) => {
    if (!client) return;
    const newRepo = await query(() => client.query.refetchRepo(publicKey));
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
          value={tableType}
          onChange={(e) => setTableType(fromStringToTableType(e.target.value))}
        >
          <option>{TableType.approved}</option>
          <option>{TableType.proposed}</option>
        </select>
      </div>
      {tableType === TableType.proposed && client && (
        <ProposedTable
          repos={repos.filter((e) => !e.approved)}
          refetch={refetchItem}
        />
      )}
      {tableType === TableType.approved && client && (
        <ApprovedTable
          repos={repos.filter((e) => e.approved)}
          refetch={refetchItem}
        />
      )}
      {loading}
    </div>
  );
}
