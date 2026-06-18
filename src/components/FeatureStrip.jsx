"use client";

import { Glass3DCard } from "@/components/Glass3DCard";
import { useLanguage } from "@/components/LanguageProvider";
import { staggerDelay } from "@/lib/motion";

export default function FeatureStrip({ items = [] }) {
  const { lang } = useLanguage();
  if (!items.length) return null;

  return (
    <section className="page-container pb-6 sm:pb-8 relative z-20 -mt-2 sm:-mt-1">
      <div className="features-bar">
        <div className="grid grid-cols-1 min-[480px]:grid-cols-3 gap-4 sm:gap-5">
          {items.map((item, i) => {
            const title = lang === "hi" && item.titleHi ? item.titleHi : item.title;
            const desc = lang === "hi" && item.descHi ? item.descHi : item.desc;
            const isGold = i % 2 === 1;
            return (
              <Glass3DCard
                key={i}
                className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-center reveal interactive-card group relative overflow-hidden"
                style={staggerDelay(i, 80)}
              >
                <span
                  className={`absolute left-0 top-0 h-full w-1 ${isGold ? "bg-gold" : "bg-orange"} opacity-70 group-hover:w-1.5 transition-all duration-300 z-[3]`}
                  aria-hidden
                />
                <div
                  className={`text-2xl sm:text-3xl mb-3 transition-transform duration-300 group-hover:scale-110 ${isGold ? "text-gold" : "text-orange"}`}
                >
                  {item.emoji}
                </div>
                <h3 className="font-body text-sm font-semibold text-ink">{title}</h3>
                <p className="mt-1 text-xs text-muted leading-relaxed">{desc}</p>
              </Glass3DCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
