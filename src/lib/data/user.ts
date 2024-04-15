export interface GitHubData {
  id: string;
  name: string;
  accessToken: string;
}

export interface User {
  id: string;
  publicKey: string;
  github: GitHubData;
}
