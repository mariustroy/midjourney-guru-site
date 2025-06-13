/* ──────────────────────────────────────────────────────────────
   app/login/page.js
   ( only the import list & render tree changed – all logic kept )
────────────────────────────────────────────────────────────────*/
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, ChevronDown } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import SignupInfoSection from "@/components/SignupInfoSection";

/* ── Supabase ─────────────────────────────────────────────── */
const supa = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);


export default function Login() {
  const router = useRouter();

  /* UI state (AUTH — DO NOT TOUCH) */
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
 
  /* ──────────────────────────────────────────────────────────
     AUTH HELPERS (unchanged)
  ────────────────────────────────────────────────────────────*/
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

    window.location.assign("/");            // hard reload with cookies
  }

  function handleCodeInput(e) {
    const digits = e.target.value.replace(/\D/g, "");
    setCode(digits);
    if (digits.length === 6) verifyToken(digits);
  }

  /* ──────────────────────────────────────────────────────────
     RENDER TREE
  ────────────────────────────────────────────────────────────*/
  return (
    <>
      {/* ——— Hero / Signup ——— */}
      <section id="signup" className="relative isolate overflow-hidden">
        {/* bg image + overlay */}
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          priority
          unoptimized
          className="object-cover object-center absolute inset-0 -z-20"
        />
        <div className="absolute inset-0 bg-black/50 -z-10" />

        {/* content */}
        <div className="mx-auto max-w-screen-xl px-4 pt-10 lg:pt-12 pb-16 lg:pb-24
        text-center text-[var(--brand)]">
          {/* logo */}
          <Image
            src="/images/logo.svg"
            alt="Midjourney Guru"
            width={192}
            height={64}
            priority
            className="mx-auto w-40 md:w-48 mb-6 md:mb-8"
          />

          {/* tagline */}
          <h1 className="hero-heading font-elanor font-[200] leading-snug
                      text-3xl md:text-4xl lg:text-5xl
                      max-w-xl md:max-w-3xl mx-auto mb-8 lg:mb-12">
            Midjourney&nbsp;AI helper. <br className="hidden sm:inline" />
            Prompts&nbsp;Vault, Tutorials &amp;&nbsp;More
          </h1>

          {/* CTA / Auth widget */}
          <div className="w-full sm:max-w-md mx-auto">
            {/* phase-dependent content */}
            {phase === "cta" && (
              <>
                <CTAButton onClick={() => setPhase("email")} />
                <SubNote className="mt-3" />
              </>
            )}

            {phase === "email" && (
              <form onSubmit={sendCode} className="mt-2 space-y-4">
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
                {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
                <SubNote />
              </form>
            )}

            {phase === "code" && (
              <div className="space-y-4 mt-2">
                <p className="text-sm text-[var(--brand)/80%]">
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
                  className="block w-full text-sm underline
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
          </div>
        </div>
      </section>

      {/* ——— Explainer / Feature blocks ——— */}
      <FeatureSection />

      {/* ——— Promo video thumb ——— */}
      <VideoSection />

      {/* ——— FAQ accordions ——— */}
      <FAQSection />

      {/* ——— Bottom CTA ——— */}
      <FinalCTA onClick={() => {
        document.getElementById("signup")?.scrollIntoView({ behavior: "smooth" });
        setPhase("email");
      }} />

      {/* Existing legal blurb (kept for parity) */}
     
    </>
  );
}

/* ──────────────────────────────────────────────────────────────
   Presentational sub-components
────────────────────────────────────────────────────────────────*/
function CTAButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-full py-3 text-lg font-medium
                 bg-[var(--brand)] text-black hover:bg-[#E8E455] transition
                 shadow-md shadow-[var(--brand)/30%]"
    >
      Get&nbsp;Started&nbsp;/&nbsp;Log&nbsp;in
    </button>
  );
}

function SubNote({ className = "" }) {
  return (
    <p className={`text-xs text-center text-[var(--brand)/50%] ${className}`}>
      Subscription is&nbsp;$7&nbsp;a&nbsp;month. Cancel any time.<br />
      By signing up you agree to our&nbsp;
      <a
        href="https://docs.google.com/document/d/12zXgnV7xZQWdRdr99Q99la3engBpTKMW-cCbLReJbS0/edit?usp=sharing"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-[var(--brand)]"
      >
        terms
      </a>.
    </p>
  );
}

/* ––– Marketing sections ––– */

function FeatureSection() {
  return (
    <section className="bg-[#0D1A0E] text-[var(--brand)] py-16 md:py-24">
      <div className="mx-auto max-w-screen-lg px-6 lg:px-8
                     space-y-12 md:space-y-2">

        {/* helper blurb – no images here anymore */}
        <div className="text-center space-y-6">
          <h3 className="text-lg md:text-2xl lg:text-4xl font-medium">
            Guru is a Midjourney and AI Prompts Helper
          </h3>
          <p className="max-w-2xl mx-auto text-sm md:text-base                      /* ↓ */
                    text-[var(--brand)/80%] leading-relaxed">
            It can help you refine and adjust your prompts. Talk to it like you
            would with a human mentor and walk away with optimized prompts in
            seconds.
          </p>
        </div>

        {/* Prompts Vault ––– now uses the fan-spread */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-24 xl:gap-32 items-center">
          <FanOfPromptCards />                       {/* <—— swapped in */}
          <div className="space-y-5 md:order-first relative z-20
                          text-center md:text-left">
            <h3 className="text-lg md:text-2xl font-medium">
              Prompts Vault with 30+ Personal Prompts
            </h3>
            <p className="text-[var(--brand)/80%]">
              Steal Marius Troy’s best work: real-world prompts grouped by
              style, subject &amp; lighting—ready to copy &amp; tweak. New
              prompts added continuously.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* fan component extracted so we can reuse it cleanly */
function FanOfPromptCards() {
  return (
    <div className="relative flex justify-center md:justify-start">
      <Image
        src="/images/demo-card1.jpg"
        alt=""
        width={200}
        height={320}
        className="rounded-xl ring-1 ring-white/10 shadow-lg relative z-10"
        unoptimized
      />
      <Image
        src="/images/demo-card2.jpg"
        alt=""
        width={200}
        height={320}
        className="rounded-xl ring-1 ring-white/10 shadow-lg absolute -rotate-6 -translate-x-36 opacity-70"
        unoptimized
      />
      <Image
        src="/images/demo-card3.jpg"
        alt=""
        width={200}
        height={320}
        className="rounded-xl ring-1 ring-white/10 shadow-lg absolute rotate-6 translate-x-36 opacity-70"
        unoptimized
      />
    </div>
  );
}


function VideoSection() {
  return (
    <section className="bg-[#0F1F11] text-[var(--brand)] py-16 md:py-24">
      <div className="mx-auto max-w-screen-lg px-6 lg:px-8 text-center space-y-6">
        <h3 className="text-lg md:text-2xl font-medium">Full Video Tutorials</h3>
        <p className="max-w-xl mx-auto text-[var(--brand)/80%]">
          Watch Marius Troy share his entire process, build prompts live and
          explain every parameter and reference-image trick.
        </p>

        {/* thumbnail + underlying stack */}
        <div className="relative inline-block">
        
          {/* main video thumb with play button */}
          <button aria-label="Play promo video" className="group relative">
            <Image
              src="/images/videostack.png"
              alt="Play video"
              width={640}
              height={423}
              className="rounded-xl"
              unoptimized
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="w-16 h-16 rounded-full bg-[var(--brand)] flex items-center justify-center group-hover:scale-105 transition-transform">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 fill-[#131B0E] pl-1"
                  viewBox="0 0 24 24"
                >
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              </span>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}


function FAQSection() {
  const faqs = [
    "Do I need a paid Midjourney account?",
    "Can I cancel anytime?",
    "Is there a free trial?",
    "When will new prompts be added?",
  ];
  return (
    <section className="bg-[#0F1F11] text-[var(--brand)] py-16 md:py-24">
      <div className="mx-auto max-w-screen-md px-6 lg:px-8">
        <h3 className="text-center text-lg md:text-2xl font-medium mb-10">
          FAQs
        </h3>
        <ul className="space-y-4">
          {faqs.map((q) => (
            <li key={q} className="bg-[#122015] rounded-lg">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer py-4 px-6">
                  <span>{q}</span>
                  <ChevronDown
                    className="w-5 h-5 shrink-0 transition-transform
                               group-open:rotate-180"
                  />
                </summary>
                <div className="px-6 pb-4 pt-0 text-[var(--brand)/80%]">
                 Yes. Guru is a companion that helps you craft prompts; you still need a Midjourney subscription to generate images on their platform.
                </div>
              </details>
            </li>
            <li key={q} className="bg-[#122015] rounded-lg">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer py-4 px-6">
                  <span>{q}</span>
                  <ChevronDown
                    className="w-5 h-5 shrink-0 transition-transform
                               group-open:rotate-180"
                  />
                </summary>
                <div className="px-6 pb-4 pt-0 text-[var(--brand)/80%]">
                 Of course.
                </div>
              </details>
            </li>
            <li key={q} className="bg-[#122015] rounded-lg">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer py-4 px-6">
                  <span>{q}</span>
                  <ChevronDown
                    className="w-5 h-5 shrink-0 transition-transform
                               group-open:rotate-180"
                  />
                </summary>
                <div className="px-6 pb-4 pt-0 text-[var(--brand)/80%]">
                 Not at the moment, but stay informed on my instagram for offers.
                </div>
              </details>
            </li>
            <li key={q} className="bg-[#122015] rounded-lg">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer py-4 px-6">
                  <span>{q}</span>
                  <ChevronDown
                    className="w-5 h-5 shrink-0 transition-transform
                               group-open:rotate-180"
                  />
                </summary>
                <div className="px-6 pb-4 pt-0 text-[var(--brand)/80%]">
                 I add new batches of prompts at least twice a month.
                </div>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function FinalCTA({ onClick }) {
  return (
    <section className="bg-[#0D1A0E] text-[var(--brand)] py-20 text-center">
      <h3 
      style={{ fontFamily: 'elanor, sans-serif', fontWeight: 200 }}
      className="text-xl md:text-3xl mb-6">
        Start learning with <span className="font-[400]">Guru</span> now
      </h3>
      <button
        onClick={onClick}
        className="inline-block rounded-full py-3 px-10 text-lg font-medium
                   bg-[var(--brand)] text-black hover:bg-[#E8E455] transition
                   shadow-md shadow-[var(--brand)/30%]"
      >
        Get Started
      </button>
    </section>
  );
}