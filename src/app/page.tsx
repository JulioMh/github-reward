"use client";

import { Loading } from "@/components/Loading";
import { GitHubAccount } from "@/lib/data/github";
import { GH_DATA_LS, useAuthStore } from "@/lib/store/authStore";
import { useLocalStorage, useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const route = useRouter();
  const { publicKey, disconnecting } = useWallet();
  const [gitHubAccountLS, setGitHubAccountLS] =
    useLocalStorage<GitHubAccount | null>(GH_DATA_LS, null);
  const { gitHubAccount, setGitHubAccount, reset } = useAuthStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!gitHubAccountLS) {
      route.push("/login");
    } else if (!gitHubAccount) {
      setGitHubAccount(gitHubAccountLS);
    }
  }, [
    setGitHubAccount,
    setGitHubAccountLS,
    reset,
    publicKey,
    disconnecting,
    gitHubAccount,
    gitHubAccountLS,
    route,
  ]);

  return (
    <div className="flex flex-col items-center gap-8 mt-32">
      {!isClient || !gitHubAccountLS ? (
        <Loading />
      ) : (
        <span
          suppressHydrationWarning
        >{`Welcome ${gitHubAccountLS.name}!`}</span>
      )}
    </div>
  );
}
