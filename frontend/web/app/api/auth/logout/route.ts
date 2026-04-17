import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  for (const cookieName of [
    "courthub_role",
    "courthub_email",
    "courthub_name",
    "courthub_vendor_id",
  ]) {
    response.cookies.set(cookieName, "", {
      expires: new Date(0),
      path: "/",
    });
  }
  return response;
}
