"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function SubscribePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("plan")
        .eq("id", user.id)
        .single();

 const isSubscribed =
           profile?.plan && profile.plan !== "free" && profile.plan !== "none";
        
         if (isSubscribed) {
        window.location.href = "/";
        return;
      }

      // otherwise → go to checkout
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const { url } = await res.json();
      window.location.href = url;
    }

    load();
  }, []);

  return (
    <div className="p-8 text-center">
      <p className="text-gray-400">Loading your subscription…</p>
    </div>
  );
}