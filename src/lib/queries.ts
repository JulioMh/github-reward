import { Connection, PublicKey } from "@solana/web3.js";
import idl from "../smart_contract.json";

export class BlockchainQuery {
  private static instance: BlockchainQuery;
  private connection: Connection;

  private constructor() {
    this.connection = new Connection("http://127.0.0.1:8899");
  }

  fetchRepos = async () => {
    const accountsWithoutData = await this.connection.getProgramAccounts(
      new PublicKey(idl.address),
      {
        dataSlice: { offset: 0, length: 0 },
      }
    );
    console.log(accountsWithoutData);
  };

  static getInstance() {
    if (!this.instance) this.instance = new BlockchainQuery();
    return this.instance;
  }
}
