// middleware.ts
// IMPORTANT: imports from auth.config (edge-safe), NOT from auth.ts
// auth.ts imports Prisma which cannot run in the Edge runtime

import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const PROTECTED_ROUTES = ["/dashboard", "/profile"];
const AUTH_ROUTES = ["/login", "/register"];

export default auth((req) => {
  const isLoggedIn = !!req.auth?.user;
  const path = req.nextUrl.pathname;

  // Send logged-in users away from auth pages
  if (isLoggedIn && AUTH_ROUTES.some((r) => path.startsWith(r))) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  // Send guests away from protected pages
  if (!isLoggedIn && PROTECTED_ROUTES.some((r) => path.startsWith(r))) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
