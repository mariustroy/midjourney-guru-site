"use client";

import { useState } from "react";
import Image from "next/image";
import { Copy, Check } from "lucide-react";

export default function FormulaCard({ data }) {
  /* ----- copy-to-clipboard feedback ----- */
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(data.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);     // reset after 1.5 s
    } catch (err) {
      console.error("Clipboard error:", err);
    }
  };

  const hasRefs = data.refs?.length > 0;

  return (
    <article className="border rounded-lg p-4 bg-background/50 space-y-3">
      {/* header ------------------------------------------------------- */}
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

      {/* prompt ------------------------------------------------------- */}
      <code className="block whitespace-pre-wrap text-sm bg-muted p-2 rounded">
        {data.prompt}
      </code>

      {/* images + (optional) refs ------------------------------------ */}
      <div className="space-y-2">
        {/* image carousel */}
        <div className="flex gap-2 overflow-x-auto [&>*]:shrink-0">
          {data.images.map((img, i) => (
            <Image
              key={img.id}
              src={img.src}
              alt={img.alt}
              width={512}
              height={512}
              unoptimized  
              className={`
     rounded object-contain object-center     /* ⬅ keep whole image, no crop */
     max-h-40 md:max-h-48                     /* ⬅ cap height */
     ${i === 0 ? "w-[85vw] md:w-72" : "w-40 md:w-48"}              `}
            />
          ))}
        </div>

        {/* reference images (renders only if present) */}
        {hasRefs && (
          <div className="flex gap-2 overflow-x-auto">
            {data.refs.map(ref => (
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
   unoptimized                               {/* ⬅ critical */}
   className="rounded hover:opacity-80 object-cover object-center h-24 w-24"
 />
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}