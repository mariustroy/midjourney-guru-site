import { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { access_token, refresh_token } = JSON.parse(req.body || "{}");
  if (!access_token || !refresh_token) return res.status(400).end("Missing tokens");

  // server-side helper that can set the auth cookies
  const supabase = createServerSupabaseClient({ req, res });
  await supabase.auth.setSession({ access_token, refresh_token });

  return res.status(200).end();
}