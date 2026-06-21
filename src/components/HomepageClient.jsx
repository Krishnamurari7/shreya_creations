"use client";

import { useEffect, useMemo, useState } from "react";
import CardImage from "@/components/CardImage";
import CategoryCards from "@/components/CategoryCards";
import { Testimonials, TrustWall } from "@/components/Sections";
import { DesignProcess } from "@/components/FashionSections";
import { toYoutubeEmbedUrl } from "@/lib/youtube";
import VideoShowcase from "@/components/VideoShowcase";
import PageCTA from "@/components/PageCTA";
import { useLanguage } from "@/components/LanguageProvider";
import { pickPage, pageBottomCtaProps } from "@/lib/cms";
import { pickBrandMessage, pickServiceUsp, normalizeServiceUsp } from "@/lib/i18n";
import { SITE_STATS } from "@/lib/seed";
import InquiryPopup from "@/components/InquiryPopup";
import HeroSection from "@/components/HeroSection";
import HomeShopPreview from "@/components/HomeShopPreview";
import HomePortfolioPreview from "@/components/HomePortfolioPreview";
import HomeCoursesPreview from "@/components/HomeCoursesPreview";
import ExploreCategories from "@/components/ExploreCategories";

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
      className={`text-center px-1 reveal section-header-glass ${compact ? "mb-4 sm:mb-5" : "mb-6 sm:mb-10"} ${className}`}
    >
      {eyebrow && (
        <span className="section-eyebrow">
          <span className="sparkle-pulse text-gold text-[10px]" aria-hidden>✦</span>
          {eyebrow}
        </span>
      )}
      {title && (
        <h2 className="section-title mt-2 leading-tight text-balance">
          {title}
          {highlight && (
            <>
              {" "}
              <span className="highlight-shimmer">{highlight}</span>
            </>
          )}
        </h2>
      )}
      {subtitle && (
        <p className="mt-3 section-lead max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      {(eyebrow || title) && (
        <div className={`section-ornament ${compact ? "mt-3 sm:mt-4" : "mt-5 sm:mt-6"}`} aria-hidden>
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

  const slide = slides[active] || slides[0];
  if (!slide) return null;

  return (
    <div className="founder-message-grid grid lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-center min-w-0">
      <div className="lg:col-span-4 xl:col-span-4 flex justify-center reveal reveal-left min-w-0">
        <div className="founder-portrait relative">
          <div className="founder-portrait__ring gradient-ring rounded-2xl p-[2px] shadow-glow">
            <div className="founder-portrait__inner rounded-[calc(1rem-2px)] overflow-hidden glass border-0 p-1.5 sm:p-2">
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
          <span className="founder-portrait__badge hero-float-badge hero-float-badge--bottom hidden sm:inline-flex">
            <span className="hero-float-badge__dot" aria-hidden />
            {slides[active]?.role || "Founder"}
          </span>
        </div>
      </div>
      <div className="lg:col-span-8 xl:col-span-8 text-center lg:text-left reveal reveal-right min-w-0">
        <div className="founder-quote-card relative min-h-[9rem] sm:min-h-[8rem] lg:min-h-[7.5rem]">
          {slides.map((s, i) => (
            <div
              key={s.name}
              className={`transition-opacity duration-700 ease-in-out ${i === active ? "opacity-100 relative" : "opacity-0 absolute inset-0 pointer-events-none"}`}
              aria-hidden={i !== active}
            >
              <blockquote className="founder-quote-card__text text-ink leading-snug italic font-normal">
                &ldquo;{s.quote}&rdquo;
              </blockquote>
              <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row items-center lg:items-start gap-2 sm:gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange/20 to-gold/20 grid place-items-center font-display text-lg text-orange shrink-0 ring-2 ring-orange/25">
                  {(s.name || "S").charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="font-display text-lg sm:text-xl text-ink">{s.name}</p>
                  <p className="text-[10px] sm:text-xs uppercase tracking-[0.16em] text-orange font-semibold mt-0.5">{s.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {count > 1 && (
          <div className="mt-4 sm:mt-5 flex items-center justify-center lg:justify-start gap-2.5">
            <button
              type="button"
              onClick={() => setActive((i) => (i - 1 + count) % count)}
              className="h-10 w-10 rounded-full border border-orange/30 text-orange hover:bg-orange/10 hover:scale-105 transition-all"
              aria-label="Previous message"
            >
              ‹
            </button>
            <div className="flex gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${i === active ? "w-8 bg-gradient-to-r from-orange to-gold" : "w-2.5 bg-orange/30 hover:bg-orange/50"}`}
                  aria-label={`Show message from ${s.name}`}
                  aria-current={i === active ? "true" : undefined}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setActive((i) => (i + 1) % count)}
              className="h-10 w-10 rounded-full border border-orange/30 text-orange hover:bg-orange/10 hover:scale-105 transition-all"
              aria-label="Next message"
            >
              ›
            </button>
          </div>
        )}
      </div>
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

  const whyChooseFeatures = useMemo(() => {
    const items = home.whyChooseFeatures || [];
    return items.map((f, i) => ({
      icon: f.icon || "✦",
      title: lang === "hi" && f.titleHi ? f.titleHi : f.title,
      sub:
        f.subHi?.includes("24 घंटे में सिले")
          ? normalizeServiceUsp(f.subHi)
          : lang === "hi" && f.subHi
            ? f.subHi
            : f.sub,
      color: i % 2 === 0 ? "orange" : "gold",
    }));
  }, [home.whyChooseFeatures, lang]);

  const brandMessage = pickBrandMessage(site);
  const serviceUsp = pickServiceUsp(site);

  const ribbonItems = useMemo(() => {
    const fromFeatures = whyChooseFeatures.map((f) => f.title).filter(Boolean);
    if (fromFeatures.length >= 3) return fromFeatures.slice(0, 6);
    return lang === "hi"
      ? [SITE_STATS.yearsHi, "कौशल से कारोबार तक", SITE_STATS.yearsHi, "100% प्रैक्टिकल ट्रेनिंग"]
      : [SITE_STATS.yearsEn, "From Skill to Business", SITE_STATS.yearsEn, "100% Practical Training"];
  }, [whyChooseFeatures, lang]);


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
    <div className="relative z-10 w-full overflow-x-hidden bg-cream">
      <div className="pointer-events-none absolute top-32 -left-20 h-64 w-64 rounded-full bg-orange/6 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute top-[40%] -right-24 h-72 w-72 rounded-full bg-orange/5 blur-3xl" aria-hidden />

      {/* ===== HERO BANNER ===== */}
      <HeroSection home={home} lang={lang} />

      {/* ===== QUICK CATEGORY LINKS ===== */}
      <CategoryCards lang={lang} />

      {/* ===== BRAND MARQUEE RIBBON ===== */}
      <div className="brand-ribbon" aria-hidden>
        <div className="marquee-container">
          <div className="marquee-content">
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

      {/* ===== WHY CHOOSE US ===== */}
      {whyChooseFeatures.length > 0 && (
        <section className="why-choose-section page-section page-container pb-12 sm:pb-16 relative">
          <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 h-48 w-[min(100%,36rem)] rounded-full bg-gold/8 blur-3xl" aria-hidden />

          <SectionHeader
            home={home}
            lang={lang}
            eyebrowKey="whyChooseEyebrow"
            titleKey="whyChooseTitle"
            compact
          />

          {/* Brand message + Service USP — primary focus */}
          <div className="why-choose-pillars reveal mb-8 sm:mb-10" data-stagger>
            <div className="why-choose-pillar why-choose-pillar--brand">
              <span className="why-choose-pillar__tag">
                {lang === "hi" ? "ब्रांड संदेश" : "Brand Message"}
              </span>
              <p className="why-choose-pillar__headline">{brandMessage}</p>
            </div>

            <div className="why-choose-pillar why-choose-pillar--usp">
              <span className="why-choose-pillar__tag why-choose-pillar__tag--usp">
                <span className="why-choose-pillar__bolt" aria-hidden>⚡</span>
                {lang === "hi" ? "हमारी खास सेवा" : "Our Signature Service"}
              </span>
              <p className="why-choose-pillar__headline why-choose-pillar__headline--usp">{serviceUsp}</p>
              <p className="why-choose-pillar__hint">
                {lang === "hi"
                  ? "तेज़ सिलाई, प्रीमियम फिनिश — पटना में"
                  : "Fast tailoring, premium finish — in Patna"}
              </p>
            </div>
          </div>

          <p className="why-choose-divider reveal text-center">
            <span>{lang === "hi" ? "और भी कारण" : "Plus more reasons"}</span>
          </p>

          <div className="features-bar mt-6 sm:mt-8">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-5" data-stagger>
              {whyChooseFeatures.map((f, i) => (
                <div
                  key={i}
                  className={`feature-card text-center reveal px-1 ${i === 0 ? "feature-card--usp" : ""}`}
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  {i === 0 && (
                    <span className="feature-card__badge">
                      {lang === "hi" ? "⭐ USP" : "⭐ USP"}
                    </span>
                  )}
                  <div
                    className={`feature-card__icon ${
                      f.color === "orange" ? "bg-orange/10 text-orange border border-orange/20" : "bg-gold/10 text-gold border border-gold/20"
                    }`}
                  >
                    {f.icon}
                  </div>
                  <h3 className="font-body text-xs sm:text-sm font-semibold text-ink leading-snug">{f.title}</h3>
                  <p className="text-[11px] sm:text-xs text-muted mt-0.5 leading-relaxed">{f.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <HomeCoursesPreview courses={courses} home={home} />

      {/* ===== SHOP PREVIEW ===== */}
      <HomeShopPreview products={products} home={home} lang={lang} whatsapp={site.whatsapp} />

      {/* ===== VIDEO SECTION ===== */}
      {videoEmbedUrl && <VideoShowcase home={home} embedUrl={videoEmbedUrl} />}

      {/* ===== FOUNDER MESSAGE ===== */}
      <section className="founder-section page-section page-container max-w-6xl relative z-20">
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
      </section>

      {/* ===== PORTFOLIO PREVIEW ===== */}
      <HomePortfolioPreview portfolio={portfolio} home={home} lang={lang} />

      {/* ===== EXPLORE CATEGORIES ===== */}
      <ExploreCategories courses={courses} products={products} />

      {/* ===== DESIGN PROCESS ===== */}
      {processSteps.length > 0 && (
        <section className="section-muted py-12 sm:py-16">
          <div className="page-section page-container">
          <div className="text-center mb-8 sm:mb-12 reveal">
            <span className="text-orange uppercase tracking-[0.25em] text-xs font-semibold">
              {lang === "hi" ? "हमारी प्रक्रिया" : "How It Works"}
            </span>
            <h2 className="section-title mt-2 text-balance">
              {lang === "hi" ? "WhatsApp से डिलीवरी तक" : "From WhatsApp to Delivery"}
            </h2>
            <div className="hairline max-w-xs mx-auto mt-6" />
          </div>
          <DesignProcess steps={processSteps} />
          </div>
        </section>
      )}

      {/* ===== TRUST STATS ===== */}
      {trust.length > 0 && (
        <section className="trust-stats-section page-section page-container">
          <div className="text-center mb-8 sm:mb-12 reveal">
            <span className="text-orange uppercase tracking-[0.25em] text-xs font-semibold">
              {lang === "hi" ? "आंकड़ों में" : "By the Numbers"}
            </span>
            <h2 className="section-title mt-2 text-balance">
              {pickPage(home, lang, "trustTitle", "trustTitleHi") ||
                (lang === "hi" ? "हज़ारों का भरोसा" : "Trusted by Thousands")}
            </h2>
            <div className="hairline max-w-xs mx-auto mt-6" />
          </div>
          <TrustWall items={trust} localize />
        </section>
      )}

      {/* ===== STUDENT SUCCESS ===== */}
      <section id="testimonials" className="page-section page-container overflow-hidden">
        <SectionHeader
          home={home}
          lang={lang}
          eyebrowKey="successEyebrow"
          titleKey="successTitle"
          subtitleKey="successSubtitle"
        />
        <Testimonials items={testimonials} />
      </section>

      {/* ===== CONTACT SECTION ===== */}
      <PageCTA whatsapp={site.whatsapp} {...pageBottomCtaProps(home)} className="pt-12 pb-8 sm:pt-20 sm:pb-12" />

      <InquiryPopup source="home_popup" />
    </div>
  );
}
