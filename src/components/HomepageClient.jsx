"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import CourseCard from "@/components/CourseCard";
import PortfolioGallery from "@/components/PortfolioGallery";
import { Testimonials } from "@/components/Sections";
import { Services } from "@/components/FashionSections";
import { waLink, greetingMessage } from "@/lib/whatsapp";
import PageCTA from "@/components/PageCTA";
import { Glass3DCard, Float3D } from "@/components/Glass3DCard";
import { useLanguage } from "@/components/LanguageProvider";
import { pickPage, pageBottomCtaProps } from "@/lib/cms";

export default function HomepageClient({ site, products, courses, portfolio, testimonials, trust, services, processSteps }) {
  const [activeStep, setActiveStep] = useState(0);
  const { lang } = useLanguage();
  const home = site.pages?.home || {};
  const wa = waLink(site.whatsapp, greetingMessage());

  const marqueePhrases =
    site.heroMarquee?.length > 0
      ? site.heroMarquee
      : [
          "⚡ STITCHING IN 24 HOURS",
          "🏆 INDIA'S NO. 1 SEWING ACADEMY",
          "🧵 5,000+ OUTFITS DELIVERED",
          "📍 PRAYAGRAJ BOUTIQUE & STUDIO",
          "⭐ CERTIFIED FASHION DESIGN COURSES",
          "👑 DESIGNER LEHENGAS & BRIDAL COUTURE",
        ];

  const doublePhrases = [...marqueePhrases, ...marqueePhrases];

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
      location: home.academyLocation || "Civil Lines, Prayagraj",
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

  const heroImage = home.heroImage || "/hero_studio_banner.png";
  const atelierImage = home.atelierImage || "/atelier_details.png";

  return (
    <div className="relative z-10 w-full overflow-x-hidden">
      {/* Grid background decoration */}
      <div className="grid-overlay" />

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-0 lg:min-h-[calc(100dvh-var(--header-offset))] pt-[calc(var(--header-offset)+0.5rem)] sm:pt-[var(--header-offset)] pb-10 sm:pb-16 flex items-center">
        <div className="mx-auto max-w-7xl px-3.5 sm:px-5 w-full grid lg:grid-cols-12 gap-6 sm:gap-12 items-center relative z-10">
          {/* Left Text Column */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <span className="inline-flex flex-wrap items-center justify-start gap-2 bg-orange/10 border border-orange/20 text-orange px-3.5 py-2 rounded-xl sm:rounded-full text-[11px] sm:text-xs font-medium tracking-wide sm:tracking-wider uppercase mb-4 sm:mb-6 self-start max-w-full text-left leading-snug">
              <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 shrink-0 rounded-full bg-orange animate-pulse" />
              {pickPage(home, lang, "heroBadge", "heroBadgeHi")}
            </span>

            <h1 className="font-display text-[1.625rem] leading-[1.25] sm:text-4xl sm:leading-[1.12] md:text-5xl lg:text-6xl xl:text-7xl text-ink text-left text-balance">
              {pickPage(home, lang, "heroTitleLine1", "heroTitleLine1Hi")}{" "}
              <span className="text-gold-gradient">{pickPage(home, lang, "heroTitleHighlight", "heroTitleHighlightHi")}</span>
            </h1>

            <p className="mt-4 sm:mt-6 text-[0.9375rem] sm:text-lg text-ink font-normal max-w-none sm:max-w-xl leading-relaxed text-left">
              {site.intro || "Shreya Creations — Prayagraj ki fashion boutique aur training institute. Yahan bespoke stitching, bridal couture aur tailoring, embroidery, boutique set-up jaise kai job-oriented courses milte hain — rozgaar ke liye tayyar."}
            </p>

            <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-2.5 sm:gap-4 w-full sm:w-auto">
              <Link href="/courses" className="btn-gold btn-mobile rounded-full px-5 sm:px-8 py-3 sm:py-3.5 text-center w-full sm:w-auto">
                Explore Courses
              </Link>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-ghost btn-mobile rounded-full px-5 sm:px-8 py-3 sm:py-3.5 text-center w-full sm:w-auto">
                Custom Stitching Enquiry
              </a>
            </div>

            {/* Quick Metrics */}
            <div className="mt-8 sm:mt-12 grid grid-cols-3 gap-2 sm:gap-6 border-t border-ink/10 pt-5 sm:pt-8 max-w-lg w-full">
              {[1, 2, 3].map((n, i) => (
                <div key={n} className="text-left min-w-0">
                  <div className={`font-display text-xl sm:text-3xl font-semibold leading-none ${i === 0 ? "text-orange" : i === 1 ? "text-golden-dark" : "text-purple-dark"}`}>
                    {home[`stat${n}Value`] || ""}
                  </div>
                  <div className="text-[9px] sm:text-[11px] uppercase tracking-wide sm:tracking-wider text-ink mt-1 leading-tight">
                    {pickPage(home, lang, `stat${n}Label`, `stat${n}LabelHi`)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image/Collage Column */}
          <div className="lg:col-span-5 relative flex justify-center mt-4 lg:mt-0">
            <div className="relative w-full max-w-sm sm:max-w-md aspect-[4/5] rounded-2xl sm:rounded-[2rem] overflow-hidden glass border border-orange/20 shadow-2xl p-2 sm:p-3">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 pointer-events-none" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImage}
                alt="Shreya Atelier Design Studio"
                className="w-full h-full object-cover rounded-3xl"
              />

              <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 z-20 glass rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-purple/20 backdrop-blur-md flex items-center gap-2.5 sm:gap-3">
                <div className="h-10 w-10 rounded-full bg-purple/10 flex items-center justify-center text-purple">
                  🧵
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-purple font-semibold">
                    {pickPage(home, lang, "heroCardTitle", "heroCardTitleHi")}
                  </h4>
                  <p className="text-[11px] text-ink mt-0.5">{pickPage(home, lang, "heroCardText", "heroCardTextHi")}</p>
                </div>
              </div>
            </div>

            {/* Decorative Vector Shapes */}
            <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-orange/10 blur-xl -z-10" />
            <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-purple/10 blur-2xl -z-10" />
          </div>
        </div>
      </section>

      {/* ===== INFINITE TICKER MARQUEE ===== */}
      <section className="bg-gradient-to-r from-orange via-golden to-purple py-4 border-y border-ink/10 relative z-20">
        <div className="marquee-container">
          <div className="marquee-content font-display text-lg sm:text-xl text-white tracking-[0.15em] font-medium">
            {doublePhrases.map((phrase, i) => (
              <span key={i} className="flex items-center gap-4">
                <span>{phrase}</span>
                <span className="text-white/80">✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TRUST / METRICS WALL ===== */}
      <section className="section-muted py-12 sm:py-24 relative z-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-5 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {trust.map((t, i) => (
            <Glass3DCard key={i} layered className="rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-center">
              <Float3D translateZ="60">
                <div className="font-display text-3xl sm:text-4xl md:text-5xl text-gold-gradient font-bold">{t.value}</div>
              </Float3D>
              <Float3D translateZ="35" className="mt-2">
                <div className="text-xs uppercase tracking-[0.2em] text-ink">{t.label}</div>
              </Float3D>
            </Glass3DCard>
          ))}
        </div>
      </section>

      {/* ===== COUTURE ATELIER BRAND INTRO ===== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-5 py-10 sm:py-12 grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">
        <div className="text-center lg:text-left">
          <span className="text-orange uppercase tracking-[0.25em] text-xs font-semibold">
            {pickPage(home, lang, "atelierEyebrow", "atelierEyebrowHi")}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-ink mt-3 leading-tight">
            {pickPage(home, lang, "atelierTitle", "atelierTitleHi")}
          </h2>
          <p className="mt-5 text-sm sm:text-base text-ink font-normal leading-relaxed">
            {pickPage(home, lang, "atelierBody", "atelierBodyHi")}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center sm:items-center justify-center lg:justify-start gap-4 sm:gap-6">
            <Link href="/about" className="btn-ghost rounded-full px-6 py-3 w-full sm:w-auto text-center">
              Our Story
            </Link>
            <Link href="/portfolio" className="text-orange hover:text-orange-dark font-medium tracking-wide flex items-center gap-1.5 transition-colors">
              See Portfolio work →
            </Link>
          </div>
        </div>

        {/* 2D Graphic Collage in place of 3D Gem */}
        <div className="relative aspect-[4/3] sm:aspect-[1.3] w-full glass rounded-2xl sm:rounded-3xl overflow-hidden p-2 sm:p-3 border border-orange/25">
          <div className="absolute inset-0 bg-gradient-to-tr from-black/25 to-transparent z-10" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={atelierImage}
            alt="Atelier embroidery details"
            className="w-full h-full object-cover rounded-2xl"
          />
          {/* Floating graphic overlay with stats */}
          <div className="absolute top-6 left-6 z-20 glass rounded-2xl px-4 py-2 border border-orange/20 backdrop-blur-md">
            <span className="text-[10px] text-orange font-semibold tracking-widest uppercase">Traditional Craft</span>
          </div>
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20 glass rounded-2xl p-3 sm:p-4 border border-purple/20 backdrop-blur-md max-w-[calc(100%-2rem)] sm:max-w-[240px]">
            <p className="text-xs text-ink font-normal leading-relaxed">
              {pickPage(home, lang, "atelierQuote", "atelierQuoteHi")}
            </p>
          </div>
        </div>
      </section>

      {/* ===== OFFLINE ACADEMY SHOWCASE ===== */}
      <section className="section-muted py-12 sm:py-24 relative z-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-5">
        <div className="text-center mb-10 sm:mb-14 reveal px-1">
          <span className="inline-flex items-center gap-2 bg-orange/10 border border-orange/20 text-orange px-4 py-1.5 rounded-full text-xs font-medium tracking-[0.2em] uppercase mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-orange animate-pulse" />
            {pickPage(home, lang, "academyBadge", "academyBadgeHi")}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-ink leading-tight">
            {pickPage(home, lang, "academyHeading", "academyHeadingHi")}{" "}
            <span className="text-gold-gradient">{pickPage(home, lang, "academyHeadingHighlight", "academyHeadingHighlightHi")}</span>
          </h2>
          <p className="mt-4 text-ink font-normal max-w-2xl mx-auto text-sm leading-relaxed">
            {pickPage(home, lang, "academySubheading", "academySubheadingHi")}
          </p>
          <div className="hairline max-w-xs mx-auto mt-8" />
        </div>

        <Glass3DCard
          layered
          className="reveal rounded-2xl sm:rounded-[2rem] p-4 sm:p-10 lg:p-12 border-orange/25 overflow-hidden relative"
        >
          <div className="absolute -top-20 -right-16 h-56 w-56 rounded-full bg-orange/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-12 h-48 w-48 rounded-full bg-purple/10 blur-3xl pointer-events-none" />

          <div className="relative z-[2] grid lg:grid-cols-2 gap-10 lg:gap-14 items-stretch">
            {/* Left — studio details */}
            <Float3D translateZ="50" className="w-full">
              <div className="flex flex-col h-full">
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-purple-dark font-semibold bg-purple/10 border border-purple/25 px-3 py-1 rounded-full">
                    <span aria-hidden>📍</span>
                    {academyDetails.location}
                  </span>
                  <span className="text-[11px] uppercase tracking-widest text-ink font-medium">
                    Practice at Studio
                  </span>
                </div>

                <h3 className="font-display text-3xl sm:text-4xl text-ink leading-[1.1]">
                  {academyDetails.title}{" "}
                  <span className="text-gold-gradient">{academyDetails.titleAccent}</span>
                </h3>
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

            {/* Right — visual + CTA */}
            <Float3D translateZ="70" className="w-full">
              <div className="flex flex-col h-full gap-5">
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden glass border border-orange/20">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent z-10" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={heroImage}
                    alt="Shreya Creations offline stitching academy studio"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center gap-3 glass rounded-xl px-4 py-3 border border-purple/20">
                    <span className="grid place-items-center h-9 w-9 rounded-full bg-purple/20 text-lg shrink-0">🪡</span>
                    <p className="text-[11px] text-ink font-normal leading-relaxed">
                      Live boutique environment — learn on the same machines used for client orders.
                    </p>
                  </div>
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
        </div>
      </section>

      {/* ===== INTERACTIVE BESPOKE STITCHING STEPPER ===== */}
      <section className="mx-auto max-w-6xl px-4 sm:px-5 py-12 sm:py-16 relative z-20">
        <div className="text-center mb-8 sm:mb-12 px-1">
          <span className="text-orange uppercase tracking-[0.25em] text-xs font-semibold">Tailoring Flow</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-ink mt-2">Bespoke Stitching Process</h2>
          <p className="mt-3 text-ink font-normal max-w-md mx-auto text-sm">
            We handle everything from designs to sizing via WhatsApp chat. Click a step to see how it works:
          </p>
        </div>

        {/* Stepper Timeline Header */}
        <div className="relative flex flex-col md:flex-row justify-between gap-4 sm:gap-6 md:gap-4 mb-8 sm:mb-10 max-w-4xl mx-auto">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-7 left-[8%] right-[8%] hairline -z-10" />
          
          {processSteps.map((s, i) => {
            const active = activeStep === i;
            return (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                className="flex md:flex-col items-center gap-3 sm:gap-4 md:gap-3 flex-1 text-left md:text-center group focus:outline-none min-w-0"
              >
                <div
                  className={`grid place-items-center h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-full font-display text-xl sm:text-2xl relative z-10 transition-all duration-300 border ${
                    active
                      ? "bg-orange border-orange-light text-cream shadow-[0_0_15px_rgba(230,92,0,0.45)]"
                      : "bg-white border-orange/20 text-ink group-hover:border-orange/50 group-hover:text-ink"
                  }`}
                >
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1 md:flex-none">
                  <h3 className={`font-display text-lg sm:text-xl transition-colors duration-300 ${active ? "text-orange" : "text-ink group-hover:text-ink"}`}>
                    {s.step}
                  </h3>
                  <span className="block md:hidden text-xs text-ink font-normal mt-0.5 line-clamp-2">{s.text}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Stepper Content Card */}
        <Glass3DCard
          layered
          className="rounded-2xl sm:rounded-3xl p-5 sm:p-8 max-w-3xl mx-auto border-orange/20 bg-cream/40 text-center animate-fadeUp"
          containerClassName="max-w-3xl mx-auto w-full"
        >
          <Float3D translateZ="40">
            <span className="text-[10px] uppercase tracking-widest text-orange font-semibold">Step {activeStep + 1}</span>
            <h4 className="font-display text-2xl sm:text-3xl text-ink mt-2">{processSteps[activeStep].step}</h4>
          </Float3D>
          <Float3D translateZ="55" className="mt-3">
            <p className="text-ink font-normal text-sm max-w-lg mx-auto leading-relaxed">
              {processSteps[activeStep].text}
            </p>
          </Float3D>
          <Float3D translateZ="35" className="mt-6">
            <a
              href={waLink(site.whatsapp, `Hello! I would like to consult about stitching a custom garment. I'm currently at Step ${activeStep + 1}: ${processSteps[activeStep].step}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold rounded-full px-6 py-2.5 inline-block text-xs font-semibold"
            >
              Consult on WhatsApp
            </a>
          </Float3D>
        </Glass3DCard>
      </section>

      {/* ===== SERVICES / EXPERTISE ===== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-5 py-10 sm:py-12">
        <div className="text-center mb-8 sm:mb-12 px-1">
          <span className="text-orange uppercase tracking-[0.25em] text-xs font-semibold">Expertise Area</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-ink mt-2">Services Tailored for You</h2>
        </div>
        <Services items={services} />
      </section>

      {/* ===== FEATURED PIECES (SHOP) ===== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-5 py-10 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-10 text-center sm:text-left">
          <div>
            <span className="text-orange uppercase tracking-[0.25em] text-xs font-semibold">The Shop</span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-ink mt-2">Featured Couture</h2>
          </div>
          <Link href="/shop" className="text-orange hover:text-orange-dark hover:underline font-medium tracking-wide text-sm shrink-0">
            View all shop items →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {products.slice(0, 3).map((p) => (
            <div key={p.id} className="reveal"><ProductCard product={p} /></div>
          ))}
        </div>
      </section>

      {/* ===== COUTURE ACADEMY COURSES ===== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-5 py-12 sm:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-10 text-center sm:text-left">
          <div>
            <span className="text-orange uppercase tracking-[0.25em] text-xs font-semibold">Learn Stitching</span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-ink mt-2">Featured Courses</h2>
          </div>
          <Link href="/courses" className="text-orange hover:text-orange-dark hover:underline font-medium tracking-wide text-sm shrink-0">
            All design courses →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
          {courses.slice(0, 3).map((c) => (
            <div key={c.id} className="reveal"><CourseCard course={c} /></div>
          ))}
        </div>
      </section>

      {/* ===== PORTFOLIO EXHIBITION ===== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-5 py-12 sm:py-20">
        <div className="text-center mb-8 sm:mb-12 px-1">
          <span className="text-orange uppercase tracking-[0.25em] text-xs font-semibold">Lookbook Portfolio</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-ink mt-2">Exquisite Creations</h2>
        </div>
        <PortfolioGallery items={portfolio.slice(0, 8)} />
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-5 py-12 sm:py-20 overflow-hidden">
        <div className="text-center mb-8 sm:mb-12 px-1">
          <span className="text-orange uppercase tracking-[0.25em] text-xs font-semibold">Client Love</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-ink mt-2">Reviews from Students & Clients</h2>
        </div>
        <Testimonials items={testimonials} />
      </section>

      {/* ===== CTA GLASS BOARD ===== */}
      <PageCTA whatsapp={site.whatsapp} {...pageBottomCtaProps(home)} className="pt-12 pb-8 sm:pt-20 sm:pb-12" />
    </div>
  );
}
