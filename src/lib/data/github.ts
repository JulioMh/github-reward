export interface GitHubAccount {
  id: number;
  name: string;
  token: string;
}

export const isValidGitHubAccount = (object: any): object is GitHubAccount => {
  return object.id && object.name && object.token;
};
