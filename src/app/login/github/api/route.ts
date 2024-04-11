import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");

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

  if (token) {
    const data = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${token}`,
      },
    }).then((r) => r.json());

    return Response.json({ id: data.id, name: data.name, token: token });
  }
  return Response.json({ error: "User data could not be retrieved" });
};
