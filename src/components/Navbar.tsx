"use client";
import dynamic from "next/dynamic";

const ReactUIWalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export const Navbar = () => {
  return (
    <nav className="flex fixed w-screen">
      <div className="flex-1 flex justify-end m-8">
        <ReactUIWalletMultiButtonDynamic />
      </div>
    </nav>
  );
};
