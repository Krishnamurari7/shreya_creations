"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  BTN_PRIMARY,
  BTN_SECONDARY,
  PAGE_CONTAINER,
  PAGE_SECTION,
  PAGE_SECTION_BORDERED,
  REVEAL,
  SECTION_LEAD,
  SECTION_TITLE,
} from "@/lib/ui";
import { cn } from "@/lib/utils";
import CardImage from "@/components/CardImage";
import { Testimonials } from "@/components/Sections";
import { useLanguage } from "@/components/LanguageProvider";
import { localizedPath } from "@/lib/locale";
import { resolveMediaSrc } from "@/lib/media";
import { DEFAULT_ADDRESS_LINE } from "@/lib/site-config";
import { waLink } from "@/lib/whatsapp";
import { trackLead, trackWhatsAppClick } from "@/lib/analytics";
import { getBoutiqueLanding, resolveBoutiqueLanding } from "@/lib/boutique-service-landing";

const EASE = [0.16, 1, 0.3, 1];

function UspIcon({ name }) {
  const common = {
    className: "blouse-landing__usp-svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.75",
    "aria-hidden": true,
  };
  switch (name) {
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" d="M12 7v5l3 2" />
        </svg>
      );
    case "fit":
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M7 7v10a2 2 0 002 2h6a2 2 0 002-2V7M9 11h6" />
        </svg>
      );
    case "finish":
      return (
        <svg {...common}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3l2.2 4.5L19 9l-3.5 3.4L16.4 18 12 15.6 7.6 18l.9-5.6L5 9l4.8-1.5L12 3z"
          />
        </svg>
      );
    case "match":
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h7M7 16h10M5 4h14v16H5z" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 4h8l1 4H7l1-4zM7 8l1.5 12h7L17 8M10 12h4" />
        </svg>
      );
  }
}

function ServiceIcon({ name }) {
  return (
    <span className="blouse-landing__service-icon" aria-hidden>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
        {name === "express" ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 3L6 14h5l-1 7 8-12h-5l1-6z" />
        ) : name === "hand" ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 11V6a2 2 0 114 0v5m4 0V8a2 2 0 10-4 0m-4 3V9a2 2 0 10-4 0v7a5 5 0 005 5h2a5 5 0 005-5v-5a2 2 0 10-4 0"
          />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5v14M7 8l2 2-2 2m10-4l-2 2 2 2" />
        )}
      </svg>
    </span>
  );
}

function BookingForm({ content, whatsapp, lang, selectedDesign, onClearDesign }) {
  const hi = lang === "hi";
  const typeOptions = content.typeOptions || [];
  const measureOptions = content.measureOptions || [];
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [itemType, setItemType] = useState(typeOptions[0]?.value || "");
  const [requiredDate, setRequiredDate] = useState("");
  const [measure, setMeasure] = useState(measureOptions[0]?.value || "");
  const [express, setExpress] = useState(false);
  const [fileName, setFileName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const expressLabel =
    (hi ? content.expressLabelHi : content.expressLabel) ||
    (hi ? "मुझे 24-Hour Express Stitching चाहिए" : "I want 24-Hour Express Stitching");

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(hi ? "कृपया अपना नाम लिखें।" : "Please enter your name.");
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      setError(hi ? "कृपया सही मोबाइल नंबर लिखें।" : "Please enter a valid mobile number.");
      return;
    }
    setError("");
    setSaving(true);

    const typeLabel = hi ? content.typeLabelHi : content.typeLabel;
    const lines = [
      hi
        ? `नमस्ते श्रेया क्रिएशन! 👋 मैं *${name.trim()}* हूँ — ${content.nounHi} बुकिंग।`
        : `Hi Shreya Creation! 👋 I'm *${name.trim()}* — ${content.noun} booking.`,
      `${hi ? "फ़ोन" : "Phone"}: ${phone.trim()}`,
      `${typeLabel}: ${itemType}`,
      selectedDesign ? `${hi ? "चुना डिज़ाइन" : "Selected design"}: ${selectedDesign}` : null,
      requiredDate ? `${hi ? "आवश्यक तारीख" : "Required date"}: ${requiredDate}` : null,
      measure ? `${hi ? "माप / विकल्प" : "Measurement / option"}: ${measure}` : null,
      express ? expressLabel : null,
      fileName
        ? hi
          ? `डिज़ाइन रेफरेंस फ़ाइल: ${fileName} (WhatsApp पर अटैच करूँगी)`
          : `Design reference file: ${fileName} (I'll attach on WhatsApp)`
        : null,
      hi ? "कृपया कीमत और टाइमलाइन बताएँ।" : "Please share price and timeline.",
    ].filter(Boolean);

    const message = lines.join("\n");

    try {
      await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          message,
          source: content.source || "boutique_booking_form",
          source_page: typeof window !== "undefined" ? window.location.pathname : content.href,
          inquiry_type: "order",
          locale: lang === "hi" ? "hi" : "en",
          preferred_date: requiredDate || undefined,
        }),
      });
    } catch {
      // WhatsApp still opens
    }

    trackLead(content.source || "boutique_booking_form", {
      cta_label: `submit_${content.slug}_booking`,
      source_page: content.href,
    });
    trackWhatsAppClick(null, {
      cta_label: `${content.slug}_booking_form`,
      source_page: content.href,
    });
    window.open(waLink(whatsapp, message), "_blank");
    setSaving(false);
  };

  return (
    <form className="blouse-landing__form" onSubmit={submit} noValidate>
      <div className="blouse-landing__form-head">
        <h3 className="blouse-landing__form-title">{hi ? content.formTitleHi : content.formTitle}</h3>
      </div>

      <div className="blouse-landing__form-body">
        {selectedDesign && (
          <p className="blouse-landing__selected-design">
            <span>{hi ? "चयनित डिज़ाइन:" : "Selected design:"}</span> {selectedDesign}
            <button type="button" onClick={onClearDesign} className="blouse-landing__clear-design">
              {hi ? "हटाएँ" : "Clear"}
            </button>
          </p>
        )}

        <label className="blouse-landing__field">
          <span>{hi ? "आपका नाम" : "Your Name"}</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={hi ? "उदा. प्रिया शर्मा" : "e.g. Priya Sharma"}
            autoComplete="name"
          />
        </label>

        <label className="blouse-landing__field">
          <span>{hi ? "मोबाइल / WhatsApp" : "Mobile / WhatsApp"}</span>
          <div className="blouse-landing__phone-row">
            <span className="blouse-landing__phone-prefix">+91</span>
            <input
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9876543210"
              autoComplete="tel"
            />
          </div>
        </label>

        {typeOptions.length > 0 && (
          <label className="blouse-landing__field">
            <span>{hi ? content.typeLabelHi : content.typeLabel}</span>
            <select value={itemType} onChange={(e) => setItemType(e.target.value)}>
              {typeOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {hi ? o.hi : o.value}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className="blouse-landing__field">
          <span>{hi ? "आवश्यक तारीख" : "Required Date"}</span>
          <input type="date" value={requiredDate} onChange={(e) => setRequiredDate(e.target.value)} />
        </label>

        <label className="blouse-landing__field">
          <span>{hi ? "डिज़ाइन रेफरेंस अपलोड" : "Upload Design Reference"}</span>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
          />
          {fileName ? (
            <em className="blouse-landing__file-note">{fileName}</em>
          ) : (
            <em className="blouse-landing__file-note">
              {hi
                ? "फ़ाइल नाम सेव होगा — फोटो WhatsApp पर अटैच करें।"
                : "Filename is saved — attach the photo on WhatsApp."}
            </em>
          )}
        </label>

        {measureOptions.length > 0 && (
          <label className="blouse-landing__field">
            <span>{hi ? "माप / विकल्प" : "Measurement Option"}</span>
            <select value={measure} onChange={(e) => setMeasure(e.target.value)}>
              {measureOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {hi ? o.hi : o.value}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className="blouse-landing__check">
          <input type="checkbox" checked={express} onChange={(e) => setExpress(e.target.checked)} />
          <span>{expressLabel}</span>
        </label>

        {error && <p className="blouse-landing__form-error">{error}</p>}

        <button type="submit" className={cn(BTN_PRIMARY, "blouse-landing__form-submit")} disabled={saving}>
          {saving
            ? hi
              ? "भेज रहा है…"
              : "Submitting…"
            : hi
              ? content.submitLabelHi
              : content.submitLabel}
        </button>
      </div>
    </form>
  );
}

function FaqAccordion({ faqs, lang }) {
  const [open, setOpen] = useState(0);
  const baseId = useId();
  const hi = lang === "hi";

  return (
    <div className="blouse-landing__faq-list">
      {faqs.map((faq, i) => {
        const isOpen = open === i;
        const btnId = `${baseId}-q-${i}`;
        const panelId = `${baseId}-a-${i}`;
        return (
          <div key={faq.q} className={cn("blouse-landing__faq-item", isOpen && "is-open")}>
            <button
              type="button"
              id={btnId}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="blouse-landing__faq-trigger"
              onClick={() => setOpen(isOpen ? -1 : i)}
            >
              <span>{hi ? faq.qHi : faq.q}</span>
              <span className="blouse-landing__faq-chevron" aria-hidden>
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen && (
              <div id={panelId} role="region" aria-labelledby={btnId} className="blouse-landing__faq-answer">
                {hi ? faq.aHi : faq.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function BoutiqueServiceLandingClient({
  slug,
  site = {},
  shopPage = {},
  products: _products = [],
  testimonials = [],
}) {
  const content = resolveBoutiqueLanding(slug, shopPage) || getBoutiqueLanding(slug);
  const { lang } = useLanguage();
  const hi = lang === "hi";
  const reduceMotion = useReducedMotion();
  const [selectedDesign, setSelectedDesign] = useState("");

  if (!content) return null;

  const whatsapp = site.whatsapp;
  const heroImage = resolveMediaSrc(content.heroImage);
  const address = site.address || DEFAULT_ADDRESS_LINE;
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  const bookMsg = hi ? content.bookMsgHi : content.bookMsg;
  const waHref = waLink(whatsapp, bookMsg);
  const formId = content.formId || "boutique-booking";

  const gallery = content.designs;

  const scrollToForm = () => {
    document.getElementById(formId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const selectDesign = (title) => {
    setSelectedDesign(title);
    scrollToForm();
  };

  const rise = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-40px" },
    transition: { duration: 0.6, delay, ease: EASE },
  });

  return (
    <div className="blouse-landing boutique-page relative min-w-0 w-full overflow-x-clip">
      <section className="blouse-landing__hero">
        <div className="blouse-landing__hero-media" aria-hidden>
          <CardImage
            src={heroImage}
            alt=""
            ratio="fill"
            priority
            className="blouse-landing__hero-img"
            imgClassName="object-cover object-[70%_center]"
          />
          <div className="blouse-landing__hero-shade" />
        </div>

        <div className={cn(PAGE_CONTAINER, "blouse-landing__hero-inner")}>
          <motion.div
            className="blouse-landing__hero-copy"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <p className="blouse-landing__eyebrow">{hi ? content.eyebrowHi : content.eyebrow}</p>
            <h1 className="blouse-landing__h1">{hi ? content.h1Hi : content.h1}</h1>
            <p className="blouse-landing__tagline">{hi ? content.taglineHi : content.tagline}</p>

            <ul className="blouse-landing__usps">
              {content.usps.map((u) => (
                <li key={u.en} className="blouse-landing__usp">
                  <span className="blouse-landing__usp-icon">
                    <UspIcon name={u.icon} />
                  </span>
                  <span>{hi ? u.hi : u.en}</span>
                </li>
              ))}
            </ul>

            <div className="blouse-landing__hero-ctas">
              <button type="button" onClick={scrollToForm} className={cn(BTN_PRIMARY, "blouse-landing__cta")}>
                {hi ? content.primaryCtaHi : content.primaryCta}
              </button>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(BTN_SECONDARY, "blouse-landing__cta blouse-landing__cta--wa")}
                onClick={() =>
                  trackWhatsAppClick(null, {
                    cta_label: `${content.slug}_hero_whatsapp`,
                    source_page: content.href,
                  })
                }
              >
                {hi ? content.secondaryCtaHi : content.secondaryCta}
              </a>
            </div>
          </motion.div>

          <aside className="blouse-landing__hero-quote" aria-label="Brand quote">
            <p>{hi ? content.heroQuoteHi : content.heroQuote}</p>
            <span>{hi ? content.heroQuoteCtaHi : content.heroQuoteCta}</span>
          </aside>
        </div>
      </section>

      <section className={cn(PAGE_SECTION, "blouse-landing__gallery-section")}>
        <div className={PAGE_CONTAINER}>
          <motion.div className="blouse-landing__section-head" {...rise()}>
            <h2 className={cn(SECTION_TITLE, "blouse-landing__section-title")}>
              {hi ? content.galleryTitleHi : content.galleryTitle}
            </h2>
            <p className={cn(SECTION_LEAD, "mt-3 max-w-2xl mx-auto text-center")}>
              {hi ? content.galleryLeadHi : content.galleryLead}
            </p>
          </motion.div>

          <div className="blouse-landing__gallery">
            {gallery.map((item, i) => (
              <motion.article key={item.id} className={cn(REVEAL, "blouse-landing__card", "in")} {...rise(0.04 * i)}>
                <div className="blouse-landing__card-media">
                  <CardImage src={item.image} alt={hi ? item.titleHi : item.title} ratio="4/5" />
                </div>
                <h3 className="blouse-landing__card-title">{hi ? item.titleHi : item.title}</h3>
                <button
                  type="button"
                  className="blouse-landing__card-select"
                  onClick={() => selectDesign(hi ? item.titleHi : item.title)}
                >
                  {hi ? content.selectDesignHi : content.selectDesign}
                </button>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id={formId} className={cn(PAGE_SECTION, PAGE_SECTION_BORDERED, "blouse-landing__booking-section")}>
        <div className={cn(PAGE_CONTAINER, "blouse-landing__booking-grid")}>
          <motion.div className="blouse-landing__panel" {...rise()}>
            <h2 className="blouse-landing__panel-title">
              {hi ? content.servicesTitleHi : content.servicesTitle}
            </h2>
            <ul className="blouse-landing__services">
              {content.services.map((s) => (
                <li key={s.en}>
                  <ServiceIcon name={s.icon} />
                  <span>{hi ? s.hi : s.en}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div className="blouse-landing__panel blouse-landing__panel--price" {...rise(0.08)}>
            <h2 className="blouse-landing__panel-title">
              {hi ? content.pricesTitleHi : content.pricesTitle}
            </h2>
            <div className="blouse-landing__price-table-wrap">
              <table className="blouse-landing__price-table">
                <thead>
                  <tr>
                    <th>{hi ? content.typeLabelHi : content.typeLabel}</th>
                    <th>{hi ? content.priceColHi : content.priceCol}</th>
                  </tr>
                </thead>
                <tbody>
                  {content.prices.map((row) => (
                    <tr key={row.type}>
                      <td>{hi ? row.typeHi : row.type}</td>
                      <td>{/^\d/.test(row.price) ? `₹${row.price}` : row.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="blouse-landing__price-note">
              {hi ? content.priceNoteHi : content.priceNote}
            </p>
          </motion.div>

          <motion.div className="blouse-landing__panel blouse-landing__panel--form" {...rise(0.12)}>
            <BookingForm
              content={content}
              whatsapp={whatsapp}
              lang={lang}
              selectedDesign={selectedDesign}
              onClearDesign={() => setSelectedDesign("")}
            />
          </motion.div>
        </div>
      </section>

      <section className={cn(PAGE_SECTION, "blouse-landing__process-section")}>
        <div className={PAGE_CONTAINER}>
          <motion.h2 className={cn(SECTION_TITLE, "text-center blouse-landing__section-title")} {...rise()}>
            {hi ? content.processTitleHi : content.processTitle}
          </motion.h2>
          <ol className="blouse-landing__process">
            {content.process.map((step, i) => (
              <motion.li key={step.step} className="blouse-landing__process-step" {...rise(0.05 * i)}>
                <span className="blouse-landing__process-num">{step.step}</span>
                <h3>{hi ? step.titleHi : step.title}</h3>
                <p>{hi ? step.descHi : step.desc}</p>
                {i < content.process.length - 1 && (
                  <span className="blouse-landing__process-arrow" aria-hidden>
                    →
                  </span>
                )}
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {testimonials?.length > 0 && (
        <section className={cn(PAGE_SECTION, PAGE_SECTION_BORDERED)}>
          <div className={PAGE_CONTAINER}>
            <h2 className={cn(SECTION_TITLE, "text-center blouse-landing__section-title mb-8")}>
              {hi ? content.reviewsTitleHi : content.reviewsTitle}
            </h2>
          </div>
          <Testimonials items={testimonials} site={site} />
        </section>
      )}

      <section className={cn(PAGE_SECTION, PAGE_SECTION_BORDERED, "blouse-landing__bottom-section")}>
        <div className={cn(PAGE_CONTAINER, "blouse-landing__bottom-grid")}>
          <div>
            <h2 className="blouse-landing__panel-title">
              {hi ? content.faqTitleHi : content.faqTitle}
            </h2>
            <FaqAccordion faqs={content.faqs} lang={lang} />
          </div>

          <blockquote className="blouse-landing__quote-card">
            <p>{hi ? content.quoteHi : content.quote}</p>
            <footer>— Shreya Creation</footer>
          </blockquote>

          <div className="blouse-landing__visit">
            <h2 className="blouse-landing__panel-title">
              {hi ? content.visitTitleHi : content.visitTitle}
            </h2>
            <p className="blouse-landing__visit-address">{address}</p>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(BTN_PRIMARY, "blouse-landing__directions")}
            >
              {hi ? content.directionsLabelHi : content.directionsLabel}
            </a>
          </div>
        </div>
      </section>

      <section className={cn(PAGE_SECTION, "blouse-landing__seo-section pt-8 md:pt-10 pb-12 md:pb-16")}>
        <div className={PAGE_CONTAINER}>
          <h2 className="blouse-landing__seo-title">{hi ? content.searchesTitleHi : content.searchesTitle}</h2>
          <div className="blouse-landing__seo-tags">
            {content.popularSearches.map((tag) => (
              <Link key={tag.label} href={localizedPath(tag.href, lang)} className="blouse-landing__seo-tag">
                {tag.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
