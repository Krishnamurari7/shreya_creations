"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";

const CATEGORIES = [
  { href: "/courses", icon: "🌸", label: "Fashion Designing", labelHi: "फैशन डिज़ाइनिंग", theme: "rose" },
  { href: "/courses", icon: "👗", label: "Stitching", labelHi: "सिलाई", theme: "orange" },
  { href: "/shop", icon: "🪡", label: "Bridal Wear", labelHi: "ब्राइडल वियर", theme: "gold" },
  { href: "/courses", icon: "💡", label: "Art & Craft", labelHi: "आर्ट एंड क्राफ्ट", theme: "lavender" },
  { href: "/shop", icon: "💅", label: "Beauty", labelHi: "ब्यूटी", theme: "coral" },
  { href: "/shop", icon: "👚", label: "Ethnic Wear", labelHi: "एथनिक वियर", theme: "peach" },
  { href: "/shop", icon: "🧵", label: "Fabric & Fusing", labelHi: "फैब्रिक और फ्यूज़िंग", theme: "mint" },
  { href: "/courses", icon: "✂️", label: "Sewing Accessories", labelHi: "सिलाई एक्सेसरीज़", theme: "wine" },
];

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
};

const item = {
  hidden: { opacity: 0, y: 18, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function PopularCategories({ className = "", compact = false }) {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const title = lang === "hi" ? "लोकप्रिय श्रेणियाँ" : "Popular Categories";
  const heading =
    lang === "hi" ? (
      <>
        अपनी{" "}
        <span className="highlight-shimmer">पसंदीदा श्रेणी</span> चुनें
      </>
    ) : (
      <>
        Explore by{" "}
        <span className="highlight-shimmer">Specialty</span>
      </>
    );
  const subtitle =
    lang === "hi"
      ? "फैशन, सिलाई, ब्यूटी और क्राफ्ट — सब कुछ एक जगह"
      : "Fashion, stitching, beauty & craft — all in one place";

  if (compact) {
    return (
      <div className={`popular-categories popular-categories--compact ${className}`.trim()}>
        <h3 className="popular-categories__title">{title}</h3>
        <div className="popular-categories__grid popular-categories__grid--compact">
          {CATEGORIES.map((cat) => (
            <Link key={cat.label} href={cat.href} className="popular-cat-chip">
              <span className="popular-cat-chip__icon" aria-hidden>
                {cat.icon}
              </span>
              <span>{lang === "hi" ? cat.labelHi : cat.label}</span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`popular-categories popular-categories--featured ${className}`.trim()}>
      <div className="text-center mb-8 sm:mb-10 reveal section-header-glass">
        <span className="section-eyebrow">
          <span className="sparkle-pulse text-gold text-[10px]" aria-hidden>
            ✦
          </span>
          {title}
        </span>
        <h2 className="section-title mt-3 text-balance">{heading}</h2>
        <p className="mt-3 text-muted font-normal max-w-xl mx-auto text-sm sm:text-base leading-relaxed text-pretty">
          {subtitle}
        </p>
        <div className="section-ornament mt-5 sm:mt-6" aria-hidden>
          <span className="text-gold text-xs">✦</span>
        </div>
      </div>

      <motion.div
        className="popular-categories__grid popular-categories__grid--cards"
        variants={reduceMotion ? undefined : container}
        initial={reduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
      >
        {CATEGORIES.map((cat) => {
          const label = lang === "hi" ? cat.labelHi : cat.label;
          return (
            <motion.div key={cat.label} variants={reduceMotion ? undefined : item}>
              <Link
                href={cat.href}
                className={`popular-cat-card popular-cat-card--${cat.theme}`}
              >
                <span className="popular-cat-card__shine" aria-hidden />
                <span className="popular-cat-card__orb" aria-hidden />
                <span className="popular-cat-card__icon" aria-hidden>
                  {cat.icon}
                </span>
                <span className="popular-cat-card__body">
                  <span className="popular-cat-card__label">{label}</span>
                  <span className="popular-cat-card__arrow" aria-hidden>
                    →
                  </span>
                </span>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
