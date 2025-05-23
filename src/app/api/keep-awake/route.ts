import { NextResponse } from "next/server";

export const runtime = "edge";              // ultra-light edge function

export async function GET() {
  await fetch(
    "https://pwxgqslsurivhznlbrmw.supabase.co/functions/v1/smart-api",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
      },
      cache: "no-store",
    }
  );

  return NextResponse.json({ ok: true });
}