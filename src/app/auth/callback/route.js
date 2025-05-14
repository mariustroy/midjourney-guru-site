import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET(request) {
  const url = new URL(request.url);
  const access_token  = url.searchParams.get("access_token");
  const refresh_token = url.searchParams.get("refresh_token");

  if (access_token && refresh_token) {
    // Bind Supabase client to response cookies
    const supabase = createRouteHandlerClient({ cookies });

    // Store session cookies (http‑only, secure)
    await supabase.auth.setSession({ access_token, refresh_token });
  }

  // Strip the sensitive params from the URL and redirect to app root
  url.searchParams.delete("access_token");
  url.searchParams.delete("refresh_token");
  return NextResponse.redirect(`${url.origin}/`);
}