"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import {
  BTN_PRIMARY,
  BTN_SECONDARY,
  PAGE_CONTAINER,
  PAGE_SECTION,
  PAGE_SECTION_BORDERED,
  SECTION_EYEBROW,
  SECTION_LEAD,
  SECTION_ORNAMENT,
  SECTION_TITLE,
  SPARKLE_PULSE,
} from "@/lib/ui";
import { cn } from "@/lib/utils";
import CardImage from "@/components/CardImage";
import AmbientGlows from "@/components/AmbientGlows";
import NriClientsHighlights from "@/components/NriClientsHighlights";
import { useLanguage } from "@/components/LanguageProvider";
import { pickPage } from "@/lib/cms";
import { resolveMediaSrc, MEDIA } from "@/lib/media";
import { waLink, nriStitchMessage, nriClassMessage, nriClientMessage } from "@/lib/whatsapp";
import { NRI_FAQS, nriServices, nriLearnTopics, nriClassSteps, nriWhyChoose } from "@/lib/nri-content";
import { pickFaq } from "@/lib/i18n";

const EASE = [0.16, 1, 0.3, 1];

function tx(page, lang, key) {
  return pickPage(page, lang, key, `${key}Hi`);
}

function localized(item, hi, enKey, hiKey) {
  if (!item) return "";
  const hiVal = item[hiKey];
  const enVal = item[enKey];
  return hi && hiVal ? hiVal : enVal || "";
}

function SectionHead({ eyebrow, title, subtitle, center = true, id }) {
  return (
    <div id={id} className={cn("boutique-v2-head nri-head", center && "boutique-v2-head--center")}>
      {eyebrow && (
        <span className={cn(SECTION_EYEBROW, "boutique-v2-eyebrow")}>
          <span className={cn(SPARKLE_PULSE, "text-gold", "text-[10px]")} aria-hidden>
            ✦
          </span>
          {eyebrow}
        </span>
      )}
      {title && <h2 className={cn(SECTION_TITLE, "boutique-v2-section-title nri-h2", "mt-2")}>{title}</h2>}
      {subtitle && (
        <p className={cn(SECTION_LEAD, "mt-3 max-w-2xl", center && "mx-auto")}>{subtitle}</p>
      )}
      <div className={cn(SECTION_ORNAMENT, "mt-3 sm:mt-4")} aria-hidden>
        <span className="text-gold text-xs">✦</span>
      </div>
    </div>
  );
}

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function NriFaqAccordion({ faqs }) {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(0);
  const items = faqs?.length ? faqs : NRI_FAQS;

  return (
    <div className="nri-faq">
      {items.map((faq, i) => {
        const { q, a } = pickFaq(
          {
            q: faq.q,
            qHi: faq.qHi || faq.q_hi,
            a: faq.a,
            aHi: faq.aHi || faq.a_hi,
          },
          lang
        );
        if (!q) return null;
        const isOpen = open === i;
        return (
          <article
            key={q}
            className={cn("nri-faq__item", isOpen && "nri-faq__item--open")}
          >
            <h3 className="nri-faq__q">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? -1 : i)}
              >
                <span>{q}</span>
                <span className="nri-faq__toggle" aria-hidden>
                  {isOpen ? "−" : "+"}
                </span>
              </button>
            </h3>
            {isOpen && <p className="nri-faq__a">{a}</p>}
          </article>
        );
      })}
    </div>
  );
}

export default function NriClientsClient({ site, nriPage }) {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const hi = lang === "hi";
  const nri = nriPage || site.pages?.nri || {};

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });
  const rawY = useTransform(scrollYProgress, [0, 1], [-16, 16]);
  const imageY = useSpring(rawY, { stiffness: 90, damping: 24 });

  const heroImage = resolveMediaSrc(nri.heroImage || MEDIA.institute);
  const trainingImage = resolveMediaSrc(nri.trainingImage || MEDIA.categories.fashionDesigning);
  const rtwImage = resolveMediaSrc(nri.rtwImage || MEDIA.categories.ethnicWear);
  const bridalImage = resolveMediaSrc(nri.bridalImage || MEDIA.categories.bridal);

  const stitchHref = waLink(site.whatsapp, tx(nri, lang, "waStitchMessage") || nriStitchMessage(lang));
  const classHref = waLink(site.whatsapp, tx(nri, lang, "waClassMessage") || nriClassMessage(lang));
  const waHref = waLink(site.whatsapp, tx(nri, lang, "waGeneralMessage") || nriClientMessage(lang));

  const eyebrow = tx(nri, lang, "headerEyebrow") || (hi ? "NRI क्लाइंट्स और ग्लोबल फैशन सेवाएँ" : "NRI Clients & Global Fashion Services");
  const legacyEnglishTitle = "NRI Boutique, Custom Stitching & Fashion Designing Services from Patna";
  const hindiTitle = "पटना से NRI बुटीक, कस्टम सिलाई और फैशन डिजाइनिंग सेवाएँ";
  const storedTitle = tx(nri, lang, "headerTitle");
  const title =
    (hi && (!storedTitle || storedTitle === legacyEnglishTitle) ? hindiTitle : storedTitle) ||
    (hi ? hindiTitle : legacyEnglishTitle);
  const heroLine =
    tx(nri, lang, "headerSubtitle") ||
    (hi
      ? "विदेश में रहते हैं? Shreya Creation के साथ Indian fashion design, stitch या learn करें।"
      : "Living Abroad? Design, Stitch or Learn Indian Fashion with Shreya Creation.");
  const heroLead =
    tx(nri, lang, "heroSubtitle") ||
    (hi
      ? "NRI clients के लिए designer blouse, bridal wear, lehenga, suit, ready-to-wear saree और customised outfits — साथ ही 1-to-1 online/offline fashion designing classes।"
      : "Designer blouses, bridal wear, lehengas, suits, ready-to-wear sarees and customised outfits for NRI clients — plus 1-to-1 online and offline fashion designing classes.");

  const rail = Array.isArray(nri.rail) && nri.rail.length
    ? nri.rail
    : [
        { emoji: "🌍", label: "Global Clients", labelHi: "ग्लोबल क्लाइंट्स" },
        { emoji: "👗", label: "Custom Stitching", labelHi: "कस्टम सिलाई" },
        { emoji: "🎓", label: "1-to-1 Classes", labelHi: "1-to-1 क्लासेस" },
      ];

  const features = Array.isArray(nri.features) ? nri.features : [];
  const conceptPoints = Array.isArray(nri.conceptPoints) ? nri.conceptPoints : [];
  const services = Array.isArray(nri.services) && nri.services.length
    ? nri.services
    : nriServices(hi).map((item) => ({ ...item, titleHi: item.title, descHi: item.desc }));
  const learnTopics = Array.isArray(nri.learnTopics) && nri.learnTopics.length
    ? nri.learnTopics
    : nriLearnTopics(hi).map((label) => ({ label, labelHi: label }));
  const classSteps = Array.isArray(nri.classSteps) && nri.classSteps.length ? nri.classSteps : nriClassSteps(hi);
  const rtwPoints = Array.isArray(nri.rtwPoints) ? nri.rtwPoints : [];
  const whyPoints = Array.isArray(nri.whyPoints) && nri.whyPoints.length
    ? nri.whyPoints
    : nriWhyChoose(hi).map((text) => ({ text, textHi: text }));
  const faqs = Array.isArray(nri.faqs) && nri.faqs.length ? nri.faqs : NRI_FAQS;

  const rise = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.65, delay, ease: EASE },
  });

  return (
    <div className="boutique-page boutique-page--v2 nri-page relative min-w-0 w-full">
      <section
        ref={heroRef}
        className={cn(
          PAGE_CONTAINER,
          "nri-hero max-w-6xl pt-[calc(var(--header-offset)+0.75rem)] sm:pt-[calc(var(--header-offset)+1.25rem)] pb-6 sm:pb-8 relative z-20"
        )}
      >
        <AmbientGlows variant="header" />
        <div className="nri-hero__grid">
          <div className="nri-hero__copy">
            <motion.p
              className={cn(SECTION_EYEBROW, "nri-kicker")}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <span aria-hidden>🌍</span>
              {eyebrow}
            </motion.p>
            <motion.h1
              className="nri-h1"
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.06, ease: EASE }}
            >
              {title}
            </motion.h1>
            <motion.p
              className="boutique-v2-script nri-script"
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.14, ease: EASE }}
            >
              {heroLine}
            </motion.p>
            <motion.p
              className="nri-lead"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.22, ease: EASE }}
            >
              {heroLead}
            </motion.p>
            <motion.div
              className="nri-ctas"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.32, ease: EASE }}
            >
              <a href={stitchHref} target="_blank" rel="noopener noreferrer" className={BTN_PRIMARY}>
                {tx(nri, lang, "heroCtaStitch") || (hi ? "कस्टम सिलाई बुक करें" : "Book Custom Stitching")}
              </a>
              <a href={classHref} target="_blank" rel="noopener noreferrer" className={cn(BTN_PRIMARY, "nri-cta-wa")}>
                {tx(nri, lang, "heroCtaClass") || (hi ? "1-to-1 क्लास जॉइन करें" : "Join 1-to-1 Class")}
              </a>
              <a href={waHref} target="_blank" rel="noopener noreferrer" className={cn(BTN_SECONDARY, "inline-flex items-center gap-2")}>
                <WhatsAppGlyph />
                {tx(nri, lang, "heroCtaWa") || "WhatsApp"}
              </a>
            </motion.div>
          </div>

          <motion.div
            className="nri-hero__media"
            initial={reduceMotion ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            style={reduceMotion ? undefined : { y: imageY }}
          >
            <div className="boutique-v2-media nri-media">
              <div className="boutique-v2-media__inner">
                <CardImage
                  src={heroImage}
                  alt={tx(nri, lang, "heroImageAlt") || title}
                  ratio="4/5"
                  position="center"
                  className="boutique-v2-media__img rounded-2xl sm:rounded-3xl"
                  loading="eager"
                />
              </div>
              <span className="boutique-v2-media__frame" aria-hidden />
              <span className="boutique-v2-media__sheen" aria-hidden />
            </div>
            <ul className="nri-rail" aria-label={hi ? "NRI सेवाएँ" : "NRI services"}>
              {rail.map((item) => (
                <li key={item.label} className="nri-rail__item">
                  <span className="nri-rail__emoji" aria-hidden>
                    {item.emoji || "✦"}
                  </span>
                  <span>{localized(item, hi, "label", "labelHi")}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      <NriClientsHighlights
        highlights={nri.highlights}
        highlightEyebrow={nri.highlightsEyebrow}
        highlightEyebrowHi={nri.highlightsEyebrowHi}
        highlightTitle={nri.highlightsTitle}
        highlightTitleHi={nri.highlightsTitleHi}
        highlightSubtitle={nri.highlightsSubtitle}
        highlightSubtitleHi={nri.highlightsSubtitleHi}
        processEyebrow={nri.processEyebrow}
        processEyebrowHi={nri.processEyebrowHi}
        processTitle={nri.processTitle}
        processTitleHi={nri.processTitleHi}
        processSubtitle={nri.processSubtitle}
        processSubtitleHi={nri.processSubtitleHi}
        processSteps={nri.processSteps}
      />

      {features.length > 0 && (
        <section id="nri-order" className={cn(PAGE_CONTAINER, PAGE_SECTION, PAGE_SECTION_BORDERED, "nri-block max-w-6xl")}>
          <SectionHead
            eyebrow={tx(nri, lang, "featuresEyebrow")}
            title={tx(nri, lang, "featuresTitle") || (hi ? "स्टूडियो आए बिना ऑर्डर करें" : "Order Without Visiting the Studio")}
            subtitle={tx(nri, lang, "featuresSubtitle")}
          />
          <ul className="nri-features">
            {features.map((item) => (
              <li key={item.title} className="nri-card nri-card--soft">
                <span className="nri-emoji" aria-hidden>
                  {item.emoji || "✦"}
                </span>
                <h3 className="nri-card__title">{localized(item, hi, "title", "titleHi")}</h3>
                <p className="nri-card__body">{localized(item, hi, "desc", "descHi")}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section id="nri-concept" className={cn(PAGE_CONTAINER, PAGE_SECTION, PAGE_SECTION_BORDERED, "nri-block max-w-6xl")}>
        <motion.div {...rise(0.04)}>
          <SectionHead
            eyebrow={tx(nri, lang, "conceptEyebrow") || "Unique Concept"}
            title={tx(nri, lang, "conceptTitle") || "More Than a Boutique: A Fashion Partner for NRI Clients"}
            subtitle={tx(nri, lang, "conceptSubtitle")}
          />
          {conceptPoints.length > 0 && (
            <ul className="nri-checks">
              {conceptPoints.map((item) => {
                const text = localized(item, hi, "text", "textHi");
                if (!text) return null;
                return (
                  <li key={text} className="nri-check">
                    <span aria-hidden>✓</span>
                    {text}
                  </li>
                );
              })}
            </ul>
          )}
        </motion.div>
      </section>

      <section id="nri-services" className={cn(PAGE_CONTAINER, PAGE_SECTION, PAGE_SECTION_BORDERED, "nri-block max-w-6xl")}>
        <SectionHead
          eyebrow={tx(nri, lang, "servicesEyebrow") || "Services"}
          title={tx(nri, lang, "servicesTitle") || "NRI Custom Fashion Services"}
          subtitle={tx(nri, lang, "servicesSubtitle")}
        />
        <ul className="nri-services">
          {services.map((svc) => (
            <li key={svc.title}>
              <a href={stitchHref} target="_blank" rel="noopener noreferrer" className="nri-service">
                <span className="nri-emoji" aria-hidden>
                  {svc.emoji || "✦"}
                </span>
                <h3 className="nri-card__title">{hi ? localized(svc, true, "title", "titleHi") : svc.title}</h3>
                <p className="nri-card__body">{hi ? localized(svc, true, "desc", "descHi") : svc.desc}</p>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section id="nri-training" className={cn(PAGE_CONTAINER, PAGE_SECTION, PAGE_SECTION_BORDERED, "nri-block max-w-6xl")}>
        <div className="nri-split">
          <motion.div {...rise(0.04)}>
            <SectionHead
              eyebrow={tx(nri, lang, "trainingEyebrow") || "Fashion Training"}
              title={tx(nri, lang, "trainingTitle") || "Learn Fashion Designing from India, Even While Living Abroad"}
              subtitle={tx(nri, lang, "trainingSubtitle")}
              center={false}
            />
            <div className="nri-pair">
              <article className="nri-card nri-card--soft">
                <h3 className="nri-card__title">{tx(nri, lang, "trainingOnlineTitle") || "Online 1-to-1"}</h3>
                <p className="nri-card__body">{tx(nri, lang, "trainingOnlineDesc")}</p>
              </article>
              <article className="nri-card nri-card--soft">
                <h3 className="nri-card__title">{tx(nri, lang, "trainingOfflineTitle") || "Offline 1-to-1"}</h3>
                <p className="nri-card__body">{tx(nri, lang, "trainingOfflineDesc")}</p>
              </article>
            </div>
            {tx(nri, lang, "trainingNote") && <p className="nri-note">{tx(nri, lang, "trainingNote")}</p>}
            <a href={classHref} target="_blank" rel="noopener noreferrer" className={cn(BTN_PRIMARY, "mt-6 inline-flex")}>
              {tx(nri, lang, "trainingCta") || "Join 1-to-1 Fashion Class"}
            </a>
          </motion.div>
          <motion.div {...rise(0.1)} className="min-w-0">
            <CardImage
              src={trainingImage}
              alt={tx(nri, lang, "trainingImageAlt") || title}
              ratio="4/3"
              className="nri-photo"
            />
          </motion.div>
        </div>
      </section>

      <section id="nri-learn" className={cn(PAGE_CONTAINER, PAGE_SECTION, PAGE_SECTION_BORDERED, "nri-block max-w-6xl")}>
        <SectionHead
          eyebrow={tx(nri, lang, "learnEyebrow") || "Curriculum"}
          title={tx(nri, lang, "learnTitle") || "What Can You Learn?"}
          subtitle={tx(nri, lang, "learnSubtitle")}
        />
        <ul className="nri-chips">
          {learnTopics.map((topic) => {
            const label = typeof topic === "string" ? topic : localized(topic, hi, "label", "labelHi");
            if (!label) return null;
            return (
              <li key={label} className="nri-chip">
                {label}
              </li>
            );
          })}
        </ul>
      </section>

      <section id="nri-saree" className={cn(PAGE_CONTAINER, PAGE_SECTION, PAGE_SECTION_BORDERED, "nri-block max-w-6xl")}>
        <div className="nri-split nri-split--flip">
          <motion.div {...rise(0.04)} className="min-w-0 nri-split__media">
            <CardImage
              src={rtwImage}
              alt={tx(nri, lang, "rtwImageAlt") || "Ready-to-wear saree training in Patna"}
              ratio="4/3"
              className="nri-photo"
            />
          </motion.div>
          <motion.div {...rise(0.08)}>
            <SectionHead
              eyebrow={tx(nri, lang, "rtwEyebrow") || "Specialty"}
              title={tx(nri, lang, "rtwTitle") || "Ready-to-Wear Saree: Learn How to Prepare and Design"}
              subtitle={tx(nri, lang, "rtwSubtitle")}
              center={false}
            />
            <ul className="nri-points">
              {rtwPoints.map((point) => {
                const text = localized(point, hi, "text", "textHi");
                if (!text) return null;
                return (
                  <li key={text}>
                    <span aria-hidden>✦</span>
                    {text}
                  </li>
                );
              })}
            </ul>
            {tx(nri, lang, "rtwKeywords") && <p className="nri-keywords">{tx(nri, lang, "rtwKeywords")}</p>}
          </motion.div>
        </div>
      </section>

      <section id="nri-remote" className={cn(PAGE_CONTAINER, PAGE_SECTION, "nri-block max-w-6xl")}>
        <motion.div className="nri-banner" {...rise(0.04)}>
          <AmbientGlows variant="section" />
          <p className="nri-kicker nri-kicker--light">{tx(nri, lang, "remoteKicker") || "India to the world"}</p>
          <h2 className="nri-banner__title">{tx(nri, lang, "remoteTitle") || "Learn from Patna, Wherever You Are"}</h2>
          <p className="nri-banner__script">{tx(nri, lang, "remoteScript")}</p>
          <p className="nri-banner__body">{tx(nri, lang, "remoteBody")}</p>
          <div className="nri-ctas nri-ctas--center">
            <Link href={nri.remotePrimaryHref || "/courses"} className={BTN_SECONDARY}>
              {tx(nri, lang, "remotePrimaryLabel") || (hi ? "कोर्स देखें" : "View Courses")}
            </Link>
            <a href={classHref} target="_blank" rel="noopener noreferrer" className={BTN_PRIMARY}>
              {tx(nri, lang, "remoteSecondaryLabel") || (hi ? "1-to-1 क्लास जॉइन करें" : "Join 1-to-1 Class")}
            </a>
          </div>
        </motion.div>
      </section>

      <section id="nri-classes" className={cn(PAGE_CONTAINER, PAGE_SECTION, PAGE_SECTION_BORDERED, "nri-block max-w-6xl")}>
        <SectionHead
          eyebrow={tx(nri, lang, "classesEyebrow") || "Process"}
          title={tx(nri, lang, "classesTitle") || "How NRI 1-to-1 Classes Work"}
          subtitle={tx(nri, lang, "classesSubtitle")}
        />
        <ol className="nri-steps nri-steps--wide">
          {classSteps.map((item) => (
            <li key={item.step || item.title} className="nri-step">
              <span className="nri-step__no">{item.step}</span>
              <h3 className="nri-card__title">{localized(item, hi, "title", "titleHi") || item.title}</h3>
              <p className="nri-card__body">{localized(item, hi, "desc", "descHi") || item.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="nri-bridal" className={cn(PAGE_CONTAINER, PAGE_SECTION, PAGE_SECTION_BORDERED, "nri-block max-w-6xl")}>
        <div className="nri-split">
          <motion.div {...rise(0.04)}>
            <SectionHead
              eyebrow={tx(nri, lang, "bridalEyebrow") || "Bridal Special"}
              title={tx(nri, lang, "bridalTitle") || "NRI Bridal & Wedding Special"}
              center={false}
            />
            {tx(nri, lang, "bridalQuote") && (
              <blockquote className="nri-quote">“{tx(nri, lang, "bridalQuote")}”</blockquote>
            )}
            <p className="nri-lead nri-lead--left">{tx(nri, lang, "bridalBody")}</p>
            <div className="nri-ctas">
              <a href={stitchHref} target="_blank" rel="noopener noreferrer" className={BTN_PRIMARY}>
                {tx(nri, lang, "bridalCta") || "Book Custom Stitching"}
              </a>
              <Link href={nri.bridalSecondaryHref || "/portfolio"} className={BTN_SECONDARY}>
                {tx(nri, lang, "bridalSecondaryLabel") || (hi ? "ब्राइडल पोर्टफोलियो" : "Bridal Portfolio")}
              </Link>
            </div>
          </motion.div>
          <motion.div {...rise(0.1)} className="min-w-0">
            <CardImage
              src={bridalImage}
              alt={tx(nri, lang, "bridalImageAlt") || "NRI bridal stitching in Patna"}
              ratio="4/3"
              className="nri-photo"
            />
          </motion.div>
        </div>
      </section>

      <section id="nri-why" className={cn(PAGE_CONTAINER, PAGE_SECTION, PAGE_SECTION_BORDERED, "nri-block max-w-6xl")}>
        <SectionHead
          eyebrow={tx(nri, lang, "whyEyebrow") || "Why Us"}
          title={tx(nri, lang, "whyTitle") || "Why NRI Clients Choose Shreya Creation"}
          subtitle={tx(nri, lang, "whySubtitle")}
        />
        <ul className="nri-checks">
          {whyPoints.map((item) => {
            const text = typeof item === "string" ? item : localized(item, hi, "text", "textHi");
            if (!text) return null;
            return (
              <li key={text} className="nri-check">
                <span aria-hidden>✔</span>
                {text}
              </li>
            );
          })}
        </ul>
      </section>

      <section id="nri-faq" className={cn(PAGE_CONTAINER, PAGE_SECTION, PAGE_SECTION_BORDERED, "nri-block max-w-6xl")}>
        <SectionHead
          eyebrow={tx(nri, lang, "faqEyebrow") || "FAQ"}
          title={tx(nri, lang, "faqTitle") || "Frequently Asked Questions"}
          subtitle={tx(nri, lang, "faqSubtitle")}
        />
        <NriFaqAccordion faqs={faqs} />
      </section>
    </div>
  );
}
