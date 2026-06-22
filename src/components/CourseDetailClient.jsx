"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { waLink, courseMessage } from "@/lib/whatsapp";
import { useLanguage } from "@/components/LanguageProvider";
import { pickFaq } from "@/lib/i18n";
import { SITE_STATS } from "@/lib/seed";
import { cn } from "@/lib/utils";
import CoursePdfModal, { coursePdfUrl } from "@/components/CoursePdfModal";

function usePageUrl() {
  const [url, setUrl] = useState("");
  useEffect(() => {
    setUrl(window.location.href);
  }, []);
  return url;
}

function reviewCountFromSlug(slug = "") {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return 80 + (hash % 420);
}

function ratingFromSlug(slug = "") {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 17 + slug.charCodeAt(i)) >>> 0;
  }
  return (4.7 + (hash % 3) * 0.1).toFixed(1);
}

function buildIncludes(course, lang) {
  if (Array.isArray(course.includes) && course.includes.length) {
    return course.includes;
  }
  if (Array.isArray(course.includes_hi) && lang === "hi" && course.includes_hi.length) {
    return course.includes_hi;
  }

  const syllabusCount = Array.isArray(course.syllabus)
    ? course.syllabus.length
    : typeof course.syllabus === "string"
      ? course.syllabus.split("\n").filter(Boolean).length
      : 0;

  if (lang === "hi") {
    return [
      syllabusCount ? `${syllabusCount}+ मॉड्यूल और प्रैक्टिकल लessons` : "स्टेप-बाय-स्टेप प्रैक्टिकल ट्रेनिंग",
      `${course.duration} की पूरी ट्रेनिंग`,
      `${course.language} में उपलब्ध`,
      "100% प्रैक्टिकल हैंड्स-ऑन लर्निंग",
      "कोर्स पूरा करने पर सर्टिफिकेट",
      "एक्सपर्ट फैकल्टी गाइडेंस",
    ];
  }

  return [
    syllabusCount ? `${syllabusCount}+ modules & practical lessons` : "Step-by-step practical training",
    `Full ${course.duration} programme`,
    `Available in ${course.language}`,
    "100% hands-on practical learning",
    "Certificate on course completion",
    "Expert faculty guidance",
  ];
}

const TRUST_BADGES = [
  { icon: "👩‍🎓", en: "2000+ Happy Students", hi: "2000+ खुश छात्र" },
  { icon: "⏰", en: "Flexible Batches", hi: "लचीले बैच" },
  { icon: "🎯", en: "Expert Faculty", hi: "एक्सपर्ट फैकल्टी" },
  { icon: "✂️", en: "Practical Learning", hi: "प्रैक्टिकल लर्निंग" },
];

function StarRating({ rating, count }) {
  return (
    <div className="course-detail__rating">
      <span className="course-detail__stars" aria-hidden>
        {"★".repeat(5)}
      </span>
      <span className="course-detail__rating-value">{rating}</span>
      <span className="course-detail__reviews">({count.toLocaleString("en-IN")} reviews)</span>
    </div>
  );
}

function PricingBlock({ price, comparePrice, discountPct, lang }) {
  if (price == null) {
    return (
      <p className="course-detail__price-note">
        {lang === "hi" ? "फीस के लिए WhatsApp पर संपर्क करें" : "Contact us on WhatsApp for fees"}
      </p>
    );
  }

  const showCompare = comparePrice && Number(comparePrice) > price;

  return (
    <div className="course-detail__pricing">
      <span className="course-detail__price">₹{price.toLocaleString("en-IN")}</span>
      {showCompare && (
        <>
          <span className="course-detail__compare">₹{Number(comparePrice).toLocaleString("en-IN")}</span>
          {discountPct != null && discountPct > 0 && (
            <span className="course-detail__discount">{discountPct}% OFF</span>
          )}
        </>
      )}
    </div>
  );
}

function EnrollButton({ href, label, className }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cn("course-detail__enroll-btn", className)}>
      {label}
      <span aria-hidden>→</span>
    </a>
  );
}

function CourseFaq({ faqs, lang }) {
  const [open, setOpen] = useState(0);
  const items = faqs.slice(0, 6);

  if (!items.length) return null;

  return (
    <div className="course-detail__faq-list">
      {items.map((f, i) => {
        const { q, a } = pickFaq(f, lang);
        const isOpen = open === i;
        return (
          <div key={i} className={cn("course-detail__faq-item", isOpen && "course-detail__faq-item--open")}>
            <button
              type="button"
              className="course-detail__faq-trigger"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
            >
              <span>{q}</span>
              <svg
                className={cn("course-detail__faq-chevron", isOpen && "course-detail__faq-chevron--open")}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isOpen && <div className="course-detail__faq-answer">{a}</div>}
          </div>
        );
      })}
    </div>
  );
}

export default function CourseDetailClient({ course, site, faqs = [] }) {
  const { lang } = useLanguage();
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [pdfOpen, setPdfOpen] = useState(false);

  const title =
    lang === "hi" ? course.title_hi ?? course.titleHi ?? course.title : course.title;
  const description =
    lang === "hi"
      ? course.description_hi ?? course.descriptionHi ?? course.description
      : course.description;
  const aboutLong =
    lang === "hi"
      ? course.about_hi ?? course.aboutHi ?? course.about ?? description
      : course.about ?? course.about_en ?? description;

  const price = course.price != null ? Number(course.price) : null;
  const comparePrice = course.compare_price ?? course.comparePrice ?? course.original_price;
  const showCompare = comparePrice && price && Number(comparePrice) > price;
  const discountPct = showCompare ? Math.round((1 - price / Number(comparePrice)) * 100) : null;
  const reviews = reviewCountFromSlug(course.slug);
  const rating = ratingFromSlug(course.slug);
  const includes = buildIncludes(course, lang);

  const pageUrl = usePageUrl();
  const enrollUrl = waLink(site.whatsapp, courseMessage(course, pageUrl, lang));
  const pdfUrl = coursePdfUrl();
  const showPdf = course.show_pdf !== false;

  const t = {
    back: lang === "hi" ? "सभी कोर्स" : "All Courses",
    languages: lang === "hi" ? "उपलब्ध भाषा" : "Available in",
    getCourse: lang === "hi" ? "यह कोर्स लें" : "Get This Course",
    enroll: lang === "hi" ? "अभी एनरोल करें" : "Enroll Now",
    secure: lang === "hi" ? "सुरक्षित एनरोलमेंट · सर्टिफिकेट शामिल" : "Secure enrollment · Certificate included",
    included: lang === "hi" ? "क्या शामिल है" : "What's Included",
    about: lang === "hi" ? "इस कोर्स के बारे में" : "About This Course",
    readMore: lang === "hi" ? "और पढ़ें" : "Read More",
    readLess: lang === "hi" ? "कम दिखाएं" : "Show Less",
    faq: lang === "hi" ? "अक्सर पूछे जाने वाले प्रश्न" : "Frequently Asked Questions",
    readyTitle: lang === "hi" ? "एनरोल करने के लिए तैयार?" : "Ready to Enroll?",
    readySub:
      lang === "hi"
        ? `${SITE_STATS.studentsHi} — पटना का भरोसेमंद फैशन इंस्टिट्यूट`
        : `Trusted by ${SITE_STATS.studentsEn} — Patna's skill training institute`,
    limited: lang === "hi" ? "सीमित समय ऑफर" : "Limited Time Offer",
    securePay: lang === "hi" ? "सुरक्षित पेमेंट · सर्टिफिकेट शामिल" : "Secure payment · Certificate included",
    viewDetails: lang === "hi" ? "पूरा विवरण देखें" : "View Full Details",
    viewDetailsSub: lang === "hi" ? "कोर्स PDF ब्रोशर · पॉपअप में खुलेगा" : "Course PDF brochure · opens in popup",
  };

  const aboutPreview = aboutLong.length > 280 ? aboutLong.slice(0, 280).trim() + "…" : aboutLong;
  const showAboutToggle = aboutLong.length > 280;

  return (
    <div className="course-detail min-w-0 w-full">
      <div className="course-detail__hero-wrap">
        <div className="page-container course-detail__hero">
          <Link href="/courses" className="course-detail__back">
            <span aria-hidden>←</span> {t.back}
          </Link>

          <div className="course-detail__hero-grid">
            <div className="course-detail__media">
              {course.preview_video ? (
                <iframe
                  src={course.preview_video}
                  title={title}
                  className="course-detail__iframe"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : course.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={course.image} alt={title} className="course-detail__image" />
              ) : (
                <div className="course-detail__image-placeholder">{title}</div>
              )}
            </div>

            <div className="course-detail__info">
              {course.category && <span className="course-detail__category">{course.category}</span>}

              <h1 className="course-detail__title">{title}</h1>

              {course.language && (
                <p className="course-detail__languages">
                  {t.languages}: <strong>{course.language}</strong>
                  {course.duration && <> · {course.duration}</>}
                </p>
              )}

              <StarRating rating={rating} count={reviews} />

              <PricingBlock
                price={price}
                comparePrice={comparePrice}
                discountPct={discountPct}
                lang={lang}
              />

              <EnrollButton href={enrollUrl} label={t.getCourse} />

              <p className="course-detail__secure">🔒 {t.secure}</p>

              <ul className="course-detail__trust">
                {TRUST_BADGES.map((badge) => (
                  <li key={badge.en}>
                    <span className="course-detail__trust-icon" aria-hidden>
                      {badge.icon}
                    </span>
                    <span>{lang === "hi" ? badge.hi : badge.en}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {showPdf && (
        <div className="page-container course-detail__pdf-wrap">
          <button
            type="button"
            className="course-detail__pdf-btn"
            onClick={() => setPdfOpen(true)}
          >
            <span className="course-detail__pdf-btn-icon" aria-hidden>
              📄
            </span>
            <span className="course-detail__pdf-btn-copy">
              <span className="course-detail__pdf-btn-label">{t.viewDetails}</span>
              <span className="course-detail__pdf-btn-sub">{t.viewDetailsSub}</span>
            </span>
            <span className="course-detail__pdf-btn-arrow" aria-hidden>
              →
            </span>
          </button>
        </div>
      )}

      <div className="page-container course-detail__body">
        <section className="course-detail__section">
          <h2 className="course-detail__section-title">{t.included}</h2>
          <ul className="course-detail__includes">
            {includes.map((item, i) => (
              <li key={i}>
                <span className="course-detail__check" aria-hidden>
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="course-detail__section">
          <h2 className="course-detail__section-title">{t.about}</h2>
          <div className="course-detail__about">
            <p>{aboutExpanded ? aboutLong : aboutPreview}</p>
            {showAboutToggle && (
              <button
                type="button"
                className="course-detail__read-more"
                onClick={() => setAboutExpanded((v) => !v)}
              >
                {aboutExpanded ? t.readLess : t.readMore}
              </button>
            )}
          </div>
        </section>

        {faqs.length > 0 && (
          <section className="course-detail__section">
            <h2 className="course-detail__section-title">{t.faq}</h2>
            <CourseFaq faqs={faqs} lang={lang} />
          </section>
        )}

        <section className="course-detail__cta">
          <p className="course-detail__cta-eyebrow">{t.limited}</p>
          <h2 className="course-detail__cta-title">{t.readyTitle}</h2>
          <p className="course-detail__cta-sub">{t.readySub}</p>
          <PricingBlock
            price={price}
            comparePrice={comparePrice}
            discountPct={discountPct}
            lang={lang}
          />
          <EnrollButton href={enrollUrl} label={t.enroll} className="course-detail__enroll-btn--wide" />
          <p className="course-detail__secure">🔒 {t.securePay}</p>
        </section>
      </div>

      <div className="course-detail__sticky" aria-label={t.enroll}>
        <div className="course-detail__sticky-inner">
          <div className="course-detail__sticky-pricing">
            {price != null ? (
              <>
                <span className="course-detail__price course-detail__price--sm">
                  ₹{price.toLocaleString("en-IN")}
                </span>
                {showCompare && (
                  <span className="course-detail__compare course-detail__compare--sm">
                    ₹{Number(comparePrice).toLocaleString("en-IN")}
                  </span>
                )}
              </>
            ) : (
              <span className="course-detail__price-note course-detail__price-note--sm">
                {lang === "hi" ? "WhatsApp पर पूछें" : "Ask on WhatsApp"}
              </span>
            )}
          </div>
          <EnrollButton href={enrollUrl} label={t.enroll} className="course-detail__enroll-btn--sticky" />
        </div>
      </div>

      <CoursePdfModal
        open={pdfOpen}
        onClose={() => setPdfOpen(false)}
        title={title}
        pdfUrl={pdfUrl}
        lang={lang}
      />
    </div>
  );
}
