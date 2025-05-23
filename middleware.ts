import { NextResponse } from "next/server";
import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req) {
  // Create a response object Supabase can attach cookies to
  const res = NextResponse.next();
  const supabase = createMiddlewareSupabaseClient({ req, res });

  // Read any existing session from cookies
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const path = req.nextUrl.pathname;

  /* -------- public (non‑guarded) routes -------- */
  const isLogin     = path.startsWith("/login");
  const isWaitlist  = path.startsWith("/waitlist");
  const isCallback  = path.startsWith("/auth/callback");

const isPublic =
  isLogin ||
  isWaitlist ||
  isCallback ||
  path.startsWith("/subscribe") ||
  path.startsWith("/success") ||
  path.startsWith("/cancelled") ||
  path.startsWith("/settings") ||
  path.startsWith("/favicon.ico") ||
  path.startsWith("/images");

  /* -------- unauthenticated user hitting a private page -------- */
  if (!session && !isPublic) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  /* -------- authenticated user: enforce beta limit -------- */
  if (session && !isPublic) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, beta_expires")
    .eq("id", session.user.id)
    .single();

  const expired =
  !!profile?.beta_expires &&              // guard against null
  new Date(profile.beta_expires) < new Date();
  const notPaid = profile?.plan !== "pro";

  if (expired || notPaid) {
    return NextResponse.redirect(new URL("/subscribe", req.url));
  }
}

  return res; // everything OK -> continue
}

/* Apply middleware to all routes except Next internal files & API routes */
export const config = {
  matcher: ["/((?!_next/|api/).*)"],
};