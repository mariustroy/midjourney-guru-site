"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== "undefined" && window.location.origin);

const supa = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent]  = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  /* — redirect if already logged in OR if magic‑link just returned — */
useEffect(() => {
  supa.auth.getSession().then(({ data: { session } }) => {
    if (session) router.replace("/");
  });
}, [router]);

  /* — send magic link — */
async function sendLink(e) {
  e.preventDefault();
  const { error } = await supa.auth.signInWithOtp({
    email,
options: {
  emailRedirectTo: `${
    process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
  }/auth/callback`,
},
  });
if (error) {                 // ← NEW
      setErrorMsg(error.message);
      return;
    }
    setErrorMsg("");             // clear any previous errors
    setSent(true);
}
  /* — UI — */
  if (sent)
    return (
      <p className="text-center mt-20">
        ✅ Magic link sent! Check your inbox.
      </p>
    );

  return (
    <form
      onSubmit={sendLink}
      className="max-w-xs mx-auto mt-40 flex flex-col gap-3"
    >
      <h1 className="text-xl text-center">Beta access</h1>

      <input
        type="email"
        required
        placeholder="Email"
        className="border p-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      
      {errorMsg && (             /* ← NEW */
        <p className="text-sm text-red-600">{errorMsg}</p>
      )}

      <button className="bg-cyan-600 text-white py-2 rounded">
        Send link
      </button>
    </form>
  );
  <p className="text-center text-sm mt-4 text-gray-400">
  Want full access?{" "}
  <a href="/subscribe" className="text-cyan-500 hover:underline">
    Get Guru Pro
  </a>
</p>
}