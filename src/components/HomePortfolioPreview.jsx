"use client";

import { BTN_PRIMARY, HIGHLIGHT_SHIMMER, HOME_BAND_BRAND, PAGE_CONTAINER, PAGE_SECTION, REVEAL, SECTION_EYEBROW, SECTION_HEADER_GLASS, SECTION_LEAD, SECTION_ORNAMENT, SECTION_TITLE, SPARKLE_PULSE } from "@/lib/ui";
import { cn } from "@/lib/utils";
import Link from "next/link";
import CardImage from "@/components/CardImage";
import { pickPage } from "@/lib/cms";

function PortfolioSectionHeader({ home, lang }) {
  const eyebrow =
    pickPage(home, lang, "portfolioPreviewEyebrow", "portfolioPreviewEyebrowHi") ||
    (lang === "hi" ? "हमारा काम" : "Our Work");
  const title =
    pickPage(home, lang, "portfolioPreviewTitle", "portfolioPreviewTitleHi") ||
    (lang === "hi" ? "पोर्टफोलियो" : "Portfolio");
  const highlight =
    pickPage(home, lang, "portfolioPreviewTitleHighlight", "portfolioPreviewTitleHighlightHi") ||
    (lang === "hi" ? "झलक" : "Highlights");
  const subtitle =
    pickPage(home, lang, "portfolioPreviewSubtitle", "portfolioPreviewSubtitleHi") ||
    (lang === "hi"
      ? "पटना एटेलियर में बने लहंगे, गाउन और ब्राइडल पीस।"
      : "Lehengas, gowns and bridal pieces crafted at our Patna atelier.");

  return (
    <div className={cn(REVEAL, SECTION_HEADER_GLASS, "text-center", "mb-8", "sm:mb-12", "px-1")}>
      {eyebrow && (
        <span className={SECTION_EYEBROW}>
          <span className={cn(SPARKLE_PULSE, "text-gold", "text-[10px]")} aria-hidden>
            ✦
          </span>
          {eyebrow}
        </span>
      )}
      <h2 className={cn(SECTION_TITLE, "mt-2", "leading-tight", "text-balance")}>
        {title}
        {highlight && <> <span className={HIGHLIGHT_SHIMMER}>{highlight}</span></>}
      </h2>
      {subtitle && (
        <p className={cn(SECTION_LEAD, "mt-3", "max-w-2xl", "mx-auto")}>
          {subtitle}
        </p>
      )}
      <div className={cn(SECTION_ORNAMENT, "mt-5", "sm:mt-6")} aria-hidden>
        <span className="text-gold text-xs">✦</span>
      </div>
    </div>
  );
}

export default function HomePortfolioPreview({ portfolio = [], home = {}, lang = "en" }) {
  if (!portfolio.length) return null;

  const items = portfolio.slice(0, 4);
  const categories = [...new Set(items.map((i) => i.category).filter(Boolean))];
  const portfolioCta =
    pickPage(home, lang, "portfolioPreviewCta", "portfolioPreviewCtaHi") ||
    (lang === "hi" ? "पूरा पोर्टफोलियो" : "View Full Portfolio");

  return (
    <section className={cn(HOME_BAND_BRAND, PAGE_SECTION, "home-portfolio-showcase", "relative", "overflow-hidden")}>
      <div className="home-portfolio-showcase__bg" aria-hidden />
      <div className={cn(PAGE_CONTAINER, "relative", "z-[1]")}>
        <PortfolioSectionHeader home={home} lang={lang} />

        {categories.length > 0 && (
          <div className={cn(REVEAL, "home-portfolio-showcase__chips")}>
            {categories.map((cat) => (
              <span key={cat} className="home-portfolio-showcase__chip">
                {cat}
              </span>
            ))}
          </div>
        )}

        <div className={cn(REVEAL, "home-portfolio-showcase__grid")} data-stagger>
          {items.map((item, idx) => (
            <Link
              key={item.id || idx}
              href="/portfolio"
              className={`home-portfolio-showcase__item home-portfolio-showcase__item--${idx + 1} group`}
              style={{ transitionDelay: `${idx * 70}ms` }}
            >
              <CardImage src={item.image} alt={item.title} ratio="fill" position="top" />
              <div className="home-portfolio-showcase__overlay">
                {item.category && (
                  <span className="home-portfolio-showcase__category">{item.category}</span>
                )}
                <div className="home-portfolio-showcase__footer">
                  <span className="home-portfolio-showcase__title">{item.title}</span>
                  <span className="home-portfolio-showcase__arrow" aria-hidden>
                    ↗
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className={cn(REVEAL, "text-center", "mt-5", "sm:mt-7")}>
          <Link href="/portfolio" className={cn(BTN_PRIMARY, "inline-flex", "items-center", "gap-2", "rounded-full", "px-8", "py-3", "text-xs", "sm:text-sm")}>
            {portfolioCta} <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
