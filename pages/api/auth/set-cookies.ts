import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { session } = await req.json();

  const supabase = createRouteHandlerClient({ cookies });
  await supabase.auth.setSession({
    access_token:  session.access_token,
    refresh_token: session.refresh_token,
  });

  return NextResponse.json({ ok: true });
}