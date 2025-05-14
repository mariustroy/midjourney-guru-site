import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET(request) {
  const url = new URL(request.url);
  const access_token  = url.searchParams.get("access_token");
  const refresh_token = url.searchParams.get("refresh_token");

  if (access_token && refresh_token) {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.setSession({ access_token, refresh_token });
  }

  // strip tokens from URL & send to home
  return NextResponse.redirect(`${url.origin}/`);
}