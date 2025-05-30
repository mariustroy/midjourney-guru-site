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

  /* ---------- authenticated visitor: check plan / beta ---------- */
  if (session && !isPublic) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, beta_expires")
      .eq("id", session.user.id)
      .maybeSingle(); // returns { data: null } if row missing

    /* treat any plan starting with "pro" as paid */
    const paid =
      !!profile?.plan &&
      profile.plan.trim().toLowerCase().startsWith("pro");

    /* still inside beta? */
    const inBeta =
      !!profile?.beta_expires &&
      new Date(profile.beta_expires) > new Date();

    /* block unless user is paid OR still in beta */
    if (!paid && !inBeta) {
      return NextResponse.redirect(new URL("/subscribe", req.url));
    }
  }

  return res; // everything OK → continue
}

/* run on every route except Next internals & API */
export const config = {
  matcher: ["/((?!_next/|api/).*)"],
};