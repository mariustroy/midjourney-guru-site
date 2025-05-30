import { NextResponse } from "next/server";
import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: Request) {
  /* create response object so Supabase can attach fresh cookies */
  const res = NextResponse.next();
  const supabase = createMiddlewareSupabaseClient({ req, res });

  /* read any existing session */
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const path = req.nextUrl.pathname;

  /* ---------- public (non-guarded) routes ---------- */
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

  /* ---------- unauthenticated user hitting a private page ---------- */
  if (!session && !isPublic) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  /* ---------- authenticated user: check beta expiry & plan ---------- */
  if (session && !isPublic) {
    const { data: profile, error: profErr } = await supabase
      .from("profiles")
      .select("plan, beta_expires")
      .eq("id", session.user.id)
      .maybeSingle();            // ← no throw if row missing

    // treat any plan that starts with "pro" (case-insensitive) as paid
    const paid =
      profile?.plan &&
      profile.plan.trim().toLowerCase().startsWith("pro");

    const expired =
      !!profile?.beta_expires &&
      new Date(profile.beta_expires) < new Date();

    // redirect only if user is *definitely* unpaid and beta is over
    if (!paid && expired) {
      return NextResponse.redirect(new URL("/subscribe", req.url));
    }
  }

  return res; // everything OK → continue to requested page
}

/* Apply middleware to all routes except Next internal files & API routes */
export const config = {
  matcher: ["/((?!_next/|api/).*)"],
};