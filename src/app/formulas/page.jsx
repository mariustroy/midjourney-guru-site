"use client";
import { useState, useMemo } from "react";
import formulas from "@/data/formulas";      // temp local file
import FormulaCard from "@/components/FormulaCard";
import { Copy, Search, X } from "lucide-react";

export default function Formulas() {
  /* ------------- state ------------- */
  const [search, setSearch]     = useState("");
  const [activeCat, setCat]     = useState(null);

  /* ------------- derived list ------------- */
  const filtered = useMemo(() => {
    return formulas.filter(f => {
      const matchesSearch =
        f.prompt.toLowerCase().includes(search.toLowerCase()) ||
        f.title .toLowerCase().includes(search.toLowerCase());

     const matchesCat = !activeCat || (f.category ?? []).includes(activeCat);
      return matchesSearch && matchesCat;
    });
  }, [search, activeCat]);

  return (
   <div
   className="
     max-w-2xl mx-auto        /* same width constraint as Resources */
     px-4 py-6               /* horizontal + vertical padding       */
     pt-16 md:pt-8           /* extra room under the hamburger      */
     space-y-6
   "
 >
      <h1 className="text-2xl font-semibold">Formulas</h1>

      {/* ------------- search ------------- */}
      <div className="relative max-w-sm">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search formula…"
          className="w-full bg-background/60 backdrop-blur border rounded pl-10 pr-10 py-2"
        />
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        {search && (
          <button
            className="absolute right-2 top-2.5"
            onClick={() => setSearch("")}
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ------------- category chips ------------- */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {["portrait","surreal","fashion","architecture"].map(cat => {
          const active = activeCat === cat;
          return (
            <button
              key={cat}
              onClick={() => setCat(active ? null : cat)}
              className={`
                whitespace-nowrap rounded-full px-3 py-1 text-sm
                ${active
                  ? "bg-brand text-black"
                  : "bg-muted hover:bg-muted/70"}
              `}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* ------------- list ------------- */}
      <div className="space-y-8">
        {filtered.map(formula => (
          <FormulaCard key={formula.id} data={formula} />
        ))}
      </div>
    </div>
  );
}