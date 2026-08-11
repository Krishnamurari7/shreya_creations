"use client";

import {
  HIGHLIGHT_SHIMMER,
  HOME_BAND_WHITE,
  PAGE_CONTAINER,
  PAGE_SECTION,
  PAGE_SECTION_BORDERED,
  REVEAL,
  SECTION_EYEBROW,
  SECTION_HEADER_GLASS,
  SECTION_ORNAMENT,
  SECTION_TITLE,
  SPARKLE_PULSE,
} from "@/lib/ui";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import { normalizeJourneyCards, pickPage } from "@/lib/cms";
import OptimizedImage from "@/components/OptimizedImage";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

function CardBadgeIcon({ type }) {
  const props = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.75",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  switch (type) {
    case "sewing":
      return (
        <svg {...props}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M7 8h10M7 12h6" />
          <path d="M16 12l2 2-2 2" />
        </svg>
      );
    case "graduation":
      return (
        <svg {...props}>
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 1.1 2.7 2 6 2s6-.9 6-2v-5" />
        </svg>
      );
    case "community":
      return (
        <svg {...props}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    default:
      return null;
  }
}

function FeatureIcon({ type }) {
  const props = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.75",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  switch (type) {
    case "needle":
      return (
        <svg {...props}>
          <path d="m18 2 4 4-10 10-4 1 1-4L18 2z" />
          <path d="M14 6l4 4" />
        </svg>
      );
    case "blouse":
      return (
        <svg {...props}>
          <path d="M12 3 8 7v14h8V7l-4-4z" />
          <path d="M8 7h8" />
        </svg>
      );
    case "bridal":
      return (
        <svg {...props}>
          <path d="M12 21s-6-4.35-6-10a6 6 0 0 1 12 0c0 5.65-6 10-6 10z" />
        </svg>
      );
    case "lehenga":
      return (
        <svg {...props}>
          <path d="M12 3v18" />
          <path d="M6 8c2 2 4 2 6 0s4-2 6 0v13H6V8z" />
        </svg>
      );
    case "design":
      return (
        <svg {...props}>
          <path d="M12 2v6" />
          <circle cx="12" cy="10" r="3" />
          <path d="M8 21h8M10 13v8M14 13v8" />
        </svg>
      );
    case "business":
      return (
        <svg {...props}>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <path d="M9 22V12h6v10" />
        </svg>
      );
    case "tailoring":
      return (
        <svg {...props}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M8 9h8M8 13h5" />
        </svg>
      );
    case "courses":
      return (
        <svg {...props}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      );
    case "mission":
      return (
        <svg {...props}>
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      );
    case "skill":
      return (
        <svg {...props}>
          <path d="M3 3v18h18" />
          <path d="M7 16l4-4 4 4 5-6" />
        </svg>
      );
    case "women":
      return (
        <svg {...props}>
          <circle cx="12" cy="8" r="4" />
          <path d="M12 12v9" />
          <path d="M8 17h8" />
        </svg>
      );
    case "apply":
      return (
        <svg {...props}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M8 12l2.5 2.5L16 9" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}

function journeyCardAlt(key, lang) {
  const hi = lang === "hi";
  if (key === "boutique") {
    return hi
      ? "पटना में श्रेया क्रिएशन बुटीक — कस्टम सिलाई और ब्राइडल वियर"
      : "Shreya Creation boutique in Patna — custom stitching and bridal wear";
  }
  if (key === "institute") {
    return hi
      ? "पटना में श्रेया क्रिएशन फैशन डिज़ाइनिंग इंस्टिट्यूट"
      : "Shreya Creation fashion designing institute in Patna";
  }
  if (key === "shakti") {
    return hi
      ? "शक्ति 50 — पटना में महिलाओं के लिए कौशल प्रशिक्षण"
      : "Shakti 50 skill training for women at Shreya Creation, Patna";
  }
  return hi ? "श्रेया क्रिएशन" : "Shreya Creation";
}

function JourneyCard({ card, lang }) {
  const title = lang === "hi" && card.titleHi ? card.titleHi : card.title;
  const label = lang === "hi" && card.ctaHi ? card.ctaHi : card.cta;

  return (
    <article className={cn("start-journey-card", `start-journey-card--${card.theme}`)}>
      <div className="start-journey-card__top">
        <div className="start-journey-card__visual relative">
          <OptimizedImage
            src={card.image}
            alt={journeyCardAlt(card.key, lang)}
            fill
            sizes="(max-width: 640px) 85vw, 320px"
            loading="lazy"
            className="start-journey-card__image object-cover"
          />
        </div>
        <span className="start-journey-card__badge" aria-hidden>
          <CardBadgeIcon type={card.icon} />
        </span>
      </div>

      <div className="start-journey-card__body">
        <h3 className="start-journey-card__title">{title}</h3>

        <ul className="start-journey-card__features">
          {card.features.map((feature) => (
            <li key={`${feature.icon}-${feature.label}`} className="start-journey-card__feature">
              <span className="start-journey-card__feature-icon" aria-hidden>
                <FeatureIcon type={feature.icon} />
              </span>
              <span className="min-w-0 break-words">
                {lang === "hi" && feature.labelHi ? feature.labelHi : feature.label}
              </span>
            </li>
          ))}
        </ul>

        <Link href={card.href} className="start-journey-card__cta">
          {label}
          <span aria-hidden>→</span>
        </Link>
      </div>
    </article>
  );
}

/** Homepage “Start Your Journey” hub — Boutique, Institute & Shakti 50 cards (CMS-driven). */
export default function StartJourneySection({ lang = "en", home = {} }) {
  const reduceMotion = useReducedMotion();
  const cards = useMemo(() => normalizeJourneyCards(home.journeyCards), [home.journeyCards]);

  const eyebrow = pickPage(home, lang, "journeyEyebrow", "journeyEyebrowHi");
  const titleMain = pickPage(home, lang, "journeyTitle", "journeyTitleHi");
  const titleHighlight = pickPage(home, lang, "journeyTitleHighlight", "journeyTitleHighlightHi");
  const titleTail = pickPage(home, lang, "journeyTitleTail", "journeyTitleTailHi");

  if (!cards.length) return null;

  return (
    <section
      className={cn(
        HOME_BAND_WHITE,
        PAGE_CONTAINER,
        PAGE_SECTION,
        PAGE_SECTION_BORDERED,
        "start-journey"
      )}
    >
      <div className={cn(REVEAL, SECTION_HEADER_GLASS, "text-center", "mb-5", "sm:mb-8")}>
        <span className={SECTION_EYEBROW}>
          <span className={cn(SPARKLE_PULSE, "text-gold", "text-[10px]")} aria-hidden>
            ✦
          </span>
          {eyebrow}
        </span>
        <h2 className={cn(SECTION_TITLE, "mt-2", "text-balance")}>
          {titleMain}{" "}
          <span className={HIGHLIGHT_SHIMMER}>{titleHighlight}</span>
          {titleTail}
        </h2>
        <div className={cn(SECTION_ORNAMENT, "mt-3", "sm:mt-4")} aria-hidden>
          <span className="text-gold text-xs">✦</span>
        </div>
      </div>

      <motion.div
        className="start-journey__grid"
        variants={reduceMotion ? undefined : container}
        initial={reduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
      >
        {cards.map((card) => (
          <motion.div key={card.key} variants={reduceMotion ? undefined : item}>
            <JourneyCard card={card} lang={lang} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
