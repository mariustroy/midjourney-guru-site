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

  /* -------------- local state -------------- */
  const [phase, setPhase]       = useState<"cta" | "form" | "sent">("cta");
  const [email, setEmail]       = useState("");
  const [errorMsg, setError]    = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  /* -------------- redirect if already signed-in -------------- */
  useEffect(() => {
    supa.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace("/");
    });
  }, [router]);

  /* -------------- send magic link -------------- */
  async function sendLink(e?: React.FormEvent) {
    e?.preventDefault();
    if (!email) { inputRef.current?.focus(); return; }

    const { error } = await supa.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${
          process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
        }/auth/callback`,
      },
    });

    if (error) { setError(error.message); return; }
    setError("");
    setPhase("sent");
  }

  /* -------------- UI -------------- */
  return (
    <Shell phase={phase}>
      {phase === "sent" && (
        <>
          <p className="text-center text-lg font-medium text-brand">
            ✅ Check your inbox!
          </p>
          <p className="text-center text-sm opacity-80">
            We just sent you a magic link to sign&nbsp;in.
          </p>
        </>
      )}

      {phase === "cta" && (
        <CTAButton onClick={() => { setPhase("form"); setTimeout(()=>inputRef.current?.focus(),50); }} />
      )}

      {phase === "form" && (
        <form onSubmit={sendLink} className="w-full max-w-xs mx-auto">
          <div className="relative">
            <input
              ref={inputRef}
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="
                w-full rounded-full px-5 py-3 text-base
                border-2 border-brand bg-transparent text-brand
                placeholder:text-brand/60
                focus:outline-none focus:ring-2 focus:ring-brand
              "
            />
            <button
              type="submit"
              className="
                absolute right-3 top-1/2 -translate-y-1/2
                p-1 rounded-full bg-brand text-black hover:bg-brand/90
              "
              aria-label="Send magic link"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          {errorMsg && (
            <p className="mt-2 text-sm text-red-600">{errorMsg}</p>
          )}

          <p className="mt-2 text-xs text-center opacity-60">
            (subscription required)
          </p>
        </form>
      )}
    </Shell>
  );
}

/* ---------- CTA component ---------- */
function CTAButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="
        w-full max-w-xs mx-auto
        rounded-full py-3 text-lg font-medium
        bg-brand text-black hover:bg-brand/90 transition
        shadow-md shadow-brand/30
      "
    >
      Get&nbsp;Started
    </button>
  );
}

/* ---------- Shared layout shell ---------- */
function Shell({
  children,
  phase,
}: {
  children: React.ReactNode;
  phase: string;
}) {
  return (
    <main
      className="
        relative isolate min-h-screen flex flex-col
        items-center justify-center
        md:justify-start md:pt-24
        px-4 text-brand animate-fade-in
      "
    >
      {/* bg image */}
      <Image
        src="/hero.jpg"
        alt=""
        fill
        priority
        unoptimized
        className="object-cover object-center -z-10"
      />
      {/* dark overlay */}
      <div className="absolute inset-0 bg-black/60 -z-10" />

      {/* logo */}
      <Image
        src="/logo.svg"
        width={180}
        height={60}
        alt="Midjourney Guru"
        className="mx-auto mb-8"
        priority
      />

      {/* tag-line always visible */}
      <ul className="space-y-1 text-center text-lg md:text-xl font-light mb-10">
        <li>Midjourney AI Copilot</li>
        <li>Prompts Vault</li>
        <li>Resources &amp; Tutorials</li>
      </ul>

      {/* main content */}
      {children}

      {/* sticky mobile CTA (only in phase 'cta') */}
      {phase === "cta" && (
        <div
          className="
            md:hidden fixed inset-x-0 bottom-0
            backdrop-blur bg-black/50 p-4
          "
        >
          <CTAButton onClick={onClick => {}} />{/* click passes from parent */}
        </div>
      )}
    </main>
  );
}