import { NextRequest } from "next/server";
import { login } from "@/session";

import { Exceptions } from "@/lib/exceptions";
import { prisma } from "@/lib/db";

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");
  const publicKey = searchParams.get("publicKey");

  if (!publicKey) return Response.json({ error: "Public key is required" });

  const { access_token: token } = await fetch(
    "https://github.com/login/oauth/access_token" +
      `?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}` +
      `&client_secret=${process.env.GITHUB_CLIENT_SECRET}` +
      `&code=${code}`,
    {
      method: "POST",
      headers: { Accept: "application/json" },
    }
  ).then((r) => r.json());

  if (!token) {
    return Response.json({ error: "Access token could not be retrieved" });
  }

  const json = await fetch(`https://api.github.com/user`, {
    headers: {
      Authorization: `token ${token}`,
    },
  }).then((r) => r.json());

  const user =
    (await prisma.user.findUnique({
      where: {
        github_id: json.id,
      },
    })) ??
    (await prisma.user.create({
      data: {
        publicKey: publicKey,
        github_name: json.name,
        github_id: json.id,
      },
    }));

  const session = {
    id: user.id,
    publicKey,
    github: { id: json.id, name: json.name, accessToken: token },
  };
  await login(session);

  if (user.publicKey !== publicKey)
    return Response.json({
      ...Exceptions.account_in_use,
      payload: { id: user.id },
    });

  return Response.json({ id: user.id });
};
