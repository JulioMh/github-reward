"use client";

import useSWR from "swr";
import { useRouter, useSearchParams } from "next/navigation";
import { Fetchers } from "@/utils/fetchers";
import { Suspense, useEffect, useRef, useState } from "react";
import { Loading } from "@/components/Loading";
import { useNotify } from "@/lib/hooks/useNotify";
import { useLocalStorage, useWallet } from "@solana/wallet-adapter-react";
import { Exceptions, isValidException } from "@/lib/exceptions";
import { prisma } from "@/lib/db";

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
  const paramsError = searchParams.get("error");
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const [nonce, setNonce] = useLocalStorage<string | null>("nonce", null);
  const [error, setError] = useState([false, ""]);

  const updateUser = async ({ id }: { id: string }) => {
    if (!publicKey) return;
    const res = await Fetchers.PUT([
      `/user/${id}`,
      { publicKey: publicKey.toString() },
    ]);
    if (!res.error) loggedIn();
    else setError([true, res.error]);
  };

  const loggedIn = () => {
    setNonce(null);
    window.location.href = window.location.origin;
  };

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
      `/login?code=${code}&publicKey=${publicKey.toString()}`,
    Fetchers.GET
  );

  if (isValidException(data) || error[0] || swrError || paramsError) {
    if (!error[0] && data?.code === Exceptions.account_in_use.code) {
      return (
        <>
          <span>This account is linked to another wallet</span>
          <button
            className="btn-primary"
            onClick={() => updateUser(data.payload)}
          >
            Click here to change it
          </button>
        </>
      );
    }
    return (
      <>
        <span>
          {data.error ??
            (error[0] && error[1]) ??
            "Your account information could not be retrieved"}
        </span>
        {error[0] ? (
          <></>
        ) : (
          <>
            <Loading text="We are trying again" />
            <button
              className="btn-primary"
              onClick={() => route.push("/login")}
            >
              If nothing happens, click here to start the process again
            </button>
          </>
        )}
      </>
    );
  }
  if (!data) return <Loading text="Retrieving information" />;

  loggedIn();
}
