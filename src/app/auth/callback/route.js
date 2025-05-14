import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");          // Supabase sends ?code=...

  if (code) {
    // server‑side client bound to response cookies
    const supabase = createRouteHandlerClient({ cookies });

    // exchange code → set sb-access-token / sb-refresh-token cookies
    await supabase.auth.exchangeCodeForSession(code);
  }

  // always land users on the app root
  return NextResponse.redirect(new URL("/", request.url));
}