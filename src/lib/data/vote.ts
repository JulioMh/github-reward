import { Repo } from "./repo";

export enum VoteType {
  up = "up",
  down = "down",
}

export interface Vote {
  voter: string;
  repo: Repo;
  voteType: VoteType;
}
