"use client";
import { Loading } from "@/components/Loading";
import { GitHubAccount } from "@/lib/data/github";
import { useSignMsg } from "@/lib/hooks/useSignMsg";
import { GH_DATA_LS, NONCE_LS, useAuthStore } from "@/lib/store/authStore";
import { makeId } from "@/utils/string";
import { useLocalStorage, useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [waitingForGitHub, setWaitingForGitHub] = useState(false);
  const { publicKey, signMessage } = useWallet();
  const [_, persistNonce] = useLocalStorage<string | undefined>(
    NONCE_LS,
    undefined
  );

  const { signMsg, msgSignature, error } = useSignMsg({
    publicKey,
    signMessage,
  });

  useEffect(() => {
    if (msgSignature) persistNonce(msgSignature);
  }, [msgSignature, persistNonce]);

  const onSignIn = () => {
    const msg = `We need you to sign this message in order to log in\n\n${makeId(
      10
    )}`;
    signMsg(msg);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {!publicKey && <span>Connect your wallet</span>}
      {publicKey && !msgSignature && (
        <button className="btn-primary" onClick={onSignIn}>
          Sign In
        </button>
      )}
      {error && publicKey && (
        <span className="text-red-500	text-sm	">
          Your signature is required to proceed, please try again
        </span>
      )}
      {publicKey &&
        msgSignature &&
        (!waitingForGitHub ? (
          <a
            className="btn-primary"
            onClick={() => setWaitingForGitHub(true)}
            href={
              "https://github.com/login/oauth/authorize" +
              `?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}` +
              `&state=${msgSignature}`
            }
          >
            {" "}
            {"Connect with GitHub"}
          </a>
        ) : (
          <Loading text="Connecting" />
        ))}
    </div>
  );
}
