"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  /* ------------ handlers ------------------ */
  async function handleManageSubscription() {
    try {
      setLoading(true);
      const res  = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error("Could not load billing portal");
    } catch (err) {
      alert(err.message);
      setLoading(false);
    }
  }

  async function handleLogout() {
    /*  lazy-load Supabase only in the browser  */
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    await supabase.auth.signOut();
    router.push("/login");
  }

  /* ------------ render -------------------- */
  return (
    <main className="mx-auto max-w-md space-y-4 px-6 py-10 text-white">
      <button
        onClick={handleManageSubscription}
        disabled={loading}
        className="w-full rounded-lg bg-white/10 px-4 py-2 text-left hover:bg-white/20 disabled:opacity-50"
      >
        {loading ? "Opening portal…" : "Manage Subscription"}
      </button>

      <Link
        href="https://YOUR-GOOGLE-FORM"
        target="_blank"
        className="block w-full rounded-lg bg-white/10 px-4 py-2 text-left hover:bg-white/20"
      >
        Provide Feedback
      </Link>

      <button
        onClick={handleLogout}
        className="w-full rounded-lg bg-red-600 px-4 py-2 text-left hover:bg-red-700"
      >
        Log out
      </button>
    </main>
  );
}