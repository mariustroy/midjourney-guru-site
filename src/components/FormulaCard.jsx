// components/FormulaCard.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Copy, Check } from "lucide-react";

/*
  --------------------------------------------------------------------
  FormulaCard – full-width horizontal strip with a blurred info overlay
  --------------------------------------------------------------------
  Expected data shape (already coming from Supabase):
    {
      id,
      title,
      prompt,
      images:  [{ id, alt, src }],
      videos:  [".mp4", ...]      // optional array
      refs:    [{ id, src, href, label }],
      method:  "multi-line description"
    }
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

  /* ---------- show / hide info overlay ------------ */
  const [open, setOpen] = useState(false);

  /* ---------- lazy-render media when near viewport */
  const cardRef = useRef(null);
  const [showMedia, setShowMedia] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setShowMedia(true),
      { rootMargin: "200px 0px" } // load 200 px before visible
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* ---------------------------------------------------------------- */
  /*  Render                                                          */
  /* ---------------------------------------------------------------- */
  return (
    <article ref={cardRef} className="relative w-full py-8">
      {/* horizontal media row -------------------------------------- */}
      {showMedia && (
        <div className="flex gap-2 overflow-x-auto px-6 scrollbar-hide">
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
              (videoSrc, idx) =>
                typeof videoSrc === "string" && (
                  <video
                    key={idx}
                    src={videoSrc}
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

      {/* SHOW / HIDE toggle --------------------------------------- */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="absolute bottom-4 right-4 z-20 rounded-full bg-black/60 px-4 py-1 text-sm text-white backdrop-blur-md hover:bg-black/70"
      >
        {open ? "Hide" : "Show"}
      </button>

      {/* info overlay --------------------------------------------- */}
      <div
        className={`absolute right-6 top-6 z-10 w-[calc(100%-3rem)] max-w-sm overflow-hidden rounded-2xl bg-black/60 text-white backdrop-blur-md transition-all duration-300 ease-in-out ${
          open
            ? "pointer-events-auto max-h-[90vh] opacity-100"
            : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <div className="flex max-h-[85vh] flex-col gap-4 overflow-y-auto p-6">
          {/* title ------------------------------------------------ */}
          <h2 className="text-lg font-medium">{data.title}</h2>

          {/* copy prompt button ----------------------------------- */}
          <button
            onClick={copy}
            className="flex items-center gap-1 self-start rounded-md bg-yellow-400 px-3 py-1 text-sm font-medium text-black hover:bg-yellow-300"
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

          {/* prompt text ----------------------------------------- */}
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {data.prompt}
          </p>

          {/* reference images ------------------------------------ */}
          {Array.isArray(data.refs) && data.refs.length > 0 && (
            <details>
              <summary className="cursor-pointer text-sm font-medium">
                Reference Images
              </summary>
              <ul className="mt-2 flex flex-wrap gap-2">
                {data.refs.map((ref) => (
                  <li key={ref.id} className="flex flex-col items-center gap-1">
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

          {/* method drawer --------------------------------------- */}
          {data.method && (
            <details>
              <summary className="cursor-pointer text-sm font-medium">
                Method
              </summary>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
                {data.method}
              </p>
            </details>
          )}
        </div>
      </div>
    </article>
  );
}