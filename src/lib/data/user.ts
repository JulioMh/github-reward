export interface GitHubData {
  id: string;
  name: string;
  accessToken: string;
}

export interface User {
  publicKey: string;
  github: GitHubData;
}
