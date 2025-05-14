import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET(request) {
  // 1 · Create server‑side Supabase client bound to response cookies
  const supabase = createRouteHandlerClient({ cookies });

  // 2 · Exchange ?code=... query for JWT cookies
  await supabase.auth.exchangeCodeForSession(request);

  // 3 · Redirect user into the app
  return NextResponse.redirect(new URL("/", request.url));
}