import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("courthub_role", "", {
    expires: new Date(0),
    path: "/",
  });
  return response;
}
