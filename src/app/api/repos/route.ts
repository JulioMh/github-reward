import { Exceptions } from "@/lib/exceptions";
import { getSession } from "@/session";
import { NextRequest } from "next/server";

const fetchRepo = async (owner: string, name: string) => {
  return fetch(`https://api.github.com/repos/${owner}/${name}`).then((res) =>
    res.json()
  );
};

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const owner = searchParams.get("owner");
  const name = searchParams.get("name");

  const session = await getSession();
  if (!session || !session.user)
    return Response.json({ error: "Unauthorized operation" });

  if (!owner || !name)
    return Response.json({ error: "Owner and Name required" });

  const response = await fetchRepo(owner, name);
  console.log(response);
  if (response.message === "Not Found")
    return Response.json(Exceptions.repo_doesnt_exists);

  // Sign coupon

  return Response.json({ response });
};
