import Image from "next/image";
import { Copy } from "lucide-react";

export default function FormulaCard({ data }) {
  const copy = () => navigator.clipboard.writeText(data.prompt);

  return (
    <article className="border rounded-lg p-4 space-y-3 bg-background/50">
      <header className="flex justify-between items-start">
        <h2 className="font-medium">{data.title}</h2>
        <button
          onClick={copy}
          className="flex items-center gap-1 text-sm hover:text-brand"
        >
          <Copy className="h-4 w-4" /> Copy prompt
        </button>
      </header>

      <code className="block whitespace-pre-wrap text-sm bg-muted p-2 rounded">
        {data.prompt}
      </code>

      {/* results carousel */}
      <div
        className="
          flex gap-2 overflow-x-auto
          [&>*]:shrink-0
        "
      >
        {data.images.map((img, i) => (
          <Image
            key={img.id}
            src={img.src}
            alt={img.alt}
            width={512}
            height={512}
            className={`
              rounded
              ${i === 0 ? "w-[85vw] md:w-72" : "w-40 md:w-48"}
            `}
          />
        ))}
      </div>

      {/* reference images */}
      {data.refs.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pt-2">
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
                className="rounded hover:opacity-80"
              />
            </a>
          ))}
        </div>
      )}
    </article>
  );
}