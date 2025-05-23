// pages/api/keep-awake.ts
import type { VercelRequest, VercelResponse } from "vercel";

export const config = {
  runtime: "edge",           // lightweight Edge Function
  schedule: "*/4 * * * *"    // every 4 minutes  ⬅ Vercel will auto-register
};

export default async function handler(
  _req: VercelRequest,
  res: VercelResponse
) {
  await fetch(
    "https://pwxgqslsurivhznlbrmw.supabase.co/functions/v1/smart-api",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
      }
    }
  );

  return res.status(200).json({ ok: true });
}