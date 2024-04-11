"use client";

import useSWR from "swr";
import { useRouter, useSearchParams } from "next/navigation";
import { GH_DATA_LS, NONCE_LS, useAuthStore } from "@/lib/store/authStore";
import { GitHubAccount, isValidGitHubAccount } from "@/lib/data/github";
import { fetcher } from "@/utils/fetchers";
import { Suspense, useEffect, useRef, useState } from "react";
import { Loading } from "@/components/Loading";
import { useNotify } from "@/lib/hooks/useNotify";
import { useLocalStorage } from "@solana/wallet-adapter-react";

export default function GitHubConnectWrapper() {
  return (
    <Suspense>
      <GitHubConnect />
    </Suspense>
  );
}

function GitHubConnect() {
  const route = useRouter();
  const notify = useNotify();
  const firstRenderRef = useRef(true);
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const [nonce, setNonce] = useLocalStorage<string | null>(NONCE_LS, null);
  const [gitHubAccountSL, setGitHubAccountLS] =
    useLocalStorage<GitHubAccount | null>(GH_DATA_LS, null);

  const { setGitHubAccount } = useAuthStore();

  const validNonce = nonce === state;

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      if (!code || !state) {
        notify("error", "Missing required parameters");
        route.push("/login");
      }
    }
  }, [code, state, notify, route]);

  const { data, error: swrError } = useSWR<
    GitHubAccount | { error: string },
    any
  >(validNonce && `/login/github/api?code=${code}`, fetcher);
  console.log(data);
  if ((data && !isValidGitHubAccount(data)) || error || swrError) {
    return (
      <>
        <span>Your account information could not be retrieved</span>
        <Loading text="We are trying again" />
        <button className="btn-primary" onClick={() => route.push("/login")}>
          If nothing happens, click here to start the process again
        </button>
      </>
    );
  }

  if (data) {
    setGitHubAccountLS(data);
    setGitHubAccount(data);
    setNonce(null);
    route.push("/");
  }

  return <Loading text="Retrieving information" />;
}
