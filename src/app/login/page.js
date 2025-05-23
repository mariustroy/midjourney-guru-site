"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supa = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Login() {
  const router = useRouter();
  const [phase, setPhase] = useState("cta");   // cta | form | sent
  const [email, setEmail] = useState("");
  const [errorMsg, setError] = useState("");
  const inputRef = useRef(null);

  /* redirect if already signed-in */
  useEffect(() => {
    supa.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace("/");
    });
  }, [router]);

  /* send magic link */
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

    if (error) { setError(error.message); return; }
    setError("");
    setPhase("sent");
  }

  const showForm = () => {
    setPhase("form");
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <Shell phase={phase}>
      {/* ---------- logo ---------- */}
      <Image
        src="/images/logo.svg"
        alt="Midjourney Guru"
        width={176} height={60}           /* intrinsic size */
        className="w-36 md:w-44 mx-auto mb-6"   /* 144 px mobile, 176 px desktop */
        priority
      />

      {/* ---------- tagline ---------- */}
      <ul className="space-y-1 text-center text-lg md:text-xl font-medium mb-12">
        <li>Midjourney AI Copilot</li>
        <li>Prompts Vault</li>
        <li>Resources &amp; Tutorials</li>
      </ul>

      {/* ---------- main slot ---------- */}
      {phase === "cta" && (
        <>
          <CTAButton onClick={showForm} />
          <SubscriptionNote />
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
                border-2 border-[var(--brand)] bg-transparent text-[var(--brand)]
                placeholder:text-[var(--brand)/0.6]
                focus:outline-none focus:ring-2 focus:ring-[var(--brand)]
              "
            />
            <button
              type="submit"
              aria-label="Send magic link"
              className="
                absolute right-3 top-1/2 -translate-y-1/2
                p-1 rounded-full bg-[var(--brand)] text-black hover:bg-[var(--brand)/0.9]
              "
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          {errorMsg && (
            <p className="mt-2 text-sm text-red-600">{errorMsg}</p>
          )}

          <SubscriptionNote className="mt-4" />
        </form>
      )}

      {phase === "sent" && (
        <>
          <p className="text-center text-lg font-medium text-[var(--brand)]">
            ✅ Check your inbox!
          </p>
          <p className="text-center text-sm opacity-80">
            We just sent you a magic link to sign&nbsp;in.
          </p>
        </>
      )}
    </Shell>
  );
}

/* ---------- reusable components ---------- */

function CTAButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        w-full max-w-xs mx-auto
        rounded-full py-3 text-lg font-medium
        bg-[var(--brand)] text-black hover:bg-[var(--brand)/0.9] transition
        shadow-md shadow-[var(--brand)/0.3]
      "
    >
      Get&nbsp;Started
    </button>
  );
}

function SubscriptionNote({ className = "" }) {
  return (
    <p className={`text-xs text-center opacity-60 ${className}`}>
      (subscription required)
    </p>
  );
}

/* ---------- Layout shell ---------- */
function Shell({ children, phase }) {
  return (
    <main
      className="
        relative isolate min-h-screen flex flex-col items-center
        /* mobile: start near top; desktop: centre vertically */
        pt-20 justify-start md:justify-center
        px-4 text-[var(--brand)]
      "
    >
      {/* background image + overlay */}
      <Image
        src="/images/hero.jpg"
        alt=""
        fill
        priority
        unoptimized
        className="object-cover object-center -z-10"
      />
      <div className="absolute inset-0 bg-black/60 -z-10" />

      {/* flex-column content */}
      {children}

      {/* spacer pushes content up so button centres desktop only */}
      {phase === "cta" && <div className="flex-1 md:flex-none" />}
    </main>
  );
}