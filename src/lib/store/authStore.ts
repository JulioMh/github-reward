import { create } from "zustand";
import { GitHubAccount } from "../data/github";

export const NONCE_LS = "gh-state";
export const GH_DATA_LS = "gh-data";

interface AuthState {
  gitHubAccount?: GitHubAccount;
  setGitHubAccount: (nonce: GitHubAccount) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  setGitHubAccount: (gitHubAccount) => set({ gitHubAccount }),
  reset: () => set({ gitHubAccount: undefined }),
}));
