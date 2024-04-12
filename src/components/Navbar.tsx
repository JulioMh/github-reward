"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Fetchers } from "@/utils/fetchers";

const ReactUIWalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export const Navbar = () => {
  const route = useRouter();
  const { disconnecting, publicKey, connecting } = useWallet();
  const triedToConnect = useRef(false);

  useEffect(() => {
    if (disconnecting || (triedToConnect.current && !publicKey)) {
      Fetchers.POST("/logout");
      route.push("/login");
    }
    if (connecting) triedToConnect.current = true;
  }, [disconnecting, route, publicKey, connecting, triedToConnect]);

  return (
    <nav className="flex fixed w-screen">
      <div className="flex-1 flex justify-end m-8">
        <ReactUIWalletMultiButtonDynamic />
      </div>
    </nav>
  );
};
