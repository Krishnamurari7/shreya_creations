"use client";

import { useMemo } from "react";
import Link from "next/link";
import CardImage from "@/components/CardImage";
import CourseCard from "@/components/CourseCard";
import ProductCard from "@/components/ProductCard";
import CollectionBanner from "@/components/CollectionBanner";
import { Testimonials, TrustWall } from "@/components/Sections";
import { Services, DesignProcess } from "@/components/FashionSections";
import { waLink } from "@/lib/whatsapp";
import PageCTA from "@/components/PageCTA";
import { Glass3DCard, Float3D } from "@/components/Glass3DCard";
import { useLanguage } from "@/components/LanguageProvider";
import { pickPage, pageBottomCtaProps } from "@/lib/cms";
import { pickLocalized } from "@/lib/i18n";

function SectionHeader({ home, lang, eyebrowKey, titleKey, subtitleKey, className = "" }) {
  const eyebrow = pickPage(home, lang, eyebrowKey, `${eyebrowKey}Hi`);
  const title = pickPage(home, lang, titleKey, `${titleKey}Hi`);
  const subtitle = subtitleKey ? pickPage(home, lang, subtitleKey, `${subtitleKey}Hi`) : "";
  return (
    <div className={`text-center mb-8 sm:mb-12 px-1 reveal ${className}`}>
      {eyebrow && (
        <span className="text-orange uppercase tracking-[0.25em] text-xs font-semibold">{eyebrow}</span>
      )}
      {title && (
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-ink mt-2 leading-tight">{title}</h2>
      )}
      {subtitle && (
        <p className="mt-3 text-ink font-normal max-w-2xl mx-auto text-sm leading-relaxed">{subtitle}</p>
      )}
      <div className="hairline max-w-xs mx-auto mt-6" />
    </div>
  );
}

const CATEGORY_LINKS = [
  { href: "/shop", label: "Shop", labelHi: "शॉप", sub: "Made-to-order couture", subHi: "ऑर्डर पर कउचर", color: "orange" },
  { href: "/courses", label: "Courses", labelHi: "कोर्स", sub: "50+ fashion programs", subHi: "50+ फैशन प्रोग्राम", color: "lavender" },
  { href: "/portfolio", label: "Portfolio", labelHi: "पोर्टफोलियो", sub: "Bridal & festive wear", subHi: "ब्राइडल और फेस्टिव", color: "purple" },
];

export default function HomepageClient({
  site,
  products = [],
  courses,
  portfolio = [],
  testimonials,
  trust = [],
  services,
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

  const siteIntro = pickLocalized(site, lang, "intro", "introHi");
  const heroSubtitle =
    pickPage(home, lang, "heroSubtitle", "heroSubtitleHi") ||
    siteIntro ||
    "From skill to business — bespoke stitching, bridal couture & 50+ fashion courses.";
  const heroImage = home.heroImage || "/hero_studio_banner.png";
  const heroCtaLabel = pickPage(home, lang, "heroCtaLabel", "heroCtaLabelHi") || "SHOP NOW";
  const heroCtaHref = home.heroCtaHref || "/shop";
  const founderImage = home.founderImage || "/atelier_details.png";

  return (
    <div className="relative z-10 w-full overflow-x-hidden bg-cream">

      {/* ===== HERO BANNER ===== */}
      <section className="hero-floral-bg relative pt-[var(--header-offset)] pb-10 sm:pb-14">
        <div className="page-container w-full grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          <div className="flex flex-col justify-center py-6 sm:py-8 lg:py-12 order-2 lg:order-1 text-center lg:text-left">
            <span className="text-purple uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[10px] sm:text-xs font-semibold mb-3 sm:mb-4">
              {pickPage(home, lang, "heroBadge", "heroBadgeHi")}
            </span>

            <h1 className="font-display text-[2rem] sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08] text-balance">
              <span className="text-brand-gold block sm:inline">
                {pickPage(home, lang, "heroTitleLine1", "heroTitleLine1Hi")}
              </span>{" "}
              <span className="text-brand-purple">
                {pickPage(home, lang, "heroTitleHighlight", "heroTitleHighlightHi")}
              </span>
            </h1>

            <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-muted max-w-lg mx-auto lg:mx-0 leading-relaxed text-pretty">
              {heroSubtitle}
            </p>

            <div className="mt-6 sm:mt-8 flex flex-col min-[480px]:flex-row flex-wrap gap-3 justify-center lg:justify-start">
              <Link
                href={heroCtaHref}
                className="btn-purple inline-flex items-center justify-center gap-2 rounded-md px-6 sm:px-8 py-3 sm:py-3.5 w-full sm:w-auto text-xs sm:text-sm btn-mobile"
              >
                {heroCtaLabel} <span aria-hidden>›</span>
              </Link>
              <Link
                href="/courses"
                className="btn-ghost inline-flex items-center justify-center gap-2 rounded-md px-6 sm:px-8 py-3 sm:py-3.5 w-full sm:w-auto text-xs sm:text-sm btn-mobile"
              >
                {lang === "hi" ? "कोर्स देखें" : "Explore Courses"}
              </Link>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="hero-arch-frame w-full max-w-[280px] sm:max-w-md shadow-xl relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImage}
                alt="Shreya creation ethnic wear"
                className="w-full h-full object-cover"
              />
              {(home.heroCardTitle || home.heroCardText) && (
                <div className="absolute bottom-4 left-4 right-4 z-10 glass rounded-xl px-4 py-3 border border-purple/20 backdrop-blur-md">
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
                <div key={i} className="text-center reveal px-1" style={{ transitionDelay: `${i * 60}ms` }}>
                  <div className={`text-xl sm:text-2xl mb-1.5 sm:mb-2 ${f.color === "orange" ? "text-orange" : "text-purple"}`}>
                    {f.icon}
                  </div>
                  <h3 className="font-body text-xs sm:text-sm font-semibold text-ink leading-snug">{f.title}</h3>
                  <p className="text-[10px] sm:text-xs text-muted mt-0.5 leading-relaxed">{f.sub}</p>
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
      <section className="page-container pb-10 sm:pb-14">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-5 max-w-4xl mx-auto">
          {CATEGORY_LINKS.map((cat, i) => (
            <Link
              key={cat.href}
              href={cat.href}
              className={`category-arch-card category-arch-card--${cat.color} reveal`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <span className="font-display text-lg sm:text-xl">
                {lang === "hi" ? cat.labelHi : cat.label}
              </span>
              <span className="text-[10px] sm:text-xs mt-1 opacity-90 uppercase tracking-wider">
                {lang === "hi" ? cat.subHi : cat.sub}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== COURSES OVERVIEW ===== */}
      <section className="section-muted py-12 sm:py-24 relative z-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-5">
          <SectionHeader
            home={home}
            lang={lang}
            eyebrowKey="coursesEyebrow"
            titleKey="coursesTitle"
            subtitleKey="coursesSubtitle"
          />

          <div className="text-center mb-10 sm:mb-14 reveal px-1">
            <span className="inline-flex items-center gap-2 bg-orange/10 border border-orange/20 text-orange px-4 py-1.5 rounded-full text-xs font-medium tracking-[0.2em] uppercase mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-orange animate-pulse" />
              {pickPage(home, lang, "academyBadge", "academyBadgeHi")}
            </span>
            <h3 className="font-display text-2xl sm:text-3xl md:text-4xl text-ink leading-tight">
              {pickPage(home, lang, "academyHeading", "academyHeadingHi")}{" "}
              <span className="text-gold-gradient">{pickPage(home, lang, "academyHeadingHighlight", "academyHeadingHighlightHi")}</span>
            </h3>
            <p className="mt-4 text-ink font-normal max-w-2xl mx-auto text-sm leading-relaxed">
              {pickPage(home, lang, "academySubheading", "academySubheadingHi")}
            </p>
          </div>

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
                    <span className="inline-flex items-center gap-1.5 max-w-full text-[10px] sm:text-[11px] uppercase tracking-widest text-purple-dark font-semibold bg-purple/10 border border-purple/25 px-3 py-1.5 rounded-full">
                      <span aria-hidden className="shrink-0">📍</span>
                      <span className="line-clamp-2 sm:line-clamp-none sm:truncate">{academyDetails.location}</span>
                    </span>
                  </div>

                  <h4 className="font-display text-3xl sm:text-4xl text-ink leading-[1.1]">
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

                  <div className="mt-8 grid grid-cols-3 gap-3 pt-6 border-t border-ink/15">
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
              {courses.slice(0, 3).map((c) => (
                <div key={c.id} className="reveal">
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
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-ink mt-2 leading-tight">
                {lang === "hi" ? "क्यूरेटेड " : "Curated "}
                <span className="text-gold-gradient">{lang === "hi" ? "कउचर" : "Couture"}</span>
              </h2>
              <p className="mt-3 text-ink font-normal max-w-2xl mx-auto text-sm leading-relaxed">
                {lang === "hi"
                  ? "कलेक्शन देखें और WhatsApp पर अपने माप पर ऑर्डर करें।"
                  : "Browse the collection and order stitched to your size on WhatsApp."}
              </p>
              <div className="hairline max-w-xs mx-auto mt-6" />
            </div>
          )}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {products.slice(0, 4).map((p) => (
              <div key={p.id} className="reveal h-full">
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

      {/* ===== BOUTIQUE SERVICES OVERVIEW ===== */}
      <section className="section-muted py-10 sm:py-16">
        <div className="page-section page-container">
          <SectionHeader
            home={home}
            lang={lang}
            eyebrowKey="servicesEyebrow"
            titleKey="servicesTitle"
            subtitleKey="servicesSubtitle"
          />
          <Services items={services} />
        </div>
      </section>

      {/* ===== FOUNDER MESSAGE ===== */}
      <section className="page-section page-container max-w-6xl py-12 sm:py-20 relative z-20">
        <SectionHeader
          home={home}
          lang={lang}
          eyebrowKey="founderEyebrow"
          titleKey="founderTitle"
        />
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center reveal">
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm rounded-2xl overflow-hidden glass border border-orange/25 p-2 sm:p-3 shadow-xl">
              <CardImage src={founderImage} alt={pickPage(home, lang, "founderName", "founderNameHi")} ratio="3/4" position="top" className="rounded-xl" />
            </div>
          </div>
          <div className="lg:col-span-7 text-center lg:text-left">
            <blockquote className="font-display text-xl sm:text-2xl md:text-3xl text-ink leading-relaxed italic">
              &ldquo;{pickPage(home, lang, "founderQuote", "founderQuoteHi")}&rdquo;
            </blockquote>
            <div className="mt-8 flex flex-col sm:flex-row items-center lg:items-start gap-2 sm:gap-4">
              <div className="h-12 w-12 rounded-full bg-purple/10 grid place-items-center font-display text-xl text-purple shrink-0">
                {(pickPage(home, lang, "founderName", "founderNameHi") || "S").charAt(0)}
              </div>
              <div>
                <p className="font-display text-xl text-ink">{pickPage(home, lang, "founderName", "founderNameHi")}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-orange font-semibold mt-1">
                  {pickPage(home, lang, "founderRole", "founderRoleHi")}
                </p>
              </div>
            </div>
          </div>
        </div>
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
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-ink mt-2 leading-tight">
                {lang === "hi" ? "पोर्टफोलियो " : "Portfolio "}
                <span className="text-gold-gradient">{lang === "hi" ? "झलक" : "Highlights"}</span>
              </h2>
              <p className="mt-3 text-ink font-normal max-w-2xl mx-auto text-sm leading-relaxed">
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent flex flex-col justify-end p-3 sm:p-4">
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
            <h2 className="font-display text-2xl sm:text-3xl md:text-5xl text-ink mt-2">
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
            <h2 className="font-display text-2xl sm:text-3xl md:text-5xl text-ink mt-2">
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
