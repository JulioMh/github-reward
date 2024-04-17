import { prisma } from "@/lib/db";
import { getSession } from "@/session";
import { NextRequest } from "next/server";

export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const session = await getSession();
  if (!session || !session.user)
    return Response.json({ error: "Unauthorized operation" });
  const id = session.user.id;

  const body = await req.json();
  const { publicKey } = body;

  if (!publicKey) return Response.json({ error: "publicKey required" });

  await prisma.user.update({
    data: { publicKey: publicKey.toString() },
    where: { id },
  });
  return Response.json({ id });
};
