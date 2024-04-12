"use client";

import useSWR from "swr";
import { useRouter, useSearchParams } from "next/navigation";
import { Fetchers } from "@/utils/fetchers";
import { Suspense, useEffect, useRef, useState } from "react";
import { Loading } from "@/components/Loading";
import { useNotify } from "@/lib/hooks/useNotify";
import { useLocalStorage, useWallet } from "@solana/wallet-adapter-react";

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
  const { publicKey } = useWallet();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const [nonce, setNonce] = useLocalStorage<string | null>("nonce", null);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      if (!code || !state) {
        notify("error", "Missing required parameters");
        route.push("/login");
      }
    }
  }, [code, state, notify, route]);

  const { data, error: swrError } = useSWR(
    publicKey &&
      nonce === state &&
      `/login/api?code=${code}&publicKey=${publicKey.toString()}`,
    Fetchers.GET
  );

  if (!data) return <Loading text="Retrieving information" />;
  if (data.error || error || swrError) {
    return (
      <>
        <span>
          {data.error ?? "Your account information could not be retrieved"}
        </span>
        <Loading text="We are trying again" />
        <button className="btn-primary" onClick={() => route.push("/login")}>
          If nothing happens, click here to start the process again
        </button>
      </>
    );
  }

  setNonce(null);
  route.push("/");
}
