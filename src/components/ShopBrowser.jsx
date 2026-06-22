"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import { Glass3DCard } from "@/components/Glass3DCard";
import { staggerDelay } from "@/lib/motion";

export default function ShopBrowser({ products, whatsapp }) {
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ["All", ...set];
  }, [products]);

  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const okCat = active === "All" || p.category === active;
      const okQ =
        !q ||
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q);
      return okCat && okQ;
    });
  }, [products, active, query]);

  return (
    <div className="page-container pb-10 sm:pb-12 relative z-20">
      {/* Search and Filters Header */}
      <Glass3DCard className="rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 lg:p-8 border-ink/15 mb-8 sm:mb-12 flex flex-col lg:flex-row gap-4 sm:gap-6 items-stretch lg:items-center justify-between shadow-xl reveal">
        {/* Category selection */}
        <div className="filter-pills justify-start w-full lg:w-auto lg:flex-wrap">
          {categories.map((c) => {
            const isSelected = active === c;
            return (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-semibold tracking-widest uppercase transition-all duration-300 ${
                  isSelected
                    ? "btn-gold tab-active-glow"
                    : "filter-pill rounded-full px-5 py-2.5 text-xs uppercase tracking-wider font-medium"
                }`}
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
            className="w-full field-surface rounded-full pl-11 pr-5 py-3 text-sm font-light"
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
            <div key={p.id} className="reveal w-full h-full" style={staggerDelay(i, 60)}>
              <ProductCard product={p} variant="boutique" whatsapp={whatsapp} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
