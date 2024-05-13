import { PublicKey } from "@solana/web3.js";
import * as borsh from "borsh";
import * as anchor from "@coral-xyz/anchor";

export interface RepoPayload {
  name: string;
  owner: string;
  branch: string;
}

export interface Repo {
  name: string;
  owner: string;
  branch: string;
  approvedTimestamp: anchor.BN;
  votes: anchor.BN;
  totalClaimed: anchor.BN;
  bump: number;
  proposedTimestamp: anchor.BN;
  approved: boolean;
  publisher: PublicKey;
  publicKey: PublicKey;
}

export class RepoAdapter {
  static schema = {
    struct: { owner: "string", name: "string", branch: "string" },
  };

  static serialize(repo: RepoPayload): Uint8Array {
    return borsh.serialize(this.schema, repo);
  }
}
