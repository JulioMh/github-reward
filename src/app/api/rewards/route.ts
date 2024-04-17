import { getSession } from "@/session";
import { NextRequest } from "next/server";

const fetchCommits = async (
  author: string,
  {
    owner,
    name,
    approvedTimestamp, //  ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ,
    sha, // main, master
  }: Repository
) => {
  return fetch(
    `https://api.github.com/repos/${owner}/${name}/commits?since=${approvedTimestamp}&sha=${sha}&author=${author}`
  ).then((res) => res.json());
};

const calculateReward = () => {};

export const POST = async (req: NextRequest) => {
  const session = await getSession();
  if (!session || !session.user)
    return Response.json({ error: "Unauthorized operation" });

  const { user } = session;
  const body = await req.json();
  const { repos } = body;
  const commits = await Promise.all(
    repos.map((repo: Repository) => fetchCommits(user.github.name, repo))
  );

  return Response.json({ commits });
};
