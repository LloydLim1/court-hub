import { NextResponse } from "next/server";

import { resolveRoleFromEmail } from "../../../../lib/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as { email: string };
  const role = resolveRoleFromEmail(body.email);
  const response = NextResponse.json({ success: true, role });

  response.cookies.set("courthub_role", role, {
    httpOnly: false,
    path: "/",
    sameSite: "lax",
  });

  return response;
}
