"use client";

import Link from "next/link";
import CardImage from "@/components/CardImage";
import { pickPage } from "@/lib/cms";

function PortfolioSectionHeader({ home, lang }) {
  const hasCms = pickPage(home, lang, "portfolioPreviewTitle", "portfolioPreviewTitleHi");
  const eyebrow = hasCms
    ? pickPage(home, lang, "portfolioPreviewEyebrow", "portfolioPreviewEyebrowHi")
    : lang === "hi"
      ? "हमारा काम"
      : "Our Work";
  const title = hasCms
    ? pickPage(home, lang, "portfolioPreviewTitle", "portfolioPreviewTitleHi")
    : lang === "hi"
      ? "पोर्टफोलियो"
      : "Portfolio";
  const highlight = hasCms ? "" : lang === "hi" ? "झलक" : "Highlights";
  const subtitle = hasCms
    ? pickPage(home, lang, "portfolioPreviewSubtitle", "portfolioPreviewSubtitleHi")
    : lang === "hi"
      ? "पटना एटेलियर में बने लहंगे, गाउन और ब्राइडल पीस।"
      : "Lehengas, gowns and bridal pieces crafted at our Patna atelier.";

  return (
    <div className="text-center mb-8 sm:mb-12 px-1 reveal section-header-glass">
      {eyebrow && (
        <span className="section-eyebrow">
          <span className="sparkle-pulse text-gold text-[10px]" aria-hidden>
            ✦
          </span>
          {eyebrow}
        </span>
      )}
      <h2 className="section-title mt-2 leading-tight text-balance">
        {title}
        {highlight && <> <span className="highlight-shimmer">{highlight}</span></>}
      </h2>
      {subtitle && (
        <p className="mt-3 section-lead max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      <div className="section-ornament mt-5 sm:mt-6" aria-hidden>
        <span className="text-gold text-xs">✦</span>
      </div>
    </div>
  );
}

export default function HomePortfolioPreview({ portfolio = [], home = {}, lang = "en" }) {
  if (!portfolio.length) return null;

  const items = portfolio.slice(0, 4);
  const categories = [...new Set(items.map((i) => i.category).filter(Boolean))];

  return (
    <section className="home-portfolio-showcase page-section relative overflow-hidden">
      <div className="home-portfolio-showcase__bg" aria-hidden />
      <div className="page-container relative z-[1]">
        <PortfolioSectionHeader home={home} lang={lang} />

        {categories.length > 0 && (
          <div className="home-portfolio-showcase__chips reveal">
            {categories.map((cat) => (
              <span key={cat} className="home-portfolio-showcase__chip">
                {cat}
              </span>
            ))}
          </div>
        )}

        <div className="home-portfolio-showcase__grid reveal" data-stagger>
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

        <div className="text-center mt-8 sm:mt-10 reveal">
          <Link href="/portfolio" className="btn-primary inline-flex items-center gap-2 rounded-full px-8 py-3 text-xs sm:text-sm">
            {lang === "hi" ? "पूरा पोर्टफोलियो" : "View Full Portfolio"} <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
