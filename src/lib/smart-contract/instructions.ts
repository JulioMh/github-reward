import { Idl, Program } from "@coral-xyz/anchor";
import { Connection, TransactionSignature } from "@solana/web3.js";
import { Repo } from "../data/repo";
import { Adapter } from "./adapter";
import { VoteType } from "../data/vote";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { AddRepoPayload } from "./types";
import { TxnSignature } from "./signature";

export class Instructions {
  private static instance: Instructions;
  private program: Program<Idl>;
  private wallet: AnchorWallet;

  private constructor(program: Program<Idl>, wallet: AnchorWallet) {
    this.program = program;
    this.wallet = wallet;
  }

  async addRepo(payload: AddRepoPayload): Promise<TxnSignature> {
    const sig = await this.program.methods
      .addRepo(payload)
      .accounts({ publisher: this.wallet.publicKey })
      .rpc();

    return new TxnSignature(this.program, sig);
  }

  async voteRepo(repo: Repo, voteType: VoteType): Promise<TxnSignature> {
    const sig = await this.program.methods
      .voteRepo(Adapter.voteRepo({ repo, voteType }))
      .accounts({
        voter: this.wallet.publicKey,
      })
      .rpc();

    return new TxnSignature(this.program, sig);
  }

  static getInstructions(
    program: Program<Idl>,
    wallet: AnchorWallet
  ): Instructions {
    if (!Instructions.instance) {
      Instructions.instance = new Instructions(program, wallet);
    }

    return Instructions.instance;
  }
}
