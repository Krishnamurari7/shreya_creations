"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const CARDS = [
  {
    href: "/shop",
    label: "Shop",
    labelHi: "शॉप",
    sub: "Made-to-order couture",
    subHi: "ऑर्डर पर कउचर",
    icon: "🪡",
    theme: "orange",
  },
  {
    href: "/courses",
    label: "Courses",
    labelHi: "कोर्स",
    sub: "50+ fashion programs",
    subHi: "50+ फैशन प्रोग्राम",
    icon: "✂️",
    theme: "lavender",
  },
  {
    href: "/portfolio",
    label: "Portfolio",
    labelHi: "पोर्टफोलियो",
    sub: "Bridal & festive wear",
    subHi: "ब्राइडल और फेस्टिव",
    icon: "✨",
    theme: "purple",
  },
];

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function CategoryCards({ lang = "en" }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="page-container pb-10 sm:pb-14">
      <div className="text-center mb-6 sm:mb-10 reveal section-header-glass">
        <span className="section-eyebrow">
          <span className="sparkle-pulse text-gold text-[10px]" aria-hidden>✦</span>
          {lang === "hi" ? "त्वरित लिंक" : "Quick Explore"}
        </span>
        <h2 className="section-title mt-3 text-balance">
          {lang === "hi" ? "शुरू करें " : "Start with "}
          <span className="highlight-shimmer">{lang === "hi" ? "यहाँ से" : "Here"}</span>
        </h2>
        <div className="section-ornament mt-5 sm:mt-6" aria-hidden>
          <span className="text-gold text-xs">✦</span>
        </div>
      </div>

      <motion.div
        className="category-cards-grid"
        variants={reduceMotion ? undefined : container}
        initial={reduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
      >
        {CARDS.map((cat) => {
          const label = lang === "hi" ? cat.labelHi : cat.label;
          const sub = lang === "hi" ? cat.subHi : cat.sub;

          return (
            <motion.div key={cat.href} variants={reduceMotion ? undefined : item} className="h-full">
              <Link href={cat.href} className={`category-card category-card--${cat.theme} group`}>
                <span className="category-card__shine" aria-hidden />
                <span className="category-card__orb" aria-hidden />

                <span className="category-card__icon" aria-hidden>
                  {cat.icon}
                </span>

                <span className="category-card__body">
                  <span className="category-card__title font-display">{label}</span>
                  <span className="category-card__sub">{sub}</span>
                </span>

                <span className="category-card__arrow" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
