"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
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
import {
  NRI_FAQS,
  nriServices,
  nriLearnTopics,
  nriClassSteps,
  nriWhyChoose,
} from "@/lib/nri-content";
import { pickFaq } from "@/lib/i18n";

const EASE = [0.16, 1, 0.3, 1];

function SectionHead({ eyebrow, title, subtitle, center = true }) {
  return (
    <div className={cn("boutique-v2-head", center && "boutique-v2-head--center")}>
      {eyebrow && (
        <span className={cn(SECTION_EYEBROW, "boutique-v2-eyebrow")}>
          <span className={cn(SPARKLE_PULSE, "text-gold", "text-[10px]")} aria-hidden>
            ✦
          </span>
          {eyebrow}
        </span>
      )}
      {title && <h2 className={cn(SECTION_TITLE, "boutique-v2-section-title", "mt-2")}>{title}</h2>}
      {subtitle && (
        <p className={cn(SECTION_LEAD, "mt-3", "max-w-2xl", center && "mx-auto")}>{subtitle}</p>
      )}
      <div className={cn(SECTION_ORNAMENT, "mt-3 sm:mt-4")} aria-hidden>
        <span className="text-gold text-xs">✦</span>
      </div>
    </div>
  );
}

function pickFeature(feature, hi) {
  return {
    emoji: feature.emoji || "✦",
    title: hi && feature.titleHi ? feature.titleHi : feature.title,
    desc: hi && feature.descHi ? feature.descHi : feature.desc,
  };
}

function normalizeClassSteps(raw, hi) {
  const fallback = nriClassSteps(hi);
  if (!Array.isArray(raw) || !raw.length) return fallback;
  return raw.map((item, index) => {
    const def = fallback[index] || fallback[0];
    return {
      step: item.step || def.step,
      title: hi && (item.titleHi || item.title_hi) ? item.titleHi || item.title_hi : item.title || def.title,
      desc: hi && (item.descHi || item.desc_hi) ? item.descHi || item.desc_hi : item.desc || def.desc,
    };
  });
}

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function NriFaqAccordion() {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(0);

  return (
    <div className="mx-auto mt-10 max-w-3xl space-y-3">
      {NRI_FAQS.map((faq, i) => {
        const { q, a } = pickFaq(faq, lang);
        const isOpen = open === i;
        return (
          <div
            key={q}
            className={cn(
              "rounded-2xl border transition-all duration-300",
              isOpen
                ? "border-orange/35 bg-orange/[0.04] shadow-[0_12px_32px_-12px_rgba(var(--orange-rgb),0.18)]"
                : "border-orange/15 bg-white/[0.5] hover:border-orange/25 dark:bg-[rgba(20,16,28,0.5)]"
            )}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
            >
              <span className={cn("font-display text-base sm:text-lg", isOpen ? "text-orange" : "text-ink")}>
                {q}
              </span>
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm transition-colors",
                  isOpen ? "border-orange bg-orange text-white" : "border-orange/25 text-orange"
                )}
                aria-hidden
              >
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen && (
              <div className="border-t border-orange/10 px-5 pb-5 pt-4 text-sm leading-relaxed text-ink/75 sm:px-6 sm:text-base">
                {a}
              </div>
            )}
          </div>
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
  const rawY = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  const imageY = useSpring(rawY, { stiffness: 90, damping: 24 });
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1, 1.05]);

  const heroImage = resolveMediaSrc(nri.heroImage || MEDIA.institute);
  const stitchHref = waLink(site.whatsapp, nriStitchMessage(lang));
  const classHref = waLink(site.whatsapp, nriClassMessage(lang));
  const waHref = waLink(site.whatsapp, nriClientMessage(lang));

  const eyebrow =
    pickPage(nri, lang, "headerEyebrow", "headerEyebrowHi") ||
    (hi ? "NRI क्लाइंट्स और ग्लोबल फैशन सेवाएँ" : "NRI Clients & Global Fashion Services");

  const title =
    pickPage(nri, lang, "headerTitle", "headerTitleHi") ||
    (hi
      ? "NRI Boutique, Custom Stitching & Fashion Designing Services from Patna"
      : "NRI Boutique, Custom Stitching & Fashion Designing Services from Patna");

  const heroLine =
    pickPage(nri, lang, "headerSubtitle", "headerSubtitleHi") ||
    (hi
      ? "विदेश में रहते हैं? Shreya Creation के साथ Indian fashion design, stitch या learn करें।"
      : "Living Abroad? Design, Stitch or Learn Indian Fashion with Shreya Creation.");

  const heroLead =
    pickPage(nri, lang, "heroSubtitle", "heroSubtitleHi") ||
    (hi
      ? "NRI clients के लिए designer blouse, bridal wear, lehenga, suit, ready-to-wear saree और customised outfits — साथ ही 1-to-1 online/offline fashion designing classes।"
      : "Designer blouses, bridal wear, lehengas, suits, ready-to-wear sarees and customised outfits for NRI clients — plus 1-to-1 online and offline fashion designing classes.");

  const cmsFeatures = Array.isArray(nri.features) && nri.features.length
    ? nri.features.map((f) => pickFeature(f, hi))
    : null;

  const services = nriServices(hi);
  const learnTopics = nriLearnTopics(hi);
  const classSteps = normalizeClassSteps(nri.classSteps, hi);
  const whyChoose = nriWhyChoose(hi);

  const conceptBullets = hi
    ? [
        "अपने लिए customised Indian outfits बनवा सकते हैं",
        "bridal & wedding outfits तैयार करवा सकते हैं",
        "designer blouse और lehenga stitch करवा सकते हैं",
        "ready-to-wear saree customise करवा सकते हैं",
        "India से 1-to-1 fashion designing / stitching training भी ले सकते हैं",
      ]
    : [
        "Get customised Indian outfits made for yourself",
        "Prepare bridal & wedding outfits",
        "Have designer blouses and lehengas stitched",
        "Customise ready-to-wear sarees",
        "Take 1-to-1 fashion designing / stitching training from India",
      ];

  const rtwPoints = hi
    ? [
        "Ready-to-wear saree क्या है?",
        "इसे कैसे prepare किया जाता है?",
        "Pleats और fitting कैसे set की जाती है?",
        "Different body measurements के अनुसार finishing कैसे की जाती है?",
      ]
    : [
        "What is a ready-to-wear saree?",
        "How is it prepared?",
        "How are pleats and fitting set?",
        "How is finishing done for different body measurements?",
      ];

  const rise = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 24, filter: "blur(6px)" },
    whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.7, delay, ease: EASE },
  });

  return (
    <div className="boutique-page boutique-page--v2 nri-page relative min-w-0 w-full">
      {/* Hero */}
      <section
        ref={heroRef}
        className={cn(
          PAGE_CONTAINER,
          "boutique-v2-hero",
          "max-w-6xl",
          "pt-[calc(var(--header-offset)+0.75rem)]",
          "sm:pt-[calc(var(--header-offset)+1.25rem)]",
          "pb-8 sm:pb-10",
          "relative z-20 min-w-0 w-full"
        )}
      >
        <AmbientGlows variant="header" />

        <div className="grid items-center gap-7 sm:gap-9 lg:grid-cols-12 lg:gap-10">
          <div className="min-w-0 space-y-4 text-center sm:space-y-5 lg:col-span-6 lg:text-left">
            <motion.span
              className={cn(SECTION_EYEBROW, "boutique-v2-eyebrow")}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              <span className={cn(SPARKLE_PULSE, "text-gold", "text-[10px]")} aria-hidden>
                🌍
              </span>
              {eyebrow}
            </motion.span>

            <motion.h1
              className="font-display text-balance text-[clamp(1.65rem,4.2vw,2.65rem)] font-bold leading-[1.15] tracking-tight text-ink"
              initial={reduceMotion ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.08, ease: EASE }}
            >
              {title}
            </motion.h1>

            <motion.p
              className="boutique-v2-script text-lg sm:text-xl"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18, ease: EASE }}
            >
              {heroLine}
            </motion.p>

            <motion.p
              className="boutique-v2-lead"
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.28, ease: EASE }}
            >
              {heroLead}
            </motion.p>

            <motion.div
              className="boutique-v2-hero-ctas flex-wrap"
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.44, ease: EASE }}
            >
              <a href={stitchHref} target="_blank" rel="noopener noreferrer" className={cn(BTN_PRIMARY)}>
                {hi ? "Book Custom Stitching" : "Book Custom Stitching"}
              </a>
              <a
                href={classHref}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  BTN_PRIMARY,
                  "!bg-[#25D366] !shadow-[0_4px_20px_rgba(37,211,102,0.32)] hover:!bg-[#1fb855] hover:!shadow-[0_10px_32px_rgba(37,211,102,0.38)]"
                )}
              >
                {hi ? "Join 1-to-1 Class" : "Join 1-to-1 Class"}
              </a>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(BTN_SECONDARY, "inline-flex items-center gap-2")}
              >
                <WhatsAppGlyph />
                {hi ? "WhatsApp Us" : "WhatsApp Us"}
              </a>
            </motion.div>
          </div>

          <motion.div
            className="relative min-w-0 lg:col-span-6"
            initial={reduceMotion ? false : { opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.85, ease: EASE }}
            style={reduceMotion ? undefined : { y: imageY }}
          >
            <div className="boutique-v2-media group">
              <motion.div
                className="boutique-v2-media__inner"
                style={reduceMotion ? undefined : { scale: imageScale }}
              >
                <CardImage
                  src={heroImage}
                  alt={
                    hi
                      ? "NRI clients के लिए Shreya Creation — Patna boutique और fashion training"
                      : "Shreya Creation for NRI clients — Patna boutique and fashion training"
                  }
                  ratio="4/5"
                  position="center"
                  className="boutique-v2-media__img rounded-2xl sm:rounded-3xl"
                  loading="eager"
                />
              </motion.div>
              <span className="boutique-v2-media__frame" aria-hidden />
              <span className="boutique-v2-media__sheen" aria-hidden />
            </div>

            <aside className="boutique-v2-rail" aria-label={hi ? "NRI सेवाएँ" : "NRI services"}>
              {[
                { value: "🌍", label: hi ? "Global Clients" : "Global Clients" },
                { value: "👗", label: hi ? "Custom Stitching" : "Custom Stitching" },
                { value: "🎓", label: hi ? "1-to-1 Classes" : "1-to-1 Classes" },
              ].map((item) => (
                <div key={item.label} className="boutique-v2-rail__item">
                  <span className="boutique-v2-rail__value text-2xl">{item.value}</span>
                  <span className="boutique-v2-rail__label">{item.label}</span>
                </div>
              ))}
            </aside>
          </motion.div>
        </div>
      </section>

      <NriClientsHighlights
        highlights={nri.highlights}
        processEyebrow={pickPage(nri, lang, "processEyebrow", "processEyebrowHi")}
        processEyebrowHi={nri.processEyebrowHi}
        processTitle={pickPage(nri, lang, "processTitle", "processTitleHi")}
        processTitleHi={nri.processTitleHi}
        processSubtitle={pickPage(nri, lang, "processSubtitle", "processSubtitleHi")}
        processSubtitleHi={nri.processSubtitleHi}
        processSteps={nri.processSteps}
      />

      {cmsFeatures && (
        <section className={cn(PAGE_CONTAINER, "max-w-5xl pb-6 sm:pb-8 relative z-20")}>
          <ul className="grid gap-4 sm:grid-cols-3">
            {cmsFeatures.map((item) => (
              <li
                key={item.title}
                className="rounded-2xl border border-orange/15 bg-orange/[0.03] px-4 py-4 text-center sm:px-5 sm:py-5"
              >
                <span className="text-2xl" aria-hidden>
                  {item.emoji}
                </span>
                <h3 className="mt-2 font-display text-base text-ink sm:text-lg">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/70">{item.desc}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Concept */}
      <section className={cn(PAGE_CONTAINER, PAGE_SECTION, "max-w-6xl")}>
        <motion.div {...rise(0.05)}>
          <SectionHead
            eyebrow={hi ? "Unique Concept" : "Unique Concept"}
            title={
              hi
                ? "More Than a Boutique: A Fashion Partner for NRI Clients"
                : "More Than a Boutique: A Fashion Partner for NRI Clients"
            }
            subtitle={
              hi
                ? "आप विदेश में रहें, लेकिन Indian fashion से आपका connection बना रहे। Shreya Creation के माध्यम से NRI clients:"
                : "Live abroad but stay connected to Indian fashion. Through Shreya Creation, NRI clients can:"
            }
          />
          <ul className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-2">
            {conceptBullets.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-xl border border-orange/15 bg-orange/[0.03] px-4 py-3 text-sm leading-relaxed text-ink/80 sm:text-[0.9375rem]"
              >
                <span className="mt-0.5 text-orange" aria-hidden>
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* Services */}
      <section className={cn(PAGE_CONTAINER, PAGE_SECTION, PAGE_SECTION_BORDERED, "max-w-6xl")}>
        <SectionHead
          eyebrow={hi ? "Services" : "Services"}
          title={hi ? "NRI Custom Fashion Services" : "NRI Custom Fashion Services"}
          subtitle={
            hi
              ? "Designer stitching, bridal wear, ready-to-wear saree और express services — Patna से worldwide support।"
              : "Designer stitching, bridal wear, ready-to-wear sarees and express services — worldwide support from Patna."
          }
        />

        <motion.div
          className="boutique-v2-services mt-10 !grid-cols-2 md:!grid-cols-4"
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        >
          {services.map((svc) => (
            <motion.a
              key={svc.title}
              href={stitchHref}
              target="_blank"
              rel="noopener noreferrer"
              className="boutique-v2-service text-left"
              variants={{
                hidden: { opacity: 0, y: 22, scale: 0.96 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { type: "spring", stiffness: 240, damping: 20 },
                },
              }}
              whileHover={reduceMotion ? undefined : { y: -5 }}
            >
              <span className="text-2xl" aria-hidden>
                {svc.emoji}
              </span>
              <h3 className="boutique-v2-service__title">{svc.title}</h3>
              <p className="boutique-v2-service__desc">{svc.desc}</p>
            </motion.a>
          ))}
        </motion.div>
      </section>

      {/* Fashion Training */}
      <section className={cn(PAGE_CONTAINER, PAGE_SECTION, PAGE_SECTION_BORDERED, "max-w-6xl")}>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div {...rise(0.05)}>
            <SectionHead
              eyebrow={hi ? "Fashion Training" : "Fashion Training"}
              title={
                hi
                  ? "Learn Fashion Designing from India, Even While Living Abroad"
                  : "Learn Fashion Designing from India, Even While Living Abroad"
              }
              subtitle={
                hi
                  ? "India से fashion designing, boutique stitching या saree designing सीखना चाहती हैं? Patna आने की जरूरत हर बार नहीं होगी।"
                  : "Want to learn fashion designing, boutique stitching or saree designing from India? You don't need to visit Patna every time."
              }
              center={false}
            />

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-orange/15 bg-orange/[0.04] p-5">
                <h3 className="font-display text-lg text-ink">
                  {hi ? "Online 1-to-1" : "Online 1-to-1"}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">
                  {hi
                    ? "विदेश में रहते हुए live personalised online class।"
                    : "Live personalised online classes while you are abroad."}
                </p>
              </div>
              <div className="rounded-2xl border border-orange/15 bg-orange/[0.04] p-5">
                <h3 className="font-display text-lg text-ink">
                  {hi ? "Offline 1-to-1" : "Offline 1-to-1"}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">
                  {hi
                    ? "India/Patna visit के दौरान personalised offline practical training।"
                    : "Personalised offline practical training during your India/Patna visit."}
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm text-muted">
              {hi
                ? "Personalised learning • Individual attention • Practical training"
                : "Personalised learning • Individual attention • Practical training"}
            </p>

            <a
              href={classHref}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(BTN_PRIMARY, "mt-6 inline-flex")}
            >
              {hi ? "JOIN 1-to-1 FASHION CLASS" : "JOIN 1-to-1 FASHION CLASS"}
            </a>
          </motion.div>

          <motion.div {...rise(0.12)} className="min-w-0">
            <CardImage
              src={resolveMediaSrc(MEDIA.categories.fashionDesigning)}
              alt={
                hi
                  ? "Patna में fashion designing training — NRI learners के लिए"
                  : "Fashion designing training in Patna for NRI learners"
              }
              ratio="4/3"
              className="rounded-2xl sm:rounded-3xl"
            />
          </motion.div>
        </div>
      </section>

      {/* What Can You Learn */}
      <section className={cn(PAGE_CONTAINER, PAGE_SECTION, PAGE_SECTION_BORDERED, "max-w-6xl")}>
        <SectionHead
          eyebrow={hi ? "Curriculum" : "Curriculum"}
          title={hi ? "What Can You Learn?" : "What Can You Learn?"}
          subtitle={
            hi
              ? "Designer blouse से ready-to-wear saree तक — practical topics for NRI learners।"
              : "From designer blouses to ready-to-wear sarees — practical topics for NRI learners."
          }
        />
        <div className="mt-8 flex flex-wrap justify-center gap-2 sm:gap-3">
          {learnTopics.map((topic) => (
            <span
              key={topic}
              className="rounded-full border border-orange/20 bg-orange/[0.05] px-4 py-2 text-sm text-ink/85"
            >
              {topic}
            </span>
          ))}
        </div>
      </section>

      {/* Ready-to-Wear Saree */}
      <section className={cn(PAGE_CONTAINER, PAGE_SECTION, PAGE_SECTION_BORDERED, "max-w-6xl")}>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div {...rise(0.05)} className="min-w-0 order-2 lg:order-1">
            <CardImage
              src={resolveMediaSrc(MEDIA.categories.ethnicWear)}
              alt={
                hi
                  ? "Ready-to-wear saree making और pre-stitched saree training Patna"
                  : "Ready-to-wear saree making and pre-stitched saree training in Patna"
              }
              ratio="4/3"
              className="rounded-2xl sm:rounded-3xl"
            />
          </motion.div>
          <motion.div {...rise(0.1)} className="order-1 lg:order-2">
            <SectionHead
              eyebrow={hi ? "Specialty" : "Specialty"}
              title={
                hi
                  ? "Ready-to-Wear Saree: Learn How to Prepare & Design"
                  : "Ready-to-Wear Saree: Learn How to Prepare & Design"
              }
              subtitle={
                hi
                  ? "Practical training में इन topics को step-by-step explain किया जाता है।"
                  : "These topics are explained step-by-step in practical training."
              }
              center={false}
            />
            <ul className="mt-6 space-y-3">
              {rtwPoints.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm leading-relaxed text-ink/80 sm:text-base">
                  <span className="text-orange" aria-hidden>
                    ✦
                  </span>
                  {point}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs leading-relaxed text-muted sm:text-sm">
              {hi
                ? "Ready to Wear Saree • Ready to Wear Saree Making • How to Prepare Ready to Wear Saree • Pre Stitched Saree Making • Box Pleat Saree Making"
                : "Ready to Wear Saree • Ready to Wear Saree Making • How to Prepare Ready to Wear Saree • Pre Stitched Saree Making • Box Pleat Saree Making"}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Learn from Patna */}
      <section className={cn(PAGE_CONTAINER, PAGE_SECTION, PAGE_SECTION_BORDERED, "max-w-6xl")}>
        <motion.div
          className="relative overflow-hidden rounded-3xl border border-orange/20 bg-gradient-to-br from-orange/[0.08] via-cream to-orange/[0.04] px-6 py-10 text-center sm:px-10 sm:py-14 dark:from-orange/[0.12] dark:via-[rgba(20,16,28,0.95)] dark:to-orange/[0.06]"
          {...rise(0.05)}
        >
          <AmbientGlows variant="section" />
          <p className="text-3xl sm:text-4xl" aria-hidden>
            🇮🇳 → 🌍
          </p>
          <h2 className="mt-4 font-display text-2xl text-ink sm:text-3xl">
            {hi ? "Learn from Patna, Wherever You Are" : "Learn from Patna, Wherever You Are"}
          </h2>
          <p className="mt-3 font-display text-lg text-orange sm:text-xl">
            {hi ? "You Learn • We Guide • You Create" : "You Learn • We Guide • You Create"}
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ink/75 sm:text-base">
            {hi
              ? "NRI student India से remotely सीख सकती है — stitching, saree designing और boutique techniques के साथ personalised guidance।"
              : "NRI students can learn remotely from India — with personalised guidance in stitching, saree designing and boutique techniques."}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/courses" className={cn(BTN_SECONDARY)}>
              {hi ? "View Courses" : "View Courses"}
            </Link>
            <a href={classHref} target="_blank" rel="noopener noreferrer" className={cn(BTN_PRIMARY)}>
              {hi ? "Join 1-to-1 Class" : "Join 1-to-1 Class"}
            </a>
          </div>
        </motion.div>
      </section>

      {/* How Classes Work */}
      <section className={cn(PAGE_CONTAINER, PAGE_SECTION, PAGE_SECTION_BORDERED, "max-w-6xl")}>
        <SectionHead
          eyebrow={hi ? "Process" : "Process"}
          title={hi ? "How NRI 1-to-1 Classes Work" : "How NRI 1-to-1 Classes Work"}
        />
        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {classSteps.map((item) => (
            <li
              key={item.step}
              className="rounded-2xl border border-orange/15 bg-orange/[0.03] p-5 sm:p-6"
            >
              <span className="font-display text-sm tracking-widest text-orange">{item.step}</span>
              <h3 className="mt-2 font-display text-lg text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{item.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Bridal Special */}
      <section className={cn(PAGE_CONTAINER, PAGE_SECTION, PAGE_SECTION_BORDERED, "max-w-6xl")}>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div {...rise(0.05)}>
            <SectionHead
              eyebrow={hi ? "Bridal Special" : "Bridal Special"}
              title={hi ? "NRI Bridal & Wedding Special" : "NRI Bridal & Wedding Special"}
              center={false}
            />
            <blockquote className="mt-6 border-l-4 border-orange/40 pl-5 font-display text-xl italic leading-snug text-ink sm:text-2xl">
              {hi
                ? "“Your wedding may be abroad, but your Indian style can begin in Patna.”"
                : "“Your wedding may be abroad, but your Indian style can begin in Patna.”"}
            </blockquote>
            <p className="mt-5 text-sm leading-relaxed text-ink/75 sm:text-base">
              {hi
                ? "Designer blouse, lehenga, saree, bridal outfits और customised wedding wear के लिए personalised consultation।"
                : "Personalised consultation for designer blouses, lehengas, sarees, bridal outfits and customised wedding wear."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={stitchHref} target="_blank" rel="noopener noreferrer" className={cn(BTN_PRIMARY)}>
                {hi ? "Book Custom Stitching" : "Book Custom Stitching"}
              </a>
              <Link href="/portfolio" className={cn(BTN_SECONDARY)}>
                {hi ? "Bridal Portfolio" : "Bridal Portfolio"}
              </Link>
            </div>
          </motion.div>
          <motion.div {...rise(0.1)} className="min-w-0">
            <CardImage
              src={resolveMediaSrc(MEDIA.categories.bridal)}
              alt={
                hi
                  ? "NRI bridal blouse और wedding wear stitching Patna"
                  : "NRI bridal blouse and wedding wear stitching in Patna"
              }
              ratio="4/3"
              className="rounded-2xl sm:rounded-3xl"
            />
          </motion.div>
        </div>
      </section>

      {/* Why Choose */}
      <section className={cn(PAGE_CONTAINER, PAGE_SECTION, PAGE_SECTION_BORDERED, "max-w-6xl")}>
        <SectionHead
          eyebrow={hi ? "Why Us" : "Why Us"}
          title={hi ? "Why NRI Clients Choose Shreya Creation" : "Why NRI Clients Choose Shreya Creation"}
        />
        <ul className="mx-auto mt-8 grid max-w-4xl gap-3 sm:grid-cols-2">
          {whyChoose.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 rounded-xl border border-orange/12 px-4 py-3 text-sm text-ink/85 sm:text-[0.9375rem]"
            >
              <span className="text-orange" aria-hidden>
                ✔
              </span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section className={cn(PAGE_CONTAINER, PAGE_SECTION, PAGE_SECTION_BORDERED, "max-w-6xl")}>
        <SectionHead
          eyebrow={hi ? "FAQ" : "FAQ"}
          title={hi ? "Frequently Asked Questions" : "Frequently Asked Questions"}
        />
        <NriFaqAccordion />
      </section>
    </div>
  );
}
