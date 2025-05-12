import { NextResponse } from "next/server";

export function middleware(req) {
  const cookie = req.cookies.get("guruAuth");
  const isLogin = req.nextUrl.pathname.startsWith("/login");

  if (!cookie && !isLogin) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|images|waitlist).*)"],
};