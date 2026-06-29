"use client";

import { BTN_GOLD_OUTLINE, BTN_PRIMARY, GLASS, HAIRLINE, HIGHLIGHT_SHIMMER, INTERACTIVE_CARD, MARQUEE_CONTAINER, MARQUEE_CONTENT, PAGE_CONTAINER, REVEAL, SECTION_EYEBROW, SECTION_MUTED, SECTION_TITLE, SPARKLE_PULSE } from "@/lib/ui";
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

const PILLAR_ACCENTS = ["border-orange/25", "border-gold/30", "border-orange/20"];

const JOURNEY = [
  {
    year: "2007",
    titleEn: "Founded in Patna",
    titleHi: "पटना में स्थापना",
    descEn: "Started with a vision to empower women through fashion skills.",
    descHi: "फैशन कौशल से महिलाओं को सशक्त बनाने की दृष्टि के साथ शुरुआत।",
    icon: "🏛️",
  },
  {
    year: "2000+",
    titleEn: "Students Trained",
    titleHi: "छात्र प्रशिक्षित",
    descEn: "Thousands of learners turned skill into self-employment.",
    descHi: "हज़ारों छात्राओं ने कौशल को स्वरोजगार में बदला।",
    icon: "🎓",
  },
  {
    year: "10",
    titleEn: "Professional Courses",
    titleHi: "प्रोफेशनल कोर्स",
    descEn: "Boutique, blouse, suit, kids wear, fashion design & lehenga.",
    descHi: "बुटीक, ब्लाउज, सूट, किड्स वियर, फैशन डिज़ाइन और लहंगा।",
    icon: "📚",
  },
  {
    year: "24hr",
    titleEn: "Stitching Service",
    titleHi: "सिलाई सेवा",
    descEn: "Custom outfits delivered within a day for urgent needs.",
    descHi: "जरूरी ऑर्डर के लिए एक दिन में कस्टम परिधान।",
    icon: "⚡",
  },
];

const QUICK_LINKS = [
  {
    href: "/courses",
    emoji: "🎓",
    titleEn: "Courses",
    titleHi: "कोर्स",
    subEn: "10 job-oriented programs",
    subHi: "10 जॉब ओरिएंटेड प्रोग्राम",
    accent: "orange",
  },
  {
    href: "/shop",
    emoji: "👗",
    titleEn: "Boutique Shop",
    titleHi: "बुटीक शॉप",
    subEn: "Designer wear & fabrics",
    subHi: "डिज़ाइनर वियर और फैब्रिक",
    accent: "gold",
  },
  {
    href: "/portfolio",
    emoji: "✨",
    titleEn: "Portfolio",
    titleHi: "पोर्टफोलियो",
    subEn: "Our finest creations",
    subHi: "हमारी बेहतरीन रचनाएँ",
    accent: "orange",
  },
  {
    href: "/contact",
    emoji: "💬",
    titleEn: "Contact",
    titleHi: "संपर्क",
    subEn: "Visit or WhatsApp us",
    subHi: "विज़िट करें या WhatsApp करें",
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

  const heroBefore =
    pickPage(about, lang, "heroTitleBefore", "heroTitleBeforeHi") ||
    (lang === "hi" ? "कौशल से कारोबार तक —" : "From skill to business —");
  const heroHighlight =
    pickPage(about, lang, "heroTitleHighlight", "heroTitleHighlightHi") ||
    (lang === "hi" ? SITE_STATS.yearsHi : SITE_STATS.yearsEn);
  const pillarsTitle = pickPage(about, lang, "pillarsTitle", "pillarsTitleHi");
  const trustTitle = pickPage(about, lang, "trustTitle", "trustTitleHi");
  const heroImage = about.heroImage || home.heroImage || "/hero_studio_banner.png";

  const valuesEyebrow = lang === "hi" ? "हमारे मूल्य" : "Our values";
  const numbersEyebrow = lang === "hi" ? "आंकड़ों में" : "By the numbers";
  const storyEyebrow = lang === "hi" ? "हमारी कहानी" : "Our Story";
  const journeyEyebrow = lang === "hi" ? "हमारी यात्रा" : "Our Journey";
  const journeyTitle = lang === "hi" ? "वर्षों का भरोसा" : "Years of Trust";
  const exploreEyebrow = lang === "hi" ? "और जानें" : "Explore more";

  const statChips = [
    {
      icon: "⭐",
      value: lang === "hi" ? SITE_STATS.yearsHi : SITE_STATS.yearsEn,
      label: lang === "hi" ? "अनुभव" : "Experience",
    },
    {
      icon: "🎓",
      value: "2000+",
      label: lang === "hi" ? "छात्र प्रशिक्षित" : "Students trained",
    },
    {
      icon: "📚",
      value: lang === "hi" ? SITE_STATS.coursesHi : SITE_STATS.coursesEn,
      label: lang === "hi" ? "प्रोफेशनल कोर्स" : "Professional courses",
    },
  ];

  const memberImages = [
    home.founderImage || "/133.png",
    home.mentorImage || "/hero_studio_banner.png",
  ];

  const ribbonItems = (site.heroMarquee || []).slice(0, 6);

  return (
    <div className="about-page relative min-w-0 w-full">
      {/* ——— Hero story ——— */}
      <section className={cn(PAGE_CONTAINER, "about-hero", "max-w-6xl", "py-5", "sm:py-8", "lg:py-12", "relative", "z-20", "overflow-hidden", "min-w-0", "w-full")}>
        <AmbientGlows />
        <div className="pointer-events-none absolute -top-16 right-0 h-56 w-56 rounded-full bg-orange/8 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute bottom-0 -left-20 h-48 w-48 rounded-full bg-gold/6 blur-3xl" aria-hidden />

        <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 xl:gap-14 items-center">
          <motion.div
            className="lg:col-span-5 relative flex justify-center order-1 lg:order-none min-w-0"
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
            custom={0.1}
            variants={fadeUp}
          >
            <div className="about-hero__portrait founder-portrait relative">
              <div className="founder-portrait__ring gradient-ring rounded-2xl sm:rounded-3xl p-[2px] shadow-glow">
                <div className={cn(GLASS, "founder-portrait__inner", "rounded-[calc(1rem-2px)]", "sm:rounded-[calc(1.5rem-2px)]", "overflow-hidden", "border-0", "p-1.5", "sm:p-2")}>
                  <motion.div
                    className="about-hero-frame relative w-full"
                    animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
                    transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <CardImage
                      src={heroImage}
                      alt={lang === "hi" ? "श्रेया क्रिएशन स्टूडियो" : "Shreya Creation studio"}
                      ratio="4/5"
                      position="top"
                      className="founder-portrait__media rounded-xl sm:rounded-2xl"
                    />
                    <div className="absolute inset-1.5 sm:inset-2 bg-gradient-to-t from-black/45 via-transparent to-transparent z-10 pointer-events-none rounded-xl sm:rounded-2xl" />
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
            className="lg:col-span-7 space-y-4 sm:space-y-5 lg:space-y-6 text-center lg:text-left order-2 lg:order-none min-w-0"
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
            custom={0.25}
            variants={fadeUp}
          >
            <span className={SECTION_EYEBROW}>
              <span className={cn(SPARKLE_PULSE, "text-gold", "text-[10px]")} aria-hidden>
                ✦
              </span>
              {storyEyebrow}
            </span>

            <h2 className={cn(SECTION_TITLE, "mt-2", "text-balance", "leading-tight")}>
              {heroBefore}{" "}
              <span className={HIGHLIGHT_SHIMMER}>{heroHighlight}</span>
            </h2>

            <div className={cn(HAIRLINE, "max-w-xs", "mx-auto", "lg:mx-0", "lg:max-w-sm")} />

            <p className="text-muted font-normal leading-relaxed text-sm sm:text-base lg:text-lg max-w-xl mx-auto lg:mx-0 text-pretty">
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
          </motion.div>
        </div>
      </section>

      {/* ——— Brand ribbon ——— */}
      {ribbonItems.length > 0 && (
        <div className="brand-ribbon about-brand-ribbon relative z-20" aria-hidden>
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
      )}

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
      <section className={cn(PAGE_CONTAINER, "about-journey", "max-w-6xl", "py-10", "sm:py-14", "lg:py-16", "relative", "z-20", "min-w-0")}>
        <SectionHeading eyebrow={journeyEyebrow} title={journeyTitle} />
        <div className="about-journey__track">
          <div className="about-journey__line" aria-hidden />
          {JOURNEY.map((step, i) => (
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

      {/* ——— Quick explore links ——— */}
      <section className={cn(PAGE_CONTAINER, "max-w-6xl", "py-10", "sm:py-12", "lg:py-14", "relative", "z-20", "min-w-0")}>
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

      {/* ——— Trust stats ——— */}
      {trust.length > 0 && (
        <section className="trust-stats-band about-trust-band relative z-20 trust-stats-section">
          <div className={cn(PAGE_CONTAINER, "max-w-6xl", "relative")}>
            <SectionHeading eyebrow={numbersEyebrow} title={trustTitle} />
            <TrustWall items={trust} localize />
          </div>
        </section>
      )}
    </div>
  );
}
