"use client";

import { useState, useMemo } from "react";
import FormulaCard from "@/components/FormulaCard";
import { Search, X } from "lucide-react";

export default function FormulasClient({ initial }) {
  /* ---------- state ---------- */
  const [search, setSearch]   = useState("");
  const [activeCat, setCat]   = useState(null);

  /* ---------- derive categories from data ---------- */
  const categories = useMemo(() => {
    const set = new Set();
    initial.forEach(f => (f.category ?? []).forEach(c => set.add(c)));
    return Array.from(set).sort();          // alphabetise; remove .sort() if you prefer raw order
  }, [initial]);

  /* ---------- filtered list ---------- */
  const filtered = useMemo(() => {
    return initial.filter(f => {
      const q = search.toLowerCase();
      const matchesSearch =
        f.prompt.toLowerCase().includes(q) ||
        f.title .toLowerCase().includes(q);

      const matchesCat =
        !activeCat || (f.category ?? []).includes(activeCat);

      return matchesSearch && matchesCat;
    });
  }, [search, activeCat, initial]);

  /* ---------- render ---------- */
  return (
    <div
      className="
        max-w-2xl mx-auto
        px-4 py-6
        pt-22 md:pt-8
        space-y-6
      "
    >
      <h1 className="text-2xl font-semibold">Formulas</h1>

      {/* search */}
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

      {/* dynamic category chips */}
      {categories.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(cat => {
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
      )}

      {/* formulas list */}
      <div className="space-y-8">
        {filtered.map(f => (
          <FormulaCard key={f.id} data={f} />
        ))}
      </div>
    </div>
  );
}