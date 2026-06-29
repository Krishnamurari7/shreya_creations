"use client";

import { HIGHLIGHT_SHIMMER, HOME_BAND_WHITE, PAGE_CONTAINER, PAGE_SECTION, PAGE_SECTION_BORDERED, PAGE_SECTION_TIGHT_TOP, REVEAL, SECTION_EYEBROW, SECTION_HEADER_GLASS, SECTION_ORNAMENT, SECTION_TITLE, SPARKLE_PULSE } from "@/lib/ui";
import { cn } from "@/lib/utils";
import Link from "next/link";
import CardImage from "@/components/CardImage";
import { motion, useReducedMotion } from "framer-motion";

import { SITE_STATS } from "@/lib/seed";

const CARDS = [
  {
    href: "/about",
    label: "Our Studio",
    labelHi: "हमारा स्टूडियो",
    sub: `Patna · ${SITE_STATS.yearsEn}`,
    subHi: `पटना · ${SITE_STATS.yearsHi}`,
    image: "/slider4.png",
  },
  {
    href: "/shop",
    label: "Shop",
    labelHi: "शॉप",
    sub: "Made-to-order couture",
    subHi: "ऑर्डर पर कउचर",
    image: "/slider2.png",
  },
  {
    href: "/courses",
    label: "Courses",
    labelHi: "कोर्स",
    sub: "10 Professional Courses",
    subHi: "10 प्रोफेशनल कोर्स",
    image: "/slider3.png",
  },
  {
    href: "/portfolio",
    label: "Portfolio",
    labelHi: "पोर्टफोलियो",
    sub: "Bridal & festive wear",
    subHi: "ब्राइडल और फेस्टिव",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
  },
];

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.04 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

function LinkCard({ card, lang }) {
  const label = lang === "hi" ? card.labelHi : card.label;
  const sub = lang === "hi" ? card.subHi : card.sub;

  return (
    <Link href={card.href} className="quick-explore-card group">
      <div className="quick-explore-card__copy">
        <span className="quick-explore-card__title font-display">{label}</span>
        <span className="quick-explore-card__sub">{sub}</span>
        <span className="quick-explore-card__arrow" aria-hidden>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
      <div className="quick-explore-card__media" aria-hidden>
        <CardImage src={card.image} alt="" ratio="fill" position="top" />
      </div>
    </Link>
  );
}

export default function CategoryCards({ lang = "en" }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className={cn(HOME_BAND_WHITE, PAGE_CONTAINER, PAGE_SECTION, PAGE_SECTION_BORDERED, PAGE_SECTION_TIGHT_TOP, "quick-explore")}>
      <div className={cn(REVEAL, SECTION_HEADER_GLASS, "text-center", "mb-4", "sm:mb-5")}>
        <span className={SECTION_EYEBROW}>
          <span className={cn(SPARKLE_PULSE, "text-gold", "text-[10px]")} aria-hidden>✦</span>
          {lang === "hi" ? "त्वरित लिंक" : "Quick Explore"}
        </span>
        <h2 className={cn(SECTION_TITLE, "mt-2", "text-balance")}>
          {lang === "hi" ? "शुरू करें " : "Start with "}
          <span className={HIGHLIGHT_SHIMMER}>{lang === "hi" ? "यहाँ से" : "Here"}</span>
        </h2>
        <div className={cn(SECTION_ORNAMENT, "mt-3", "sm:mt-4")} aria-hidden>
          <span className="text-gold text-xs">✦</span>
        </div>
      </div>

      <motion.div
        className="quick-explore__grid"
        variants={reduceMotion ? undefined : container}
        initial={reduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
      >
        {CARDS.map((card) => (
          <motion.div
            key={card.href}
            variants={reduceMotion ? undefined : item}
            className="quick-explore__cell"
          >
            <LinkCard card={card} lang={lang} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
