"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";
import { pickLocalized } from "@/lib/i18n";
import AmbientGlows from "@/components/AmbientGlows";
import { fadeUp } from "@/lib/motion";

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
  const reduceMotion = useReducedMotion();
  const eyebrowText = pickLocalized({ eyebrow, eyebrowHi }, lang, "eyebrow", "eyebrowHi");
  const titleText = pickLocalized({ title, titleHi }, lang, "title", "titleHi");
  const subtitleText = pickLocalized({ subtitle, subtitleHi }, lang, "subtitle", "subtitleHi");
  const highlightText = pickLocalized({ highlight, highlightHi }, lang, "highlight", "highlightHi");

  return (
    <header className="relative pt-[calc(var(--header-offset)+1.25rem)] sm:pt-[calc(var(--header-offset)+2rem)] md:pt-[calc(var(--header-offset)+2.5rem)] pb-4 sm:pb-6 md:pb-8 text-center mx-auto max-w-4xl px-4 sm:px-5 overflow-hidden">
      <AmbientGlows variant="header" />

      <motion.div
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
        custom={0}
        variants={fadeUp}
      >
        {eyebrowText && (
          <span className="inline-flex items-center gap-1.5 bg-orange/10 border border-orange/20 text-orange px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold tracking-widest uppercase mb-5 sm:mb-6 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-orange animate-pulse" />
            {eyebrowText}
          </span>
        )}

        <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-ink leading-tight mt-2 font-normal text-balance px-1">
          {titleText}
          {highlightText && (
            <>
              {" "}
              <span className="highlight-shimmer">{highlightText}</span>
            </>
          )}
        </h1>

        {subtitleText && (
          <p className="mt-4 text-muted font-normal text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-pretty px-1">
            {subtitleText}
          </p>
        )}

        <div className="section-ornament mt-5 sm:mt-6" aria-hidden>
          <span className="text-gold text-xs">✦</span>
        </div>
      </motion.div>
    </header>
  );
}
