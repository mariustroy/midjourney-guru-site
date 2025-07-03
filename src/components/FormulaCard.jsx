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

  /* show / hide whole panel */
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

  /* Drawer helper (keeps full-width border via -mx-6 trick) */
  const Drawer = ({
    summary,
    icon,
    children,
    accent = "#FFFD91",
    textClr = "#FFFEE6",
  }) => (
    <details className="-mx-6 border-t border-[#3E4A32] px-6 pt-4 group">
      <summary className="flex cursor-pointer items-center justify-between">
        <span className="flex items-center gap-2 text-sm" style={{ color: textClr }}>
          {icon}
          {summary}
        </span>
        <ChevronDown
          className="h-4 w-4 transform transition-transform group-open:rotate-180"
          style={{ color: accent }}
        />
      </summary>

      {/* animated body */}
      <div className="grid max-h-0 overflow-hidden transition-all duration-300 ease-in-out group-open:mt-4 group-open:max-h-96">
        {children}
      </div>
    </details>
  );

  return (
    <article ref={cardRef} className="relative px-6 pt-6">
      {/* ---------------------------------------------------------------- */}
      {/* MEDIA STRIP (edge-to-edge)                                       */}
      {/* ---------------------------------------------------------------- */}
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

      {/* ---------------------------------------------------------------- */}
      {/* INFO BOX  (position & size unchanged)                            */}
      {/* ---------------------------------------------------------------- */}
      <aside
        className={`
          relative z-20 w-full rounded-2xl bg-black/60 backdrop-blur-md
          transition-all duration-300 ease-in-out
          ${boxOpen ? "p-6" : "p-2"}
          -mt-16 lg:mt-0 lg:absolute lg:right-6 lg:top-12 lg:w-[320px]
        `}
        style={{ border: "1px solid #3E4A32" }}
      >
        {/* -------------------------------------------------------------- */}
        {/* HEADER ROW  (Copy + Hide  OR  Show)                            */}
        {/* -------------------------------------------------------------- */}
        <div className="flex items-start justify-between">
          {boxOpen ? (
            <>
              {/* Copy prompt */}
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

              {/* Hide */}
              <button
                onClick={() => setBoxOpen(false)}
                className="flex items-center gap-1 text-sm text-[#FFFD91] hover:opacity-90"
              >
                Hide <ChevronUp className="h-4 w-4" />
              </button>
            </>
          ) : (
            /* Show — sits exactly where Hide was */
            <button
              onClick={() => setBoxOpen(true)}
              style={{ border: "1px solid rgba(87,92,85,0.3)" }} // #575C55 @ 30 %
              className="flex items-center gap-2 rounded-full px-4 py-1 text-sm font-medium text-[#FFFD91] hover:opacity-90"
            >
              <ChevronDown className="h-4 w-4" /> Show
            </button>
          )}
        </div>

        {/* -------------------------------------------------------------- */}
        {/* COLLAPSIBLE CONTENT                                            */}
        {/* -------------------------------------------------------------- */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            boxOpen ? "max-h-[1000px] mt-6" : "max-h-0"
          }`}
        >
          {/* prompt */}
          <p className="mb-6 whitespace-pre-wrap text-[16px] leading-[19px] text-[#FFFEE6]">
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
        </div>
      </aside>
    </article>
  );
}