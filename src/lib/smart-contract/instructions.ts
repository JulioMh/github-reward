import { Idl, Program } from "@coral-xyz/anchor";
import { Repo } from "../data/repo";
import { Adapter } from "./adapter";
import { VoteType } from "../data/vote";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { AddRepoPayload, Coupon } from "./types";
import { TxnSignature } from "./txn_signature";
import { Notify } from "../hooks/useNotify";
import * as anchor from "@coral-xyz/anchor";

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

  async propose(payload: AddRepoPayload): Promise<TxnSignature> {
    console.log(this.program.programId);
    const sig = await this.program.methods
      .addRepo(payload)
      .accounts({ publisher: this.wallet.publicKey })
      .rpc();

    return new TxnSignature(this.program, sig, this.notify);
  }

  async vote(repo: Repo, voteType: VoteType): Promise<TxnSignature> {
    const sig = await this.program.methods
      .voteRepo(Adapter.voteRepo({ repo, voteType }))
      .accounts({
        voter: this.wallet.publicKey,
      })
      .rpc();

    return new TxnSignature(this.program, sig, this.notify);
  }

  async subscribe(
    repo: Repo,
    userId: number,
    coupon: Coupon
  ): Promise<TxnSignature> {
    const sig = await this.program.methods
      .subscribe({
        repo,
        coupon,
        userId: userId.toString(),
        timestamp: new anchor.BN(Date.now()),
      })
      .accounts({
        signer: this.wallet.publicKey,
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
