import type { NextApiRequest, NextApiResponse } from "next";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { access_token, refresh_token } = req.body ?? {};
  if (!access_token || !refresh_token) return res.status(400).end("Missing tokens");

  const supabase = createRouteHandlerClient({ cookies: () => req.cookies });

  // this writes the http-only “sb:…” cookies for RSC / API use
  await supabase.auth.setSession({ access_token, refresh_token });

  res.status(200).end();
}