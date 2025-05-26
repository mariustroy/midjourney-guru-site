"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

/* ─── Supabase client (browser) ─────────────────────────────── */
const supa = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/* ─── Page component ────────────────────────────────────────── */
export default function Login() {
  const router = useRouter();

  /* phases: cta → email → code → (redirect) */
  const [phase, setPhase] = useState("cta");
  const [email, setEmail] = useState("");
  const [code,  setCode ] = useState("");  // six-digit OTP
  const [errorMsg, setErr] = useState("");
  const [autoDone, setAutoDone] = useState(false); // guard

  const emailRef = useRef(null);
  const codeRef  = useRef(null);

  /* already signed-in? — redirect home */
  useEffect(() => {
    supa.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace("/");
    });
  }, [router]);

  /* ── send OTP ── */
  async function sendCode(e) {
    e.preventDefault();
    const addr = email.trim().toLowerCase();
    if (!addr) { emailRef.current?.focus(); return; }

    const { error } = await supa.auth.signInWithOtp({
      email: addr,
      options: { shouldCreateUser: true }     // numeric code only
    });

    if (error) { setErr(error.message); return; }

    setErr("");
    setPhase("code");
    setAutoDone(false);
    setTimeout(() => codeRef.current?.focus(), 50);
  }

  /* ── verify OTP + set server cookies ── */
  async function verify(raw) {
    const clean = raw.replace(/[^0-9]/g, "");
    if (clean.length !== 6) return;

    /* 1  verify with Supabase JS (client) */
    const { data, error } = await supa.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: clean,
      type : "magiclink"               // numeric e-mail code
    });

    if (error) { setErr(error.message); return; }

    /* 2  persist the session cookie on the server
          mimic what the magic-link callback normally does */
    const { session } = data;
    const qs = new URLSearchParams({
      access_token : session.access_token,
      refresh_token: session.refresh_token,
      type         : "email"
    }).toString();

    await fetch(`/auth/callback?${qs}`);   // sets Http-only cookies

    /* 3  client-side nav is now authorised */
    router.replace("/");
  }

  /* ─────────────────────────────────────────────────────────── */
  return (
    <main className="relative isolate min-h-screen flex flex-col bg-black text-[var(--brand)]">
      {/* bg image + overlay */}
      <Image
        src="/images/hero.jpg"
        alt=""
        fill
        priority
        unoptimized
        className="object-cover object-center -z-10"
      />
      <div className="absolute inset-0 bg-black/40 -z-10" />

      {/* header (logo + tagline) */}
      <header className="pt-16 md:pt-12 text-center px-4 md:absolute md:top-12 md:left-1/2 md:-translate-x-1/2">
        <Image
          src="/images/logo.svg"
          alt="Midjourney Guru"
          width={176} height={60}
          className="w-36 md:w-44 mx-auto mb-6"
          priority
        />
        <ul className="space-y-1 text-lg md:text-xl font-light tracking-wide mb-8 max-w-md mx-auto">
          <li>Midjourney AI Copilot</li>
          <li>Prompts Vault</li>
          <li>Resources &amp; Tutorials</li>
        </ul>
      </header>

      {/* main area */}
      <section className="flex-1 flex flex-col items-center justify-end md:justify-center px-4 pb-32 md:pb-0">

        {/* CTA */}
        {phase === "cta" && (
          <>
            <CTAButton onClick={() => setPhase("email")} />
            <SubNote className="mt-3" />
          </>
        )}

        {/* e-mail form */}
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
                className="
                  w-full rounded-full px-5 py-3
                  border-2 border-[var(--brand)]
                  bg-transparent text-[var(--brand)]
                  placeholder:text-[var(--brand)/0.6]
                  focus:outline-none focus:ring-2 focus:ring-[var(--brand)]
                "
              />
              <button
                type="submit"
                aria-label="Send code"
                className="
                  absolute right-3 top-1/2 -translate-y-1/2
                  p-1 rounded-full bg-[var(--brand)] text-black
                  hover:bg-[#E8E455] transition
                "
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
          <form onSubmit={e => { e.preventDefault(); verify(code); }} className="w-full max-w-xs mx-auto space-y-4">
            <input
              ref={codeRef}
              type="text"
              inputMode="numeric"
              maxLength={6}
              required
              placeholder="123 456"
              value={code}
              onChange={e => {
                const digits = e.target.value.replace(/\D/g, "");
                setCode(digits);
                if (digits.length === 6 && !autoDone) {
                  setAutoDone(true);
                  verify(digits);      // 🚀 auto-submit on 6th digit / paste
                }
              }}
              className="
                w-full text-center tracking-widest text-2xl font-medium
                bg-transparent border-b-2 border-[var(--brand)]
                placeholder:text-[var(--brand)/0.6] py-2
                focus:outline-none focus:border-[var(--brand)]
              "
            />

            <button
              type="submit"
              className="w-full rounded-full py-3 bg-[var(--brand)] text-[#131B0E] font-medium hover:bg-[#E8E455] transition"
            >
              Sign&nbsp;in
            </button>

            <button
              type="button"
              onClick={sendCode}
              className="block w-full text-center text-sm underline text-[var(--brand)/0.8] hover:text-[var(--brand)]"
            >
              Resend code
            </button>

            {errorMsg && <p className="text-sm text-red-600 text-center">{errorMsg}</p>}
          </form>
        )}
      </section>
    </main>
  );
}

/* ─── helpers ───────────────────────────────────────────────── */
function CTAButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        w-full max-w-xs mx-auto
        rounded-full py-3 text-lg font-medium
        bg-[var(--brand)] text-black
        hover:bg-[#E8E455] transition
        shadow-md shadow-[var(--brand)/0.3]
      "
    >
      Get&nbsp;Started &#47; Log in
    </button>
  );
}

function SubNote({ className = "" }) {
  return (
    <p className={`text-xs text-center text-[var(--brand)/0.5] ${className}`}>
      By signing up you agree to our terms.<br />Subscription is required.
    </p>
  );
}