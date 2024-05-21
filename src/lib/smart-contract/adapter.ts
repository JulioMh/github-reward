import { Repo, RepoPayload } from "../data/repo";
import { VoteType } from "../data/vote";
import { VotePayload } from "./types";
import * as anchor from "@coral-xyz/anchor";

export class Adapter {
  static repo(repo: Repo): RepoPayload {
    return {
      name: repo.name,
      branch: repo.branch,
      owner: repo.owner,
    };
  }

  static voteRepo({
    voteType,
    repo,
    timestamp,
  }: {
    voteType: VoteType;
    repo: Repo;
    timestamp: number;
  }): VotePayload {
    return {
      repo: this.repo(repo),
      timestamp: new anchor.BN(timestamp),
      voteType: {
        [voteType]: {},
      },
    };
  }
}
