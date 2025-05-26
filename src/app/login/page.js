"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

/* ─── Supabase ──────────────────────────────────────────────── */
const supa = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Login() {
  const router = useRouter();

  const [phase, setPhase]  = useState("cta");   // cta → email → code
  const [email, setEmail]  = useState("");
  const [code,  setCode]   = useState("");      // 6-digit otp
  const [err,   setErr]    = useState("");
  const [busy,  setBusy]   = useState(false);

  const emailRef = useRef(null);
  const codeRef  = useRef(null);

  /* already logged-in? → home */
  useEffect(() => {
    supa.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace("/");
    });
  }, [router]);

  /* ───────── 1. send code ───────── */
  async function sendCode(e) {
    e.preventDefault();
    const addr = email.trim().toLowerCase();
    if (!addr) return emailRef.current?.focus();

    const { error } = await supa.auth.signInWithOtp({
      email: addr,
      options: { shouldCreateUser: true }
    });
    if (error) return setErr(error.message);

    setErr(""); setPhase("code"); setCode("");
    setTimeout(() => codeRef.current?.focus(), 50);
  }

  /* ───────── 2. verify code + push cookies ───────── */
  async function verifyToken(token) {
    setBusy(true); setErr("");

    const { error } = await supa.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token,
      type : "email"                  // numeric otp channel
    });
    if (error) { setErr(error.message); setBusy(false); return; }

    /* we now have a client-side session → forward it to the server */
    const { data: { session } } = await supa.auth.getSession();
    await fetch("/api/auth/set-cookies", {
      method : "POST",
      headers: { "Content-Type": "application/json" },
      body   : JSON.stringify({
        access_token : session.access_token,
        refresh_token: session.refresh_token,
        expires_at   : session.expires_at
      })
    });

    router.replace("/");            // server can see cookies → OK
  }

  /* ───────── handlers ───────── */
  function onCode(e) {
    const digits = e.target.value.replace(/\D/g, "");
    setCode(digits);
    if (digits.length === 6 && !busy) verifyToken(digits);
  }

  /* ───────── UI ───────── */
  return (
    <main className="relative min-h-screen flex flex-col bg-black text-[var(--brand)]">
      <Image src="/images/hero.jpg" alt="" fill priority unoptimized
             className="object-cover -z-10" />
      <div className="absolute inset-0 bg-black/40 -z-10" />

      {/* header omitted here for brevity –- keep your existing markup */}

      <section className="flex-1 flex flex-col items-center justify-end md:justify-center px-4 pb-32 md:pb-0">

        {phase === "cta" && (
          <>
            <CTAButton onClick={() => setPhase("email")} />
            <SubNote className="mt-3" />
          </>
        )}

        {phase === "email" && (
          <form onSubmit={sendCode} className="w-full max-w-xs mx-auto">
            {/* …input & button (unchanged)… */}
          </form>
        )}

        {phase === "code" && (
          <form onSubmit={e => { e.preventDefault(); if (!busy) verifyToken(code); }}
                className="w-full max-w-xs mx-auto space-y-4">
            <input
              ref={codeRef}
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={onCode}
              placeholder="123456"
              className="w-full text-center tracking-widest text-2xl
                         bg-transparent border-b-2 border-[var(--brand)] py-2" />

            {!busy && (
              <button className="w-full rounded-full py-3 bg-[var(--brand)] text-[#131B0E]">
                Sign&nbsp;in
              </button>
            )}

            {err && <p className="text-sm text-red-600 text-center">{err}</p>}
          </form>
        )}
      </section>
    </main>
  );
}

/* helpers – keep your originals */
function CTAButton({ onClick }) { /* … */ }
function SubNote({ className })  { /* … */ }