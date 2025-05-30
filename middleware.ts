import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  /* allow Supabase to refresh cookies */
  const res = NextResponse.next();
  const supabase = createMiddlewareSupabaseClient({ req, res });

  /* current auth session (if any) */
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const path = req.nextUrl.pathname;

  /* ---------- routes that never need a subscription ---------- */
  const isPublic =
    path.startsWith("/login") ||
    path.startsWith("/waitlist") ||
    path.startsWith("/auth/callback") ||
    path.startsWith("/subscribe") ||
    path.startsWith("/success") ||
    path.startsWith("/cancelled") ||
    path.startsWith("/settings") ||
    path.startsWith("/favicon.ico") ||
    path.startsWith("/images");

  /* ---------- unauthenticated visitor on a private page ---------- */
  if (!session && !isPublic) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

/* ---------- authenticated visitor: paywall ---------- */
  if (session && !isPublic) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")            // we only need the plan column now
      .eq("id", session.user.id)
      .maybeSingle();            // data === null if the row is missing
  
    /* allow ONLY if plan is exactly "pro" */
    const paid = profile?.plan === "pro";
  
    if (!paid) {
      return NextResponse.redirect(new URL("/subscribe", req.url));
    }
  }

/* run on every route except Next internals & API */
export const config = {
  matcher: ["/((?!_next/|api/).*)"],
};