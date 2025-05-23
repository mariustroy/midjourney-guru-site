// Scheduled Edge Function: runs every 4 minutes on Vercel
export const config = {
  runtime:  "edge",
  schedule: "*/4 * * * *",   // cron expression
};

export default async function handler() {
  await fetch(
    "https://pwxgqslsurivhznlbrmw.supabase.co/functions/v1/smart-api",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
      },
    }
  );

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
}