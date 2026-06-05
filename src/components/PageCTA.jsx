"use client";

import Link from "next/link";
import { Glass3DCard, Float3D } from "@/components/Glass3DCard";
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
    <section className={`mx-auto max-w-5xl px-4 sm:px-5 pt-8 pb-10 sm:pt-12 sm:pb-14 relative z-20 ${className}`}>
      <Glass3DCard
        layered
        className="rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-10 md:p-14 text-center relative overflow-hidden border-orange/30 bg-orange/5 reveal"
      >
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-orange/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-purple/10 blur-3xl pointer-events-none" />

        <Float3D translateZ="50">
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl text-ink leading-tight">
            {heading}
            {highlight ? (
              <>
                {" "}
                <span className="text-gold-gradient">{highlight}</span>
              </>
            ) : null}
          </h2>
        </Float3D>
        <Float3D translateZ="40" className="mt-4">
          <p className="text-ink font-normal max-w-md mx-auto text-sm leading-relaxed px-1">{body}</p>
        </Float3D>
        <Float3D translateZ="60" className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center">
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold rounded-full px-6 sm:px-9 py-3.5 sm:py-4 inline-block w-full sm:w-auto max-w-sm mx-auto sm:mx-0"
          >
            {primary}
          </a>
          {secondaryHref && (
            <Link
              href={secondaryHref}
              className="btn-ghost rounded-full px-6 sm:px-9 py-3.5 sm:py-4 inline-block w-full sm:w-auto max-w-sm mx-auto sm:mx-0 text-center"
            >
              {secondary}
            </Link>
          )}
        </Float3D>
      </Glass3DCard>
    </section>
  );
}
