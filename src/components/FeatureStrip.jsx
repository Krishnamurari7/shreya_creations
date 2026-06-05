"use client";

import { Glass3DCard, Float3D } from "@/components/Glass3DCard";
import { useLanguage } from "@/components/LanguageProvider";

export default function FeatureStrip({ items = [] }) {
  const { lang } = useLanguage();
  if (!items.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-5 pb-8 sm:pb-10 relative z-20">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {items.map((item, i) => {
          const title = lang === "hi" && item.titleHi ? item.titleHi : item.title;
          const desc = lang === "hi" && item.descHi ? item.descHi : item.desc;
          return (
            <Glass3DCard
              key={i}
              layered
              className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-center reveal"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <Float3D translateZ="45">
                <div className="text-2xl sm:text-3xl mb-3">{item.emoji}</div>
                <h3 className="font-display text-lg sm:text-xl text-ink">{title}</h3>
                <p className="mt-2 text-xs sm:text-sm text-ink font-normal leading-relaxed">{desc}</p>
              </Float3D>
            </Glass3DCard>
          );
        })}
      </div>
    </section>
  );
}
