"use client";

import { PAGE_CONTAINER, PAGE_SECTION, REVEAL } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { waLink, greetingMessage } from "@/lib/whatsapp";
import { fadeUp } from "@/lib/motion";

/** Canonical studio-visit CTA copy — used site-wide unless a page overrides. */
export const STUDIO_CTA = {
  en: {
    eyebrow: "Visit Our Studio",
    title: "Want to visit our studio?",
    subtitle: "Book a private studio visit or start a custom stitching consultation on WhatsApp.",
    primary: "Chat on WhatsApp",
    secondary: "Contact us",
    reply: "Usually replies within minutes",
    perks: ["Studio tour", "Boutique consult", "Course guidance", "Free demo"],
  },
  hi: {
    eyebrow: "हमारा स्टूडियो देखें",
    title: "हमारा स्टूडियो देखना चाहते हैं?",
    subtitle: "प्राइवेट स्टूडियो विज़िट बुक करें या WhatsApp पर कस्टम सिलाई की सलाह लें।",
    primary: "WhatsApp पर चैट करें",
    secondary: "संपर्क करें",
    reply: "आमतौर पर कुछ मिनटों में जवाब",
    perks: ["स्टूडियो टूर", "बुटीक सलाह", "कोर्स गाइडेंस", "मुफ़्त डेमो"],
  },
};

function MannequinArt() {
  return (
    <svg className="page-cta__art page-cta__art--mannequin" viewBox="0 0 120 200" fill="none" aria-hidden>
      <ellipse cx="60" cy="22" rx="14" ry="16" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M46 38c4 6 10 8 14 8s10-2 14-8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path d="M60 46v18" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M38 68c0-4 8-8 22-8s22 4 22 8v8c0 4-6 10-22 10S38 80 38 76v-8z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path d="M42 84l-10 52c-1 6 2 12 10 14h36c8-2 11-8 10-14L78 84" stroke="currentColor" strokeWidth="1.2" />
      <path d="M48 150v28M72 150v28" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M40 178h24M56 178h24" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M50 100c4 8 16 8 20 0" stroke="currentColor" strokeWidth="1" opacity="0.7" />
    </svg>
  );
}

function PatternArt() {
  return (
    <svg className="page-cta__art page-cta__art--pattern" viewBox="0 0 140 180" fill="none" aria-hidden>
      <path
        d="M20 30c20-18 50-22 78-8 18 9 28 28 24 48-6 28-28 40-52 48-20 6-38 20-42 42"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeDasharray="3 4"
      />
      <path d="M36 48c14-8 34-10 52-2" stroke="currentColor" strokeWidth="1" />
      <path d="M30 72c18-6 40-4 58 8" stroke="currentColor" strokeWidth="1" />
      <path d="M28 98c16 2 34 10 46 24" stroke="currentColor" strokeWidth="1" />
      <circle cx="42" cy="56" r="2.2" fill="currentColor" />
      <circle cx="78" cy="64" r="2.2" fill="currentColor" />
      <circle cx="58" cy="92" r="2.2" fill="currentColor" />
      <path d="M88 118l28 36M96 112l32 20" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M20 140c22 8 48 18 70 12" stroke="currentColor" strokeWidth="1.1" strokeDasharray="2 3" />
    </svg>
  );
}

export default function PageCTA({
  whatsapp,
  title,
  titleHi,
  titleHighlight,
  titleHighlightHi,
  subtitle,
  subtitleHi,
  primaryHref,
  primaryLabel,
  primaryLabelHi,
  secondaryHref = "/contact",
  secondaryLabel,
  secondaryLabelHi,
  waMessage,
  waMessageHi,
  className = "",
  perks,
  perksHi,
  eyebrow: eyebrowProp,
  eyebrowHi,
  reply,
  replyHi,
}) {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const t = STUDIO_CTA[lang] || STUDIO_CTA.en;

  const heading = lang === "hi" && titleHi ? titleHi : title || t.title;
  const highlight = lang === "hi" && titleHighlightHi ? titleHighlightHi : titleHighlight;
  const body = lang === "hi" && subtitleHi ? subtitleHi : subtitle || t.subtitle;
  const primary = lang === "hi" && primaryLabelHi ? primaryLabelHi : primaryLabel || t.primary;
  const secondary = lang === "hi" && secondaryLabelHi ? secondaryLabelHi : secondaryLabel || t.secondary;
  const waText = lang === "hi" && waMessageHi ? waMessageHi : waMessage || greetingMessage(lang);
  const wa = waLink(whatsapp, waText);
  const replyText = (lang === "hi" && replyHi ? replyHi : reply) || t.reply;

  const eyebrow =
    (lang === "hi" && eyebrowHi ? eyebrowHi : eyebrowProp) || t.eyebrow;

  const perksList =
    (lang === "hi" && perksHi?.length ? perksHi : null) ||
    (perks?.length ? perks : null) ||
    t.perks;

  return (
    <section
      className={cn(
        "page-cta-wrap",
        PAGE_CONTAINER,
        PAGE_SECTION,
        "max-w-5xl",
        className
      )}
    >
      <motion.div
        className={cn(REVEAL, "page-cta")}
        initial={reduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        custom={0}
        variants={fadeUp}
      >
        <div className="page-cta__deco" aria-hidden>
          <div className="page-cta__silk page-cta__silk--left" />
          <div className="page-cta__silk page-cta__silk--right" />
          <MannequinArt />
          <PatternArt />
          <span className="page-cta__spark page-cta__spark--1">✦</span>
          <span className="page-cta__spark page-cta__spark--2">✦</span>
          <span className="page-cta__spark page-cta__spark--3">✦</span>
          <span className="page-cta__spark page-cta__spark--4">✦</span>
          <span className="page-cta__spark page-cta__spark--5">✦</span>
        </div>

        <div className="page-cta__inner">
          <span className="page-cta__eyebrow">
            <span className="page-cta__eyebrow-dot" aria-hidden />
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

          <p className="page-cta__subtitle text-pretty">{body}</p>

          <ul className="page-cta__perks" aria-label={lang === "hi" ? "हम क्या मदद करते हैं" : "What we help with"}>
            {perksList.map((perk) => (
              <li key={perk} className="page-cta__perk">
                <span className="page-cta__perk-gem" aria-hidden>
                  ✦
                </span>
                {perk}
              </li>
            ))}
          </ul>

          <p className="page-cta__reply">
            <span className="page-cta__reply-dot" aria-hidden />
            {replyText}
          </p>

          <div className="page-cta__actions">
            {primaryHref ? (
              <Link href={primaryHref} className="page-cta__btn page-cta__btn--primary">
                <span className="page-cta__btn-shine" aria-hidden />
                <span className="page-cta__btn-label">{primary}</span>
              </Link>
            ) : (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                data-track-cta="page_cta"
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
            )}
            {secondaryHref && (
              <Link href={secondaryHref} className="page-cta__btn page-cta__btn--secondary">
                <span className="page-cta__btn-label">{secondary}</span>
                <span className="page-cta__btn-arrow" aria-hidden>
                  →
                </span>
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
