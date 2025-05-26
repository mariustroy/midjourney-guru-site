import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { access_token, refresh_token, expires_at } = req.body || {};
  if (!access_token || !refresh_token) return res.status(400).end();

  const opts = {
    httpOnly : true,
    secure   : process.env.NODE_ENV === "production",
    sameSite : "lax" as const,
    path     : "/",
  };

  res.setHeader("Set-Cookie", [
    serialize("sb-access-token",  access_token, { ...opts, maxAge: 3600 }),
    serialize("sb-refresh-token", refresh_token, { ...opts, maxAge: 60 * 60 * 24 * 365 }),
  ]);

  res.status(200).end();
}