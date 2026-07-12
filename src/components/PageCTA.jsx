"use client";

import { PAGE_CONTAINER, REVEAL, SPARKLE_PULSE } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { waLink, greetingMessage } from "@/lib/whatsapp";
import { fadeUp } from "@/lib/motion";

const COPY = {
  en: {
    title: "Ready to start?",
    subtitle: "Chat with our boutique team on WhatsApp — custom stitching, course enrollment, or any question.",
    primary: "Chat on WhatsApp",
    secondary: "Contact us",
    reply: "Usually replies within minutes",
    perks: ["Designs", "Pricing", "Sizing", "Shipping"],
  },
  hi: {
    title: "शुरू करने के लिए तैयार?",
    subtitle: "WhatsApp पर हमारी टीम से बात करें — कस्टम सिलाई, कोर्स एनरोलमेंट या कोई भी सवाल।",
    primary: "WhatsApp पर चैट करें",
    secondary: "संपर्क करें",
    reply: "आमतौर पर कुछ मिनटों में जवाब",
    perks: ["डिज़ाइन", "कीमत", "माप", "शिपिंग"],
  },
};

export default function PageCTA({
  whatsapp,
  title,
  titleHi,
  titleHighlight,
  titleHighlightHi,
  subtitle,
  subtitleHi,
  primaryLabel,
  primaryLabelHi,
  secondaryHref = "/contact",
  secondaryLabel,
  secondaryLabelHi,
  waMessage,
  className = "",
}) {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const t = COPY[lang] || COPY.en;

  const heading = lang === "hi" && titleHi ? titleHi : title || t.title;
  const highlight = lang === "hi" && titleHighlightHi ? titleHighlightHi : titleHighlight;
  const body = lang === "hi" && subtitleHi ? subtitleHi : subtitle || t.subtitle;
  const primary = lang === "hi" && primaryLabelHi ? primaryLabelHi : primaryLabel || t.primary;
  const secondary = lang === "hi" && secondaryLabelHi ? secondaryLabelHi : secondaryLabel || t.secondary;
  const wa = waLink(whatsapp, waMessage || greetingMessage(lang));

  const eyebrow = lang === "hi" ? "बुटीक परामर्श" : "Boutique Consultation";

  const perks = t.perks;

  return (
    <section className={`page-cta-wrap ${PAGE_CONTAINER} max-w-5xl relative z-20 ${className}`}>
      <motion.div
        className={cn(REVEAL, "page-cta")}
        initial={reduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        custom={0}
        variants={fadeUp}
      >
        <div className="page-cta__deco" aria-hidden>
          <div className="page-cta__orb page-cta__orb--tl" />
          <div className="page-cta__orb page-cta__orb--center" />
          <div className="page-cta__orb page-cta__orb--br" />
          <div className="page-cta__mesh" />
          <div className="page-cta__grain" />
          <span className="page-cta__spark page-cta__spark--1">✦</span>
          <span className="page-cta__spark page-cta__spark--2">✦</span>
          <span className="page-cta__spark page-cta__spark--3">✦</span>
          <span className="page-cta__corner page-cta__corner--tl" />
          <span className="page-cta__corner page-cta__corner--tr" />
          <span className="page-cta__corner page-cta__corner--bl" />
          <span className="page-cta__corner page-cta__corner--br" />
        </div>

        <div className="page-cta__frame">
          <div className="page-cta__inner">
            <span className="page-cta__eyebrow">
              <span className="page-cta__eyebrow-dot" aria-hidden />
              <span className={cn(SPARKLE_PULSE, "page-cta__eyebrow-gem")} aria-hidden>
                ✦
              </span>
              {eyebrow}
            </span>

            <h2 className="page-cta__title text-balance">
              {heading}
              {highlight ? (
                <>
                  {" "}
                  <span className="page-cta__title-accent">{highlight}</span>
                </>
              ) : null}
            </h2>

            <div className="page-cta__ornament" aria-hidden>
              <span />
              <span className={cn(SPARKLE_PULSE, "page-cta__ornament-gem")}>✦</span>
              <span />
            </div>

            <p className="page-cta__subtitle text-pretty">{body}</p>

            <ul className="page-cta__perks" aria-label={lang === "hi" ? "हम क्या मदद करते हैं" : "What we help with"}>
              {perks.map((perk) => (
                <li key={perk} className="page-cta__perk">
                  <span className="page-cta__perk-dot" aria-hidden />
                  {perk}
                </li>
              ))}
            </ul>

            <p className="page-cta__reply">
              <span className="page-cta__reply-dot" aria-hidden />
              {t.reply}
            </p>

            <div className="page-cta__actions">
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="page-cta__btn page-cta__btn--primary"
              >
                <span className="page-cta__btn-shine" aria-hidden />
                <span className="page-cta__btn-icon" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </span>
                <span className="page-cta__btn-label">{primary}</span>
              </a>
              {secondaryHref && (
                <Link href={secondaryHref} className="page-cta__btn page-cta__btn--ghost">
                  <span className="page-cta__btn-label">{secondary}</span>
                  <span className="page-cta__btn-arrow" aria-hidden>
                    →
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
