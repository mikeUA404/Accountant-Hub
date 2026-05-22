// middleware.ts
// Lightweight route protection - no Prisma, no heavy imports
// Uses NextAuth's built-in JWT check only

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const PROTECTED_ROUTES = ["/dashboard"];
const AUTH_ROUTES = ["/login", "/register"];

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isLoggedIn = !!token;
  const path = req.nextUrl.pathname;

  // Redirect logged-in users away from auth pages
  if (isLoggedIn && AUTH_ROUTES.some((r) => path.startsWith(r))) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  // Redirect unauthenticated users from protected routes
  if (!isLoggedIn && PROTECTED_ROUTES.some((r) => path.startsWith(r))) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
