"use client";

import { Button } from "@/components/Button";
import { Loading } from "@/components/Loading";
import { Exceptions, isValidException } from "@/lib/exceptions";
import { useNotify } from "@/lib/hooks/useNotify";
import { useProgram } from "@/lib/hooks/useProgram";
import { Fetchers } from "@/utils/fetchers";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProposePage() {
  const [[owner, name], setRepo] = useState<[string, string]>(["", ""]);
  const route = useRouter();
  const { client } = useProgram();
  const notify = useNotify();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [waiting, setWaiting] = useState(false);

  const onSubmit = async () => {
    if (!client) return;
    setLoading(true);
    const { response, payload } = await Fetchers.GET(
      `/repos?owner=${owner}&name=${name}`
    );
    if (
      isValidException(response) &&
      response.code === Exceptions.repo_doesnt_exists.code
    ) {
      notify("error", response.msg);
      return;
    }
    const tx = await client.instructions.addRepo(payload);

    await tx.wait(setWaiting, notify, () => route.push("/repos"));
  };

  const validate = (e: any) => {
    const input = e.currentTarget.textContent;
    const regex = /github\.com\/(?<owner>.+)\/(?<name>.+)/;
    if (!input) {
      setError(false);
      return;
    }
    const { owner, name } = regex.exec(input)?.groups ?? {
      owner: null,
      name: null,
    };
    if (!owner || !name) return setError(true);
    setError(false);
    setRepo([owner, name]);
  };

  return (
    <div className="flex flex-col items-center mt-16 gap-16">
      <div className="flex flex-col items-center gap-2">
        <label>Repo URL</label>
        <span
          onInput={(e) => validate(e)}
          className={`border-2 rounded-lg min-w-32 p-2 ${
            error ? "border-red-500" : "border-white"
          }`}
          role="textbox"
          contentEditable
        >
          {"https://github.com/<<owner>>/<<name>>"}
        </span>
        {error && (
          <span className="self-start text-sm text-red-500">Invalid URL</span>
        )}
      </div>
      {loading ? (
        <Loading text={loading ? "Loading" : "Waiting"} />
      ) : (
        <Button onClick={onSubmit} disabled={error || owner === ""}>
          Propose
        </Button>
      )}
    </div>
  );
}
