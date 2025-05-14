"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supa = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    async function finish() {
      // 1. Parse #fragment tokens
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const access_token  = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (!access_token || !refresh_token) {
        router.replace("/login?error=no_tokens");
        return;
      }

      // 2. Store session on client (optional but harmless)
      await supa.auth.setSession({ access_token, refresh_token });

      // 3. Ask server to set http‑only cookies
      await fetch("/api/auth/set-cookie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token, refresh_token }),
      });

      // 4. Clean URL & enter the app
      window.history.replaceState({}, "", "/");
      router.replace("/");
    }
    finish();
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-sm text-gray-500">Signing you in…</p>
    </div>
  );
}