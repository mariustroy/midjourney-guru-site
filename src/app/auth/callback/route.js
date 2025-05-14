import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET(request) {
  // Bind Supabase client to the response cookies
  const supabase = createRouteHandlerClient({ cookies });

  // This helper reads the ?code=... (or magiclink) query
  // and swaps it for sb-access-token / sb-refresh-token cookies
  await supabase.auth.exchangeCodeForSession(request);

  // Always land the user on the app root (chat UI)
  return NextResponse.redirect(new URL("/", request.url));
}