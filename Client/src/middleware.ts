import { NextRequest, NextResponse } from "next/server";

// AUTH DISABLED - Set to true when Firebase is configured
const AUTH_ENABLED = false;

const publicPaths = ["/auth"];
const protectedPaths = ["/dashboard", "/mission", "/solar-view"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // If auth is disabled, allow all routes
  if (!AUTH_ENABLED) {
    return NextResponse.next();
  }

  // --- AUTH ENABLED LOGIC BELOW ---
  const token = request.cookies.get("auth_token")?.value;

  // Check if path is public
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // Check if path is protected
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path),
  );

  // Root path redirects
  if (pathname === "/") {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // Protect routes
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // Redirect authenticated users away from auth pages
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"],
};
