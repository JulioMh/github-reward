import { Repo, RepoPayload } from "@/lib/data/repo";
import { getSession } from "@/session";
import { NextRequest } from "next/server";

export interface ClaimPayload {
  repo: RepoPayload;
  subscribedAt: number;
}

const fetchCommits = async (
  author: string,
  {
    owner,
    name,
    subscribedDate, //  ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ,
    branch,
  }: RepoPayload & { subscribedDate: Date }
) => {
  console.log(
    `https://api.github.com/repos/${owner}/${name}/commits?since=${subscribedDate.toISOString()}&sha=${branch}&author=${author}`
  );
  return fetch(
    `https://api.github.com/repos/${owner}/${name}/commits?since=${subscribedDate.toISOString()}&sha=${branch}&author=${author}`
  ).then((res) => res.json());
};

export const POST = async (req: NextRequest) => {
  const session = await getSession();
  if (!session || !session.user)
    return Response.json({ error: "Unauthorized operation" });

  const {
    user: { github },
  } = session;
  const body = await req.json();
  const { repo, subscribedAt } = body;

  const a = await fetchCommits(github.name, {
    ...repo,
    subscribedDate: new Date(subscribedAt),
  });

  return Response.json(a);
};
