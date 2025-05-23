import { NextResponse } from "next/server";

// --- SCHEDULED EDGE FUNCTION --- //
// Vercel will run this handler every 4 minutes automatically.
export const runtime  = "edge";
export const schedule = "*/4 * * * *";        // cron: every 4 min

export async function GET() {
  await fetch(
    "https://pwxgqslsurivhznlbrmw.supabase.co/functions/v1/smart-api",
    {
      method: "GET",
      headers: {
        // safer: keep the key out of your repo & set in Vercel → Env Vars
        Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
      },
      cache: "no-store",
    }
  );

  return NextResponse.json({ ok: true });
}