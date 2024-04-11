"use client";

import useSWR, { Fetcher } from "swr";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocalStorage } from "@solana/wallet-adapter-react";
import { GH_DATA_LS, NONCE_LS, useAuthStore } from "@/lib/store/authStore";
import { GitHubAccount, isValidGitHubAccount } from "@/lib/data/github";
import { fetcher } from "@/utils/fetchers";
import { Suspense } from "react";

export default function GitHubConnectWrapper() {
  return (
    <Suspense>
      <GitHubConnect />
    </Suspense>
  );
}

function GitHubConnect() {
  const route = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const [nonce] = useLocalStorage<string | undefined>(NONCE_LS, undefined);
  const [gitHubAccount, setGitHubAccountLS] = useLocalStorage<
    GitHubAccount | undefined
  >(GH_DATA_LS, undefined);

  const { setGitHubAccount } = useAuthStore();

  const validNonce = nonce === state;

  const { data, error: swrError } = useSWR<
    GitHubAccount | { error: string },
    any
  >(validNonce && `/login/github/api?code=${code}`, fetcher);

  if ((data && !isValidGitHubAccount(data)) || error || swrError) {
    return (
      <div className="flex flex-col items-center p-32 gap-8">
        <span>Your account information could not be retrieved</span>
        <button className="btn-primary">Try again</button>
      </div>
    );
  }

  if (data && !gitHubAccount) {
    setGitHubAccountLS(data);
    setGitHubAccount(data);
    route.push("/");
  }

  return (
    <div className="flex flex-col items-center p-32 gap-8">Loading...</div>
  );
}
