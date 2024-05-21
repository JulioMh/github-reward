"use client";

import { create } from "zustand";
import { useEffect } from "react";
import {
  AnchorWallet,
  useAnchorWallet,
  useConnection,
} from "@solana/wallet-adapter-react";
import { SmartContract } from "@/lib/smart-contract";
import { useNotify } from "@/lib/hooks/useNotify";
import {
  AnchorProvider,
  Idl,
  Program,
  Provider,
  getProvider,
} from "@coral-xyz/anchor";
import idl from "../../smart_contract.json";

type State = { client?: SmartContract };
type Action = {
  setClient: (client: SmartContract) => void;
};

export const useProgramStore = create<State & Action>((set) => ({
  setClient: (client: SmartContract) => set((state) => ({ ...state, client })),
}));

export const SmartContractProvider = () => {
  const { connection } = useConnection();
  const notify = useNotify();
  const wallet = useAnchorWallet();

  const client = useProgramStore((state) => state.client);
  const setClient = useProgramStore((state) => state.setClient);

  useEffect(() => {
    if (client) return;
    let provider: Provider;
    if (!wallet) return;
    try {
      provider = getProvider();
    } catch {
      provider = new AnchorProvider(connection, wallet, {});
    }

    const program = new Program(idl as Idl, provider);
    setClient(
      SmartContract.getSmartContract(program, wallet, {
        notify,
      })
    );
  }, [client, connection, wallet, notify, setClient]);

  return <></>;
};
