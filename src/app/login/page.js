"use client";
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supa = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Login() {
  /* ---------- hooks must be inside the component ---------- */
  const router = useRouter();   // ← now safely inside
  const [email, setEmail] = useState("");
  const [sent,  setSent]  = useState(false);

  /* redirect if already logged in */
  useEffect(() => {
    supa.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace("/");
    });
  }, [router]);

  async function sendLink(e) {
    e.preventDefault();
    const { error } = await supa.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_SITE_URL || window.location.origin,
      },
    });
    if (!error) setSent(true);
  }

  if (sent) return <p>Magic link sent! Check your inbox.</p>;

  return (
    <form onSubmit={sendLink} className="max-w-xs mx-auto mt-40 flex flex-col gap-3">
      <h1 className="text-xl text-center">Beta access</h1>
      <input
        type="email" required placeholder="Email"
        className="border p-2 rounded"
        value={email} onChange={e=>setEmail(e.target.value)}
      />
      <button className="bg-cyan-600 text-white py-2 rounded">Send link</button>
    </form>
  );
}