"use client";

import { useMemo, useState } from "react";
import { BTN_PRIMARY, HIGHLIGHT_SHIMMER, HOME_BAND_BRAND, PAGE_CONTAINER, PAGE_SECTION, REVEAL, SECTION_EYEBROW, SECTION_HEADER_GLASS, SECTION_LEAD, SECTION_ORNAMENT, SECTION_TITLE, SPARKLE_PULSE } from "@/lib/ui";
import { cn } from "@/lib/utils";
import Link from "next/link";
import CardImage from "@/components/CardImage";
import { pickPage } from "@/lib/cms";

const MAX_ITEMS = 10;
const FILTER_TABS = ["All", "Bridal", "Gowns", "Blouses"];

/**
 * Test rows typed into the admin panel ("News", "disign", …) still live in the
 * portfolio table because /portfolio deliberately shows every piece. This band
 * must never surface them, even if one gets flagged as featured by mistake.
 */
const HIDDEN_CATEGORIES = new Set(["news", "uncategorised", "uncategorized"]);
const PLACEHOLDER_TITLES = new Set([
  "portfolio piece",
  "news",
  "design",
  "disign",
  "disiner",
  "untitled",
  "test",
  "demo",
  "sample",
]);

const normalize = (value) => String(value ?? "").trim().toLowerCase();

function isHighlightReady(item) {
  if (!item?.featured || !item.image) return false;
  const title = normalize(item.title);
  if (!title || PLACEHOLDER_TITLES.has(title)) return false;
  return !HIDDEN_CATEGORIES.has(normalize(item.category));
}

const matchesTab = (item, tab) => normalize(item.category) === normalize(tab);

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
  const [activeTab, setActiveTab] = useState("All");

  const items = useMemo(
    () => portfolio.filter(isHighlightReady).slice(0, MAX_ITEMS),
    [portfolio]
  );

  const tabs = useMemo(
    () =>
      FILTER_TABS.map((tab) => ({
        tab,
        count: tab === "All" ? items.length : items.filter((i) => matchesTab(i, tab)).length,
      })),
    [items]
  );

  const visible = useMemo(
    () => (activeTab === "All" ? items : items.filter((i) => matchesTab(i, activeTab))),
    [items, activeTab]
  );

  if (!items.length) return null;

  const portfolioCta =
    pickPage(home, lang, "portfolioPreviewCta", "portfolioPreviewCtaHi") ||
    (lang === "hi" ? "पूरा पोर्टफोलियो" : "View Full Portfolio");

  return (
    <section className={cn(HOME_BAND_BRAND, PAGE_SECTION, "home-portfolio-showcase", "relative", "overflow-hidden")}>
      <div className="home-portfolio-showcase__bg" aria-hidden />
      <div className={cn(PAGE_CONTAINER, "relative", "z-[1]")}>
        <PortfolioSectionHeader home={home} lang={lang} />

        <div
          className={cn(REVEAL, "home-portfolio-showcase__chips")}
          role="tablist"
          aria-label={lang === "hi" ? "श्रेणी फ़िल्टर" : "Filter portfolio by category"}
        >
          {tabs.map(({ tab, count }) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              disabled={!count}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "home-portfolio-showcase__chip",
                activeTab === tab && "home-portfolio-showcase__chip--active"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className={cn(REVEAL, "home-portfolio-showcase__grid")} data-stagger>
          {visible.map((item, idx) => (
            <Link
              key={item.id || item.slug || idx}
              href={item.slug ? `/portfolio/${item.slug}` : "/portfolio"}
              className="home-portfolio-showcase__item group"
              style={{ transitionDelay: `${idx * 70}ms` }}
            >
              <CardImage
                src={item.image}
                alt={item.image_alt || item.imageAlt || `${item.title} Patna`}
                ratio="3/4"
                position="top"
                className="aspect-[3/4]"
                imgClassName="object-cover"
                loading="lazy"
              />
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
          <Link href="/portfolio" className={BTN_PRIMARY}>
            {portfolioCta} <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
