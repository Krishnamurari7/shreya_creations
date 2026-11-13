"use client";

import dynamic from "next/dynamic";
import { HAIRLINE, HIGHLIGHT_SHIMMER, HOME_BAND_BRAND, HOME_BAND_WHITE, PAGE_CONTAINER, PAGE_SECTION, PAGE_SECTION_BORDERED, REVEAL, SECTION_EYEBROW, SECTION_HEADER_GLASS, SECTION_LEAD, SECTION_MUTED, SECTION_ORNAMENT, SECTION_TITLE, SPARKLE_PULSE } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/LanguageProvider";
import { pageBottomCtaProps, pickPage } from "@/lib/cms";
import LazyWhenVisible from "@/components/LazyWhenVisible";
import HeroSection from "@/components/HeroSection";
import PageCTA from "@/components/PageCTA";

const DesignProcess = dynamic(() =>
  import("@/components/FashionSections").then((mod) => mod.DesignProcess)
);

const HomeCategoryCards = dynamic(() => import("@/components/CategoryCards"), {
  loading: () => <div className="category-cards-skeleton min-h-[320px]" aria-hidden />,
});

const HomeCoursesPreview = dynamic(() => import("@/components/HomeCoursesPreview"), {
  loading: () => <div className="home-courses-preview-skeleton min-h-[480px]" aria-hidden />,
});
const HomePortfolioPreview = dynamic(() => import("@/components/HomePortfolioPreview"), {
  loading: () => <div className="home-portfolio-skeleton min-h-[360px]" aria-hidden />,
});
const SocialFeeds = dynamic(() => import("@/components/SocialFeeds"), {
  ssr: false,
  loading: () => (
    <div className="social-feeds-skeleton min-h-[280px] flex items-center justify-center text-sm text-muted" aria-busy="true">
      Loading social feeds…
    </div>
  ),
});
const Testimonials = dynamic(() => import("@/components/Sections").then((mod) => mod.Testimonials), {
  ssr: false,
  loading: () => <div className="testimonials-skeleton min-h-[240px]" aria-hidden />,
});
const InquiryPopup = dynamic(() => import("@/components/InquiryPopup"), { ssr: false });
const HomeOfferPopup = dynamic(() => import("@/components/HomeOfferPopup"), { ssr: false });

function SectionHeader({
  home,
  lang,
  eyebrowKey,
  titleKey,
  titleHighlightKey,
  subtitleKey,
  className = "",
  compact = false,
  hiOnlyKeys = [],
}) {
  const pageLang = (key) => (hiOnlyKeys.includes(key) ? "hi" : lang);
  const eyebrow = pickPage(home, pageLang(eyebrowKey), eyebrowKey, `${eyebrowKey}Hi`);
  const title = pickPage(home, pageLang(titleKey), titleKey, `${titleKey}Hi`);
  const highlight = titleHighlightKey
    ? pickPage(home, lang, titleHighlightKey, `${titleHighlightKey}Hi`)
    : "";
  const subtitle = subtitleKey ? pickPage(home, lang, subtitleKey, `${subtitleKey}Hi`) : "";
  return (
    <div
      className={`text-center px-1 ${REVEAL} ${SECTION_HEADER_GLASS} ${compact ? "mb-3 sm:mb-4" : "mb-4 sm:mb-6"} ${className}`}
    >
      {eyebrow && (
        <span className={SECTION_EYEBROW}>
          <span className={cn(SPARKLE_PULSE, "text-gold", "text-[10px]")} aria-hidden>✦</span>
          {eyebrow}
        </span>
      )}
      {title && (
        <h2 className={cn(SECTION_TITLE, "mt-2", "leading-tight", "text-balance")}>
          {title}
          {highlight && (
            <>
              {" "}
              <span className={HIGHLIGHT_SHIMMER}>{highlight}</span>
            </>
          )}
        </h2>
      )}
      {subtitle && (
        <p className={cn(SECTION_LEAD, "mt-3", "max-w-2xl", "mx-auto")}>
          {subtitle}
        </p>
      )}
      {(eyebrow || title) && (
        <div className={cn(SECTION_ORNAMENT, compact ? "mt-2 sm:mt-3" : "mt-3 sm:mt-4")} aria-hidden>
          <span className="text-gold text-xs">✦</span>
        </div>
      )}
    </div>
  );
}

export default function HomepageClient({
  heroBackground,
  home: homeProp,
  site,
  ctaOverrides,
  homePopup,
  courses,
  portfolio = [],
  testimonials,
  trust = [],
  processSteps = [],
}) {
  const { lang } = useLanguage();
  const home = homeProp || site.pages?.home || {};

  return (
    <div className="home-page relative z-10 w-full min-w-0 max-w-full overflow-x-clip">
      <section
        className={`home-hero home-hero--boutique${lang === "hi" ? " home-hero--hi" : ""}`}
        aria-label={lang === "hi" ? "मुख्य बैनर" : "Hero banner"}
      >
        {heroBackground}
        <HeroSection
          home={home}
          lang={lang}
          phone={site.phone}
          whatsapp={site.whatsapp}
          site={site}
          embedded
        />
      </section>

      <LazyWhenVisible fallback={<div className="category-cards-skeleton min-h-[320px]" aria-hidden />}>
        <HomeCategoryCards lang={lang} site={site} whatsapp={site.whatsapp} home={home} />
      </LazyWhenVisible>

      <LazyWhenVisible fallback={<div className="home-courses-preview-skeleton min-h-[480px]" aria-hidden />}>
        <HomeCoursesPreview courses={courses} home={home} site={site} />
      </LazyWhenVisible>

      <LazyWhenVisible fallback={<div className="home-portfolio-skeleton min-h-[360px]" aria-hidden />}>
        <HomePortfolioPreview portfolio={portfolio} home={home} lang={lang} />
      </LazyWhenVisible>

      <LazyWhenVisible
        fallback={
          <section className="home-instagram-band relative z-20 overflow-hidden">
            <div className="social-feeds-skeleton min-h-[280px]" aria-hidden />
          </section>
        }
      >
        <section className="home-instagram-band relative z-20 overflow-hidden">
          <SocialFeeds site={site} lang={lang} />
        </section>
      </LazyWhenVisible>

      {/* ===== STUDENT SUCCESS ===== */}
      <LazyWhenVisible>
        <section id="testimonials" className={cn(HOME_BAND_WHITE, PAGE_SECTION, PAGE_SECTION_BORDERED, "overflow-hidden", "min-w-0")}>
          <div className={PAGE_CONTAINER}>
            <SectionHeader
              home={home}
              lang={lang}
              eyebrowKey="successEyebrow"
              titleKey="successTitle"
              subtitleKey="successSubtitle"
            />
          </div>
          <Testimonials items={testimonials} site={site} />
        </section>
      </LazyWhenVisible>

      {/* ===== DESIGN PROCESS ===== */}
      {processSteps.length > 0 && (
        <section className={cn(HOME_BAND_BRAND, PAGE_SECTION, SECTION_MUTED)}>
          <div className={PAGE_CONTAINER}>
          <div className={cn(REVEAL, "text-center", "mb-5", "sm:mb-8")}>
            <span className={cn(SECTION_EYEBROW, "tracking-[0.25em]", "text-xs")}>
              {pickPage(home, lang, "processEyebrow", "processEyebrowHi") ||
                (lang === "hi" ? "हमारी प्रक्रिया" : "How It Works")}
            </span>
            <h2 className={cn(SECTION_TITLE, "mt-2", "text-balance")}>
              {pickPage(home, lang, "processTitle", "processTitleHi") ||
                (lang === "hi" ? "बोरिंग रोड, पटना में लेडीज़ टेलर" : "Ladies Tailors in Boring Road, Patna")}
            </h2>
            <div className={cn(HAIRLINE, "max-w-xs", "mx-auto", "mt-6")} />
          </div>
          <DesignProcess steps={processSteps} />
          </div>
        </section>
      )}

      <PageCTA whatsapp={site.whatsapp} {...pageBottomCtaProps(home)} overrides={ctaOverrides} />

      <InquiryPopup source="home_popup" whatsapp={site.whatsapp} />
      <HomeOfferPopup settings={homePopup} />
    </div>
  );
}
