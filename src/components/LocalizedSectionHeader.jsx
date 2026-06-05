"use client";

import { useLanguage } from "@/components/LanguageProvider";

export default function LocalizedSectionHeader({ eyebrow, eyebrowHi, title, titleHi, subtitle, subtitleHi, className = "" }) {
  const { lang } = useLanguage();
  const e = lang === "hi" && eyebrowHi ? eyebrowHi : eyebrow;
  const t = lang === "hi" && titleHi ? titleHi : title;
  const s = lang === "hi" && subtitleHi ? subtitleHi : subtitle;

  return (
    <div className={`text-center mb-10 reveal ${className}`}>
      {e && <span className="text-orange uppercase tracking-[0.25em] text-xs font-semibold">{e}</span>}
      {t && <h2 className="font-display text-3xl md:text-4xl text-ink mt-2">{t}</h2>}
      {s && <p className="mt-3 text-ink font-normal max-w-xl mx-auto text-sm leading-relaxed">{s}</p>}
      {(e || t) && <div className="hairline max-w-xs mx-auto mt-6" />}
    </div>
  );
}
