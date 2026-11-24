"use client";

import { FIELD_SURFACE, FILTER_PILL, FILTER_PILL_ACTIVE, FILTER_PILLS, PAGE_CONTAINER, REVEAL } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { useState, useMemo, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { Glass3DCard } from "@/components/Glass3DCard";
import { staggerDelay } from "@/lib/motion";

export default function ShopBrowser({ products, whatsapp, initialCategory = "" }) {
  const [active, setActive] = useState(initialCategory || "All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    setActive(initialCategory || "All");
  }, [initialCategory]);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    if (active !== "All" && ![...set].some((category) => category.toLowerCase() === active.toLowerCase())) {
      set.add(active);
    }
    return ["All", ...set];
  }, [products, active]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const okCat = active === "All" || String(p.category || "").toLowerCase() === active.toLowerCase();
      const okQ =
        !q ||
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q);
      return okCat && okQ;
    });
  }, [products, active, query]);

  return (
    <div className={cn(PAGE_CONTAINER, "pt-6", "sm:pt-8", "pb-10", "sm:pb-12", "relative", "z-20")}>
      {/* Search and Filters Header */}
      <Glass3DCard className={cn(REVEAL, "rounded-2xl", "sm:rounded-[2rem]", "p-4", "sm:p-6", "lg:p-8", "border-ink/15", "mb-8", "sm:mb-12", "flex", "flex-col", "lg:flex-row", "gap-5", "sm:gap-7", "lg:gap-6", "items-stretch", "lg:items-center", "justify-between", "shadow-xl")}>
        {/* Category selection */}
        <div className={cn(FILTER_PILLS, "justify-start", "w-full", "lg:w-auto", "lg:flex-wrap")}>
          {categories.map((c) => {
            const isSelected = active.toLowerCase() === c.toLowerCase();
            return (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={cn(
                  "min-h-11 shrink-0 whitespace-nowrap px-4 py-2.5 rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-300",
                  isSelected
                    ? cn(FILTER_PILL_ACTIVE, "tab-active-glow")
                    : cn(FILTER_PILL, "tracking-wider font-medium")
                )}
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* Search bar */}
        <div className="relative w-full lg:w-72 shrink-0">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search our couture pieces..."
            className={cn(FIELD_SURFACE, "w-full", "rounded-full", "pl-11", "pr-5", "py-3", "text-sm", "font-light")}
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-orange">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>
      </Glass3DCard>

      {/* Grid of Products */}
      {filtered.length === 0 ? (
        <Glass3DCard className="rounded-2xl sm:rounded-[2rem] border-ink/15 p-12 sm:p-20 text-center">
          <span className="text-4xl">🪡</span>
          <p className="text-ink mt-4 font-normal text-base">No couture pieces match your search query.</p>
        </Glass3DCard>
      ) : (
        <div className="shop-grid grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {filtered.map((p, i) => (
            <div key={p.id} className={cn(REVEAL, "w-full", "h-full")} style={staggerDelay(i, 60)}>
              <ProductCard product={p} variant="boutique" whatsapp={whatsapp} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
