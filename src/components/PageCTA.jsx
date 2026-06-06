"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { waLink, greetingMessage } from "@/lib/whatsapp";

const COPY = {
  en: {
    title: "Ready to start?",
    subtitle: "Chat with our boutique team on WhatsApp — custom stitching, course enrollment, or any question.",
    primary: "Chat on WhatsApp",
    secondary: "Contact us",
  },
  hi: {
    title: "शुरू करने के लिए तैयार?",
    subtitle: "WhatsApp पर हमारी टीम से बात करें — कस्टम सिलाई, कोर्स एनरोलमेंट या कोई भी सवाल।",
    primary: "WhatsApp पर चैट करें",
    secondary: "संपर्क करें",
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
  const t = COPY[lang] || COPY.en;

  const heading = lang === "hi" && titleHi ? titleHi : title || t.title;
  const highlight = lang === "hi" && titleHighlightHi ? titleHighlightHi : titleHighlight;
  const body = lang === "hi" && subtitleHi ? subtitleHi : subtitle || t.subtitle;
  const primary = lang === "hi" && primaryLabelHi ? primaryLabelHi : primaryLabel || t.primary;
  const secondary = lang === "hi" && secondaryLabelHi ? secondaryLabelHi : secondaryLabel || t.secondary;
  const wa = waLink(whatsapp, waMessage || greetingMessage());

  return (
    <section className={`page-container max-w-5xl pt-6 pb-10 sm:pt-10 sm:pb-14 relative z-20 ${className}`}>
      <div className="collection-banner rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-14 text-center reveal relative">
        <div className="absolute -top-10 left-1/4 h-32 w-32 rounded-full bg-orange/20 blur-3xl pointer-events-none" aria-hidden />
        <div className="absolute -bottom-8 right-1/4 h-28 w-28 rounded-full bg-lavender/15 blur-3xl pointer-events-none" aria-hidden />
        <div className="relative z-[1]">
        <h2 className="font-display text-2xl sm:text-4xl md:text-5xl text-white leading-tight text-balance">
          {heading}
          {highlight ? (
            <>
              {" "}
              <span className="text-orange">{highlight}</span>
            </>
          ) : null}
        </h2>
        <p className="text-white/80 font-normal max-w-md mx-auto text-sm leading-relaxed px-1 mt-4">{body}</p>
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center">
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold-outline rounded-md px-6 sm:px-9 py-3.5 sm:py-4 inline-block w-full sm:w-auto max-w-sm mx-auto sm:mx-0"
          >
            {primary}
          </a>
          {secondaryHref && (
            <Link
              href={secondaryHref}
              className="rounded-md px-6 sm:px-9 py-3.5 sm:py-4 inline-block w-full sm:w-auto max-w-sm mx-auto sm:mx-0 text-center text-white border border-white/40 hover:bg-white/10 transition-colors text-sm uppercase tracking-wider"
            >
              {secondary}
            </Link>
          )}
        </div>
        </div>
      </div>
    </section>
  );
}
