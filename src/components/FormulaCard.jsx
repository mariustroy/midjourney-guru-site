// components/FormulaCard.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  FileText,
} from "lucide-react";

/*
  FormulaCard – full-width strip with floating info panel
  ------------------------------------------------------
  • open === true  ➜ panel visible (default)
  • open === false ➜ panel hidden, only “Show” button appears
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
      {/* 1 · Media row (edge-to-edge)                               */}
      {/* ---------------------------------------------------------- */}
      {showMedia && (
        <div className="-mx-6 flex gap-2 overflow-x-auto scrollbar-hide">
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
      {/* 2 · Info panel                                            */}
      {/* ---------------------------------------------------------- */}
      {open && (
        <aside
          className="
            relative z-20 w-full rounded-2xl bg-black/60 p-6 backdrop-blur-md
            -mt-16                           /* overlap 64 px on mobile   */
            lg:mt-0 lg:absolute lg:right-6 lg:top-12 lg:w-[320px]         /* desktop: 24 px gap */
          "
          style={{ border: "1px solid #3E4A32" }}
        >
          {/* header row ------------------------------------------ */}
          <div className="mb-4 flex items-start justify-between">
            {/* Copy button -------------------------------------- */}
            <button
              onClick={copy}
              className="flex items-center gap-2 text-lg font-medium text-[#FFFD91] hover:opacity-90"
            >
              {copied ? (
                <>
                  <Check className="h-5 w-5" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-5 w-5" /> Copy Prompt
                </>
              )}
            </button>

            {/* Hide button -------------------------------------- */}
            <button
              onClick={() => setOpen(false)}
              aria-label="Hide info"
              className="text-[#FFFD91] hover:opacity-90"
            >
              <ChevronUp className="h-5 w-5" />
            </button>
          </div>

          {/* prompt text ----------------------------------------- */}
          <p className="mb-6 whitespace-pre-wrap text-[17px] leading-relaxed text-[#FFFEE6]">
            {data.prompt}
          </p>

          {/* drawers --------------------------------------------- */}
          <div className="space-y-4">
            {/* Reference Images drawer ------------------------- */}
            {Array.isArray(data.refs) && data.refs.length > 0 && (
              <details className="group border-t border-[#3E4A32] pt-4">
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-[#FFFEE6]">
                  <span className="flex items-center gap-2 text-[17px]">
                    <ImageIcon className="h-5 w-5 text-[#FFFD91]" />
                    Reference Images ({data.refs.length})
                  </span>
                  <ChevronDown className="h-5 w-5 transform transition-transform group-open:rotate-180 text-[#FFFD91]" />
                </summary>

                <ul className="mt-4 flex flex-wrap gap-3">
                  {data.refs.map((ref) => (
                    <li key={ref.id} className="flex flex-col items-center">
                      <a
                        href={ref.href || ref.src}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg"
                      >
                        <Image
                          src={ref.src}
                          alt={ref.label || ""}
                          width={96}
                          height={96}
                          unoptimized
                          loading="lazy"
                          className="h-24 w-24 rounded-lg object-cover"
                        />
                      </a>
                      {ref.label && (
                        <span className="mt-1 text-xs text-[#FFFD91]">
                          {ref.label}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </details>
            )}

            {/* Method drawer ----------------------------------- */}
            {data.method && (
              <details className="group border-t border-[#3E4A32] pt-4">
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-[#FFFEE6]">
                  <span className="flex items-center gap-2 text-[17px]">
                    <FileText className="h-5 w-5 text-[#FFFD91]" />
                    Method
                  </span>
                  <ChevronDown className="h-5 w-5 transform transition-transform group-open:rotate-180 text-[#FFFD91]" />
                </summary>

                <p className="mt-4 whitespace-pre-wrap text-[17px] leading-relaxed text-[#FFFEE6]">
                  {data.method}
                </p>
              </details>
            )}
          </div>
        </aside>
      )}

      {/* ---------------------------------------------------------- */}
      {/* 3 · Show button (only when panel is hidden)                */}
      {/* ---------------------------------------------------------- */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="absolute right-6 top-6 z-30 rounded-full bg-black/60 px-4 py-1 text-sm text-[#FFFD91] backdrop-blur-md hover:bg-black/70"
        >
          Show
        </button>
      )}
    </article>
  );
}