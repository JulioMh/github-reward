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

export const useProgram = () => {
  const [client, setClient] = useState<SmartContract>();
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  useEffect(() => {
    let provider: Provider;
    if (!wallet) return;
    try {
      provider = getProvider();
    } catch {
      provider = new AnchorProvider(connection, wallet, {});
    }

    const program = new Program(idl as Idl, provider);
    setClient(SmartContract.getSmartContract(program, wallet));
  }, []);

  return { client };
};
