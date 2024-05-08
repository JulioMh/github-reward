import { Idl, Program } from "@coral-xyz/anchor";
import {
  Connection,
  RpcResponseAndContext,
  SignatureStatus,
  TransactionSignature,
} from "@solana/web3.js";
import { SetStateAction } from "react";
import { Notify } from "../hooks/useNotify";

export class TxnSignature {
  private connection: Connection;
  private program: Program<Idl>;
  private lastSig?: TransactionSignature;

  constructor(program: Program<Idl>, lastSig: TransactionSignature) {
    this.program = program;
    this.connection = this.program.provider.connection;
    this.lastSig = lastSig;
  }

  private finished(status: SignatureStatus | null, notify: Notify): boolean {
    if (status?.confirmationStatus === "finalized") {
      notify("success", "Txn confirmed");
      return true;
    }
    if (status?.err) {
      notify("error", status.err.toString());
      return true;
    }
    return false;
  }

  async wait(
    setWaiting: (param: SetStateAction<boolean>) => void,
    notify: Notify,
    navigate: () => void
  ) {
    const interval = setInterval(async () => {
      if (!this.lastSig) return;
      setWaiting(true);
      const result = await this.connection.getSignatureStatus(this.lastSig, {
        searchTransactionHistory: true,
      });
      if (this.finished(result.value, notify)) {
        clearInterval(interval);
        setWaiting(false);
        return navigate();
      }
    }, 1000);
  }

  async showLogs() {
    if (!this.lastSig) return;

    const latestBlockHash = await this.connection.getLatestBlockhash();
    await this.connection.confirmTransaction(
      {
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: this.lastSig,
      },
      "confirmed"
    );

    const txDetails = await this.program.provider.connection.getTransaction(
      this.lastSig,
      {
        maxSupportedTransactionVersion: 0,
        commitment: "confirmed",
      }
    );

    const logs = txDetails?.meta?.logMessages || null;
    console.log(logs);
  }
}
