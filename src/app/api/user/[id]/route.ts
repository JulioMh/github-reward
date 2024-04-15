import { prisma } from "@/lib/db";
import { getSession } from "@/session";
import { NextRequest } from "next/server";

export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const session = await getSession();
  const id = params.id;
  if (id !== session?.user.id)
    return Response.json({ error: "Unauthorized operation" });

  const body = await req.json();
  const { publicKey } = body;

  if (!publicKey) return Response.json({ error: "publicKey required" });

  await prisma.user.update({
    data: { publicKey: publicKey.toString() },
    where: { id },
  });
  return Response.json({ id });
};
