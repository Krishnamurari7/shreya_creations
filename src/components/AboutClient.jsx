"use client";

import { useEffect, useRef } from "react";
import {
  PAGE_CONTAINER,
  SECTION_EYEBROW,
  SPARKLE_PULSE,
} from "@/lib/ui";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import CardImage from "@/components/CardImage";
import AmbientGlows from "@/components/AmbientGlows";
import { useLanguage } from "@/components/LanguageProvider";
import { pickLocalized } from "@/lib/i18n";
import { pickPage } from "@/lib/cms";
import { SITE_STATS } from "@/lib/seed";
import {
  DEFAULT_OUTFITS_DELIVERED,
  DEFAULT_STUDENTS_TAUGHT,
} from "@/lib/site-config";

const EASE = [0.16, 1, 0.3, 1];

const STORY_ICONS = {
  people: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.2 19c0-3.1 2.6-5.3 5.8-5.3s5.8 2.2 5.8 5.3" />
      <path d="M16.4 5.4a3.2 3.2 0 010 6" />
      <path d="M17.5 13.8c2.3.5 3.7 2.3 3.7 4.9" />
    </>
  ),
  dress: (
    <>
      <path d="M9.5 3.2l2.5 2 2.5-2" />
      <path d="M9.5 3.2l-1 4.3L12 9.8l3.5-2.3L14.5 3.2" />
      <path d="M8.5 7.5L5.6 20.5h12.8L15.5 7.5" />
    </>
  ),
  cap: (
    <>
      <path d="M12 4.5L2.8 9.2 12 13.8l9.2-4.6z" />
      <path d="M6.6 11.3v4.7c0 1.35 2.4 2.6 5.4 2.6s5.4-1.25 5.4-2.6v-4.7" />
    </>
  ),
};

const SERVICE_ICONS = {
  star: (
    <path d="M12 3.2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.6l-4.8 2.5.9-5.4-3.9-3.8 5.4-.8z" />
  ),
  dress: STORY_ICONS.dress,
  sew: (
    <>
      <rect x="4" y="10" width="16" height="8" rx="1.5" />
      <path d="M7 10V8.2a2 2 0 012-2h0a2 2 0 012 2V10" />
      <circle cx="16.5" cy="14" r="1.4" />
      <path d="M4 14h7" />
    </>
  ),
  fabric: (
    <>
      <path d="M7 5c3.5 0 3.5 3 7 3s3.5-3 7-3v14c-3.5 0-3.5-3-7-3s-3.5 3-7 3z" />
      <path d="M7 9c3.5 0 3.5 3 7 3s3.5-3 7-3M7 13c3.5 0 3.5 3 7 3s3.5-3 7-3" />
    </>
  ),
  floral: (
    <>
      <circle cx="12" cy="12" r="2.2" />
      <path d="M12 4.5c1.8 2.2 2.6 4.2 2.6 5.8A2.6 2.6 0 0112 13a2.6 2.6 0 01-2.6-2.7C9.4 8.7 10.2 6.7 12 4.5z" />
      <path d="M19.5 12c-2.2 1.8-4.2 2.6-5.8 2.6A2.6 2.6 0 0111 12a2.6 2.6 0 012.7-2.6c1.6 0 3.6.8 5.8 2.6z" />
      <path d="M12 19.5c-1.8-2.2-2.6-4.2-2.6-5.8A2.6 2.6 0 0112 11a2.6 2.6 0 012.6 2.7c0 1.6-.8 3.6-2.6 5.8z" />
      <path d="M4.5 12c2.2-1.8 4.2-2.6 5.8-2.6A2.6 2.6 0 0113 12a2.6 2.6 0 01-2.7 2.6C8.7 14.6 6.7 13.8 4.5 12z" />
    </>
  ),
  cap: STORY_ICONS.cap,
  truck: (
    <>
      <path d="M3 7.5h11v8H3z" />
      <path d="M14 10.5h4.2l2.3 3v2H14z" />
      <circle cx="7" cy="17.5" r="1.6" />
      <circle cx="17" cy="17.5" r="1.6" />
      <circle cx="18.2" cy="7.2" r="2.4" />
      <path d="M18.2 6v1.8M17.2 7.2h2" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.4 2.5 3.6 5.4 3.6 8.5s-1.2 6-3.6 8.5c-2.4-2.5-3.6-5.4-3.6-8.5s1.2-6 3.6-8.5z" />
    </>
  ),
};

function GoldIcon({ children, className }) {
  return (
    <svg
      className={cn("about-gold-icon", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

/** Gold icon that springs in when it scrolls into view. */
function RevealIcon({ children, className, delay = 0 }) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <GoldIcon className={className}>{children}</GoldIcon>;

  return (
    <motion.svg
      className={cn("about-gold-icon", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ opacity: 0, scale: 0.5, rotate: -18 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay, type: "spring", stiffness: 260, damping: 15 }}
      aria-hidden
    >
      {children}
    </motion.svg>
  );
}

/** Animated counter that runs once when scrolled into view. */
function CountUp({ value, prefix = "", suffix = "", duration = 1.7 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduceMotion = useReducedMotion();
  const count = useMotionValue(0);
  const display = useTransform(count, (v) => Math.round(v).toLocaleString("en-IN"));

  useEffect(() => {
    if (!inView) return undefined;
    if (reduceMotion) {
      count.set(value);
      return undefined;
    }
    const controls = animate(count, value, { duration, ease: EASE });
    return () => controls.stop();
  }, [inView, value, count, duration, reduceMotion]);

  return (
    <span ref={ref} className="about-v2-count">
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}

/** Title that reveals word by word. */
function WordReveal({ text, className, delay = 0 }) {
  const reduceMotion = useReducedMotion();
  const words = String(text).split(" ");

  if (reduceMotion) return <h1 className={className}>{text}</h1>;

  return (
    <motion.h1
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.055, delayChildren: delay } },
      }}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="about-v2-title__word">
          <motion.span
            className="about-v2-title__word-inner"
            variants={{
              hidden: { y: "110%", opacity: 0, rotate: 3 },
              visible: {
                y: "0%",
                opacity: 1,
                rotate: 0,
                transition: { duration: 0.85, ease: EASE },
              },
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.h1>
  );
}

export default function AboutClient({ site, aboutPage }) {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const about = aboutPage || site.pages?.about || {};
  const home = site.pages?.home || {};
  const hi = lang === "hi";

  const rootRef = useRef(null);
  const heroRef = useRef(null);

  const { scrollYProgress: pageProgress } = useScroll({ target: rootRef, offset: ["start start", "end end"] });
  const progressScale = useSpring(pageProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });
  const rawParallax = useTransform(heroProgress, [0, 1], [-26, 26]);
  const imageParallax = useSpring(rawParallax, { stiffness: 90, damping: 24 });
  const imageScale = useTransform(heroProgress, [0, 0.5, 1], [1.06, 1, 1.06]);

  const years = site.yearsExperience || Number(String(SITE_STATS.yearsEn).replace(/\D/g, "")) || 17;
  const founded = site.foundingYear || 2012;
  const students = site.studentsTaught || DEFAULT_STUDENTS_TAUGHT;
  const outfits = site.outfitsDelivered || DEFAULT_OUTFITS_DELIVERED;
  const hours = site.expressDeliveryHours || 24;
  const motto =
    pickLocalized(site, lang, "boutique", "boutiqueHi") ||
    (hi ? "कौशल से कारोबार तक" : "From Skill to Business");

  const storyEyebrow =
    pickPage(about, lang, "headerEyebrow", "headerEyebrowHi") || (hi ? "हमारी कहानी" : "Our Story");
  const pageTitle =
    pickPage(about, lang, "headerTitle", "headerTitleHi") ||
    (hi
      ? "श्रेया क्रिएशन बुटीक एंड इंस्टिट्यूट के बारे में"
      : "About Shreya Creation Boutique & Institute");
  const tagline = hi
    ? "डिज़ाइनर फैशन तैयार करना। महिलाओं को सशक्त बनाना। सफल व्यवसाय बनाना।"
    : "Crafting Designer Fashion. Empowering Women. Building Successful Businesses.";

  const storyBlocks = [
    {
      icon: "people",
      text: hi
        ? `श्रेया क्रिएशन की स्थापना ${founded} में संजय कुमार मिश्रा और श्रेया ने महिलाओं को सशक्त बनाने के विज़न के साथ की। हमारा मंत्र — “${motto}”.`
        : `Founded in ${founded} by Sanjay Kumar Mishra and Shreya, with a vision of empowering women through fashion and skill. Our motto — “${motto}”.`,
    },
    {
      icon: "dress",
      text: hi
        ? "बोरिंग रोड, पटना का भरोसेमंद बुटीक — डिज़ाइनर ब्लाउज़, ब्राइडल वियर, हाथ का काम (आरी/ज़री) और साड़ी रीडिज़ाइनिंग में विशेषज्ञ।"
        : "A trusted boutique on Boring Road, Patna — specializing in designer blouses, bridal wear, handwork (Aari/Zari), and saree redesigning.",
    },
    {
      icon: "cap",
      text: hi
        ? "फैशन डिज़ाइनिंग कोर्स, बुटीक मास्टर कोर्स और 100% प्रैक्टिकल लर्निंग के साथ तेज़ डिलीवरी — कौशल से व्यवसाय तक।"
        : "Fashion designing courses, boutique master course, and a commitment to practical learning with fast delivery — from skill to business.",
    },
  ];

  const stats = [
    {
      icon: "dress",
      value: outfits,
      suffix: "+",
      label: hi ? "डिज़ाइनर आउटफ़िट्स" : "Designer Outfits",
    },
    {
      icon: "cap",
      value: students,
      suffix: "+",
      label: hi ? "छात्र प्रशिक्षित" : "Students Trained",
    },
    {
      icon: "truck",
      value: hours,
      suffix: hi ? " घंटे" : " Hours",
      label: hi ? "एक्सप्रेस डिलीवरी" : "Express Delivery",
    },
  ];

  const services = [
    { icon: "star", label: hi ? `${years} वर्षों का भरोसा` : `${years} Years of Trust` },
    { icon: "dress", label: hi ? "बेस्ट डिज़ाइनर बुटीक" : "Best Designer Boutique" },
    { icon: "sew", label: hi ? "लेडीज़ टेलर" : "Ladies Tailor" },
    { icon: "fabric", label: hi ? "प्रीमियम फैब्रिक स्टोर" : "Premium Fabric Store" },
    { icon: "floral", label: hi ? "हैंडवर्क आरी | ज़री" : "Handwork Aari | Zari Work" },
    { icon: "cap", label: hi ? "फैशन डिज़ाइनिंग इंस्टिट्यूट" : "Fashion Designing Institute" },
    { icon: "truck", label: hi ? `एक्सप्रेस डिलीवरी ${hours} घंटे` : `Express Delivery ${hours} Hours` },
    { icon: "globe", label: hi ? "NRI क्लाइंट्स स्वागत" : "NRI Clients Welcome" },
  ];

  const ribbonItems = [
    hi ? "डिज़ाइनर बुटीक" : "Designer Boutique",
    hi ? "लेडीज़ टेलर" : "Ladies Tailor",
    hi ? "प्रीमियम फैब्रिक स्टोर" : "Premium Fabric Store",
    hi ? "फैशन डिज़ाइनिंग इंस्टिट्यूट" : "Fashion Designing Institute",
    hi ? "बुटीक मास्टर कोर्स" : "Boutique Master Course",
    hi ? "हैंडवर्क आरी | ज़री" : "Handwork Aari | Zari Work",
    hi ? "पुरानी साड़ी रीडिज़ाइनिंग" : "Old Saree Redesigning",
    hi ? "ब्राइडल ब्लाउज़ लहंगा" : "Bridal Blouse Lehenga",
    hi ? `${hours} घंटे एक्सप्रेस डिलीवरी` : `${hours} Hours Express Delivery`,
  ];

  const studioImage = about.heroImage || home.heroImage || "/botique.png";
  const foundersImage =
    about.foundersImage || home.founderImage || home.mentorImage || "/institute.png";

  const foundersTitle = hi ? "हमारे संस्थापक" : "Our Founders";
  const foundersNames = hi ? "संजय कुमार मिश्रा एवं श्रेया" : "Sanjay Kumar Mishra & Shreya";
  const foundersBlurb = hi
    ? "उनके विज़न और मिशन ने श्रेया क्रिएशन को पटना का भरोसेमंद फैशन बुटीक और इंस्टिट्यूट बनाया।"
    : "Their vision and mission built Shreya Creation into Patna's trusted fashion boutique and institute.";

  const rise = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 26, filter: "blur(6px)" },
    whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.75, delay, ease: EASE },
  });

  return (
    <div ref={rootRef} className="about-page about-page--v2 relative min-w-0 w-full">
      {!reduceMotion && (
        <motion.div
          className="about-v2-progress"
          style={{ scaleX: progressScale }}
          aria-hidden
        />
      )}

      {/* ——— Story hero ——— */}
      <section
        ref={heroRef}
        className={cn(
          PAGE_CONTAINER,
          "about-v2-hero",
          "max-w-6xl",
          "pt-[calc(var(--header-offset)+0.75rem)]",
          "sm:pt-[calc(var(--header-offset)+1.25rem)]",
          "pb-8",
          "sm:pb-10",
          "relative",
          "z-20",
          "min-w-0",
          "w-full"
        )}
      >
        <AmbientGlows variant="header" />

        <div className="grid lg:grid-cols-12 gap-7 sm:gap-9 lg:gap-12 items-start">
          <motion.div
            className="lg:col-span-5 relative min-w-0"
            initial={reduceMotion ? false : { opacity: 0, x: -32, filter: "blur(8px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, ease: EASE }}
            style={reduceMotion ? undefined : { y: imageParallax }}
          >
            <div className="about-v2-studio group">
              <motion.div
                className="about-v2-studio__inner"
                style={reduceMotion ? undefined : { scale: imageScale }}
              >
                <CardImage
                  src={studioImage}
                  alt={
                    hi
                      ? "श्रेया क्रिएशन स्टूडियो — पटना बुटीक इंटीरियर"
                      : "Shreya Creation studio — boutique interior in Patna"
                  }
                  ratio="4/5"
                  position="center"
                  className="about-v2-studio__media rounded-2xl sm:rounded-3xl"
                  loading="eager"
                />
              </motion.div>
              <span className="about-v2-studio__sheen" aria-hidden />
              <span className="about-v2-studio__frame" aria-hidden />

              <motion.div
                className="about-v2-badge"
                initial={reduceMotion ? false : { opacity: 0, scale: 0.7, rotate: -12 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, duration: 0.7, ease: EASE }}
                aria-label={`Since ${founded}`}
              >
                <span className="about-v2-badge__ring" aria-hidden />
                <span className="about-v2-badge__since">
                  {hi ? `${founded} से` : `Since ${founded}`}
                </span>
                <span className="about-v2-badge__value">{years}</span>
                <span className="about-v2-badge__years">
                  {hi ? "वर्षों का भरोसा" : "Years of Trust"}
                </span>
              </motion.div>

              {!reduceMotion && (
                <motion.span
                  className="about-v2-studio__chip"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75, duration: 0.6, ease: EASE }}
                >
                  <span className="about-v2-studio__chip-dot" aria-hidden />
                  {hi ? "बोरिंग रोड, पटना" : "Boring Road, Patna"}
                </motion.span>
              )}
            </div>
          </motion.div>

          <div className="lg:col-span-7 min-w-0 space-y-4 sm:space-y-5 text-center lg:text-left">
            <motion.span
              className={cn(SECTION_EYEBROW, "about-v2-eyebrow")}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <span className={cn(SPARKLE_PULSE, "text-gold", "text-[10px]")} aria-hidden>
                ✦
              </span>
              {storyEyebrow}
            </motion.span>

            <WordReveal text={pageTitle} className="about-v2-title" delay={0.12} />

            <motion.div
              className="about-v2-divider"
              initial={reduceMotion ? false : { scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.9, ease: EASE }}
              aria-hidden
            >
              <span>✦</span>
            </motion.div>

            <motion.p
              className="about-v2-tagline"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8, ease: EASE }}
            >
              {tagline}
            </motion.p>

            <div className="about-v2-story-list">
              {storyBlocks.map((block, i) => (
                <motion.div
                  key={block.icon}
                  className="about-v2-story-item"
                  initial={reduceMotion ? false : { opacity: 0, x: 26, filter: "blur(6px)" }}
                  whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: 0.15 + i * 0.14, duration: 0.75, ease: EASE }}
                >
                  <motion.span
                    className="about-v2-story-item__icon"
                    whileHover={reduceMotion ? undefined : { scale: 1.1, rotate: -6 }}
                    transition={{ type: "spring", stiffness: 320, damping: 16 }}
                  >
                    <RevealIcon delay={0.2 + i * 0.14}>{STORY_ICONS[block.icon]}</RevealIcon>
                  </motion.span>
                  <p className="about-v2-story-item__text">{block.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ——— Stats bar ——— */}
      <section className={cn(PAGE_CONTAINER, "about-v2-stats-wrap", "max-w-6xl", "relative", "z-20")}>
        <motion.div className="about-v2-stats" {...rise(0.05)}>
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="about-v2-stat"
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.12 + i * 0.12, duration: 0.6, ease: EASE }}
              whileHover={reduceMotion ? undefined : { y: -4 }}
            >
              <span className="about-v2-stat__icon">
                <RevealIcon delay={0.2 + i * 0.12}>{SERVICE_ICONS[stat.icon]}</RevealIcon>
              </span>
              <div className="min-w-0">
                <p className="about-v2-stat__value">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="about-v2-stat__label">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ——— Founders + services ——— */}
      <section
        className={cn(
          PAGE_CONTAINER,
          "about-v2-bottom",
          "max-w-6xl",
          "py-8",
          "sm:py-10",
          "lg:py-12",
          "relative",
          "z-20",
          "min-w-0"
        )}
      >
        <div className="grid lg:grid-cols-12 gap-7 sm:gap-9 lg:gap-10 items-start">
          <motion.div className="lg:col-span-5 min-w-0" {...rise(0.05)}>
            <span className={cn(SECTION_EYEBROW, "about-v2-eyebrow")}>
              <span className={cn(SPARKLE_PULSE, "text-gold", "text-[10px]")} aria-hidden>
                ✦
              </span>
              {foundersTitle}
            </span>
            <div className="about-v2-founders mt-3 sm:mt-4 group">
              <div className="about-v2-founders__frame">
                <CardImage
                  src={foundersImage}
                  alt={foundersNames}
                  ratio="4/3"
                  position="top"
                  className="about-v2-founders__media rounded-2xl"
                />
                <span className="about-v2-founders__sheen" aria-hidden />
              </div>
              <h2 className="about-v2-founders__names">{foundersNames}</h2>
              <p className="about-v2-founders__blurb">{foundersBlurb}</p>
              <motion.p
                className="about-v2-motto"
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.2, duration: 0.7, ease: EASE }}
              >
                “{motto}”
              </motion.p>
            </div>
          </motion.div>

          <div className="lg:col-span-7 min-w-0">
            <motion.div
              className="about-v2-services"
              initial={reduceMotion ? false : "hidden"}
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
            >
              {services.map((svc, i) => (
                <motion.div
                  key={svc.label}
                  className="about-v2-service"
                  variants={{
                    hidden: { opacity: 0, y: 26, scale: 0.94 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: { type: "spring", stiffness: 240, damping: 20 },
                    },
                  }}
                  whileHover={reduceMotion ? undefined : { y: -6, scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 320, damping: 18 }}
                >
                  <span className="about-v2-service__glow" aria-hidden />
                  <span className="about-v2-service__icon">
                    <RevealIcon delay={0.1 + i * 0.05}>{SERVICE_ICONS[svc.icon]}</RevealIcon>
                  </span>
                  <span className="about-v2-service__label">{svc.label}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div className="about-v2-ctas" {...rise(0.15)}>
              <Link href="/shop" className="about-v2-cta about-v2-cta--boutique">
                <span>{hi ? "बुटीक देखें" : "Explore Boutique"}</span>
                <span className="about-v2-cta__arrow" aria-hidden>
                  →
                </span>
              </Link>
              <Link href="/courses" className="about-v2-cta about-v2-cta--institute">
                <span>{hi ? "इंस्टिट्यूट देखें" : "Explore Institute"}</span>
                <span className="about-v2-cta__arrow" aria-hidden>
                  →
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ——— Service ribbon ——— */}
      <motion.section
        className="about-v2-ribbon"
        aria-label={hi ? "हमारी सेवाएँ" : "Our services"}
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <div className="about-v2-ribbon__track">
          {[...ribbonItems, ...ribbonItems].map((item, i) => (
            <span key={`${item}-${i}`} className="about-v2-ribbon__item">
              <GoldIcon className="about-v2-ribbon__icon">{SERVICE_ICONS.star}</GoldIcon>
              {item}
            </span>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
