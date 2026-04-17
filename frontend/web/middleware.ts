import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getRoleHome, normalizeRole } from "./lib/auth";

const PUBLIC_ROUTES = new Set(["/", "/login", "/signup", "/forgot-password"]);

export function middleware(request: NextRequest) {
  const role = request.cookies.get("courthub_role")?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  if (PUBLIC_ROUTES.has(pathname)) {
    if (role && (pathname === "/login" || pathname === "/signup")) {
      return NextResponse.redirect(new URL(getRoleHome(role), request.url));
    }

    return NextResponse.next();
  }

  if (!role) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/admin") && normalizeRole(role) !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname.startsWith("/executive")) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (pathname.startsWith("/operations") || pathname.startsWith("/pricing") || pathname.startsWith("/inventory")) {
    return NextResponse.redirect(
      new URL(normalizeRole(role) === "admin" ? "/admin" : "/dashboard", request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!favicon.ico).*)"],
};
