import { Idl, Program, Wallet } from "@coral-xyz/anchor";
import idl from "../../smart_contract.json";
import { TransactionSignature } from "@solana/web3.js";
import { Instructions } from "./instructions";
import { AnchorWallet } from "@solana/wallet-adapter-react";

export class SmartContract {
  private static instance: SmartContract;
  private program: Program<Idl>;
  public instructions: Instructions;
  // public queries: Query;

  private constructor(program: Program<Idl>, wallet: AnchorWallet) {
    this.program = program;
    this.instructions = Instructions.getInstructions(program, wallet);
  }

  static getSmartContract(
    program: Program<Idl>,
    wallet: AnchorWallet
  ): SmartContract {
    if (!SmartContract.instance) {
      SmartContract.instance = new SmartContract(program, wallet);
    }

    return SmartContract.instance;
  }
}
