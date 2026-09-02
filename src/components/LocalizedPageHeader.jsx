"use client";

import { HIGHLIGHT_SHIMMER, PAGE_HERO_TITLE, PAGE_HERO_TITLE_COMPACT, SECTION_LEAD, SECTION_ORNAMENT } from "@/lib/ui";
import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";
import { pickLocalized } from "@/lib/i18n";
import AmbientGlows from "@/components/AmbientGlows";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

export default function LocalizedPageHeader({
  eyebrow,
  eyebrowHi,
  title,
  titleHi,
  subtitle,
  subtitleHi,
  highlight,
  highlightHi,
  compact = false,
  showOrnament = true,
}) {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const eyebrowText = pickLocalized({ eyebrow, eyebrowHi }, lang, "eyebrow", "eyebrowHi");
  const titleText = pickLocalized({ title, titleHi }, lang, "title", "titleHi");
  const subtitleText = pickLocalized({ subtitle, subtitleHi }, lang, "subtitle", "subtitleHi");
  const highlightText = pickLocalized({ highlight, highlightHi }, lang, "highlight", "highlightHi");

  return (
    <header
      className={cn(
        "relative text-center mx-auto max-w-4xl px-4 sm:px-5 overflow-hidden",
        compact
          ? "pt-[calc(var(--header-offset)+0.5rem)] sm:pt-[calc(var(--header-offset)+0.75rem)] pb-0"
          : "pt-[calc(var(--header-offset)+1.25rem)] sm:pt-[calc(var(--header-offset)+2rem)] md:pt-[calc(var(--header-offset)+2.5rem)] pb-4 sm:pb-6 md:pb-8"
      )}
    >
      <AmbientGlows variant="header" />

      <motion.div
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
        custom={0}
        variants={fadeUp}
      >
        {eyebrowText && (
          <span
            className={cn(
              "inline-flex items-center gap-1.5 bg-orange/10 border border-orange/20 text-orange px-3 sm:px-4 py-1 rounded-full text-[10px] sm:text-xs font-semibold tracking-widest uppercase shadow-sm",
              compact ? "mb-2.5 sm:mb-3" : "mb-5 sm:mb-6 py-1.5"
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-orange animate-pulse" />
            {eyebrowText}
          </span>
        )}

        <h1
          className={cn(
            PAGE_HERO_TITLE,
            "text-balance px-1",
            compact ? cn("mt-0 leading-[1.15]", PAGE_HERO_TITLE_COMPACT) : "mt-2"
          )}
        >
          {titleText}
          {highlightText && (
            <>
              {" "}
              <span className={HIGHLIGHT_SHIMMER}>{highlightText}</span>
            </>
          )}
        </h1>

        {subtitleText && (
          <p
            className={cn(
              SECTION_LEAD,
              "max-w-2xl mx-auto px-1",
              compact ? "mt-2 sm:mt-2.5 text-sm sm:text-base" : "mt-4"
            )}
          >
            {subtitleText}
          </p>
        )}

        {!compact && showOrnament && (
          <div className={cn(SECTION_ORNAMENT, "mt-5", "sm:mt-6")} aria-hidden>
            <span className="text-gold text-xs">✦</span>
          </div>
        )}
      </motion.div>
    </header>
  );
}
