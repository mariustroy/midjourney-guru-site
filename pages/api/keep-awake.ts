// pages/api/keep-awake.ts
import type { VercelRequest, VercelResponse } from "vercel";

/**
 * Vercel will detect `config.schedule` and run this handler
 * every 4 minutes, completely independent of the rest of your app.
 */
export const config = {
  runtime:  "edge",         // tiny Edge Function
  schedule: "*/4 * * * *"   // every 4 minutes
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
      },
    }
  );

  return res.status(200).json({ ok: true });
}