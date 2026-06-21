"use client";

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

  const statChips = [
    {
      icon: "⭐",
      value: lang === "hi" ? SITE_STATS.yearsHi : SITE_STATS.yearsEn,
      label: lang === "hi" ? "अनुभव" : "Experience",
    },
    {
      icon: "🎓",
      value: lang === "hi" ? "2000+" : "2000+",
      label: lang === "hi" ? "छात्र प्रशिक्षित" : "Students trained",
    },
    {
      icon: "✂️",
      value: "100%",
      label: lang === "hi" ? "प्रैक्टिकल ट्रेनिंग" : "Practical training",
    },
  ];

  const memberImages = [
    home.founderImage || "/133.png",
    home.mentorImage || "/hero_studio_banner.png",
  ];

  return (
    <>
      {/* ——— Hero story ——— */}
      <section className="about-hero page-container max-w-6xl py-6 sm:py-10 lg:py-14 relative z-20 overflow-hidden min-w-0 w-full">
        <AmbientGlows />
        <div
          className="pointer-events-none absolute -top-16 right-0 h-56 w-56 rounded-full bg-orange/8 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 -left-20 h-48 w-48 rounded-full bg-gold/6 blur-3xl"
          aria-hidden
        />

        <div className="grid lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-center">
          <motion.div
            className="lg:col-span-5 relative flex justify-center order-1 lg:order-none min-w-0"
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
            custom={0.1}
            variants={fadeUp}
          >
            <div className="about-hero__portrait founder-portrait relative">
              <div className="founder-portrait__ring gradient-ring rounded-2xl sm:rounded-3xl p-[2px] shadow-glow">
                <div className="founder-portrait__inner rounded-[calc(1rem-2px)] sm:rounded-[calc(1.5rem-2px)] overflow-hidden glass border-0 p-1.5 sm:p-2">
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
                className="about-hero__float-chip about-hero__float-chip--top hidden sm:inline-flex"
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
            className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left order-2 lg:order-none min-w-0"
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
            custom={0.25}
            variants={fadeUp}
          >
            <span className="section-eyebrow">
              <span className="sparkle-pulse text-gold text-[10px]" aria-hidden>
                ✦
              </span>
              {storyEyebrow}
            </span>

            <h2 className="section-title mt-2 text-balance leading-tight">
              {heroBefore}{" "}
              <span className="highlight-shimmer">{heroHighlight}</span>
            </h2>

            <div className="hairline max-w-xs mx-auto lg:mx-0 lg:max-w-sm" />

            <p className="text-muted font-normal leading-relaxed text-base sm:text-lg max-w-xl mx-auto lg:mx-0 text-pretty">
              {intro}
            </p>

            <div className="about-stat-chips">
              {statChips.map((chip, i) => (
                <div key={chip.label} className="about-stat-chip reveal" style={staggerDelay(i, 70)}>
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
              <div className="about-quote-card reveal">
                <blockquote className="about-quote-card__text text-ink font-normal leading-relaxed text-sm sm:text-base text-left">
                  &ldquo;{aboutExtra}&rdquo;
                </blockquote>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1 reveal">
              <Link
                href="/courses"
                className="btn-primary rounded-full px-6 py-3 inline-block text-xs sm:text-sm tracking-widest"
              >
                {lang === "hi" ? "कोर्स देखें" : "Explore Courses"}
              </Link>
              <Link
                href="/contact"
                className="btn-gold-outline rounded-full px-6 py-3 inline-block text-xs sm:text-sm tracking-widest"
              >
                {lang === "hi" ? "संपर्क करें" : "Contact Us"}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ——— Mission band ——— */}
      <section className="about-mission-band relative z-20 overflow-hidden" aria-label={brandMessage}>
        <div className="about-mission-band__inner page-container max-w-6xl">
          <div className="about-mission-band__pill about-mission-band__pill--brand">
            <span className="about-mission-band__icon" aria-hidden>
              ✦
            </span>
            <div>
              <p className="about-mission-band__tag">
                {lang === "hi" ? "हमारा मिशन" : "Our Mission"}
              </p>
              <p className="about-mission-band__headline">{brandMessage}</p>
            </div>
          </div>
          <div className="about-mission-band__divider" aria-hidden />
          <div className="about-mission-band__pill about-mission-band__pill--usp">
            <span className="about-mission-band__icon about-mission-band__icon--bolt" aria-hidden>
              ⚡
            </span>
            <div>
              <p className="about-mission-band__tag">
                {lang === "hi" ? "हमारी खास सेवा" : "Our Signature Service"}
              </p>
              <p className="about-mission-band__headline about-mission-band__headline--usp">{serviceUsp}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ——— Values / pillars ——— */}
      {pillarList.length > 0 && (
        <section className="section-muted py-14 sm:py-20 lg:py-24 relative z-20 overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(232,93,34,0.07), transparent 60%)",
            }}
            aria-hidden
          />
          <div className="page-container max-w-6xl relative">
            <SectionHeading eyebrow={valuesEyebrow} title={pillarsTitle} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {pillarList.map((p, i) => (
                <Glass3DCard
                  key={p.title}
                  className={`about-pillar-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 relative group overflow-hidden reveal interactive-card border ${PILLAR_ACCENTS[i % PILLAR_ACCENTS.length]}`}
                  style={staggerDelay(i, 100)}
                >
                  <span className="about-pillar-card__index" aria-hidden>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-orange to-gold opacity-80 group-hover:w-1.5 transition-all duration-300 z-[3]"
                    aria-hidden
                  />
                  <div className="text-4xl sm:text-5xl mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5 inline-block">
                    {p.emoji}
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl text-ink mb-2">{p.title}</h3>
                  <p className="text-sm sm:text-base text-ink/90 font-normal leading-relaxed">{p.desc}</p>
                </Glass3DCard>
              ))}
            </div>
          </div>
        </section>
      )}

      <TeamSection aboutPage={about} memberImages={memberImages} />

      <section className="section-muted py-14 sm:py-16 lg:py-20 relative z-20 trust-stats-section">
        <div className="page-container max-w-6xl relative">
          <SectionHeading eyebrow={numbersEyebrow} title={trustTitle} />
          <TrustWall items={trust} localize />
        </div>
      </section>
    </>
  );
}
