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
  FormulaCard – UI-polished strip
  - Reference & Method summary text: 14 px
  - Drawer borders stretch edge-to-edge via -mx-6
  - Drawer content animates open / close (max-height transition)
*/

export default function FormulaCard({ data }) {
  /* copy prompt feedback */
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

  /* show / hide info box */
  const [open, setOpen] = useState(true);

  /* lazy-load media */
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

  return (
    <article ref={cardRef} className="relative px-6 pt-6">
      {/* media row ------------------------------------------------ */}
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

      {/* info box ------------------------------------------------- */}
      {open && (
        <aside
          className="
            relative z-20 w-full rounded-2xl bg-black/60 p-6 backdrop-blur-md
            -mt-16 lg:mt-0 lg:absolute lg:right-6 lg:top-12 lg:w-[320px]
          "
          style={{ border: "1px solid #3E4A32" }}
        >
          {/* header row */}
          <div className="mb-4 flex items-start justify-between">
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

            <button
              onClick={() => setOpen(false)}
              className="flex items-center gap-1 text-sm text-[#FFFD91] hover:opacity-90"
            >
              Hide <ChevronUp className="h-4 w-4" />
            </button>
          </div>

          {/* prompt text */}
          <p className="mb-6 whitespace-pre-wrap text-[16px] leading-[19px] text-[#FFFEE6]">
            {data.prompt}
          </p>

          {/* drawers --------------------------------------------- */}
          <div className="space-y-4">
            {/* Reference Images --------------------------------- */}
            {data.refs?.length > 0 && (
              <details className="group -mx-6 border-t border-[#3E4A32] px-6 pt-4">
                <summary className="flex cursor-pointer items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-[#7A947D]">
                    <ImageIcon className="h-4 w-4 text-[#7A947D]" />
                    Reference Images ({data.refs.length})
                  </span>
                  <ChevronDown className="h-4 w-4 transform text-[#7A947D] transition-transform group-open:rotate-180" />
                </summary>

                {/* animated content */}
                <div className="grid max-h-0 overflow-hidden transition-all duration-300 ease-in-out group-open:mt-4 group-open:max-h-96">
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
                </div>
              </details>
            )}

            {/* Method ------------------------------------------- */}
            {data.method && (
              <details className="group -mx-6 border-t border-[#3E4A32] px-6 pt-4">
                <summary className="flex cursor-pointer items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-[#FFFEE6]">
                    <FileText className="h-4 w-4 text-[#FFFD91]" />
                    Method
                  </span>
                  <ChevronDown className="h-4 w-4 transform text-[#FFFD91] transition-transform group-open:rotate-180" />
                </summary>

                <div className="grid max-h-0 overflow-hidden transition-all duration-300 ease-in-out group-open:mt-4 group-open:max-h-96">
                  <p className="whitespace-pre-wrap text-[17px] leading-relaxed text-[#FFFEE6]">
                    {data.method}
                  </p>
                </div>
              </details>
            )}
          </div>
        </aside>
      )}

      {/* show button */}
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