"use client";

import { motion, useReducedMotion } from "framer-motion";
import CardImage from "@/components/CardImage";
import { TrustWall } from "@/components/Sections";
import { Glass3DCard } from "@/components/Glass3DCard";
import SectionHeading from "@/components/SectionHeading";
import AmbientGlows from "@/components/AmbientGlows";
import { useLanguage } from "@/components/LanguageProvider";
import { pickLocalized, pickBrandMessage, pickServiceUsp } from "@/lib/i18n";
import { pickPage, pickPillar } from "@/lib/cms";
import { fadeUp, staggerDelay } from "@/lib/motion";
import TeamSection from "@/components/TeamSection";

export default function AboutClient({ site, trust, pillars, aboutPage }) {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const about = aboutPage || site.pages?.about || {};
  const intro = pickLocalized(site, lang, "intro", "introHi");
  const aboutExtra = pickLocalized(site, lang, "aboutBody", "aboutBodyHi");
  const pillarList = (pillars || site.aboutPillars || []).map((p) => pickPillar(p, lang));

  const heroBefore =
    pickPage(about, "hi", "heroTitleBefore", "heroTitleBeforeHi") || `${pickBrandMessage(site)} —`;
  const heroHighlight =
    pickPage(about, "hi", "heroTitleHighlight", "heroTitleHighlightHi") || `${pickServiceUsp(site)}।`;
  const pillarsTitle = pickPage(about, lang, "pillarsTitle", "pillarsTitleHi");
  const trustTitle = pickPage(about, lang, "trustTitle", "trustTitleHi");
  const heroImage = about.heroImage || "/atelier_details.png";

  const valuesEyebrow = lang === "hi" ? "हमारे मूल्य" : "Our values";
  const numbersEyebrow = lang === "hi" ? "आंकड़ों में" : "By the numbers";

  return (
    <>
      <section className="page-container max-w-6xl py-8 sm:py-12 lg:py-16 grid lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-center relative z-20 overflow-hidden">
        <AmbientGlows />

        <motion.div
          className="lg:col-span-5 relative flex justify-center order-1 lg:order-none"
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          custom={0.1}
          variants={fadeUp}
        >
          <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-orange/10 blur-2xl -z-10" aria-hidden />
          <motion.div
            className="relative w-full max-w-[280px] sm:max-w-md about-hero-frame"
            animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="relative w-full rounded-2xl sm:rounded-[2rem] overflow-hidden glass border border-orange/25 shadow-2xl p-2 sm:p-3 group transition-transform duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_rgba(212,129,49,0.15)]">
              <CardImage src={heroImage} alt="Atelier" ratio="3/4" position="top" className="rounded-3xl" />
              <div className="absolute inset-2 sm:inset-3 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 pointer-events-none rounded-3xl" />
              {site.founded && (
                <motion.div
                  className="absolute bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 glass rounded-full px-4 py-1.5 border border-gold/30 text-[10px] uppercase tracking-widest text-orange font-semibold max-w-[calc(100%-1.5rem)] text-center about-founded-badge"
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  {site.founded}
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left order-2 lg:order-none"
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          custom={0.25}
          variants={fadeUp}
        >
          <span className="section-eyebrow">{lang === "hi" ? "हमारी कहानी" : "Our Story"}</span>
          <h2 className="section-title mt-2 text-balance">
            {heroBefore}{" "}
            <span className="highlight-shimmer">{heroHighlight}</span>
          </h2>
          <div className="hairline max-w-xs mx-auto lg:mx-0 lg:max-w-sm" />
          <p className="text-muted font-normal leading-relaxed text-base sm:text-lg max-w-xl mx-auto lg:mx-0 text-pretty">
            {intro}
          </p>
          {aboutExtra && (
            <blockquote className="about-quote reveal text-ink font-normal leading-relaxed text-sm sm:text-base max-w-xl mx-auto lg:mx-0 text-left">
              {aboutExtra}
            </blockquote>
          )}
        </motion.div>
      </section>

      {pillarList.length > 0 && (
        <section className="section-muted py-14 sm:py-20 lg:py-24 relative z-20 overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(212,129,49,0.07), transparent 60%)",
            }}
            aria-hidden
          />
          <div className="page-container max-w-6xl relative">
            <SectionHeading eyebrow={valuesEyebrow} title={pillarsTitle} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {pillarList.map((p, i) => {
                const isPurple = i % 2 === 1;
                return (
                  <Glass3DCard
                    key={i}
                    className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 relative group overflow-hidden reveal interactive-card"
                    style={staggerDelay(i, 100)}
                  >
                    <span
                      className={`absolute left-0 top-0 h-full w-1 ${isPurple ? "bg-orange" : "bg-orange"} opacity-70 group-hover:w-1.5 transition-all duration-300 z-[3]`}
                      aria-hidden
                    />
                    <div className="text-4xl sm:text-5xl mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5 inline-block">
                      {p.emoji}
                    </div>
                    <h3 className="font-display text-xl sm:text-2xl text-ink mb-2">{p.title}</h3>
                    <p className="text-sm sm:text-base text-ink/90 font-normal leading-relaxed">{p.desc}</p>
                  </Glass3DCard>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <TeamSection aboutPage={about} />

      <section className="page-container max-w-6xl pb-14 sm:pb-16 lg:pb-20 relative z-20 trust-stats-section">
        <SectionHeading eyebrow={numbersEyebrow} title={trustTitle} />
        <TrustWall items={trust} localize />
      </section>
    </>
  );
}
