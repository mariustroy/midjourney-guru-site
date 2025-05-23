// pages/api/keep-awake.ts
export const config = {
  runtime:  "edge",
  schedule: "*/4 * * * *"        // every 4 minutes
};

export default async function handler() {
  // Small, harmless query: ask for 1 row's id
  await fetch(
    "https://pwxgqslsurivhznlbrmw.supabase.co/rest/v1/formulas?id=eq.0&select=id",
    {
      headers: { apiKey: process.env.SUPABASE_ANON_KEY! },
      cache:   "no-store",
    }
  );

  return new Response("ok");
}