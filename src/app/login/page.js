"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supa = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent]  = useState(false);

  /* — redirect if already logged in OR if magic‑link just returned — */
  useEffect(() => {
    async function handleRedirect() {
      // ① Check if magic‑link params are in the URL
      const url = new URL(window.location.href);
      const access_token  = url.searchParams.get("access_token");
      const refresh_token = url.searchParams.get("refresh_token");

      if (access_token && refresh_token) {
        // store session cookie/localStorage
        await supa.auth.setSession({ access_token, refresh_token });

        // clean sensitive params from the URL
        url.searchParams.delete("access_token");
        url.searchParams.delete("refresh_token");
        window.history.replaceState({}, "", url.pathname);

        router.replace("/");     // go to Guru
        return;
      }

      // ② Already logged‑in user hitting /login manually
      const { data: { session } } = await supa.auth.getSession();
      if (session) router.replace("/");
    }
    handleRedirect();
  }, [router]);

  /* — send magic link — */
  async function sendLink(e) {
    e.preventDefault();
    const { error } = await supa.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${
          process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
        }/login`,
      },
    });
    if (!error) setSent(true);
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

      <button className="bg-cyan-600 text-white py-2 rounded">
        Send link
      </button>
    </form>
  );
}