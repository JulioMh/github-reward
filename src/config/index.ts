import { Connection, PublicKey } from "@solana/web3.js";

const program = new PublicKey("8Jy1eMYr3fjGHBAbW5ebT5tTssXtB4BQpWRzZRHk4HMg");
const [mintAddress] = PublicKey.findProgramAddressSync(
  [Buffer.from("token")],
  program
);
const mint = new PublicKey(mintAddress);
const tokenProgramId = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);
const associatedTokenProgramId = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);
const connection = new Connection("http://127.0.0.1:8899");

export const config = {
  program,
  mint,
  tokenProgramId,
  associatedTokenProgramId,
  connection,
};
