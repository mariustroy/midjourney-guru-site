"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

/* ── Supabase ─────────────────────────────────────────────── */
const supa = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Login() {
  const router = useRouter();

  /* UI state */
  const [phase, setPhase]  = useState("cta"); // cta → email → code
  const [email, setEmail]  = useState("");
  const [code,  setCode]   = useState("");
  const [busy,  setBusy]   = useState(false);
  const [errorMsg, setErr] = useState("");

  const emailRef = useRef(null);
  const codeRef  = useRef(null);

  /* redirect if already logged-in */
  useEffect(() => {
    supa.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace("/");
    });
  }, [router]);

  /* ── 1. send OTP ────────────────────────────────────────── */
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

  /* ── 2. verify helper ───────────────────────────────────── */
  async function verifyToken(token) {
    setBusy(true);
    setErr("");

    const emailAddr = email.trim().toLowerCase();
    const tryVerify = (type) =>
      supa.auth.verifyOtp({ email: emailAddr, token, type });

    let { data, error } = await tryVerify("email");
    if (error?.status === 403) ({ data, error } = await tryVerify("signup"));

    setBusy(false);
    if (error) { setErr(error.message); return; }

    const { access_token, refresh_token } = data.session;
    await fetch("/api/auth/set-cookies", {
      method : "POST",
      headers: { "Content-Type": "application/json" },
      body   : JSON.stringify({ access_token, refresh_token })
    });

    window.location.assign("/");            // full reload with cookies
  }

  /* ── 3. auto-submit on 6 digits ─────────────────────────── */
  function handleCodeInput(e) {
    const digits = e.target.value.replace(/\D/g, "");
    setCode(digits);
    if (digits.length === 6) verifyToken(digits);
  }

  /* ── RENDER ─────────────────────────────────────────────── */
  return (
    <main className="relative isolate min-h-screen flex flex-col text-[var(--brand)]">
      {/* background image */}
      <Image
        src="/images/hero.jpg"
        alt=""
        fill
        priority
        unoptimized
        className="object-cover object-center -z-30"
      />
      <div className="absolute inset-0 bg-black/40 -z-20" />

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
      <section className="flex-1 flex flex-col items-center
                          justify-end md:justify-center px-4 pb-32 md:pb-0">
        {/* CTA */}
        {phase === "cta" && (
          <>
            <CTAButton onClick={() => setPhase("email")} />
            <SubNote className="mt-3" />
          </>
        )}

        {/* email form */}
        {phase === "email" && (
          <form onSubmit={sendCode} className="w-full max-w-xs mx-auto">
            <div className="relative">
              <input
                ref={emailRef}
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-full px-5 py-3
                           border-2 border-[var(--brand)] bg-transparent
                           text-[var(--brand)]
                           placeholder:text-[var(--brand)/60%]
                           focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
              />
              <button
                type="submit"
                aria-label="Send code"
                className="absolute right-3 top-1/2 -translate-y-1/2
                           p-1 rounded-full bg-[var(--brand)]
                           text-black hover:bg-[#E8E455] transition"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
            {errorMsg && <p className="mt-2 text-sm text-red-600">{errorMsg}</p>}
            <SubNote className="mt-4" />
          </form>
        )}

        {/* code form */}
        {phase === "code" && (
          <div className="w-full max-w-xs mx-auto space-y-4">
            <p className="text-sm text-center text-[var(--brand)/80%]">
              We’ve sent you a 6-digit verification code. Check your email.
            </p>

            <input
              ref={codeRef}
              inputMode="numeric"
              maxLength={6}
              required
              placeholder="123456"
              value={code}
              onChange={handleCodeInput}
              className="w-full text-center tracking-widest text-2xl font-medium
                         bg-transparent border-b-2 border-[var(--brand)]
                         placeholder:text-[var(--brand)/60%] py-2
                         focus:outline-none focus:border-[var(--brand)]"
            />

            {/* real Sign-in button */}
            <button
              onClick={() => verifyToken(code)}
              disabled={busy || code.length !== 6}
              className="w-full rounded-full py-3 bg-[var(--brand)]
                         text-[#131B0E] font-medium
                         hover:bg-[#E8E455] transition
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {busy ? "Signing in…" : "Sign in"}
            </button>

            <button
              type="button"
              onClick={sendCode}
              disabled={busy}
              className="block w-full text-center text-sm underline
                         text-[var(--brand)/80%] hover:text-[var(--brand)]
                         disabled:opacity-50"
            >
              Resend code
            </button>

            {errorMsg && (
              <p className="text-sm text-red-600 text-center">{errorMsg}</p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

/* helpers */
function CTAButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full max-w-xs mx-auto rounded-full py-3 text-lg font-medium
                 bg-[var(--brand)] text-black hover:bg-[#E8E455] transition
                 shadow-md shadow-[var(--brand)/30%]"
    >
      Get&nbsp;Started / Log in
    </button>
  );
}

function SubNote({ className = "" }) {
  return (
    <p className={`text-xs text-center text-[var(--brand)/50%] ${className}`}>
      By signing up you agree to our terms.<br />Subscription is required.
    </p>
  );
}