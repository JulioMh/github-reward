import { logout } from "@/session";
import { redirect } from "next/navigation";

import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  await logout();
  return Response.json({ ok: "ok" });
};
