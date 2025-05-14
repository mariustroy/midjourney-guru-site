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
    async function finishMagicLink() {
      // 1 · Parse the URL fragment for tokens: #access_token=…&refresh_token=…
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const access_token  = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (access_token && refresh_token) {
        // 2 · Store session (sets sb-access-token / sb-refresh-token cookies)
        await supa.auth.setSession({ access_token, refresh_token });

        // 3 · Clean URL and enter the app
        window.history.replaceState({}, "", "/");
        router.replace("/");
      } else {
        // fallback: nothing to process
        router.replace("/login?error=magiclink");
      }
    }
    finishMagicLink();
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-sm text-gray-500">Signing you in…</p>
    </div>
  );
}