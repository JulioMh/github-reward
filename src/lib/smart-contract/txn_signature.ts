import { Idl, Program } from "@coral-xyz/anchor";
import {
  Connection,
  SignatureStatus,
  TransactionSignature,
} from "@solana/web3.js";
import { Notify } from "../hooks/useNotify";

export class TxnSignature {
  private connection: Connection;
  private program: Program<Idl>;
  private lastSig?: TransactionSignature;
  private notify: Notify;

  constructor(
    program: Program<Idl>,
    lastSig: TransactionSignature,
    notify: Notify
  ) {
    this.program = program;
    this.connection = this.program.provider.connection;
    this.lastSig = lastSig;
    this.notify = notify;
  }

  private finished(status: SignatureStatus | null): boolean {
    if (status?.confirmationStatus === "finalized") {
      this.notify("success", "Txn confirmed");
      return true;
    }
    if (status?.err) {
      this.notify("error", status.err.toString());
      return true;
    }
    return false;
  }

  async wait(callback: () => void) {
    const interval = setInterval(async () => {
      if (!this.lastSig) return;

      const result = await this.connection.getSignatureStatus(this.lastSig, {
        searchTransactionHistory: true,
      });

      if (this.finished(result.value)) {
        clearInterval(interval);
        return callback();
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
