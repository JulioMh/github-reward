"use client";

import { GitHubAccount } from "@/lib/data/github";
import { GH_DATA_LS, useAuthStore } from "@/lib/store/authStore";
import { useLocalStorage, useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const route = useRouter();
  const { publicKey, disconnecting } = useWallet();
  const [gitHubAccountLS, setGitHubAccountLS] = useLocalStorage<
    GitHubAccount | undefined
  >(GH_DATA_LS, undefined);

  const { gitHubAccount, setGitHubAccount, reset } = useAuthStore();

  useEffect(() => {
    if (disconnecting || !publicKey) {
      setGitHubAccountLS(undefined);
      reset();
      route.push("/login");
    } else if (!gitHubAccountLS && gitHubAccount) {
      setGitHubAccountLS(gitHubAccount);
    } else if (gitHubAccountLS && !gitHubAccount) {
      setGitHubAccount(gitHubAccountLS);
    } else if (!gitHubAccount && !gitHubAccountLS) {
      route.push("/login");
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
    <main className="flex flex-col items-center gap-8 mt-32">
      <span>
        {!gitHubAccount || !gitHubAccountLS
          ? "Loading..."
          : `Welcome ${gitHubAccount.name}!`}
      </span>
    </main>
  );
}
