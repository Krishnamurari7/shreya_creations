"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import AmbientGlows from "@/components/AmbientGlows";
import { SECTION_LEAD, SECTION_ORNAMENT } from "@/lib/ui";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

export default function BlogPostHero({
  locale,
  title,
  excerpt,
  dateLabel,
  published,
  readingMinutes,
}) {
  const reduceMotion = useReducedMotion();
  const backLabel = locale === "hi" ? "ब्लॉग पर वापस" : "Back to Blog";
  const categoryLabel = locale === "hi" ? "बुटीक गाइड" : "Boutique guide";
  const readLabel = locale === "hi" ? "मिनट पढ़ें" : "min read";

  return (
    <header className="relative overflow-hidden text-center">
      <AmbientGlows variant="header" />

      <div className="page-container mx-auto w-full min-w-0 max-w-4xl px-4 sm:px-5 [padding-left:max(1rem,env(safe-area-inset-left))] [padding-right:max(1rem,env(safe-area-inset-right))] pt-[calc(var(--header-offset)+1rem)] pb-5 sm:pb-6 relative z-20">
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          custom={0}
          variants={fadeUp}
        >
          <div className="flex justify-start mb-5 sm:mb-6">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-ink/70 backdrop-blur-sm transition-all hover:border-orange/30 hover:bg-orange/[0.06] hover:text-orange dark:border-white/10 dark:bg-white/[0.06] dark:hover:border-orange/30"
            >
              <span
                aria-hidden
                className="transition-transform group-hover:-translate-x-0.5"
              >
                ←
              </span>
              {backLabel}
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-orange/25 bg-orange/10 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-orange shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-orange animate-pulse" aria-hidden />
              {categoryLabel}
            </span>
            {dateLabel && published && (
              <time
                dateTime={published}
                className="inline-flex items-center rounded-full border border-ink/10 bg-white/50 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-wide text-ink/60 backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.05]"
              >
                {dateLabel}
              </time>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-white/50 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-wide text-ink/60 backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.05]">
              <svg
                className="h-3.5 w-3.5 text-orange/80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              {readingMinutes} {readLabel}
            </span>
          </div>

          <h1
            className={cn(
              "blog-post-title",
              "font-display font-bold text-ink text-balance break-words tracking-tight",
              "leading-[1.28] sm:leading-[1.22]",
              "text-[clamp(1.65rem,5.5vw,2.35rem)] sm:text-[clamp(1.85rem,3.8vw,2.85rem)]",
              "max-w-3xl mx-auto px-1 mt-5 sm:mt-6",
              "[hyphens:auto]"
            )}
          >
            {title}
          </h1>

          {excerpt && (
            <p className={cn(SECTION_LEAD, "mt-4 sm:mt-5 max-w-2xl mx-auto px-1 text-ink/70")}>
              {excerpt}
            </p>
          )}

          <div className={cn(SECTION_ORNAMENT, "mt-5 sm:mt-6")} aria-hidden>
            <span className="text-gold text-xs">✦</span>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
