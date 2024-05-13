import { Idl, Program } from "@coral-xyz/anchor";
import { Repo } from "../data/repo";
import { Adapter } from "./adapter";
import { VoteType } from "../data/vote";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { AddRepoPayload } from "./types";
import { TxnSignature } from "./txn_signature";
import { Notify } from "../hooks/useNotify";

export class Instructions {
  private static instance: Instructions;
  private program: Program<Idl>;
  private wallet: AnchorWallet;
  private notify: Notify;

  private constructor(
    program: Program<Idl>,
    wallet: AnchorWallet,
    notify: Notify
  ) {
    this.program = program;
    this.wallet = wallet;
    this.notify = notify;
  }

  async addRepo(payload: AddRepoPayload): Promise<TxnSignature> {
    console.log(this.program.programId);
    const sig = await this.program.methods
      .addRepo(payload)
      .accounts({ publisher: this.wallet.publicKey })
      .rpc();

    return new TxnSignature(this.program, sig, this.notify);
  }

  async voteRepo(repo: Repo, voteType: VoteType): Promise<TxnSignature> {
    const sig = await this.program.methods
      .voteRepo(Adapter.voteRepo({ repo, voteType }))
      .accounts({
        voter: this.wallet.publicKey,
      })
      .rpc();

    return new TxnSignature(this.program, sig, this.notify);
  }

  static getInstructions(
    program: Program<Idl>,
    wallet: AnchorWallet,
    notify: Notify
  ): Instructions {
    if (!Instructions.instance) {
      Instructions.instance = new Instructions(program, wallet, notify);
    }

    return Instructions.instance;
  }
}
