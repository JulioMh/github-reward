import {
  AnchorProvider,
  Idl,
  Program,
  Provider,
  getProvider,
  setProvider,
  web3,
} from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import idl from "../../smart_contract.json";
import { useNotify } from "./useNotify";

export const useProgram = () => {
  const [program, setProgram] = useState<Program<Idl>>();
  const [counter, setCounter] = useState<web3.PublicKey>();
  const notify = useNotify();
  const [count, setCount] = useState(0);
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  useEffect(() => {
    let provider: Provider;
    if (!wallet) return;
    try {
      provider = getProvider();
    } catch {
      provider = new AnchorProvider(connection, wallet, {});
      setProvider(provider);
    }

    const program = new Program(idl as Idl, provider);
    setProgram(program);
  }, []);

  const initialize = async () => {
    if (!wallet || !program) {
      notify("error", "program not initialized");
      return;
    }
    const newCounter = web3.Keypair.generate();
    await program.methods
      .initialize()
      .accounts({
        counter: newCounter.publicKey,
        user: wallet.publicKey,
        systemAccount: web3.SystemProgram.programId,
      })
      .signers([newCounter])
      .rpc();

    setCounter(newCounter.publicKey);
  };

  const increment = async () => {
    if (!wallet || !counter || !program) {
      notify("error", "program not initialized");
      return;
    }

    await program.methods
      .increment()
      .accounts({
        counter,
        user: wallet.publicKey,
      })
      .rpc();
  };

  return { counter, initialize, increment, count };
};
