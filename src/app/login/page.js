"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supa = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Login() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function sendLink(e) {
    e.preventDefault();
    const { error } = await supa.auth.signInWithOtp({ email });
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