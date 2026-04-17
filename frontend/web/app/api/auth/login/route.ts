import { NextResponse } from "next/server";

import { createSessionFromIdentity, getRoleHome } from "../../../../lib/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email: string;
    name?: string;
    role?: string;
  };
  const session = createSessionFromIdentity(body);
  const response = NextResponse.json({
    success: true,
    role: session.role,
    home: getRoleHome(session.role),
    name: session.name,
  });

  response.cookies.set("courthub_role", session.role, {
    httpOnly: false,
    path: "/",
    sameSite: "lax",
  });
  response.cookies.set("courthub_email", session.email, {
    httpOnly: false,
    path: "/",
    sameSite: "lax",
  });
  response.cookies.set("courthub_name", session.name, {
    httpOnly: false,
    path: "/",
    sameSite: "lax",
  });
  if (session.vendorId) {
    response.cookies.set("courthub_vendor_id", session.vendorId, {
      httpOnly: false,
      path: "/",
      sameSite: "lax",
    });
  } else {
    response.cookies.set("courthub_vendor_id", "", {
      expires: new Date(0),
      path: "/",
    });
  }

  return response;
}
