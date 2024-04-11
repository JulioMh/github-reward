"use client";
import { GitHubAccount } from "@/lib/data/github";
import { GH_DATA_LS, useAuthStore } from "@/lib/store/authStore";
import { useLocalStorage, useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const ReactUIWalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export const Navbar = () => {
  const route = useRouter();
  const { disconnecting, publicKey, connecting } = useWallet();
  const triedToConnect = useRef(false);
  const [_, setGitHubAccountLS] = useLocalStorage<GitHubAccount | null>(
    GH_DATA_LS,
    null
  );
  const { reset } = useAuthStore();

  useEffect(() => {
    if (disconnecting || (triedToConnect.current && !publicKey)) {
      setGitHubAccountLS(null);
      reset();
      route.push("/login");
    }
    if (connecting) triedToConnect.current = true;
  }, [
    reset,
    disconnecting,
    route,
    setGitHubAccountLS,
    publicKey,
    connecting,
    triedToConnect,
  ]);

  return (
    <nav className="flex fixed w-screen">
      <div className="flex-1 flex justify-end m-8">
        <ReactUIWalletMultiButtonDynamic />
      </div>
    </nav>
  );
};
