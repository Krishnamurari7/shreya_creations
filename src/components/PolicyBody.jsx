"use client";

import { Glass3DCard, Float3D } from "@/components/Glass3DCard";
import AmbientGlows from "@/components/AmbientGlows";
import { useLanguage } from "@/components/LanguageProvider";
import { pickLocalized } from "@/lib/i18n";

export default function PolicyBody({ page }) {
  const { lang } = useLanguage();
  const title = pickLocalized(page, lang, "title", "titleHi");
  const body = pickLocalized(page, lang, "body", "bodyHi");

  return (
    <div className="page-container max-w-3xl pb-12 sm:pb-16 relative z-20 overflow-hidden">
      <AmbientGlows variant="subtle" />
      <Glass3DCard layered className="rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border-ink/15 reveal relative overflow-hidden interactive-card">
        <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-orange/5 blur-3xl pointer-events-none" />
        <Float3D translateZ="40">
          <h2 className="font-display text-2xl text-ink mb-6 sr-only">{title}</h2>
          <div className="policy-prose text-ink font-normal leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
            {body}
          </div>
        </Float3D>
      </Glass3DCard>
    </div>
  );
}
