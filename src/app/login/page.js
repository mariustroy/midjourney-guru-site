"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

/* ---------- Supabase ---------- */
const supa = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Login() {
  const router             = useRouter();
  const [phase, setPhase]  = useState("cta");      // cta | form | sent
  const [email, setEmail]  = useState("");
  const [errorMsg, setErr] = useState("");
  const inputRef           = useRef(null);

  /* redirect if already logged in */
  useEffect(() => {
    supa.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace("/");
    });
  }, [router]);

  /* send magic-link */
  async function sendLink(e) {
    e.preventDefault();
    if (!email) { inputRef.current?.focus(); return; }

    const { error } = await supa.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo:
          `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback`,
      },
    });

    if (error) { setErr(error.message); return; }
    setErr("");
    setPhase("sent");
  }

  return (
    <main
      className="
        relative isolate min-h-screen flex flex-col
        bg-black text-[var(--brand)]
      "
    >
      {/* -------- background & overlay -------- */}
      <Image
        src="/images/hero.jpg"
        alt=""
        fill
        priority
        unoptimized
        className="object-cover object-center -z-10"
      />
      <div className="absolute inset-0 bg-black/40 -z-10" />

      {/* -------- header (logo + tagline) -------- */}
      <header
        className="
          pt-16 md:pt-12            /*  ↓ 64 px from top on mobile, 48 px on desktop */
          text-center px-4
          md:absolute md:top-12 md:left-1/2 md:-translate-x-1/2
        "
      >
        <Image
          src="/images/logo.svg"
          alt="Midjourney Guru"
          width={176} height={60}
          className="w-36 md:w-44 mx-auto mb-6"   /* 144 px mobile */
          priority
        />

        <ul
          className="
            space-y-1
            text-lg md:text-xl
            font-light tracking-wide           /*   thinner but readable   */
            mb-8
            max-w-md mx-auto
          "
        >
          <li>Midjourney AI Copilot</li>
          <li>Prompts Vault</li>
          <li>Resources &amp; Tutorials</li>
        </ul>
      </header>

      {/* -------- CTA / form wrapper -------- */}
      <section
        className="
          flex-1 flex flex-col items-center
          justify-end md:justify-center
          px-4 pb-32 md:pb-0           /*  ↓  keeps CTA clear of iOS bottom bar   */
        "
      >
        {phase === "cta" && (
          <>
            <CTAButton onClick={() => setPhase("form")} />
            <SubNote className="mt-3" />
          </>
        )}

        {phase === "form" && (
          <form onSubmit={sendLink} className="w-full max-w-xs mx-auto">
            <div className="relative">
              <input
                ref={inputRef}
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
                aria-label="Send magic link"
                className="
                  absolute right-3 top-1/2 -translate-y-1/2
                  p-1 rounded-full bg-[var(--brand)]
                  text-black hover:bg-[var(--brand)/0.9]
                "
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            {errorMsg && (
              <p className="mt-2 text-sm text-red-600">{errorMsg}</p>
            )}

            <SubNote className="mt-4" />
          </form>
        )}

        {phase === "sent" && (
          <div className="text-center space-y-1 mb-10 md:mb-0">
            <p className="text-lg font-medium text-[var(--brand)]">
              ✅ Check your inbox!
            </p>
            <p className="text-sm opacity-80">
              We just sent you a magic link to sign&nbsp;in.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

/* ---------- helpers ---------- */

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
      Get&nbsp;Started
    </button>
  );
}

function SubNote({ className = "" }) {
  return (
    <p className={`text-xs text-center text-[var(--brand)/0.5] ${className}`}>
      (subscription required)
    </p>
  );
}