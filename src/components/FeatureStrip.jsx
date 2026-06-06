"use client";

import { useLanguage } from "@/components/LanguageProvider";

export default function FeatureStrip({ items = [] }) {
  const { lang } = useLanguage();
  if (!items.length) return null;

  return (
    <section className="page-container pb-8 sm:pb-10 relative z-20">
      <div className="features-bar">
        <div className="grid grid-cols-1 min-[480px]:grid-cols-3 gap-5 sm:gap-6">
          {items.map((item, i) => {
            const title = lang === "hi" && item.titleHi ? item.titleHi : item.title;
            const desc = lang === "hi" && item.descHi ? item.descHi : item.desc;
            return (
              <div key={i} className="text-center reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className={`text-2xl sm:text-3xl mb-3 ${i % 2 === 0 ? "text-orange" : "text-purple"}`}>
                  {item.emoji}
                </div>
                <h3 className="font-body text-sm font-semibold text-ink">{title}</h3>
                <p className="mt-1 text-xs text-muted leading-relaxed">{desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
