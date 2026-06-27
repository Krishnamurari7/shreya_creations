"use client";

import { useState, useMemo, useEffect } from "react";
import { Glass3DCard, Float3D } from "@/components/Glass3DCard";
import { useLanguage } from "@/components/LanguageProvider";
import { pickFaq } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { staggerDelay } from "@/lib/motion";

export default function FaqList({ faqs }) {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(0);
  const [query, setQuery] = useState("");

  useEffect(() => setOpen(0), [query]);

  const filtered = useMemo(() => {
    if (!query.trim()) return faqs;
    const q = query.toLowerCase();
    return faqs.filter((f) => {
      const { q: question, a: answer } = pickFaq(f, lang);
      return question.toLowerCase().includes(q) || answer.toLowerCase().includes(q);
    });
  }, [faqs, query, lang]);

  return (
    <div className="mx-auto max-w-3xl page-container pb-6 sm:pb-8 relative z-20">
      <Glass3DCard className="rounded-2xl sm:rounded-[2rem] p-4 sm:p-5 border-ink/15 mb-6 sm:mb-8 reveal">
        <div className="relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={lang === "hi" ? "प्रश्न खोजें..." : "Search questions..."}
            className="w-full field-surface rounded-full pl-11 pr-5 py-3 text-sm font-light"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-orange">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>
      </Glass3DCard>

      {filtered.length === 0 ? (
        <Glass3DCard className="rounded-2xl border-ink/15 p-12 text-center reveal">
          <p className="text-ink font-normal">
            {lang === "hi" ? "कोई प्रश्न नहीं मिला।" : "No questions match your search."}
          </p>
        </Glass3DCard>
      ) : (
        <div className="space-y-3 sm:space-y-4">
      {filtered.map((f, i) => {
        const { q, a } = pickFaq(f, lang);
        const isOpen = open === i;
        return (
          <Glass3DCard
            key={i}
            layered
            className={cn(
              "rounded-3xl overflow-hidden transition-all duration-300 reveal interactive-card",
              isOpen
                ? "border-orange/40 shadow-[0_15px_40px_-15px_rgba(230,90,5,0.15)] bg-orange/[0.03]"
                : "border-ink/15 hover:border-orange/25"
            )}
            style={staggerDelay(i, 70)}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="w-full text-left px-4 sm:px-7 py-4 sm:py-6 flex justify-between items-start sm:items-center gap-3 sm:gap-6 group"
            >
              <Float3D translateZ="45">
                <span
                  className={cn(
                    "font-display text-lg sm:text-xl md:text-2xl transition-colors duration-300 text-left",
                    isOpen ? "text-orange" : "text-ink group-hover:text-orange"
                  )}
                >
                  {q}
                </span>
              </Float3D>
              <span
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center border transition-all duration-300 shrink-0",
                  isOpen
                    ? "bg-orange border-orange text-white"
                    : "border-orange/20 bg-orange/5 text-orange group-hover:border-orange/50"
                )}
              >
                <svg
                  className={cn("h-4 w-4 transition-transform duration-300", isOpen && "rotate-180")}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>

            <div
              className={cn(
                "transition-all duration-300 ease-in-out overflow-hidden",
                isOpen ? "max-h-[min(80vh,1200px)] border-t border-ink/15" : "max-h-0"
              )}
            >
              <Float3D translateZ="35" className="px-4 sm:px-7 py-4 sm:py-6 text-ink font-normal leading-relaxed text-sm sm:text-base bg-cream/30">
                {a}
              </Float3D>
            </div>
          </Glass3DCard>
        );
      })}
        </div>
      )}
    </div>
  );
}
