"use client";

import { BTN_GOLD_OUTLINE, BTN_PRIMARY, GLASS, HAIRLINE, HIGHLIGHT_SHIMMER, INTERACTIVE_CARD, PAGE_CONTAINER, PAGE_HERO_TITLE, PAGE_HERO_TITLE_COMPACT, REVEAL, SECTION_EYEBROW, SECTION_LEAD, SECTION_MUTED, SECTION_ORNAMENT, SPARKLE_PULSE } from "@/lib/ui";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import CardImage from "@/components/CardImage";
import { TrustWall } from "@/components/Sections";
import { Glass3DCard } from "@/components/Glass3DCard";
import SectionHeading from "@/components/SectionHeading";
import AmbientGlows from "@/components/AmbientGlows";
import { useLanguage } from "@/components/LanguageProvider";
import { pickLocalized, pickBrandMessage, pickServiceUsp } from "@/lib/i18n";
import { pickPage, pickPillar } from "@/lib/cms";
import { SITE_STATS } from "@/lib/seed";
import { fadeUp, staggerDelay } from "@/lib/motion";
import TeamSection from "@/components/TeamSection";
import { DEFAULT_ABOUT_JOURNEY } from "@/lib/cms/home-blocks";

const PILLAR_ACCENTS = ["border-orange/25", "border-gold/30", "border-orange/20"];

const QUICK_LINKS = [
  {
    href: "/courses",
    emoji: "🎓",
    titleEn: "Boutique courses in Patna",
    titleHi: "पटना में बुटीक कोर्स",
    subEn: "Fashion designing & blouse making",
    subHi: "फैशन डिज़ाइनिंग और ब्लाउज मेकिंग",
    accent: "orange",
  },
  {
    href: "/shop",
    emoji: "👗",
    titleEn: "24-hour custom stitching",
    titleHi: "24 घंटे कस्टम सिलाई",
    subEn: "Designer blouses & bridal wear",
    subHi: "डिज़ाइनर ब्लाउज और ब्राइडल वियर",
    accent: "gold",
  },
  {
    href: "/portfolio",
    emoji: "✨",
    titleEn: "Bridal boutique portfolio",
    titleHi: "ब्राइडल बुटीक पोर्टफोलियो",
    subEn: "Wedding lehengas & reception gowns",
    subHi: "वेडिंग लहंगा और रिसेप्शन गाउन",
    accent: "orange",
  },
  {
    href: "/contact",
    emoji: "💬",
    titleEn: "Boutique near me — visit Patna",
    titleHi: "पास का बुटीक — पटना विज़िट",
    subEn: "East Boring Canal Road studio",
    subHi: "ईस्ट बोरिंग कैनाल रोड स्टूडियो",
    accent: "gold",
  },
];

function viewProps(reduceMotion, delay = 0) {
  return {
    initial: reduceMotion ? false : "hidden",
    whileInView: "visible",
    viewport: { once: true, margin: "-40px" },
    custom: delay,
    variants: fadeUp,
  };
}

export default function AboutClient({ site, trust, pillars, aboutPage }) {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const about = aboutPage || site.pages?.about || {};
  const home = site.pages?.home || {};
  const intro = pickLocalized(site, lang, "intro", "introHi");
  const aboutExtra = pickLocalized(site, lang, "aboutBody", "aboutBodyHi");
  const pillarList = (pillars || site.aboutPillars || []).map((p) => pickPillar(p, lang));
  const brandMessage = pickBrandMessage(site);
  const serviceUsp = pickServiceUsp(site);

  const pageTitle =
    pickPage(about, lang, "headerTitle", "headerTitleHi") ||
    (lang === "hi"
      ? "श्रेया क्रिएशन — पटना का फैशन बुटीक इंस्टिट्यूट"
      : "About Shreya Creation — Patna's Fashion Boutique Institute");
  const pageSubtitle =
    pickPage(about, lang, "headerSubtitle", "headerSubtitleHi") ||
    (lang === "hi"
      ? "ईस्ट बोरिंग कैनाल रोड पर पटना का भरोसेमंद फैशन बुटीक और ट्रेनिंग इंस्टिट्यूट"
      : "Patna's trusted fashion boutique & training institute on East Boring Canal Road");
  const heroBefore =
    pickPage(about, lang, "heroTitleBefore", "heroTitleBeforeHi") ||
    (lang === "hi" ? "कौशल से कारोबार तक —" : "From skill to business —");
  const heroHighlight =
    pickPage(about, lang, "heroTitleHighlight", "heroTitleHighlightHi") ||
    (lang === "hi"
      ? `पटना में ${SITE_STATS.yearsHi} की परंपरा।`
      : `${SITE_STATS.yearsEn} of craft in Patna.`);
  const pillarsTitle = pickPage(about, lang, "pillarsTitle", "pillarsTitleHi");
  const trustTitle = pickPage(about, lang, "trustTitle", "trustTitleHi");
  const heroImage = about.heroImage || home.heroImage || "/hero_studio_banner.png";

  const valuesEyebrow = lang === "hi" ? "हमारे मूल्य" : "Our values";
  const numbersEyebrow = lang === "hi" ? "आंकड़ों में" : "By the numbers";
  const storyEyebrow =
    pickPage(about, lang, "headerEyebrow", "headerEyebrowHi") ||
    (lang === "hi" ? "हमारी कहानी" : "Our Story");
  const journeyEyebrow =
    pickPage(about, lang, "journeyTitle", "journeyTitleHi") ||
    (lang === "hi" ? "हमारी यात्रा" : "Our Journey");
  const journeyTitle = lang === "hi" ? "वर्षों का भरोसा" : "Years of Trust";
  const exploreEyebrow = lang === "hi" ? "और जानें" : "Explore more";

  const statChips = [
    {
      icon: "⭐",
      value: site.stats?.yearsEn || SITE_STATS.yearsEn,
      label: lang === "hi" ? "अनुभव" : "Experience",
    },
    {
      icon: "🎓",
      value: `${site.studentsTaught || 2000}+`,
      label: lang === "hi" ? "छात्र प्रशिक्षित" : "Students trained",
    },
    {
      icon: "📚",
      value: site.stats?.coursesEn || `${site.coursesCount || ""} Courses`.trim(),
      label: lang === "hi" ? "प्रोफेशनल कोर्स" : "Professional courses",
    },
  ];

  const journeySource =
    Array.isArray(about.journeySteps) && about.journeySteps.length
      ? about.journeySteps
      : DEFAULT_ABOUT_JOURNEY;

  const journeySteps = journeySource.map((step) => {
    const yearKey = step.yearKey || step.year_key;
    let year = "";
    if (yearKey === "founding") year = String(site.foundingYear || 2012);
    else if (yearKey === "students") year = `${site.studentsTaught || 2000}+`;
    else if (yearKey === "courses") year = String(site.coursesCount || "—");
    else if (yearKey === "express") year = `${site.expressDeliveryHours || 24}hr`;
    const titleEn = step.titleEn || step.title || "";
    const titleHi = step.titleHi || step.title_hi || titleEn;
    const descEn = step.descEn || step.desc || "";
    const descHi = step.descHi || step.desc_hi || descEn;
    return {
      yearKey,
      year,
      icon: step.icon || "✦",
      titleEn,
      titleHi,
      descEn,
      descHi,
    };
  });

  const memberImages = [
    home.founderImage || "/133.png",
    home.mentorImage || "/hero_studio_banner.png",
  ];

  return (
    <div className="about-page relative min-w-0 w-full">
      {/* ——— Hero ——— */}
      <section
        className={cn(
          PAGE_CONTAINER,
          "about-hero",
          "max-w-6xl",
          "pt-[calc(var(--header-offset)+0.75rem)]",
          "sm:pt-[calc(var(--header-offset)+1.25rem)]",
          "pb-8",
          "sm:pb-10",
          "lg:pb-14",
          "relative",
          "z-20",
          "overflow-hidden",
          "min-w-0",
          "w-full"
        )}
      >
        <AmbientGlows />
        <div className="about-hero__glow about-hero__glow--left" aria-hidden />
        <div className="about-hero__glow about-hero__glow--right" aria-hidden />

        <div className="grid lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 xl:gap-16 items-center">
          <motion.div
            className="lg:col-span-5 relative flex justify-center order-1 lg:order-none min-w-0"
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
            custom={0.1}
            variants={fadeUp}
          >
            <div className="about-hero__portrait founder-portrait relative">
              <div className="founder-portrait__halo" aria-hidden />
              <div className="founder-portrait__ring gradient-ring rounded-2xl sm:rounded-3xl p-[2px] shadow-glow">
                <div className={cn(GLASS, "founder-portrait__inner", "rounded-[calc(1rem-2px)]", "sm:rounded-[calc(1.5rem-2px)]", "overflow-hidden", "border-0", "p-1.5", "sm:p-2")}>
                  <motion.div
                    className="about-hero-frame relative w-full"
                    animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
                    transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <CardImage
                      src={heroImage}
                      alt={
                        lang === "hi"
                          ? "पटना का फैशन बुटीक इंस्टिट्यूट — श्रेया क्रिएशन स्टूडियो"
                          : "fashion boutique institute in Patna — Shreya Creation studio"
                      }
                      ratio="4/5"
                      position="top"
                      className="founder-portrait__media rounded-xl sm:rounded-2xl"
                    />
                    <div className="absolute inset-1.5 sm:inset-2 bg-gradient-to-t from-black/50 via-black/5 to-transparent z-10 pointer-events-none rounded-xl sm:rounded-2xl" />
                  </motion.div>
                </div>
              </div>

              {site.founded && (
                <motion.span
                  className="founder-portrait__badge hero-float-badge hero-float-badge--bottom about-founded-badge"
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.45, duration: 0.5 }}
                >
                  <span className="hero-float-badge__dot" aria-hidden />
                  {pickLocalized(site, lang, "founded", "foundedHi")}
                </motion.span>
              )}

              <motion.span
                className="about-hero__float-chip about-hero__float-chip--top"
                initial={reduceMotion ? false : { opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <span aria-hidden>🧵</span>
                {lang === "hi" ? "फैशन और सिलाई" : "Fashion & Stitching"}
              </motion.span>
            </div>
          </motion.div>

          <motion.div
            className="lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left order-2 lg:order-none min-w-0"
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
            custom={0.2}
            variants={fadeUp}
          >
            <span className={SECTION_EYEBROW}>
              <span className={cn(SPARKLE_PULSE, "text-gold", "text-[10px]")} aria-hidden>
                ✦
              </span>
              {storyEyebrow}
            </span>

            <h1 className={cn(PAGE_HERO_TITLE, PAGE_HERO_TITLE_COMPACT, "mt-2", "text-balance", "leading-[1.12]")}>
              {pageTitle}
            </h1>

            <p className={cn(SECTION_LEAD, "max-w-xl", "mx-auto", "lg:mx-0", "text-pretty")}>
              {pageSubtitle}
            </p>

            <p className="about-hero__tagline">
              {heroBefore}{" "}
              <span className={HIGHLIGHT_SHIMMER}>{heroHighlight}</span>
            </p>

            <div className={cn(HAIRLINE, "max-w-xs", "mx-auto", "lg:mx-0")} />

            <p className="text-muted font-normal leading-relaxed text-sm sm:text-base max-w-xl mx-auto lg:mx-0 text-pretty">
              {intro}
            </p>

            <div className="about-stat-chips">
              {statChips.map((chip, i) => (
                <div key={chip.label} className={cn(REVEAL, "about-stat-chip")} style={staggerDelay(i, 70)}>
                  <span className="about-stat-chip__icon" aria-hidden>
                    {chip.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="about-stat-chip__value">{chip.value}</p>
                    <p className="about-stat-chip__label">{chip.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {aboutExtra && (
              <div className={cn(REVEAL, "about-quote-card")}>
                <blockquote className="about-quote-card__text text-ink font-normal leading-relaxed text-sm sm:text-base text-left">
                  &ldquo;{aboutExtra}&rdquo;
                </blockquote>
              </div>
            )}

            <div className={cn(REVEAL, "flex", "flex-col", "sm:flex-row", "flex-wrap", "items-stretch", "sm:items-center", "justify-center", "lg:justify-start", "gap-2.5", "sm:gap-3", "pt-1")}>
              <Link
                href="/courses"
                className={cn(BTN_PRIMARY, "rounded-full", "px-5", "sm:px-6", "py-2.5", "sm:py-3", "inline-flex", "items-center", "justify-center", "text-xs", "sm:text-sm", "tracking-widest")}
              >
                {lang === "hi" ? "कोर्स देखें" : "Explore Courses"}
              </Link>
              <Link
                href="/contact"
                className={cn(BTN_GOLD_OUTLINE, "rounded-full", "px-5", "sm:px-6", "py-2.5", "sm:py-3", "inline-flex", "items-center", "justify-center", "text-xs", "sm:text-sm", "tracking-widest")}
              >
                {lang === "hi" ? "संपर्क करें" : "Contact Us"}
              </Link>
            </div>

            <div className={cn(SECTION_ORNAMENT, "justify-center", "lg:justify-start", "pt-1")} aria-hidden>
              <span className="text-gold text-xs">✦</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Brand ribbon removed — AnnouncementBar in Navbar is the single marquee */}

      {/* ——— Mission band ——— */}
      <section className="about-mission-band relative z-20 overflow-hidden" aria-label={brandMessage}>
        <div className="about-mission-band__bg" aria-hidden />
        <div className={cn(PAGE_CONTAINER, "about-mission-band__inner", "max-w-6xl", "relative")}>
          <motion.div className="about-mission-band__pill about-mission-band__pill--brand" {...viewProps(reduceMotion, 0.1)}>
            <span className="about-mission-band__icon" aria-hidden>
              ✦
            </span>
            <div className="min-w-0">
              <p className="about-mission-band__tag">
                {lang === "hi" ? "हमारा मिशन" : "Our Mission"}
              </p>
              <p className="about-mission-band__headline">{brandMessage}</p>
            </div>
          </motion.div>
          <div className="about-mission-band__divider" aria-hidden />
          <motion.div className="about-mission-band__pill about-mission-band__pill--usp" {...viewProps(reduceMotion, 0.2)}>
            <span className="about-mission-band__icon about-mission-band__icon--bolt" aria-hidden>
              ⚡
            </span>
            <div className="min-w-0">
              <p className="about-mission-band__tag">
                {lang === "hi" ? "हमारी खास सेवा" : "Our Signature Service"}
              </p>
              <p className="about-mission-band__headline about-mission-band__headline--usp">{serviceUsp}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ——— Journey timeline ——— */}
      <section className={cn(PAGE_CONTAINER, "about-journey", "max-w-6xl", "pb-10", "sm:pb-14", "lg:pb-16", "relative", "z-20", "min-w-0")}>
        <SectionHeading eyebrow={journeyEyebrow} title={journeyTitle} />
        <div className="about-journey__track">
          <div className="about-journey__line" aria-hidden />
          {journeySteps.map((step, i) => (
            <motion.article
              key={step.year}
              className={cn(REVEAL, "about-journey__step")}
              style={staggerDelay(i, 90)}
              {...viewProps(reduceMotion, 0.1 + i * 0.08)}
            >
              <div className="about-journey__node">
                <span className="about-journey__icon" aria-hidden>
                  {step.icon}
                </span>
              </div>
              <p className="about-journey__year">{step.year}</p>
              <h3 className="about-journey__title">
                {lang === "hi" ? step.titleHi : step.titleEn}
              </h3>
              <p className="about-journey__desc">
                {lang === "hi" ? step.descHi : step.descEn}
              </p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ——— Values / pillars ——— */}
      {pillarList.length > 0 && (
        <section className={cn(SECTION_MUTED, "py-10", "sm:py-16", "lg:py-20", "relative", "z-20", "overflow-hidden")}>
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(230,90,5,0.07), transparent 60%)",
            }}
            aria-hidden
          />
          <div className={cn(PAGE_CONTAINER, "max-w-6xl", "relative")}>
            <SectionHeading eyebrow={valuesEyebrow} title={pillarsTitle} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {pillarList.map((p, i) => (
                <Glass3DCard
                  key={p.title}
                  className={`about-pillar-card rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 relative group overflow-hidden ${REVEAL} ${INTERACTIVE_CARD} border ${PILLAR_ACCENTS[i % PILLAR_ACCENTS.length]}`}
                  style={staggerDelay(i, 100)}
                >
                  <span className="about-pillar-card__index" aria-hidden>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-orange to-gold opacity-80 group-hover:w-1.5 transition-all duration-300 z-[3]"
                    aria-hidden
                  />
                  <div className="text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5 inline-block">
                    {p.emoji}
                  </div>
                  <h3 className="font-display text-lg sm:text-xl lg:text-2xl text-ink mb-1.5 sm:mb-2">{p.title}</h3>
                  <p className="text-sm sm:text-base text-ink/90 font-normal leading-relaxed">{p.desc}</p>
                </Glass3DCard>
              ))}
            </div>
          </div>
        </section>
      )}

      <TeamSection aboutPage={about} memberImages={memberImages} />

      {/* ——— Trust stats ——— */}
      {trust.length > 0 && (
        <section className="trust-stats-band about-trust-band relative z-20 trust-stats-section">
          <div className={cn(PAGE_CONTAINER, "max-w-6xl", "relative")}>
            <SectionHeading eyebrow={numbersEyebrow} title={trustTitle} />
            <TrustWall items={trust} localize />
          </div>
        </section>
      )}

      {/* ——— Quick explore links ——— */}
      <section className={cn(PAGE_CONTAINER, "about-explore", "max-w-6xl", "py-10", "sm:py-12", "lg:py-14", "relative", "z-20", "min-w-0")}>
        <SectionHeading eyebrow={exploreEyebrow} title={lang === "hi" ? "हमारी दुनिया" : "Our World"} />
        <div className="about-quick-links">
          {QUICK_LINKS.map((link, i) => (
            <motion.div key={link.href} {...viewProps(reduceMotion, 0.1 + i * 0.06)}>
              <Link
                href={link.href}
                className={`about-quick-link about-quick-link--${link.accent}`}
              >
                <span className="about-quick-link__emoji" aria-hidden>
                  {link.emoji}
                </span>
                <span className="about-quick-link__copy min-w-0">
                  <span className="about-quick-link__title">
                    {lang === "hi" ? link.titleHi : link.titleEn}
                  </span>
                  <span className="about-quick-link__sub">
                    {lang === "hi" ? link.subHi : link.subEn}
                  </span>
                </span>
                <span className="about-quick-link__arrow" aria-hidden>
                  →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
