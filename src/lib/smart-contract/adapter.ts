import { Repo } from "../data/repo";
import { VoteType } from "../data/vote";
import { RepoPayload, VotePayload } from "./types";

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
  }: {
    voteType: VoteType;
    repo: Repo;
  }): VotePayload {
    return {
      repo: this.repo(repo),
      voteType: {
        [voteType]: {},
      },
    };
  }
}
