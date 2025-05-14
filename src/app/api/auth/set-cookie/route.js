import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function POST(request) {
  const { access_token, refresh_token } = await request.json();

  const supabase = createRouteHandlerClient({ cookies });
  await supabase.auth.setSession({ access_token, refresh_token });

  return NextResponse.json({ ok: true });
}