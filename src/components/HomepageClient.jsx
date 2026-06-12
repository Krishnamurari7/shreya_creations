"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import CardImage from "@/components/CardImage";
import CourseCard from "@/components/CourseCard";
import ProductCard from "@/components/ProductCard";
import CollectionBanner from "@/components/CollectionBanner";
import CategoryCards from "@/components/CategoryCards";
import { Testimonials, TrustWall } from "@/components/Sections";
import { DesignProcess } from "@/components/FashionSections";
import { toYoutubeEmbedUrl } from "@/lib/youtube";
import VideoShowcase from "@/components/VideoShowcase";
import { waLink } from "@/lib/whatsapp";
import PageCTA from "@/components/PageCTA";
import { Glass3DCard, Float3D } from "@/components/Glass3DCard";
import { useLanguage } from "@/components/LanguageProvider";
import { pickPage, pageBottomCtaProps } from "@/lib/cms";
import { pickLocalized, pickTrust } from "@/lib/i18n";

function SectionHeader({
  home,
  lang,
  eyebrowKey,
  titleKey,
  titleHighlightKey,
  subtitleKey,
  className = "",
}) {
  const eyebrow = pickPage(home, lang, eyebrowKey, `${eyebrowKey}Hi`);
  const title = pickPage(home, lang, titleKey, `${titleKey}Hi`);
  const highlight = titleHighlightKey
    ? pickPage(home, lang, titleHighlightKey, `${titleHighlightKey}Hi`)
    : "";
  const subtitle = subtitleKey ? pickPage(home, lang, subtitleKey, `${subtitleKey}Hi`) : "";
  return (
    <div className={`text-center mb-6 sm:mb-10 px-1 reveal ${className}`}>
      {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
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
        <p className="mt-3 text-muted font-normal max-w-2xl mx-auto text-sm sm:text-base leading-relaxed text-pretty">
          {subtitle}
        </p>
      )}
      {(eyebrow || title) && (
        <div className="section-ornament mt-5 sm:mt-6" aria-hidden>
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
    <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
      <div className="lg:col-span-5 flex justify-center reveal reveal-left">
        <div className="relative w-full max-w-sm rounded-2xl overflow-hidden glass border border-orange/25 p-2 sm:p-3 shadow-xl">
          {slides.map((s, i) => (
            <div
              key={s.name}
              className={`transition-opacity duration-700 ease-in-out ${i === active ? "opacity-100" : "opacity-0 absolute inset-2 sm:inset-3 pointer-events-none"}`}
              aria-hidden={i !== active}
            >
              <CardImage src={s.image} alt={s.name} ratio="3/4" position="top" className="rounded-xl" />
            </div>
          ))}
        </div>
      </div>
      <div className="lg:col-span-7 text-center lg:text-left reveal reveal-right">
        <div className="relative min-h-[12rem] sm:min-h-[10rem]">
          {slides.map((s, i) => (
            <div
              key={s.name}
              className={`transition-opacity duration-700 ease-in-out ${i === active ? "opacity-100" : "opacity-0 absolute inset-0 pointer-events-none"}`}
              aria-hidden={i !== active}
            >
              <blockquote className="font-display text-xl sm:text-2xl md:text-3xl text-ink leading-relaxed italic">
                &ldquo;{s.quote}&rdquo;
              </blockquote>
              <div className="mt-8 flex flex-col sm:flex-row items-center lg:items-start gap-2 sm:gap-4">
                <div className="h-12 w-12 rounded-full bg-purple/10 grid place-items-center font-display text-xl text-purple shrink-0">
                  {(s.name || "S").charAt(0)}
                </div>
                <div>
                  <p className="font-display text-xl text-ink">{s.name}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-orange font-semibold mt-1">{s.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {count > 1 && (
          <div className="mt-8 flex items-center justify-center lg:justify-start gap-3">
            <button
              type="button"
              onClick={() => setActive((i) => (i - 1 + count) % count)}
              className="h-9 w-9 rounded-full border border-orange/30 text-orange hover:bg-orange/10 transition-colors"
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
                  className={`h-2.5 rounded-full transition-all duration-300 ${i === active ? "w-8 bg-orange" : "w-2.5 bg-orange/30 hover:bg-orange/50"}`}
                  aria-label={`Show message from ${s.name}`}
                  aria-current={i === active ? "true" : undefined}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setActive((i) => (i + 1) % count)}
              className="h-9 w-9 rounded-full border border-orange/30 text-orange hover:bg-orange/10 transition-colors"
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

  const academyDetails = useMemo(() => {
    const features = (home.academyFeatures || []).map((f) => ({
      icon: f.icon,
      text: lang === "hi" && f.textHi ? f.textHi : f.text,
    }));
    const highlights = (home.academyHighlights || []).map((h) => ({
      value: h.value,
      label: lang === "hi" && h.labelHi ? h.labelHi : h.label,
    }));
    let perks = (home.academyPerks || []).map((p) => {
      if (typeof p === "string") return p;
      return lang === "hi" && p.textHi ? p.textHi : p.text;
    });
    if (!perks.length && lang === "hi" && home.academyPerksHi?.length) {
      perks = home.academyPerksHi;
    }
    return {
      location: home.academyLocation || "Shreya creation, Sisodiya Place, East Boring Canal Road, Patna, Bihar 800001",
      title: pickPage(home, lang, "academyTitle", "academyTitleHi"),
      titleAccent: pickPage(home, lang, "academyTitleAccent", "academyTitleAccentHi"),
      subtitle: pickPage(home, lang, "academySubtitle", "academySubtitleHi"),
      features,
      highlights,
      perks,
      cta: pickPage(home, lang, "academyCta", "academyCtaHi"),
      note: pickPage(home, lang, "academyNote", "academyNoteHi"),
      noteSub: pickPage(home, lang, "academyNoteSub", "academyNoteSubHi"),
    };
  }, [home, lang]);

  const whyChooseFeatures = useMemo(() => {
    const items = home.whyChooseFeatures || [];
    return items.map((f, i) => ({
      icon: f.icon || "✦",
      title: lang === "hi" && f.titleHi ? f.titleHi : f.title,
      sub: lang === "hi" && f.subHi ? f.subHi : f.sub,
      color: i % 2 === 0 ? "orange" : "purple",
    }));
  }, [home.whyChooseFeatures, lang]);

  const heroStats = useMemo(
    () => trust.slice(0, 3).map((t) => pickTrust(t, lang)),
    [trust, lang]
  );

  const heroTiles = useMemo(
    () =>
      [
        {
          icon: home.heroTile1Icon || "🎓",
          title: pickPage(home, lang, "heroTile1Title", "heroTile1TitleHi"),
          sub: pickPage(home, lang, "heroTile1Sub", "heroTile1SubHi"),
          accent: "purple",
        },
        {
          icon: home.heroTile2Icon || "🧵",
          title: pickPage(home, lang, "heroTile2Title", "heroTile2TitleHi"),
          sub: pickPage(home, lang, "heroTile2Sub", "heroTile2SubHi"),
          accent: "orange",
        },
      ].filter((t) => t.title),
    [home, lang]
  );

  const ribbonItems = useMemo(() => {
    const fromFeatures = whyChooseFeatures.map((f) => f.title).filter(Boolean);
    if (fromFeatures.length >= 3) return fromFeatures.slice(0, 6);
    return lang === "hi"
      ? ["ब्राइडल कउचर", "बेस्पोक सिलाई", "50+ फैशन कोर्स", "24 घंटे डिलीवरी", "WhatsApp ऑर्डरिंग"]
      : ["Bridal Couture", "Bespoke Stitching", "50+ Fashion Courses", "24-Hour Delivery", "WhatsApp Ordering"];
  }, [whyChooseFeatures, lang]);

  const siteIntro = pickLocalized(site, lang, "intro", "introHi");
  const heroSubtitle =
    pickPage(home, lang, "heroSubtitle", "heroSubtitleHi") ||
    siteIntro ||
    "Job-oriented fashion & stitching courses, plus bespoke boutique stitching in 24 hours.";
  const heroImage = home.heroImage || "/hero_studio_banner.png";
  const heroCtaLabel = pickPage(home, lang, "heroCtaLabel", "heroCtaLabelHi") || "Explore Courses";
  const heroCtaHref = home.heroCtaHref || "/courses";
  const founderImage = home.founderImage || "/atelier_details.png";
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
      <div className="pointer-events-none absolute top-[40%] -right-24 h-72 w-72 rounded-full bg-purple/5 blur-3xl" aria-hidden />

      {/* ===== HERO BANNER ===== */}
      <section className="hero-floral-bg hero-mesh-bg relative pt-[var(--header-offset)] pb-10 sm:pb-14 lg:pb-16 overflow-hidden">
        <div className="page-container w-full grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center relative z-[1]">
          <div className="flex flex-col justify-center py-6 sm:py-8 lg:py-12 order-2 lg:order-1 text-center lg:text-left">
            <span className="anim-rise inline-flex items-center gap-2 self-center lg:self-start text-purple uppercase tracking-[0.18em] sm:tracking-[0.25em] text-xs font-semibold mb-3 sm:mb-4 rounded-full border border-purple/20 bg-purple/5 px-4 py-1.5">
              <span className="sparkle-pulse text-gold" aria-hidden>✦</span>
              {pickPage(home, lang, "heroBadge", "heroBadgeHi")}
            </span>

            <h1 className="anim-rise anim-delay-1 page-hero-title text-balance">
              <span className="highlight-shimmer block sm:inline">
                {pickPage(home, lang, "heroTitleLine1", "heroTitleLine1Hi")}
              </span>{" "}
              <span className="text-brand-purple">
                {pickPage(home, lang, "heroTitleHighlight", "heroTitleHighlightHi")}
              </span>
            </h1>

            <p className="anim-rise anim-delay-2 mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-muted max-w-lg mx-auto lg:mx-0 leading-relaxed text-pretty">
              {heroSubtitle}
            </p>

            {heroTiles.length > 0 && (
              <div className="anim-rise anim-delay-2 mt-5 sm:mt-6 grid min-[480px]:grid-cols-2 gap-3 max-w-xl mx-auto lg:mx-0 w-full">
                {heroTiles.map((t, i) => (
                  <div
                    key={i}
                    className={`hero-tile flex items-center gap-3 rounded-xl border px-4 py-3 text-left backdrop-blur-sm ${
                      t.accent === "purple" ? "border-purple/25 bg-purple/5" : "border-orange/30 bg-orange/5"
                    }`}
                  >
                    <span
                      className={`hero-tile__icon grid place-items-center h-10 w-10 shrink-0 rounded-lg text-lg ${
                        t.accent === "purple" ? "bg-purple/10" : "bg-orange/10"
                      }`}
                      aria-hidden
                    >
                      {t.icon}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold text-sm text-ink leading-snug">{t.title}</span>
                      {t.sub && (
                        <span className="block text-[11px] sm:text-xs text-muted mt-0.5 leading-snug">{t.sub}</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="anim-rise anim-delay-3 mt-6 sm:mt-8 flex flex-col min-[480px]:flex-row flex-wrap gap-3 justify-center lg:justify-start">
              <Link
                href={heroCtaHref}
                className="btn-purple inline-flex items-center justify-center gap-2 rounded-md px-6 sm:px-8 py-3 sm:py-3.5 w-full sm:w-auto text-xs sm:text-sm btn-mobile"
              >
                {heroCtaLabel} <span aria-hidden>›</span>
              </Link>
              <Link
                href="/shop"
                className="btn-ghost inline-flex items-center justify-center gap-2 rounded-md px-6 sm:px-8 py-3 sm:py-3.5 w-full sm:w-auto text-xs sm:text-sm btn-mobile"
              >
                {lang === "hi" ? "बुटीक शॉप देखें" : "Visit Boutique Shop"}
              </Link>
            </div>

            {heroStats.length > 0 && (
              <div className="anim-rise anim-delay-4 hero-stat-chips mt-7 sm:mt-9 justify-center lg:justify-start">
                {heroStats.map((s, i) => (
                  <div key={i} className="hero-stat-chip">
                    <span className="hero-stat-chip__value">{s.value}</span>
                    <span className="hero-stat-chip__label">{s.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-center lg:justify-end order-1 lg:order-2 relative">
            <div className="pointer-events-none absolute -top-8 -right-6 h-40 w-40 rounded-full bg-orange/15 blur-3xl float-soft" aria-hidden />
            <div className="pointer-events-none absolute -bottom-10 -left-4 h-44 w-44 rounded-full bg-purple/10 blur-3xl float-soft [animation-delay:-3s]" aria-hidden />
            <span className="pointer-events-none absolute top-6 left-2 sm:left-8 text-gold text-lg sparkle-pulse" aria-hidden>✦</span>
            <span className="pointer-events-none absolute bottom-12 right-2 sm:right-6 text-orange text-sm sparkle-pulse [animation-delay:-1.4s]" aria-hidden>✦</span>

            <div className="anim-hero-media hero-arch-frame w-full max-w-[280px] sm:max-w-md shadow-xl relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImage}
                alt="Shreya creation ethnic wear"
                className="w-full h-full object-cover"
              />
              {(home.heroCardTitle || home.heroCardText) && (
                <div className="absolute bottom-4 left-4 right-4 z-10 glass rounded-xl px-4 py-3 border border-purple/20 backdrop-blur-md float-soft">
                  <p className="font-display text-sm text-ink font-semibold">
                    {pickPage(home, lang, "heroCardTitle", "heroCardTitleHi")}
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    {pickPage(home, lang, "heroCardText", "heroCardTextHi")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

      </section>

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
        <section className="page-section page-container pb-12 sm:pb-16">
          <SectionHeader
            home={home}
            lang={lang}
            eyebrowKey="whyChooseEyebrow"
            titleKey="whyChooseTitle"
          />
          <div className="features-bar">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
              {whyChooseFeatures.map((f, i) => (
                <div key={i} className="feature-card text-center reveal px-1" style={{ transitionDelay: `${i * 60}ms` }}>
                  <div
                    className={`feature-card__icon ${
                      f.color === "orange" ? "bg-orange/10 text-orange border border-orange/20" : "bg-purple/10 text-purple border border-purple/20"
                    }`}
                  >
                    {f.icon}
                  </div>
                  <h3 className="font-body text-xs sm:text-sm font-semibold text-ink leading-snug">{f.title}</h3>
                  <p className="text-xs text-muted mt-0.5 leading-relaxed">{f.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== COLLECTION SHOWCASE ===== */}
      <CollectionBanner
        home={home}
        fallbackLeft={heroImage}
        fallbackRight={founderImage}
      />

      {/* ===== QUICK CATEGORY LINKS ===== */}
      <CategoryCards lang={lang} />

      {/* ===== COURSES OVERVIEW ===== */}
      <section className="section-muted py-12 sm:py-20 lg:py-24 relative z-20">
        <div className="page-container max-w-7xl">
          <SectionHeader
            home={home}
            lang={lang}
            eyebrowKey="coursesEyebrow"
            titleKey="academyHeading"
            titleHighlightKey="academyHeadingHighlight"
            subtitleKey="coursesSubtitle"
          />

          <Glass3DCard
            layered
            className="reveal rounded-2xl sm:rounded-[2rem] p-4 sm:p-10 lg:p-12 border-orange/25 overflow-hidden relative"
          >
            <div className="absolute -top-20 -right-16 h-56 w-56 rounded-full bg-orange/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-12 h-48 w-48 rounded-full bg-purple/10 blur-3xl pointer-events-none" />

            <div className="relative z-[2] grid lg:grid-cols-2 gap-10 lg:gap-14 items-stretch">
              <Float3D translateZ="50" className="w-full">
                <div className="flex flex-col h-full">
                  <div className="flex flex-wrap items-center gap-3 mb-5">
                    <span className="inline-flex items-center gap-1.5 min-w-0 max-w-full text-[10px] sm:text-[11px] uppercase tracking-widest text-purple-dark font-semibold bg-purple/10 border border-purple/25 px-3 py-1.5 rounded-full">
                      <span aria-hidden className="shrink-0">📍</span>
                      <span className="min-w-0 line-clamp-2 sm:line-clamp-none sm:truncate">{academyDetails.location}</span>
                    </span>
                  </div>

                  <h4 className="font-display text-2xl sm:text-3xl md:text-4xl text-ink leading-[1.12] text-balance">
                    {academyDetails.title}{" "}
                    <span className="text-gold-gradient">{academyDetails.titleAccent}</span>
                  </h4>
                  <p className="mt-4 text-ink font-normal text-sm leading-relaxed max-w-lg">
                    {academyDetails.subtitle}
                  </p>

                  <ul className="mt-7 space-y-3">
                    {academyDetails.features.map((feat, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3.5 rounded-2xl border border-ink/15 bg-cream/30 px-4 py-3 text-sm text-ink font-normal transition-colors hover:border-orange/25 hover:bg-orange/5"
                      >
                        <span className="grid place-items-center h-9 w-9 shrink-0 rounded-xl bg-orange/10 border border-ink/15 text-base">
                          {feat.icon}
                        </span>
                        <span className="leading-snug">{feat.text}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 grid grid-cols-1 min-[380px]:grid-cols-3 gap-3 pt-6 border-t border-ink/15">
                    {academyDetails.highlights.map((h, i) => (
                      <div key={i} className="text-center sm:text-left">
                        <div className={`font-display text-2xl sm:text-3xl font-semibold ${i === 1 ? "text-purple-dark" : "text-orange"}`}>
                          {h.value}
                        </div>
                        <div className="text-[10px] uppercase tracking-wider text-ink mt-0.5">{h.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Float3D>

              <Float3D translateZ="70" className="w-full">
                <div className="flex flex-col h-full gap-5">
                  <div className="relative w-full rounded-2xl overflow-hidden glass border border-orange/20">
                    <CardImage src={heroImage} alt="Shreya creation offline stitching academy studio" ratio="16/10" position="top" className="rounded-2xl" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent z-10 pointer-events-none" />
                  </div>

                  <div className="glass rounded-2xl p-6 sm:p-7 border border-orange/20 bg-gradient-to-br from-orange/8 via-transparent to-purple/5 flex flex-col flex-1">
                    <div className="text-center">
                      <span className="font-display text-3xl sm:text-4xl text-gold-gradient font-bold leading-none">
                        {academyDetails.note}
                      </span>
                      <p className="text-sm text-ink mt-2 font-normal">{academyDetails.noteSub}</p>
                    </div>

                    <ul className="mt-6 space-y-2.5">
                      {academyDetails.perks.map((perk, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-ink font-normal">
                          <span className="text-purple-dark shrink-0 mt-0.5" aria-hidden>✓</span>
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href={waLink(
                        site.whatsapp,
                        "Hello! I would like to book a studio visit and learn more about the Offline Studio Fashion/Stitching courses."
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full px-8 py-3.5 mt-7 w-full block text-center font-medium btn-purple"
                    >
                      {academyDetails.cta}
                    </a>
                    <Link
                      href="/courses"
                      className="mt-4 text-center text-xs text-orange hover:text-orange-dark font-medium tracking-wide transition-colors"
                    >
                      Browse all design courses →
                    </Link>
                  </div>
                </div>
              </Float3D>
            </div>
          </Glass3DCard>

          {courses.length > 0 && (
            <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
              {courses.slice(0, 3).map((c, i) => (
                <div key={c.id} className="reveal reveal-zoom" style={{ transitionDelay: `${i * 100}ms` }}>
                  <CourseCard course={c} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== SHOP PREVIEW ===== */}
      {products.length > 0 && (
        <section className="page-section page-container">
          {pickPage(home, lang, "shopPreviewTitle", "shopPreviewTitleHi") ? (
            <SectionHeader
              home={home}
              lang={lang}
              eyebrowKey="shopPreviewEyebrow"
              titleKey="shopPreviewTitle"
              subtitleKey="shopPreviewSubtitle"
            />
          ) : (
            <div className="text-center mb-8 sm:mb-12 px-1 reveal">
              <span className="text-orange uppercase tracking-[0.25em] text-xs font-semibold">
                {lang === "hi" ? "बुटीक शॉप" : "Boutique Shop"}
              </span>
              <h2 className="section-title mt-2 leading-tight text-balance">
                {lang === "hi" ? "क्यूरेटेड " : "Curated "}
                <span className="highlight-shimmer">{lang === "hi" ? "कउचर" : "Couture"}</span>
              </h2>
              <p className="mt-3 text-muted font-normal max-w-2xl mx-auto text-sm sm:text-base leading-relaxed text-pretty">
                {lang === "hi"
                  ? "कलेक्शन देखें और WhatsApp पर अपने माप पर ऑर्डर करें।"
                  : "Browse the collection and order stitched to your size on WhatsApp."}
              </p>
              <div className="hairline max-w-xs mx-auto mt-6" />
            </div>
          )}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {products.slice(0, 4).map((p, i) => (
              <div key={p.id} className="reveal reveal-zoom h-full" style={{ transitionDelay: `${(i % 4) * 80}ms` }}>
                <ProductCard product={p} variant="boutique" whatsapp={site.whatsapp} />
              </div>
            ))}
          </div>
          <div className="text-center mt-8 sm:mt-10 reveal">
            <Link href="/shop" className="btn-ghost inline-flex items-center gap-2 rounded-full px-8 py-3 text-xs sm:text-sm">
              {lang === "hi" ? "पूरी शॉप देखें" : "View Full Shop"} <span aria-hidden>→</span>
            </Link>
          </div>
        </section>
      )}

      {/* ===== VIDEO SECTION ===== */}
      {videoEmbedUrl && <VideoShowcase home={home} embedUrl={videoEmbedUrl} />}

      {/* ===== FOUNDER MESSAGE ===== */}
      <section className="page-section page-container max-w-6xl py-12 sm:py-20 relative z-20">
        <SectionHeader
          home={home}
          lang={lang}
          eyebrowKey="founderEyebrow"
          titleKey="founderTitle"
        />
        <FounderMessageSlider slides={founderSlides} />
      </section>

      {/* ===== PORTFOLIO PREVIEW ===== */}
      {portfolio.length > 0 && (
        <section className="page-section page-container overflow-hidden">
          {pickPage(home, lang, "portfolioPreviewTitle", "portfolioPreviewTitleHi") ? (
            <SectionHeader
              home={home}
              lang={lang}
              eyebrowKey="portfolioPreviewEyebrow"
              titleKey="portfolioPreviewTitle"
              subtitleKey="portfolioPreviewSubtitle"
            />
          ) : (
            <div className="text-center mb-8 sm:mb-12 px-1 reveal">
              <span className="text-orange uppercase tracking-[0.25em] text-xs font-semibold">
                {lang === "hi" ? "हमारा काम" : "Our Work"}
              </span>
              <h2 className="section-title mt-2 leading-tight text-balance">
                {lang === "hi" ? "पोर्टफोलियो " : "Portfolio "}
                <span className="highlight-shimmer">{lang === "hi" ? "झलक" : "Highlights"}</span>
              </h2>
              <p className="mt-3 text-muted font-normal max-w-2xl mx-auto text-sm sm:text-base leading-relaxed text-pretty">
                {lang === "hi"
                  ? "पटना एटेलियर में बने लहंगे, गाउन और ब्राइडल पीस।"
                  : "Lehengas, gowns and bridal pieces crafted at our Patna atelier."}
              </p>
              <div className="hairline max-w-xs mx-auto mt-6" />
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {portfolio.slice(0, 4).map((item, idx) => (
              <Link
                key={item.id || idx}
                href="/portfolio"
                className="group relative block overflow-hidden rounded-2xl glass border border-ink/15 hover:border-orange/35 transition-all duration-500 reveal shadow-md"
                style={{ transitionDelay: `${(idx % 4) * 70}ms` }}
              >
                <CardImage src={item.image} alt={item.title} ratio="3/4" position="top" />
                <div className="portfolio-card-overlay absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-4">
                  {item.category && (
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-orange font-semibold">
                      {item.category}
                    </span>
                  )}
                  <span className="font-display text-sm sm:text-base text-white leading-tight line-clamp-2 mt-0.5">
                    {item.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8 sm:mt-10 reveal">
            <Link href="/portfolio" className="btn-purple inline-flex items-center gap-2 rounded-full px-8 py-3 text-xs sm:text-sm">
              {lang === "hi" ? "पूरा पोर्टफोलियो" : "View Full Portfolio"} <span aria-hidden>→</span>
            </Link>
          </div>
        </section>
      )}

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
      <section className="page-section page-container overflow-hidden">
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
    </div>
  );
}
