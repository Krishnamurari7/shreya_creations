"use client";

import {
  HIGHLIGHT_SHIMMER,
  PAGE_CONTAINER,
  PAGE_SECTION,
  PAGE_SECTION_BORDERED,
  REVEAL,
  REVEAL_ZOOM,
  SECTION_TITLE,
} from "@/lib/ui";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import Link from "next/link";
import CourseCard from "@/components/CourseCard";
import { pickPage } from "@/lib/cms";
import { PAGE_DEFAULTS } from "@/lib/cms/defaults";
import { isAddonCourse, isCourseAvailable, isFlagshipCourse, FLAGSHIP_COURSE_SLUGS } from "@/lib/courses";
import FeeStructureLeadMagnet from "@/components/FeeStructureLeadMagnet";
import NextBatchBanner from "@/components/NextBatchBanner";
import SeoDisclosure from "@/components/SeoDisclosure";
import { useLanguage } from "@/components/LanguageProvider";
import { openInquiryPopup } from "@/lib/inquiryPopup";
import { demoClassMessage } from "@/lib/whatsapp";
import { SITE_STATS } from "@/lib/seed";
import {
  DEFAULT_EXPRESS_DELIVERY_HOURS,
  DEFAULT_STUDENTS_TAUGHT,
  COURSE_COUNT,
} from "@/lib/site-config";

const FLAGSHIP_LIMIT = 4;
const ADDON_LIMIT = 4;

const FILTER_TABS = [
  {
    id: "all",
    label: "All Courses",
    labelHi: "सभी कोर्स",
    icon: "grid",
    match: () => true,
  },
  {
    id: "beginner",
    label: "Beginner",
    labelHi: "बिगिनर",
    icon: "seedling",
    match: (c) => /basic|beginner|mastery/i.test(c.title || "") || /basic|beginner/.test(c.slug || ""),
  },
  {
    id: "blouse",
    label: "Blouse Making",
    labelHi: "ब्लाउज मेकिंग",
    icon: "blouse",
    match: (c) => c.category === "Blouse Making",
  },
  {
    id: "boutique",
    label: "Boutique",
    labelHi: "बुटीक",
    icon: "store",
    match: (c) => c.category === "Boutique",
  },
  {
    id: "advanced",
    label: "Advanced",
    labelHi: "एडवांस्ड",
    icon: "star",
    match: (c) => /advanced|advance/i.test(c.title || "") || /advanced/.test(c.slug || ""),
  },
  {
    id: "nift",
    label: "NIFT / NID / UCEED",
    labelHi: "NIFT / NID / UCEED",
    icon: "cap",
    match: (c) =>
      c.category === "Fashion Design" ||
      /nift|nid|uceed|fashion design/i.test(`${c.title || ""} ${c.category || ""}`),
  },
  {
    id: "short",
    label: "Short Courses",
    labelHi: "शॉर्ट कोर्स",
    icon: "clock",
    match: (c) => isAddonCourse(c) || /\b\d+\s*(day|days|week|weeks)\b/i.test(c.duration || ""),
  },
];

const TRUST_BADGES = [
  { icon: "shield", key: "years" },
  { icon: "book", key: "courses" },
  { icon: "scissors", en: "Hands-on Practical Training", hi: "हाथों-हाथ प्रैक्टिकल ट्रेनिंग" },
  { icon: "briefcase", en: "Internship & Placement Support", hi: "इंटर्नशिप व प्लेसमेंट सपोर्ट" },
];

const FEATURE_STRIP = [
  { icon: "scissors", en: "Hands-on Practical Training", hi: "हाथों-हाथ प्रैक्टिकल ट्रेनिंग" },
  { icon: "certificate", en: "Certificate After Completion", hi: "कोर्स पूरा करने पर सर्टिफिकेट" },
  { icon: "internship", en: "Internship Support", hi: "इंटर्नशिप सपोर्ट" },
  { icon: "placement", en: "Placement Support", hi: "प्लेसमेंट सपोर्ट" },
  { icon: "kit", en: "Free Kit For Practice", hi: "प्रैक्टिस के लिए फ्री किट" },
];

function TabIcon({ type }) {
  const props = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.75",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: "home-courses-preview__tab-icon",
    "aria-hidden": true,
  };

  switch (type) {
    case "grid":
      return (
        <svg {...props}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case "seedling":
      return (
        <svg {...props}>
          <path d="M12 22V12" />
          <path d="M12 12c-4-1-7-4-7-8 5 0 7 3 7 8z" />
          <path d="M12 12c4-1 7-4 7-8-5 0-7 3-7 8z" />
        </svg>
      );
    case "blouse":
      return (
        <svg {...props}>
          <path d="M9 4l3 2 3-2 4 3v3l-3-1v10H8V9L5 10V7z" />
        </svg>
      );
    case "store":
      return (
        <svg {...props}>
          <path d="M4 10h16v10H4z" />
          <path d="M4 10l1.5-5h13L20 10" />
          <path d="M10 20v-6h4v6" />
        </svg>
      );
    case "star":
      return (
        <svg {...props}>
          <path d="M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.9 7.2 18l.9-5.4L4.2 8.7l5.4-.8z" />
        </svg>
      );
    case "cap":
      return (
        <svg {...props}>
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 1.1 2.7 2 6 2s6-.9 6-2v-5" />
        </svg>
      );
    case "clock":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    default:
      return null;
  }
}

function LineIcon({ type }) {
  const props = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: "home-courses-preview__line-icon",
    "aria-hidden": true,
  };

  switch (type) {
    case "shield":
      return (
        <svg {...props}>
          <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case "book":
      return (
        <svg {...props}>
          <path d="M4 5a2 2 0 012-2h11v16H6a2 2 0 00-2 2V5z" />
          <path d="M6 3v16" />
        </svg>
      );
    case "scissors":
      return (
        <svg {...props}>
          <circle cx="6" cy="6" r="3" />
          <circle cx="6" cy="18" r="3" />
          <path d="M8.5 7.5L20 18M8.5 16.5L20 6" />
        </svg>
      );
    case "briefcase":
      return (
        <svg {...props}>
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M3 12h18" />
        </svg>
      );
    case "certificate":
      return (
        <svg {...props}>
          <rect x="4" y="3" width="16" height="13" rx="2" />
          <path d="M9 20l3-2 3 2v-6H9z" />
          <path d="M8 8h8M8 11h5" />
        </svg>
      );
    case "internship":
      return (
        <svg {...props}>
          <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
      );
    case "placement":
      return (
        <svg {...props}>
          <path d="M12 3l8 4v5c0 4.5-3.2 7.8-8 9-4.8-1.2-8-4.5-8-9V7z" />
          <path d="M9 12h6M12 9v6" />
        </svg>
      );
    case "kit":
      return (
        <svg {...props}>
          <path d="M4 9h16v11H4z" />
          <path d="M9 9V6a3 3 0 016 0v3" />
          <path d="M4 13h16" />
        </svg>
      );
    case "years":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "students":
      return (
        <svg {...props}>
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
      );
    case "delivery":
      return (
        <svg {...props}>
          <path d="M3 7h11v10H3z" />
          <path d="M14 10h4l3 3v4h-7V10z" />
          <circle cx="7" cy="18" r="2" />
          <circle cx="18" cy="18" r="2" />
        </svg>
      );
    case "practical":
      return (
        <svg {...props}>
          <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
        </svg>
      );
    case "career":
      return (
        <svg {...props}>
          <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...props}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M8 3v4M16 3v4M3 10h18" />
          <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
        </svg>
      );
    case "guide":
      return (
        <svg {...props}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
        </svg>
      );
    case "free":
      return (
        <svg {...props}>
          <path d="M20 12v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7" />
          <path d="M12 2v12M8 8l4-4 4 4" />
        </svg>
      );
    default:
      return null;
  }
}

export default function HomeCoursesPreview({ courses = [], home = {}, site = {} }) {
  const { lang } = useLanguage();
  const hi = lang === "hi";

  const availableCourses = useMemo(
    () => courses.filter((c) => isCourseAvailable(c)),
    [courses]
  );

  const courseBySlug = useMemo(() => {
    const map = new Map();
    courses.forEach((c) => {
      if (c?.slug) map.set(c.slug, c);
    });
    return map;
  }, [courses]);

  const flagshipCourses = useMemo(() => {
    return FLAGSHIP_COURSE_SLUGS.map((slug) => courseBySlug.get(slug)).filter(Boolean).slice(0, FLAGSHIP_LIMIT);
  }, [courseBySlug]);

  const addonCourses = useMemo(() => {
    return availableCourses.filter((c) => isAddonCourse(c)).slice(0, ADDON_LIMIT);
  }, [availableCourses]);

  const visibleTabs = useMemo(() => {
    return FILTER_TABS.filter((tab) => {
      if (tab.id === "all") return true;
      return availableCourses.some((c) => tab.match(c));
    });
  }, [availableCourses]);

  const [active, setActive] = useState("all");

  const filtered = useMemo(() => {
    if (active === "short") {
      return availableCourses.filter((c) => isAddonCourse(c)).slice(0, ADDON_LIMIT);
    }
    const tab = FILTER_TABS.find((t) => t.id === active) || FILTER_TABS[0];
    const matched = availableCourses.filter((c) => tab.match(c));
    const flagships = matched.filter((c) => isFlagshipCourse(c));
    const rest = matched.filter((c) => !isFlagshipCourse(c));
    return [...flagships, ...rest].slice(0, FLAGSHIP_LIMIT);
  }, [availableCourses, active]);

  if (!courses.length) return null;

  const courseCount = site.coursesCount ? `${site.coursesCount}+` : COURSE_COUNT;
  const yearsExp = site.yearsExperience ?? Number(SITE_FACTS.yearsOfExperience.replace(/\+$/, ""));
  const students = site.studentsTaught || DEFAULT_STUDENTS_TAUGHT;
  const expressH = site.expressDeliveryHours || DEFAULT_EXPRESS_DELIVERY_HOURS;

  const labelFor = (item) => {
    if (item.key === "years") {
      return hi ? `${yearsExp}+ वर्षों का भरोसा` : `${yearsExp}+ Years of Trust`;
    }
    if (item.key === "courses") {
      return hi ? `${courseCount} कोर्स` : `${courseCount} Courses`;
    }
    if (item.key === "students") {
      return hi ? `${students}+ संतुष्ट छात्र` : `${students}+ Happy Students`;
    }
    if (item.key === "express") {
      return hi ? `${expressH} घंटे सिलाई डिलीवरी*` : `${expressH} Hours Stitching Delivery*`;
    }
    return hi ? item.hi : item.en;
  };

  const homeDefaults = PAGE_DEFAULTS.home;
  const eyebrow =
    pickPage(home, lang, "coursesEyebrow", "coursesEyebrowHi") ||
    (hi ? "हमारे लोकप्रिय कोर्स" : "Our Popular Courses");
  const titleLead =
    pickPage(home, lang, "academyHeading", "academyHeadingHi") ||
    (hi ? homeDefaults.academy_heading_hi : homeDefaults.academy_heading);
  const rawTitleHighlight =
    pickPage(home, lang, "academyHeadingHighlight", "academyHeadingHighlightHi") || "";
  const legacyAcademyHighlights = new Set(["in Patna, Bihar", "पटना, बिहार में", "Earn.", "कमाएँ."]);
  const titleHighlight = legacyAcademyHighlights.has(rawTitleHighlight) ? "" : rawTitleHighlight;
  const scriptTagline =
    pickPage(home, lang, "coursesScriptTagline", "coursesScriptTaglineHi") ||
    (hi ? homeDefaults.courses_script_tagline_hi : homeDefaults.courses_script_tagline);
  const rawIntro =
    pickPage(home, lang, "coursesSubtitle", "coursesSubtitleHi") ||
    (hi ? homeDefaults.courses_subtitle_hi : homeDefaults.courses_subtitle);
  const legacyIntros = new Set([
    "Whether you seek to develop a career in fashion or create an outfit that feels truly yours, Shreya Creation provides you with the excellence, craftsmanship, and mentorship to make it happen. If you are searching for the best boutique near me, explore our custom stitching services at Boutique Boring Road, Patna.",
    "From basics to advanced, choose the right course for your career.",
    "बेसिक से एडवांस्ड तक — अपने करियर के लिए सही कोर्स चुनें।",
  ]);
  const intro = legacyIntros.has(rawIntro)
    ? hi
      ? homeDefaults.courses_subtitle_hi
      : homeDefaults.courses_subtitle
    : rawIntro;
  const introParagraphs = intro
    ? intro
        .split(/\n\s*\n/)
        .map((para) => para.trim())
        .filter(Boolean)
    : [];
  const viewAllLabel =
    pickPage(home, lang, "coursesViewAll", "coursesViewAllHi") ||
    (hi ? `सभी ${courseCount} कोर्स देखें` : `View All ${courseCount} Courses`);
  const demoTitle =
    pickPage(home, lang, "coursesDemoTitle", "coursesDemoTitleHi") ||
    (hi ? "कौन सा कोर्स सही है, तय नहीं?" : "Not Sure Which Course is Right for You?");
  const demoSubtitle =
    pickPage(home, lang, "coursesDemoSubtitle", "coursesDemoSubtitleHi") ||
    (hi
      ? "मुफ़्त डेमो क्लास बुक करें और एक्सपर्ट गाइडेंस पाएँ।"
      : "Book a FREE Demo Class and get expert guidance.");
  const demoCta =
    pickPage(home, lang, "coursesDemoCta", "coursesDemoCtaHi") ||
    (hi ? "अभी मुफ़्त डेमो बुक करें" : "Book Free Demo Now");
  const demoNote =
    pickPage(home, lang, "coursesDemoNote", "coursesDemoNoteHi") ||
    (hi ? "सीमित सीटें — आज ही एनरोल करें!" : "Limited Seats – Enroll Today!");
  const addonTitle =
    pickPage(home, lang, "coursesAddonTitle", "coursesAddonTitleHi") ||
    (hi ? "शॉर्ट ऐड-ऑन मॉड्यूल" : "Short add-on modules");
  const addonSubtitle =
    pickPage(home, lang, "coursesAddonSubtitle", "coursesAddonSubtitleHi") ||
    (hi
      ? "मौजूदा छात्रों के लिए — नए एनरोलमेंट से पहले मुख्य कोर्स देखें।"
      : "For existing students — explore flagship courses first if you are new.");
  const openDemo = () => {
    openInquiryPopup({
      source: "home_courses_demo",
      message: demoClassMessage(hi ? "hi" : "en"),
    });
  };

  return (
    <section
      className={cn(
        PAGE_SECTION,
        PAGE_SECTION_BORDERED,
        "home-courses-preview",
        "text-ink",
        "relative",
        "z-20",
        "min-w-0",
        "w-full",
        "max-w-full",
        "overflow-x-clip"
      )}
    >
      <div className={cn(PAGE_CONTAINER, "min-w-0", "w-full")}>
        {/* Header */}
        <div className={cn(REVEAL, "home-courses-preview__intro", "in")}>
          <NextBatchBanner site={site} lang={lang} />
          <span className="home-courses-preview__eyebrow">
            <span aria-hidden>+</span>
            {eyebrow}
            <span aria-hidden>+</span>
          </span>

          <h2 className={cn(SECTION_TITLE, "home-courses-preview__title", "mt-2")}>
            {titleLead}
            {titleHighlight ? (
              <>
                {" "}
                <span className={cn(HIGHLIGHT_SHIMMER, "home-courses-preview__title-accent")}>
                  {titleHighlight}
                </span>
              </>
            ) : null}
          </h2>

          <p className="home-courses-preview__script">{scriptTagline}</p>

          <ul className="home-courses-preview__trust">
            {TRUST_BADGES.map((badge) => (
              <li key={badge.key || badge.en} className="home-courses-preview__trust-item">
                <span className="home-courses-preview__trust-icon">
                  <LineIcon type={badge.icon} />
                </span>
                <span>{labelFor(badge)}</span>
              </li>
            ))}
          </ul>

          {introParagraphs.length > 0 && (
            <SeoDisclosure lang={lang}>
              {introParagraphs.map((para, index) => (
                <p key={`courses-lead-${index}`} className="home-courses-preview__lead">
                  {para}
                </p>
              ))}
            </SeoDisclosure>
          )}
        </div>

        {/* Category tabs */}
        <div className={cn(REVEAL, "home-courses-preview__toolbar", "in")}>
          <div
            className="home-courses-preview__filters"
            role="tablist"
            aria-label={hi ? "कोर्स श्रेणी" : "Course categories"}
          >
            {visibleTabs.map((tab) => {
              const isSelected = active === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActive(tab.id)}
                  className={cn(
                    "home-courses-preview__pill",
                    isSelected && "home-courses-preview__pill--active"
                  )}
                >
                  <TabIcon type={tab.icon} />
                  <span>{hi ? tab.labelHi : tab.label}</span>
                </button>
              );
            })}
          </div>

          <Link href="/courses" className="home-courses-preview__view-all">
            {viewAllLabel}
            <span aria-hidden>→</span>
          </Link>
        </div>

        {/* Flagship course cards */}
        <div className="home-courses-preview__grid">
          {(active === "all" ? flagshipCourses : filtered).map((course, i) => (
            <div
              key={course.id ?? course.slug ?? `flagship-${i}`}
              className={cn(REVEAL, REVEAL_ZOOM, "in", "min-w-0", "h-full")}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <CourseCard
                course={course}
                variant="featured"
                featuredIndex={i}
                lang={lang}
              />
            </div>
          ))}
        </div>

        {!flagshipCourses.length && !filtered.length && (
          <p className="home-courses-preview__empty">
            {hi
              ? "इस श्रेणी में अभी कोई कोर्स उपलब्ध नहीं है।"
              : "No courses are currently open in this category."}
          </p>
        )}

        {addonCourses.length > 0 && active !== "short" && (
          <div className={cn(REVEAL, "home-courses-preview__addon-section", "in", "mt-10", "sm:mt-12")}>
            <h3 className="home-courses-preview__addon-title">{addonTitle}</h3>
            <p className="home-courses-preview__addon-sub text-sm text-muted mt-1 mb-4">{addonSubtitle}</p>
            <div className="home-courses-preview__grid home-courses-preview__grid--addon">
              {addonCourses.map((course, i) => (
                <div
                  key={course.id ?? course.slug ?? `addon-${i}`}
                  className={cn(REVEAL, REVEAL_ZOOM, "in", "min-w-0", "h-full")}
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <CourseCard course={course} variant="featured" featuredIndex={i} lang={lang} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={cn(REVEAL, "mt-8", "sm:mt-10", "in")}>
          <FeeStructureLeadMagnet lang={lang} />
        </div>

        {/* Feature strip */}
        <ul className={cn(REVEAL, "home-courses-preview__features", "in")}>
          {FEATURE_STRIP.map((item) => (
            <li key={item.en} className="home-courses-preview__feature">
              <span className="home-courses-preview__feature-icon">
                <LineIcon type={item.icon} />
              </span>
              <span>{hi ? item.hi : item.en}</span>
            </li>
          ))}
        </ul>

        {/* Demo CTA */}
        <div className={cn(REVEAL, "home-courses-preview__demo", "in")}>
          <div className="home-courses-preview__demo-icon" aria-hidden>
            <LineIcon type="calendar" />
          </div>
          <div className="home-courses-preview__demo-copy">
            <p className="home-courses-preview__demo-title">{demoTitle}</p>
            <p>{demoSubtitle}</p>
            <ul className="home-courses-preview__demo-perks">
              <li>
                <LineIcon type="calendar" />
                <span>{hi ? "3 दिन मुफ़्त डेमो क्लास" : "3 Days Free Demo Class"}</span>
              </li>
              <li>
                <LineIcon type="guide" />
                <span>{hi ? "एक्सपर्ट गाइडेंस" : "Expert Guidance"}</span>
              </li>
              <li>
                <LineIcon type="free" />
                <span>{hi ? "100% मुफ़्त — कोई बाध्यता नहीं" : "100% Free No Obligation"}</span>
              </li>
            </ul>
          </div>
          <div className="home-courses-preview__demo-action">
            <button type="button" className="home-courses-preview__demo-btn" onClick={openDemo}>
              {demoCta}
              <span aria-hidden>→</span>
            </button>
            <span className="home-courses-preview__demo-note">{demoNote}</span>
          </div>
        </div>

      </div>

      {/* Course SEO H2 + H3 keywords */}
      <div className="home-courses-preview__keywords" aria-label={hi ? "कोर्स कीवर्ड" : "Course keywords"}>
        <div className={cn(PAGE_CONTAINER, "home-courses-preview__keywords-inner")}>
          <h2 className="home-courses-preview__why-title">
            {pickPage(home, lang, "coursesWhyTitle", "coursesWhyTitleHi") ||
              (hi
                ? "बुटीक मास्टर कोर्स और फैशन डिज़ाइनिंग कोर्स"
                : "Boutique Master Course & Fashion Designing Course")}
          </h2>
          <p className="home-courses-preview__context">
            {hi ? (
              <>
                पटना में फैशन डिज़ाइनिंग और बुटीक प्रबंधन सीखें —{" "}
                <Link href="/courses" className="home-courses-preview__context-link">
                  सभी कोर्स देखें
                </Link>
                ।
              </>
            ) : (
              <>
                Learn fashion designing and boutique management in Patna —{" "}
                <Link href="/courses" className="home-courses-preview__context-link">
                  view all courses
                </Link>
                .
              </>
            )}
          </p>
        </div>
      </div>

      <span className="sr-only">
        {SITE_STATS.yearsEn} · {SITE_STATS.studentsEn}
      </span>
    </section>
  );
}
