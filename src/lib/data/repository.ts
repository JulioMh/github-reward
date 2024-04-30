export interface Repository {
  owner: string;
  name: string;
  approvedDate: Date;
  branch: string;
  votes: number;
  totalClaimed: number;
}
