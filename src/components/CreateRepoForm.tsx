"use client";

import { Button } from "./Button";
import { useProgram } from "@/lib/hooks/useProgram";

export const CreateRepoForm = () => {
  const { counter, initialize, increment, count } = useProgram();

  return (
    <>
      <Button onClick={counter ? increment : initialize}>
        {!counter ? "Initialize counter" : "Increment counter"}
      </Button>
      <button>{count}</button>
    </>
  );
};
