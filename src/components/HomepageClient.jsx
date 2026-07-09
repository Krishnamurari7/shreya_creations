"use client";

import { GLASS, HAIRLINE, HIGHLIGHT_SHIMMER, HOME_BAND_BRAND, HOME_BAND_WHITE, MARQUEE_CONTAINER, MARQUEE_CONTENT, PAGE_CONTAINER, PAGE_SECTION, PAGE_SECTION_BORDERED, REVEAL, REVEAL_LEFT, REVEAL_RIGHT, SECTION_EYEBROW, SECTION_HEADER_GLASS, SECTION_LEAD, SECTION_MUTED, SECTION_ORNAMENT, SECTION_TITLE, SPARKLE_PULSE } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import CardImage from "@/components/CardImage";
import CategoryCards from "@/components/CategoryCards";
import { Testimonials } from "@/components/Sections";
import { DesignProcess } from "@/components/FashionSections";
import { toYoutubeEmbedUrl } from "@/lib/youtube";
import VideoShowcase from "@/components/VideoShowcase";
import { useLanguage } from "@/components/LanguageProvider";
import { pickPage } from "@/lib/cms";
import { SITE_STATS } from "@/lib/seed";
import InquiryPopup from "@/components/InquiryPopup";
import HeroSection from "@/components/HeroSection";
import HomeShopPreview from "@/components/HomeShopPreview";
import HomePortfolioPreview from "@/components/HomePortfolioPreview";
import HomeCoursesPreview from "@/components/HomeCoursesPreview";
import ExploreCategories from "@/components/ExploreCategories";
import StartJourneySection from "@/components/StartJourneySection";

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

function FounderMessageSlider({ slides }) {
  const [active, setActive] = useState(0);
  const count = slides.length;

  useEffect(() => {
    if (count < 2) return undefined;
    const id = setInterval(() => setActive((i) => (i + 1) % count), 6000);
    return () => clearInterval(id);
  }, [count]);

  if (!slides[0]) return null;

  return (
    <div className="founder-message-wrap">
      <div className="founder-message-card">
        <div className="founder-message-card__layout">
          <div className={cn(REVEAL, REVEAL_LEFT, "founder-message-card__media")}>
            <div className="founder-portrait relative">
              <div className="founder-portrait__halo" aria-hidden />
              <div className="founder-portrait__ring gradient-ring rounded-2xl p-[2px] shadow-glow">
                <div className={cn(GLASS, "founder-portrait__inner", "rounded-[calc(1rem-2px)]", "overflow-hidden", "border-0", "p-1.5", "sm:p-2")}>
                  {slides.map((s, i) => (
                    <div
                      key={s.name}
                      className={`transition-all duration-700 ease-in-out ${i === active ? "opacity-100 scale-100 relative" : "opacity-0 scale-[0.98] absolute inset-1.5 sm:inset-2 pointer-events-none"}`}
                      aria-hidden={i !== active}
                    >
                      <CardImage src={s.image} alt={s.name} ratio="4/5" position="top" className="founder-portrait__media rounded-xl" />
                    </div>
                  ))}
                </div>
              </div>
              <span className="founder-portrait__badge hero-float-badge hero-float-badge--bottom">
                <span className="hero-float-badge__dot" aria-hidden />
                {slides[active]?.role || "Founder"}
              </span>
            </div>
          </div>

          <div className={cn(REVEAL, REVEAL_RIGHT, "founder-message-card__content")}>
            <span className="founder-quote-card__mark" aria-hidden>&ldquo;</span>
            <div className="founder-quote-card__body">
              {slides.map((s, i) => (
                <div
                  key={s.name}
                  className={`founder-quote-card__slide transition-all duration-700 ease-in-out ${i === active ? "opacity-100 relative translate-y-0" : "opacity-0 absolute inset-0 translate-y-2 pointer-events-none"}`}
                  aria-hidden={i !== active}
                >
                  <blockquote className="founder-quote-card__text text-ink leading-relaxed italic font-normal">
                    {s.quote}
                  </blockquote>
                  <div className="founder-quote-card__author">
                    <div className="founder-quote-card__avatar" aria-hidden>
                      {(s.name || "S").charAt(0)}
                    </div>
                    <div className="founder-quote-card__meta min-w-0">
                      <p className="founder-quote-card__name">{s.name}</p>
                      <p className="founder-quote-card__role">{s.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {count > 1 && (
        <div className="founder-slider__nav">
          <button
            type="button"
            onClick={() => setActive((i) => (i - 1 + count) % count)}
            className="founder-slider__btn"
            aria-label="Previous message"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="founder-slider__dots">
            {slides.map((s, i) => (
              <button
                key={s.name}
                type="button"
                onClick={() => setActive(i)}
                className={`founder-slider__dot ${i === active ? "founder-slider__dot--active" : ""}`}
                aria-label={`Show message from ${s.name}`}
                aria-current={i === active ? "true" : undefined}
              />
            ))}
          </div>
          <span className="founder-slider__counter" aria-live="polite">
            {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={() => setActive((i) => (i + 1) % count)}
            className="founder-slider__btn"
            aria-label="Next message"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default function HomepageClient({
  site,
  products = [],
  courses,
  portfolio = [],
  testimonials,
  trust = [],
  processSteps = [],
}) {
  const { lang } = useLanguage();
  const home = site.pages?.home || {};

  const ribbonItems = useMemo(() => {
    const marquee = (site.heroMarquee || []).map((item) =>
      typeof item === "string" ? item : item?.text || ""
    ).filter(Boolean);
    if (marquee.length >= 3) return marquee;
    return lang === "hi"
      ? [SITE_STATS.yearsHi, "कौशल से कारोबार तक", SITE_STATS.yearsHi, "100% प्रैक्टिकल ट्रेनिंग"]
      : [SITE_STATS.yearsEn, "From Skill to Business", SITE_STATS.yearsEn, "100% Practical Training"];
  }, [site.heroMarquee, lang]);


  const founderImage = home.founderImage || "/133.png";
  const mentorImage = home.mentorImage || "/hero_studio_banner.png";

  const founderSlides = useMemo(
    () => [
      {
        name: pickPage(home, lang, "founderName", "founderNameHi"),
        role: pickPage(home, lang, "founderRole", "founderRoleHi"),
        quote: pickPage(home, lang, "founderQuote", "founderQuoteHi"),
        image: founderImage,
      },
      {
        name: pickPage(home, lang, "mentorName", "mentorNameHi"),
        role: pickPage(home, lang, "mentorRole", "mentorRoleHi"),
        quote: pickPage(home, lang, "mentorQuote", "mentorQuoteHi"),
        image: mentorImage,
      },
    ],
    [home, lang, founderImage, mentorImage]
  );

  const videoEmbedUrl = toYoutubeEmbedUrl(home.videoUrl);

  return (
    <div className="home-page relative z-10 w-full min-w-0 max-w-full overflow-x-clip">
      {/* ===== HERO BANNER (includes stats + quick actions) ===== */}
      <HeroSection home={home} lang={lang} />

      {/* ===== BRAND MARQUEE RIBBON ===== */}
      <div className="brand-ribbon" aria-hidden>
        <div className={MARQUEE_CONTAINER}>
          <div className={MARQUEE_CONTENT}>
            {[0, 1].map((dup) => (
              <span key={dup} className="brand-ribbon__item">
                {ribbonItems.map((item, i) => (
                  <span key={i} className="brand-ribbon__item">
                    {item} <span className="brand-ribbon__gem">✦</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ===== QUICK CATEGORY LINKS ===== */}
      <CategoryCards lang={lang} />

      {/* ===== START YOUR JOURNEY ===== */}
      <StartJourneySection lang={lang} home={home} />

      <HomeCoursesPreview courses={courses} home={home} />

      {/* ===== SHOP PREVIEW ===== */}
      <HomeShopPreview products={products} home={home} lang={lang} whatsapp={site.whatsapp} />

      {/* ===== VIDEO SECTION ===== */}
      {videoEmbedUrl && <VideoShowcase home={home} embedUrl={videoEmbedUrl} />}

      {/* ===== FOUNDER MESSAGE ===== */}
      <section className={cn(HOME_BAND_WHITE, PAGE_CONTAINER, PAGE_SECTION, "founder-section", "max-w-6xl", "relative", "z-20", "overflow-hidden")}>
        <div className="founder-section__bg" aria-hidden />
        <div className="founder-section__glow founder-section__glow--left" aria-hidden />
        <div className="founder-section__glow founder-section__glow--right" aria-hidden />
        <div className="relative z-10">
          <SectionHeader
            home={home}
            lang={lang}
            eyebrowKey="founderEyebrow"
            titleKey="founderTitle"
            hiOnlyKeys={["founderTitle"]}
            compact
            className="founder-section__header"
          />
          <FounderMessageSlider slides={founderSlides} />
        </div>
      </section>

      {/* ===== PORTFOLIO PREVIEW ===== */}
      <HomePortfolioPreview portfolio={portfolio} home={home} lang={lang} />

      {/* ===== EXPLORE CATEGORIES ===== */}
      <ExploreCategories courses={courses} products={products} home={home} />

      {/* ===== DESIGN PROCESS ===== */}
      {processSteps.length > 0 && (
        <section className={cn(HOME_BAND_BRAND, PAGE_SECTION, SECTION_MUTED)}>
          <div className={PAGE_CONTAINER}>
          <div className={cn(REVEAL, "text-center", "mb-5", "sm:mb-8")}>
            <span className="text-orange uppercase tracking-[0.25em] text-xs font-semibold">
              {pickPage(home, lang, "processEyebrow", "processEyebrowHi") ||
                (lang === "hi" ? "हमारी प्रक्रिया" : "How It Works")}
            </span>
            <h2 className={cn(SECTION_TITLE, "mt-2", "text-balance")}>
              {pickPage(home, lang, "processTitle", "processTitleHi") ||
                (lang === "hi" ? "WhatsApp से डिलीवरी तक" : "From WhatsApp to Delivery")}
            </h2>
            <div className={cn(HAIRLINE, "max-w-xs", "mx-auto", "mt-6")} />
          </div>
          <DesignProcess steps={processSteps} />
          </div>
        </section>
      )}

      {/* ===== STUDENT SUCCESS ===== */}
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
        <Testimonials items={testimonials} />
      </section>

      <InquiryPopup source="home_popup" />
    </div>
  );
}
