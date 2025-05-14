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
    async function handleMagic() {
      // Supabase helper parses #fragment, exchanges for session, stores cookie
      const { data, error } = await supa.auth.exchangeCodeForSession();
      if (error) {
        console.error("Magic‑link error:", error);
        router.replace("/login?error=1");
        return;
      }
      router.replace("/"); // success → go to chat
    }
    handleMagic();
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Setting up your session…</p>
    </div>
  );
}