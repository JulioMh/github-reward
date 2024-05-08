import { keccak256, toBuffer, ecsign } from "ethereumjs-utils";
import { Coupon, RepoPayload } from "./types";
import * as borsh from "borsh";
import { repoSchema } from "./schemas";

export class Coupons {
  private static hash(values: any): string {
    return keccak256(Buffer.from(values));
  }

  private static sign(hash: string): Coupon {
    const sig = ecsign(
      toBuffer(hash),
      toBuffer(`0x${process.env.ADMIN_PRIV_KEY}`)
    );

    return {
      signature: Buffer.concat([sig.r, sig.s]).toString("hex"),
      recoveryId: sig.v - 27,
    };
  }

  static build(payload: Uint8Array): Coupon {
    return this.sign(this.hash(payload));
  }

  static addRepo(repo: RepoPayload): Coupon {
    const serialized = borsh.serialize(repoSchema, repo);
    return Coupons.build(serialized);
  }
}
