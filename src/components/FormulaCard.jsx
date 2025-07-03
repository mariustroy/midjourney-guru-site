"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Copy, Check } from "lucide-react";

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

  /* ---------- lazy-render content when card is near viewport ---------- */
  const cardRef = useRef(null);
  const [showMedia, setShowMedia] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setShowMedia(true),
      { rootMargin: "200px 0px" } // start loading 200 px before visible
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);
 
  return (
    <article
      ref={cardRef}
      className="border rounded-[24px] p-4 bg-background/50 space-y-3"
    >
      {/* header ----------------------------------------------------- */}
      <header className="flex justify-between items-start">
        <h2 className="font-medium">{data.title}</h2>

        <button
          onClick={copy}
          className="flex items-center gap-1 text-sm hover:text-brand"
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
      </header>

      {/* prompt ----------------------------------------------------- */}
      <code className="block whitespace-pre-wrap text-sm bg-muted p-2 rounded">
        {data.prompt}
      </code>

      {/* media (images + videos) + refs – rendered only after the card scrolls into view */}
      {showMedia && (
        <div className="space-y-2">
          {/* image carousel */}
          {data.images?.length > 0 && (
            <div className="flex gap-2 overflow-x-auto [&>*]:shrink-0">
              {data.images.map((img, i) => (
                <Image
                  key={img.id}
                  src={img.src}
                  alt={img.alt}
                  width={512}
                  height={512}
                  unoptimized
                  loading="lazy"
                  className={`rounded object-contain object-center h-64 md:h-80 w-auto`}
                />
              ))}
            </div>
          )}
{Array.isArray(data.videos) && data.videos.length > 0 && (
  <div className="flex gap-2 overflow-x-auto [&>*]:shrink-0">
    {data.videos.map((videoSrc, idx) =>
      typeof videoSrc === 'string' ? (
        <video
          key={idx}
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          className="rounded object-contain object-center h-64 md:h-80 w-auto"
        >
          Your browser does not support the video tag.
        </video>
      ) : null
    )}
  </div>
)}
          {/* reference images (if any) */}
          {data.refs?.length > 0 && (
            <div className="flex gap-2 overflow-x-auto">
              {data.refs.map((ref) => (
                <a
                  key={ref.id}
                  href={ref.href || ref.src}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0"
                >
                  <Image
                    src={ref.src}
                    alt={ref.label || ""}
                    width={96}
                    height={96}
                    unoptimized
                    loading="lazy"
                    className="rounded hover:opacity-80 object-cover object-center h-24 w-24"
                  />
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}