export interface GitHubData {
  id: number;
  name: string;
  accessToken: string;
}

export interface User {
  id: string;
  publicKey: string;
  github: GitHubData;
}
