"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { pickLocalized } from "@/lib/i18n";

export default function LocalizedPageHeader({
  eyebrow,
  eyebrowHi,
  title,
  titleHi,
  subtitle,
  subtitleHi,
  highlight,
  highlightHi,
}) {
  const { lang } = useLanguage();
  const eyebrowText = pickLocalized({ eyebrow, eyebrowHi }, lang, "eyebrow", "eyebrowHi");
  const titleText = pickLocalized({ title, titleHi }, lang, "title", "titleHi");
  const subtitleText = pickLocalized({ subtitle, subtitleHi }, lang, "subtitle", "subtitleHi");
  const highlightText = pickLocalized({ highlight, highlightHi }, lang, "highlight", "highlightHi");

  return (
    <header className="relative pt-[calc(var(--header-offset)+1.25rem)] sm:pt-[calc(var(--header-offset)+2rem)] md:pt-[calc(var(--header-offset)+3rem)] pb-8 sm:pb-10 md:pb-12 text-center mx-auto max-w-4xl px-4 sm:px-5 overflow-hidden reveal">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-orange/5 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-60 h-60 rounded-full bg-purple/5 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-golden/5 blur-3xl -z-10 pointer-events-none" />

      {eyebrowText && (
        <span className="inline-flex items-center gap-1.5 bg-orange/10 border border-orange/20 text-orange px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-orange animate-pulse" />
          {eyebrowText}
        </span>
      )}

      <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-ink leading-tight mt-2 font-normal text-balance px-1">
        {titleText}
        {highlightText && (
          <>
            {" "}
            <span className="text-gold-gradient">{highlightText}</span>
          </>
        )}
      </h1>

      {subtitleText && (
        <p className="mt-5 text-ink font-normal text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-pretty px-1">
          {subtitleText}
        </p>
      )}

      <div className="hairline mt-8 max-w-xs mx-auto" />
    </header>
  );
}
