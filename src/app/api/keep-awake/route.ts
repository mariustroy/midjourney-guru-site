// src/app/api/keep-awake/route.ts  (Next-13/14 app-router)
import { NextResponse } from "next/server";

export const runtime = "edge";        // super-light edge function (optional)

/** GET /api/keep-awake */
export async function GET() {
  // Hit the Supabase Edge Function that keeps Postgres warm
  await fetch(
    "https://pwxgqslsurivhznlbrmw.functions.supabase.co/keep-awake",
    { method: "GET", cache: "no-store" }
  );

  return NextResponse.json({ ok: true });
}