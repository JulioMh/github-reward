import { RepoPayload } from "../data/repo";

export interface Coupon {
  signature: string;
  recoveryId: number;
}
export interface WithCoupon {
  coupon: Coupon;
}

export interface AddRepoPayload extends WithCoupon {
  repo: RepoPayload;
}

export interface ClaimRewardPayload extends WithCoupon {
  repo: RepoPayload;
  commits: number;
  timestamp: number;
}

export type VotePayload = {
  repo: RepoPayload;
  voteType: Record<string, object>;
};
