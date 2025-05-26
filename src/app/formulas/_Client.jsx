"use client";

import { useState, useMemo } from "react";
import FormulaCard from "@/components/FormulaCard";
import { Search, X } from "lucide-react";

export default function FormulasClient({ initial }) {
  /* ---------- state ---------- */
  const [search, setSearch]   = useState("");
  const [activeCats, setCats] = useState([]);          // ← now an array

  /* ---------- derive categories ---------- */
  const categories = useMemo(() => {
    const set = new Set();
    initial.forEach((f) => (f.category ?? []).forEach((c) => set.add(c)));
    return Array.from(set).sort();
  }, [initial]);

  /* ---------- filtered list ---------- */
  const filtered = useMemo(() => {
    return initial.filter((f) => {
      const q = search.toLowerCase();
      const matchesSearch =
        f.prompt.toLowerCase().includes(q) ||
        f.title .toLowerCase().includes(q);

      const matchesCat =
        activeCats.length === 0 ||                           // no pill → all
        (f.category ?? []).some((c) => activeCats.includes(c));

      return matchesSearch && matchesCat;
    });
  }, [search, activeCats, initial]);

  /* ---------- helper: toggle cat ---------- */
  const toggleCat = (cat) =>
    setCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );

  /* ---------- render ---------- */
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pt-22 md:pt-8 space-y-6">
      {/* headline --------------------------------------------------- */}
      <h1 className="text-[36px] leading-tight font-light">Formulas</h1>

      {/* search ----------------------------------------------------- */}
      <div className="relative max-w-sm">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search formula…"
          className="
            w-full bg-transparent
            border-0 border-b border-brand
            pl-10 pr-10 py-2
            text-[18px] placeholder:text-[18px] placeholder:text-brand/70
            focus:outline-none focus:border-brand
          "
        />
        <Search className="absolute left-2 top-3.5 h-4 w-4 text-brand" />
        {search && (
          <button
            className="absolute right-2 top-2.5 text-brand"
            onClick={() => setSearch("")}
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* category pills -------------------------------------------- */}
      {categories.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => {
            const active = activeCats.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => toggleCat(cat)}
                className={`
                  whitespace-nowrap rounded-full px-3 py-1 text-sm
                  border border-brand transition-colors
                  ${
                    active
                      ? "bg-[#FFFD91] text-[#131B0E]"
                      : "bg-transparent text-brand hover:bg-brand/10"
                  }
                `}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}

      {/* formulas list --------------------------------------------- */}
      <div className="space-y-8">
        {filtered.map((f) => (
          <FormulaCard key={f.id} data={f} />
        ))}
      </div>
    </div>
  );
}