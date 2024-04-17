import { NextRequest } from "next/server";

// LIST OF REPOS QUERY PARAMETER TO FILTER BY STATUS
export const GET = async (req: NextRequest) => {
  return Response.json({ ok: "ok" });
};
