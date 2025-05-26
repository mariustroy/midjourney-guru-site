/* src/app/login/page.js */
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

/* ─── Supabase client ─────────────────────────────── */
const supa = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Login() {
  const router = useRouter();

  /* ui state ----------------------------------------------------- */
  const [phase, setPhase]   = useState("cta");
  const [email, setEmail]   = useState("");
  const [code,  setCode]    = useState("");
  const [err,   setErr]     = useState("");
  const [busy,  setBusy]    = useState(false);

  const emailRef = useRef(null);
  const codeRef  = useRef(null);

  /* already signed-in? ➜ home */
  useEffect(() => {
    supa.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace("/");
    });
  }, [router]);

  /* ── send 6-digit OTP ───────────────────────────── */
  async function sendCode(e) {
    e.preventDefault();
    const addr = email.trim().toLowerCase();
    if (!addr) { emailRef.current?.focus(); return; }

    const { error } = await supa.auth.signInWithOtp({
      email: addr,
      options: { shouldCreateUser: true }
    });
    if (error) { setErr(error.message); return; }

    setErr("");
    setPhase("code");
    setCode("");
    setTimeout(() => codeRef.current?.focus(), 50);
  }

  /* ── verify (signin ➜ signup fallback) ──────────── */
  async function verify(token) {
    setBusy(true); setErr("");

    const tryType = async type =>
      supa.auth.verifyOtp({ email: email.trim().toLowerCase(), token, type });

    let { error } = await tryType("email");
    if (error?.status === 403) ({ error } = await tryType("signup"));

    setBusy(false);
    if (error) { setErr(error.message); return; }

    router.replace("/");
  }

  /* input handler with auto-submit */
  const onCode = e => {
    const digits = e.target.value.replace(/\D/g, "");
    setCode(digits);
    if (digits.length === 6 && !busy) verify(digits);
  };

  /* ─────────── UI ─────────── */
  return (
    /* ⬇︎  changed from <main> to <div>  */
    <div className="relative isolate min-h-screen flex flex-col bg-black text-[var(--brand)]">
      {/* background image */}
      <Image
        src="/images/hero.jpg"
        alt=""
        fill
        priority
        unoptimized
        className="object-cover object-center -z-10"
      />
      <div className="absolute inset-0 bg-black/40 -z-10" />

      {/* header */}
      <header className="pt-16 md:pt-12 text-center px-4
                         md:absolute md:top-12 md:left-1/2 md:-translate-x-1/2">
        <Image
          src="/images/logo.svg"
          alt="Midjourney Guru"
          width={176}
          height={60}
          className="w-36 md:w-44 mx-auto mb-6"
          priority
        />
        <ul className="space-y-1 text-lg md:text-xl font-light tracking-wide
                       mb-8 max-w-md mx-auto">
          <li>Midjourney AI Copilot</li>
          <li>Prompts Vault</li>
          <li>Resources &amp; Tutorials</li>
        </ul>
      </header>

      {/* body */}
      <main className="relative min-h-screen flex flex-col bg-black text-[var(--brand)]">
      <section className="flex-1 flex flex-col items-center
                    justify-center px-4 pb-12 md:pb-0">
          {phase === "cta" && (
            <>
              <CTA onClick={() => setPhase("email")} />
              <Note className="mt-3" />
            </>
          )}

          {phase === "email" && (
            <form onSubmit={sendCode} className="w-full max-w-xs mx-auto">
              <div className="relative">
                <input
                  ref={emailRef}
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full rounded-full px-5 py-3 border-2 border-[var(--brand)]
                             bg-transparent text-[var(--brand)]
                             placeholder:text-[var(--brand)/60%]
                             focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                />
                <button type="submit" aria-label="Send code"
                        className="absolute right-3 top-1/2 -translate-y-1/2
                                   p-1 rounded-full bg-[var(--brand)]
                                   text-black hover:bg-[#E8E455] transition">
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
              {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
              <Note className="mt-4" />
            </form>
          )}

          {phase === "code" && (
            <form onSubmit={e => { e.preventDefault(); verify(code); }}
                  className="w-full max-w-xs mx-auto space-y-4">
              <input
                ref={codeRef}
                inputMode="numeric"
                maxLength={6}
                required
                placeholder="123456"
                value={code}
                onChange={onCode}
                className="w-full text-center tracking-widest text-2xl font-medium
                           bg-transparent border-b-2 border-[var(--brand)]
                           placeholder:text-[var(--brand)/60%] py-2
                           focus:outline-none focus:border-[var(--brand)]"
              />
              <button type="submit" disabled={busy}
                      className="w-full rounded-full py-3 bg-[var(--brand)]
                                 text-[#131B0E] font-medium
                                 hover:bg-[#E8E455] transition disabled:opacity-50">
                {busy ? "Signing in…" : "Sign in"}
              </button>
              <button type="button" onClick={sendCode} disabled={busy}
                      className="block w-full text-center text-sm underline
                                 text-[var(--brand)/80%] hover:text-[var(--brand)]
                                 disabled:opacity-50">
                Resend code
              </button>
              {err && <p className="text-sm text-red-600 text-center">{err}</p>}
            </form>
          )}
        </section>
      </main>
    </div>
  );
}

/* helpers */
const CTA = ({ onClick }) => (
  <button onClick={onClick}
          className="w-full max-w-xs mx-auto rounded-full py-3 text-lg font-medium
                     bg-[var(--brand)] text-black hover:bg-[#E8E455] transition
                     shadow-md shadow-[var(--brand)/30%]">
    Get Started / Log in
  </button>
);

const Note = ({ className = "" }) => (
  <p className={`text-xs text-center text-[var(--brand)/50%] ${className}`}>
    By signing up you agree to our terms.<br />Subscription is required.
  </p>
);