"use client";
import React, { FC, useCallback, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider as WalletProviderPkg,
} from "@solana/wallet-adapter-react";
import {
  Adapter,
  WalletAdapterNetwork,
  WalletError,
} from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import {
  WalletDialogProvider as MaterialUIWalletDialogProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-material-ui";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { NodeProps } from "@/utils/props";

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

export const WalletProvider: FC<NodeProps> = ({ children }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      /**
       * Wallets that implement either of these standards will be available automatically.
       *
       *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
       *     (https://github.com/solana-mobile/mobile-wallet-adapter)
       *   - Solana Wallet Standard
       *     (https://github.com/anza-xyz/wallet-standard)
       *
       * If you wish to support a wallet that supports neither of those standards,
       * instantiate its legacy wallet adapter here. Common legacy adapters can be found
       * in the npm package `@solana/wallet-adapter-wallets`.
       */
      new PhantomWalletAdapter(),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProviderPkg wallets={wallets} autoConnect>
        <MaterialUIWalletDialogProvider>
          <WalletModalProvider>{children}</WalletModalProvider>
        </MaterialUIWalletDialogProvider>
      </WalletProviderPkg>
    </ConnectionProvider>
  );
};
