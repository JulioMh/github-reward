import { prisma } from "@/lib/db";
import { NextRequest } from "next/server";

export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const id = params.id;
  const body = await req.json();
  const { publicKey } = body;

  if (!publicKey) return Response.json({ error: "publicKey required" });

  await prisma.user.update({
    data: { publicKey: publicKey.toString() },
    where: { id },
  });
  return Response.json({ id });
};
