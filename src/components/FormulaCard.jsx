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
  Fixes (only the requested)
  --------------------------
  • Show button sits exactly where Hide was (right-6 top-6 on all breakpoints).
  • Drawer open/close animates (transition-all on max-height container).
  • Info-box collapse/expand animates (transition-all on aside).
  • Spacing under Copy Prompt restored (mt-6 before prompt text).
  • Drawer borders still span edge-to-edge.
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

  /* info-box state */
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

  /* Drawer helper */
  const Drawer = ({
    summary,
    icon,
    children,
    accent = "#FFFD91",
    textClr = "#FFFEE6",
  }) => (
    <div className="-mx-6 border-t border-[#3E4A32]">
      <details className="group">
        <summary className="flex cursor-pointer items-center justify-between px-6 pt-4">
          <span
            className="flex items-center gap-2 text-sm"
            style={{ color: textClr }}
          >
            {icon}
            {summary}
          </span>
          <ChevronDown
            className="h-4 w-4 transform transition-transform group-open:rotate-180"
            style={{ color: accent }}
          />
        </summary>

        <div className="grid max-h-0 overflow-hidden px-6 transition-all duration-300 ease-in-out group-open:mt-4 group-open:max-h-96">
          {children}
        </div>
      </details>
    </div>
  );

  /* --------------------- render --------------------- */
  return (
    <article ref={cardRef} className="relative px-6 pt-6">
      {/* edge-to-edge media strip */}
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

      {/* info box (animated) */}
      <aside
        className={`
          relative z-20 w-full rounded-2xl
          -mt-16 lg:mt-0 lg:absolute lg:right-6 lg:top-12 lg:w-[320px]
          overflow-hidden transition-all duration-300 ease-in-out
          ${boxOpen
            ? "max-h-[2000px] bg-black/60 p-6 opacity-100 border border-[#3E4A32] backdrop-blur-md"
            : "max-h-0 p-0 opacity-0 bg-transparent border-none"}
        `}
      >
        {/* header row */}
        <div className="flex items-start justify-between">
          {boxOpen && (
            <>
              {/* copy prompt */}
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

              {/* hide */}
              <button
                onClick={() => setBoxOpen(false)}
                className="flex items-center gap-1 text-sm text-[#FFFD91] hover:opacity-90"
              >
                Hide <ChevronUp className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {/* body */}
        {boxOpen && (
          <div className="mt-6">
            <p className="mb-6 whitespace-pre-wrap text-[16px] leading-[19px] text-[#FFFEE6]">
              {data.prompt}
            </p>

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
          </div>
        )}
      </aside>

      {/* show button (same spot as Hide) */}
      {!boxOpen && (
        <button
          onClick={() => setBoxOpen(true)}
          style={{ border: "1px solid rgba(87,92,85,0.3)" }}
          className="
            absolute right-6 top-6 z-30 flex items-center gap-2
            rounded-full bg-black/60 px-4 py-1 text-sm font-medium text-[#FFFD91]
            hover:opacity-90
          "
        >
          <ChevronDown className="h-4 w-4" /> Show
        </button>
      )}
    </article>
  );
}