// components/FormulaCard.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Copy, Check } from "lucide-react";

/*
  FormulaCard – strip with floating info box
  -----------------------------------------
  • open === true  ➜ panel visible (default)
  • open === false ➜ panel hidden, only “Show” button remains
*/

export default function FormulaCard({ data }) {
  /* ---------- copy-to-clipboard feedback ---------- */
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(data.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Clipboard error:", err);
    }
  };

  /* ---------- show / hide panel ---------- */
  const [open, setOpen] = useState(true);

  /* ---------- lazy-load media ------------- */
  const cardRef = useRef(null);
  const [showMedia, setShowMedia] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setShowMedia(true),
      { rootMargin: "200px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* ---------------------------------------------------------------- */
  /*  Render                                                          */
  /* ---------------------------------------------------------------- */
  return (
    <article ref={cardRef} className="relative px-6 pt-6">
      {/* ---------------------------------------------------------- */}
      {/* 1 · Media row (edge-to-edge with -mx-6)                    */}
      {/* ---------------------------------------------------------- */}
      {showMedia && (
        <div className="-mx-6 flex gap-2 overflow-x-auto scrollbar-hide">
          {/* images ------------------------------------------------ */}
          {Array.isArray(data.images) &&
            data.images.map((img) => (
              <Image
                key={img.id}
                src={img.src}
                alt={img.alt}
                width={512}
                height={512}
                unoptimized
                loading="lazy"
                className="h-64 w-auto shrink-0 rounded object-contain object-center md:h-80"
              />
            ))}

          {/* videos ------------------------------------------------ */}
          {Array.isArray(data.videos) &&
            data.videos.map(
              (src, i) =>
                typeof src === "string" && (
                  <video
                    key={i}
                    src={src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="h-64 w-auto shrink-0 rounded object-contain object-center md:h-80"
                  />
                )
            )}
        </div>
      )}

      {/* ---------------------------------------------------------- */}
      {/* 2 · Floating info panel                                   */}
      {/* ---------------------------------------------------------- */}
      {open && (
        <aside
          className="
            absolute inset-x-6 bottom-16 z-20
            rounded-2xl bg-black/60 p-6 text-white backdrop-blur-md
            lg:bottom-auto lg:right-6 lg:top-6 lg:h-auto lg:w-[320px] lg:inset-x-auto
          "
        >
          {/* title ------------------------------------------------ */}
          <h2 className="mb-2 text-lg font-medium">{data.title}</h2>

          {/* copy prompt button ---------------------------------- */}
          <button
            onClick={copy}
            className="mb-4 flex items-center gap-1 rounded-md bg-yellow-400 px-3 py-1 text-sm font-medium text-black hover:bg-yellow-300"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" /> Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" /> Copy prompt
              </>
            )}
          </button>

          {/* prompt ---------------------------------------------- */}
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {data.prompt}
          </p>

          {/* references ------------------------------------------ */}
          {Array.isArray(data.refs) && data.refs.length > 0 && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium">
                Reference Images
              </summary>
              <ul className="mt-2 flex flex-wrap gap-2">
                {data.refs.map((ref) => (
                  <li
                    key={ref.id}
                    className="flex flex-col items-center gap-1"
                  >
                    <a
                      href={ref.href || ref.src}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Image
                        src={ref.src}
                        alt={ref.label || ""}
                        width={80}
                        height={80}
                        unoptimized
                        loading="lazy"
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                    </a>
                    {ref.label && (
                      <span className="text-center text-xs opacity-80">
                        {ref.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </details>
          )}

          {/* method ---------------------------------------------- */}
          {data.method && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium">
                Method
              </summary>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
                {data.method}
              </p>
            </details>
          )}
        </aside>
      )}

      {/* ---------------------------------------------------------- */}
      {/* 3 · Show / Hide button (always top-right 24 px)           */}
      {/* ---------------------------------------------------------- */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="absolute right-6 top-6 z-30 rounded-full bg-black/60 px-4 py-1 text-sm text-white backdrop-blur-md hover:bg-black/70"
      >
        {open ? "Hide" : "Show"}
      </button>
    </article>
  );
}