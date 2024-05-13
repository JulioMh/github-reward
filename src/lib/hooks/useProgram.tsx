import {
  AnchorProvider,
  Idl,
  Program,
  Provider,
  getProvider,
} from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import idl from "../../smart_contract.json";
import { SmartContract } from "../smart-contract";
import { useNotify } from "./useNotify";

export const useProgram = () => {
  const [client, setClient] = useState<SmartContract>();
  const { connection } = useConnection();
  const notify = useNotify();
  const wallet = useAnchorWallet();

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
    setClient(SmartContract.getSmartContract(program, wallet, notify));
  }, [client, connection, wallet, notify]);

  return { client };
};
