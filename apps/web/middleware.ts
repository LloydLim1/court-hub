import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getRoleHome } from "./lib/auth";

const PUBLIC_ROUTES = new Set(["/login", "/forgot-password"]);

export function middleware(request: NextRequest) {
  const role = request.cookies.get("courthub_role")?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  if (PUBLIC_ROUTES.has(pathname)) {
    if (role) {
      return NextResponse.redirect(new URL(getRoleHome(role), request.url));
    }

    return NextResponse.next();
  }

  if (!role) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/executive") && role !== "manager") {
    return NextResponse.redirect(new URL("/operations", request.url));
  }

  if (pathname.startsWith("/pricing") && role !== "manager") {
    return NextResponse.redirect(new URL("/operations", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!favicon.ico).*)"],
};
