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
  ➜ Fix: Hide / Show buttons now sit bottom-right of the *FormulaCard*,
    not bottom-right of the info box.
  (All previous animations and drawer borders retained.)
*/

export default function FormulaCard({ data }) {
  /* copy-prompt feedback */
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

  /* info-box open / closed */
  const [boxOpen, setBoxOpen] = useState(true);

  /* lazy-render media */
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

  /* Drawer helper (edge-to-edge border + animation) */
  const Drawer = ({ summary, icon, children, accent = "#FFFD91", textClr = "#FFFEE6" }) => {
    const [open, setOpen] = useState(false);
    return (
      <div className="-mx-6 border-t border-[#3E4A32]">
        <button
          onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-between px-6 pt-4"
        >
          <span className="flex items-center gap-2 text-sm" style={{ color: textClr }}>
            {icon}
            {summary}
          </span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
            style={{ color: accent }}
          />
        </button>

        <div
          style={{ maxHeight: open ? "600px" : "0px" }}
          className="overflow-hidden px-6 transition-[max-height] duration-300 ease-in-out"
        >
          {open && <div className="mt-4">{children}</div>}
        </div>
      </div>
    );
  };

  /* ------------------------------------------------ render ------------------------------------------------ */
  return (
    <article ref={cardRef} className="relative px-6 pt-6">
      {/* media strip (edge-to-edge) */}
      {showMedia && (
        <div className="-mx-6 flex gap-2 overflow-x-auto scrollbar-hide">
          {data.images?.map((img) => (
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
          {data.videos?.map(
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

      {/* info box (animated height) */}
      <aside
        className={`
          relative z-20 w-full rounded-2xl
          -mt-16 lg:mt-0 lg:absolute lg:right-6 lg:top-12 lg:w-[320px]
          transition-[max-height,opacity,padding] duration-300 ease-in-out
          ${boxOpen
            ? "max-h-[2000px] bg-black/60 p-6 opacity-100 border border-[#3E4A32] backdrop-blur-md"
            : "max-h-0 p-0 opacity-0 bg-transparent border-none overflow-hidden"}
        `}
      >
        {boxOpen && (
          <>
            {/* Copy Prompt */}
            <button
              onClick={copy}
              className="flex items-center gap-2 text-sm font-medium text-[#FFFD91] hover:opacity-90"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" /> Copy Prompt
                </>
              )}
            </button>

            {/* prompt text */}
            <p className="mt-6 mb-6 whitespace-pre-wrap text-[16px] leading-[19px] text-[#FFFEE6]">
              {data.prompt}
            </p>

            {/* drawers */}
            <div className="space-y-4">
              {data.refs?.length > 0 && (
                <Drawer
                  summary={`Reference Images (${data.refs.length})`}
                  accent="#7A947D"
                  textClr="#7A947D"
                  icon={<ImageIcon className="h-4 w-4 text-[#7A947D]" />}
                >
                  <ul className="flex flex-wrap gap-3">
                    {data.refs.map((ref) => (
                      <li key={ref.id} className="flex flex-col items-center">
                        <a
                          href={ref.href || ref.src}
                          target="_blank"
                          rel="noreferrer"
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
                </Drawer>
              )}

              {data.method && (
                <Drawer
                  summary="Method"
                  icon={<FileText className="h-4 w-4 text-[#FFFD91]" />}
                >
                  <p className="whitespace-pre-wrap text-[17px] leading-relaxed text-[#FFFEE6]">
                    {data.method}
                  </p>
                </Drawer>
              )}
            </div>
          </>
        )}
      </aside>

      {/* Hide / Show buttons (bottom-right of card) */}
      {boxOpen ? (
        <button
          onClick={() => setBoxOpen(false)}
          className="absolute right-6 bottom-4 z-30 flex items-center gap-1 text-sm text-[#FFFD91] hover:opacity-90"
        >
          Hide <ChevronUp className="h-4 w-4" />
        </button>
      ) : (
        <button
          onClick={() => setBoxOpen(true)}
          style={{ border: "1px solid rgba(87,92,85,0.3)" }}
          className="absolute right-6 bottom-4 z-30 flex items-center gap-2 rounded-full bg-black/60 px-4 py-1 text-sm font-medium text-[#FFFD91] hover:opacity-90"
        >
          <ChevronDown className="h-4 w-4" /> Show
        </button>
      )}
    </article>
  );
}