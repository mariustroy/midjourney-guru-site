import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const res = NextResponse.next();
  const supa = createMiddlewareSupabaseClient({ req, res });

  const { data: { session } } = await supa.auth.getSession();

  const url = req.nextUrl;

  // Public routes
  if (url.pathname.startsWith("/login") || url.pathname.startsWith("/waitlist"))
    return res;

  // No session → redirect to login
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Fetch profile to check plan / beta expiry
  const { data: profile } = await supa
    .from("profiles")
    .select("beta_expires, plan")
    .eq("id", session.user.id)
    .single();

  // If no profile row (first login) → Supabase trigger can auto‑insert
  // or insert here manually.

  const now = Date.now();
  const expired = new Date(profile?.beta_expires).getTime() < now;
  const notPaid = profile?.plan !== "pro";

  if (expired && notPaid) {
    return NextResponse.redirect(new URL("/waitlist?expired=1", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|images|api/auth).*)"],
};