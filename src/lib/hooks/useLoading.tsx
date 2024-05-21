import { Loading } from "@/components/Loading";
import { useState } from "react";
import { TxnSignature } from "../smart-contract/txn_signature";

export type LoadingText = "Signing" | "Waiting" | "Querying" | "Loading";

export const useLoading = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState<LoadingText>();

  async function wait<T>(text: LoadingText, fn: () => Promise<T>): Promise<T> {
    setText(text);
    setIsLoading(true);
    const result = await fn();
    setIsLoading(false);
    return result;
  }

  async function sign<T>(fn: () => Promise<T>): Promise<T> {
    return wait<T>("Signing", fn);
  }

  async function query<T>(fn: () => Promise<T>): Promise<T> {
    return wait<T>("Querying", fn);
  }

  async function loading<T>(fn: () => Promise<T>): Promise<T> {
    return wait<T>("Loading", fn);
  }

  async function confirmation<T>(
    tx: TxnSignature,
    callback: () => void
  ): Promise<void> {
    setText("Waiting");
    setIsLoading(true);
    tx.wait(() => {
      setIsLoading(false);
      callback();
    });
  }

  return {
    sign,
    query,
    confirmation,
    loading: isLoading && <Loading text={text} />,
  };
};
