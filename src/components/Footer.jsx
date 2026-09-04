"use client";

import { REVEAL } from "@/lib/ui";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { waLink, greetingMessage } from "@/lib/whatsapp";
import { useLanguage } from "@/components/LanguageProvider";
import { UI, pickLocalized, pickBrandMessage } from "@/lib/i18n";
import { localizedPath } from "@/lib/locale";
import { LOGO_SRC, normalizeBrandName } from "@/lib/brand";
import OptimizedImage from "@/components/OptimizedImage";
import { PRODUCTION_URL, SITE_DOMAIN } from "@/lib/siteUrl";
import { formatPhoneDisplay, telHref, EXPRESS_DELIVERY_DISCLAIMER, computeYearsExperience, DEFAULT_FOUNDING_YEAR, DEFAULT_STUDENTS_TAUGHT, DEFAULT_OUTFITS_DELIVERED, COURSE_COUNT } from "@/lib/site-config";

const NAV_ROUTES = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/shop", key: "boutique" },
  { href: "/courses", key: "institute" },
  { href: "/register", key: "register" },
  { href: "/portfolio", key: "gallery" },
  { href: "/blog", key: "blog" },
  { href: "/faq", key: "faq" },
  { href: "/nri-clients", key: "nriClients" },
  { href: "/contact", key: "contact" },
];

const POLICY_ROUTES = [
  { href: "/policies/privacy", key: "privacy" },
  { href: "/policies/shipping", key: "shipping" },
  { href: "/policies/returns", key: "returns" },
  { href: "/policies/terms", key: "terms" },
  { href: "/policies/course-cancellation", key: "courseCancellation" },
];

const COURSE_LINKS = [
  {
    href: "/courses/fashion-designing-course",
    icon: "dress",
    title: "Fashion Designing Course",
    titleHi: "फैशन डिज़ाइनिंग कोर्स",
    note: "From Basic to Advance",
    noteHi: "बेसिक से एडवांस तक",
  },
  {
    href: "/courses/blouse-suit-making-course",
    icon: "scissors",
    title: "Blouse & Suit Making",
    titleHi: "ब्लाउज़ और सूट मेकिंग",
    note: "Cutting & Stitching, Practical",
    noteHi: "कटिंग और सिलाई, प्रैक्टिकल",
  },
  {
    href: "/courses/basic-boutique-course",
    icon: "store",
    title: "Basic Boutique Mastery",
    titleHi: "बेसिक बुटीक मास्टरी",
    note: "Management & Operations",
    noteHi: "मैनेजमेंट और ऑपरेशंस",
  },
  {
    href: "/courses/advanced-boutique-course",
    icon: "crown",
    title: "Advanced Boutique Course",
    titleHi: "एडवांस्ड बुटीक कोर्स",
    note: "Start Your Boutique Business",
    noteHi: "अपना बुटीक बिज़नेस शुरू करें",
  },
  {
    href: "/courses/lehenga-design-course-patna",
    icon: "sparkle",
    title: "Lehenga Design Course",
    titleHi: "लहंगा डिजाइनिंग कोर्स",
    note: "Bridal, Gown & Designer Wear",
    noteHi: "ब्राइडल, गाउन और डिज़ाइनर वियर",
  },
  {
    href: "/courses/kids-wear-course",
    icon: "growth",
    title: "Kids Wear Course",
    titleHi: "किड्स वियर कोर्स",
    note: "Complete Kids Collection",
    noteHi: "पूरा किड्स कलेक्शन",
  },
];

function whyChooseUs(site, lang) {
  const years = site?.yearsExperience ?? computeYearsExperience(site?.foundingYear ?? DEFAULT_FOUNDING_YEAR);
  const yearsLabel = `${years}+`;
  const founded = site?.foundingYear ?? DEFAULT_FOUNDING_YEAR;
  const hours = site?.expressDeliveryHours || 24;
  const coursesLabel = site?.coursesCount ? `${site.coursesCount}+` : COURSE_COUNT;
  const hi = lang === "hi";
  return [
    {
      icon: "award",
      title: hi ? `${yearsLabel} वर्षों का भरोसा` : `${yearsLabel} Years of Trust`,
      note: hi ? `${founded} से` : `Since ${founded}`,
    },
    {
      icon: "store",
      title: hi ? "पटना का बेस्ट डिज़ाइनर बुटीक" : "Best Designer Boutique",
      note: hi ? "ब्राइडल बुटीक और लेडीज़ टेलर्स" : "Bridal Boutique & Ladies Tailors in Patna",
    },
    {
      icon: "scissors",
      title: hi ? "डिज़ाइनर ब्लाउज़, लहंगा, सूट" : "Designer Blouse, Lehenga, Suit",
      note: hi ? "गाउन और प्रीमियम स्टिचिंग" : "Gown & Premium Stitching",
    },
    {
      icon: "bolt",
      highlight: true,
      title: `मात्र ${hours} घंटे में सिले कपड़े प्राप्त करें`,
      note: hi ? `एक्सप्रेस डिलीवरी — ${hours} घंटे में*` : `Express Delivery in ${hours} Hours*`,
    },
    {
      icon: "cap",
      title: hi ? "फैशन डिज़ाइनिंग और बुटीक कोर्स" : "Fashion Designing & Boutique Courses",
      note: hi ? `${coursesLabel} कोर्स उपलब्ध` : `${coursesLabel} courses offered`,
    },
    {
      icon: "check",
      title: hi ? "100% प्रैक्टिकल ट्रेनिंग" : "Hands-on Practical Training",
      note: hi ? "प्लेसमेंट सहायता | ट्रायल सुविधा" : "Placement Assistance | Trial Facility",
    },
    {
      icon: "globe",
      title: hi ? "पटना, बोरिंग रोड, ईस्ट बोरिंग कैनाल रोड" : "Patna, Boring Road, East Boring Canal Road",
      note: hi ? "बिहार और NRI क्लाइंट्स" : "Bihar & NRI Clients Welcome",
    },
  ];
}

const ICON_PATHS = {
  award: (
    <>
      <circle cx="12" cy="8.5" r="5.5" />
      <path d="M8.2 13.2L7 22l5-2.8L17 22l-1.2-8.8" />
    </>
  ),
  store: (
    <>
      <path d="M3.5 9.5L5 4h14l1.5 5.5" />
      <path d="M4.5 9.5v10h15v-10" />
      <path d="M9.5 19.5v-5.5h5v5.5" />
      <path d="M3.5 9.5a2.6 2.6 0 004.25 0 2.6 2.6 0 004.25 0 2.6 2.6 0 004.25 0 2.6 2.6 0 004.25 0" />
    </>
  ),
  scissors: (
    <>
      <circle cx="6" cy="6" r="2.6" />
      <circle cx="6" cy="18" r="2.6" />
      <path d="M20 4L8.4 15.6M14.2 14.4L20 20M8.4 8.4L12 12" />
    </>
  ),
  bolt: <path d="M13.5 2L4 13.5h6.5L10 22l9.5-11.5H13z" />,
  cap: (
    <>
      <path d="M12 4.5L2.5 9.2 12 14l9.5-4.8z" />
      <path d="M6.5 11.4v4.9c0 1.4 2.5 2.7 5.5 2.7s5.5-1.3 5.5-2.7v-4.9" />
    </>
  ),
  check: (
    <>
      <path d="M12 2.8l7.5 3v6c0 4.4-3.1 8.2-7.5 9.4-4.4-1.2-7.5-5-7.5-9.4v-6z" />
      <path d="M9 12l2.2 2.2L15.4 10" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z" />
    </>
  ),
  dress: (
    <>
      <path d="M9.5 3l2.5 2 2.5-2" />
      <path d="M9.5 3l-1 4.5L12 10l3.5-2.5L14.5 3" />
      <path d="M8.5 7.5L5.5 21h13L15.5 7.5" />
    </>
  ),
  crown: (
    <>
      <path d="M3 7.5l4.2 4L12 4l4.8 7.5L21 7.5V18H3z" />
      <path d="M3 21h18" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
      <path d="M18.5 16.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" />
    </>
  ),
  growth: (
    <>
      <path d="M3 17l5.5-5.5 3.5 3.5L21 6" />
      <path d="M15 6h6v6" />
    </>
  ),
  phone: (
    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  ),
  mail: <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
  pin: (
    <>
      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <circle cx="12" cy="11" r="2.6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.4l3.4 2" />
    </>
  ),
  web: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3.6 9h16.8M3.6 15h16.8M12 3c2.2 2.6 3.3 5.7 3.3 9S14.2 18.4 12 21c-2.2-2.6-3.3-5.7-3.3-9S9.8 5.6 12 3z" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.4" />
      <path d="M2.8 20c0-3.3 2.8-5.6 6.2-5.6s6.2 2.3 6.2 5.6" />
      <path d="M16.2 5.2a3.4 3.4 0 010 6.4M17.4 14.8c2.4.6 3.8 2.5 3.8 5.2" />
    </>
  ),
  hanger: (
    <>
      <path d="M12 8.5V7.4a2.2 2.2 0 112.2-2.2" />
      <path d="M12 8.5L3.4 15c-1 .8-.5 2.5.8 2.5h15.6c1.3 0 1.8-1.7.8-2.5L12 8.5z" />
    </>
  ),
  ruler: (
    <>
      <path d="M3.8 14.4L14.4 3.8l5.8 5.8L9.6 20.2z" />
      <path d="M8 8.6l1.8 1.8M10.9 5.7l1.8 1.8M5.1 11.5l1.8 1.8" />
    </>
  ),
  briefcase: (
    <>
      <rect x="2.8" y="7.2" width="18.4" height="13" rx="2.2" />
      <path d="M8.4 7.2V5.6a2 2 0 012-2h3.2a2 2 0 012 2v1.6M2.8 12.4h18.4" />
    </>
  ),
};

function Icon({ name, className = "h-4 w-4" }) {
  const paths = ICON_PATHS[name];
  if (!paths) return null;
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {paths}
    </svg>
  );
}

function ColTitle({ children }) {
  return (
    <h2 className="sf-col-title">
      <span>{children}</span>
    </h2>
  );
}

function SocialIcon({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="footer-social-icon sf-social"
    >
      {children}
    </a>
  );
}

export default function Footer({ site }) {
  const { lang } = useLanguage();
  const t = UI[lang];
  const hi = lang === "hi";
  const navLinks = NAV_ROUTES.map((r) => ({ href: localizedPath(r.href, lang), label: t[r.key] }));
  const policyLinks = POLICY_ROUTES.map((r) => ({ href: localizedPath(r.href, lang), label: t[r.key] }));
  const wa = waLink(site?.whatsapp, greetingMessage(lang));
  const brandMessage = pickBrandMessage(site);
  const intro = pickLocalized(site, lang, "intro", "introHi");
  const brandName = normalizeBrandName(site?.brand);

  const years = site?.yearsExperience ?? computeYearsExperience(site?.foundingYear ?? DEFAULT_FOUNDING_YEAR);
  const yearsLabel = `${years}+`;
  const foundingYear = site?.foundingYear ?? DEFAULT_FOUNDING_YEAR;
  const expressHours = site?.expressDeliveryHours || 24;
  const students = site?.studentsTaught ?? DEFAULT_STUDENTS_TAUGHT;
  const outfits = site?.outfitsDelivered ?? DEFAULT_OUTFITS_DELIVERED;

  const phoneHref = telHref(site?.phonePrimary);
  const directionsUrl = site?.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address)}`
    : site?.mapEmbedUrl;

  const reasons = whyChooseUs(site, lang);

  const stats = [
    {
      icon: "award",
      value: yearsLabel,
      label: hi ? "वर्षों का भरोसा" : "Years of Trust",
      note: hi ? `${foundingYear} से` : `Since ${foundingYear}`,
    },
    {
      icon: "users",
      value: `${students}+`,
      label: hi ? "छात्राएँ" : "Students",
      note: hi ? "प्रशिक्षित" : "Trained",
    },
    {
      icon: "hanger",
      value: `${outfits}+`,
      label: hi ? "आउटफिट्स" : "Outfits",
      note: hi ? "डिलीवर किए" : "Delivered",
    },
    {
      icon: "ruler",
      value: null,
      label: hi ? "परफेक्ट फिटिंग" : "Perfect Fitting",
      note: hi ? "और ट्रायल सुविधा" : "& Trial Facility",
    },
    {
      icon: "check",
      value: null,
      label: hi ? "प्रैक्टिकल" : "Practical",
      note: hi ? "ट्रेनिंग" : "Training",
    },
    {
      icon: "briefcase",
      value: null,
      label: hi ? "प्लेसमेंट" : "Placement",
      note: hi ? "सहायता" : "Assistance",
    },
  ];

  const areas = hi
    ? ["पटना", "बोरिंग रोड", "ईस्ट बोरिंग कैनाल रोड", "बिहार", "NRI क्लाइंट्स"]
    : ["Patna", "Boring Road", "East Boring Canal Road", "Bihar", "NRI Clients Welcome"];

  const promises = hi
    ? ["महिला सशक्तिकरण", "करियर निर्माण", "बिज़नेस निर्माण"]
    : ["Empowering Women", "Creating Careers", "Building Businesses"];

  return (
    <footer className="sf-foot relative z-[2] overflow-hidden">
      <div className="sf-foot__topline" aria-hidden />
      <div className="sf-foot__glow sf-foot__glow--left" aria-hidden />
      <div className="sf-foot__glow sf-foot__glow--right" aria-hidden />

      <div className="relative footer-glass border-t border-gold/25">
        <div className="mx-auto max-w-7xl px-4 sm:px-5 pt-10 sm:pt-14 lg:pt-16">
          <div className="sf-foot__grid">
            {/* ── Brand ── */}
            <div className={cn(REVEAL, "sf-col sf-col--brand")}>
              <p className="sf-since" aria-hidden>
                <span>{hi ? `${foundingYear} से` : `Since ${foundingYear}`}</span>
              </p>

              <OptimizedImage src={LOGO_SRC} alt={brandName} width={150} height={95} sizes="150px" loading="lazy" className="sf-logo" />

              <p className="sf-brand-sub">{hi ? "बुटीक और इंस्टिट्यूट" : "Boutique & Institute"}</p>
              <p className="sf-brand-ribbon">
                {hi ? `${yearsLabel} वर्षों का भरोसा` : `${yearsLabel} Years of Trust`}
              </p>

              <p className="sf-brand-copy">
                {intro ||
                  "Empowering learners with practical fashion skills, bespoke stitching, and creative education."}
              </p>

              <p className="sf-brand-message">{brandMessage}</p>

              <div className="sf-cta-row">
                {phoneHref && (
                  <a href={phoneHref} className="sf-cta">
                    <Icon name="phone" className="h-4 w-4" />
                    <span>
                      <strong>{hi ? "कॉल करें" : "Call Now"}</strong>
                      <small>{formatPhoneDisplay(site?.phonePrimary)}</small>
                    </span>
                  </a>
                )}
                <a href={wa} target="_blank" rel="noopener noreferrer" className="sf-cta sf-cta--wa">
                  <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.436.002 9.861-4.417 9.864-9.858.002-2.636-1.02-5.115-2.879-6.978-1.859-1.862-4.331-2.887-6.974-2.889-5.439 0-9.864 4.417-9.868 9.86-.001 1.57.418 3.101 1.21 4.47l-.995 3.633 3.738-.979c1.378.75 2.766 1.139 4.239 1.14z" />
                  </svg>
                  <span>
                    <strong>WhatsApp</strong>
                    <small>{formatPhoneDisplay(site?.phonePrimary)}</small>
                  </span>
                </a>
                {directionsUrl && (
                  <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="sf-cta">
                    <Icon name="pin" className="h-4 w-4" />
                    <span>
                      <strong>{hi ? "रास्ता" : "Directions"}</strong>
                      <small>{hi ? "मैप देखें" : "View Map"}</small>
                    </span>
                  </a>
                )}
              </div>
            </div>

            {/* ── Why choose us ── */}
            <div className={cn(REVEAL, "sf-col")} style={{ transitionDelay: "60ms" }}>
              <ColTitle>{hi ? "हमें क्यों चुनें?" : "Why Choose Us?"}</ColTitle>
              <ul className="sf-reasons">
                {reasons.map((r) => (
                  <li key={r.title} className={cn("sf-reason", r.highlight && "sf-reason--hero")}>
                    <span className="sf-reason__icon">
                      <Icon name={r.icon} className="h-[15px] w-[15px]" />
                    </span>
                    <span className="sf-reason__body">
                      <strong>{r.title}</strong>
                      <small>{r.note}</small>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Quick links ── */}
            <div className={cn(REVEAL, "sf-col")} style={{ transitionDelay: "110ms" }}>
              <ColTitle>{hi ? "त्वरित लिंक" : "Quick Links"}</ColTitle>
              <ul className="sf-links">
                {navLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="sf-link">
                      <span className="sf-link__arrow" aria-hidden>
                        ›
                      </span>
                      <span>{l.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Courses ── */}
            <div className={cn(REVEAL, "sf-col")} style={{ transitionDelay: "160ms" }}>
              <ColTitle>{hi ? "हमारे कोर्स (इंस्टिट्यूट)" : "Our Courses (Institute)"}</ColTitle>
              <ul className="sf-courses">
                {COURSE_LINKS.map((c) => (
                  <li key={c.href}>
                    <Link href={localizedPath(c.href, lang)} className="sf-course">
                      <span className="sf-course__icon">
                        <Icon name={c.icon} className="h-[15px] w-[15px]" />
                      </span>
                      <span className="sf-course__body">
                        <strong>{hi ? c.titleHi : c.title}</strong>
                        <small>{hi ? c.noteHi : c.note}</small>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="sf-course-badge">{hi ? "हाथों-हाथ प्रैक्टिकल ट्रेनिंग" : "Hands-on Practical Training"}</p>
              <p className="sf-course-ribbon">
                {hi ? "प्लेसमेंट सहायता" : "Placement Assistance"}
              </p>
            </div>

            {/* ── Contact ── */}
            <div className={cn(REVEAL, "sf-col")} style={{ transitionDelay: "210ms" }}>
              <ColTitle>{hi ? "संपर्क करें" : "Contact Us"}</ColTitle>
              <ul className="sf-contact">
                {site?.address && (
                  <li>
                    <span className="sf-contact__icon">
                      <Icon name="pin" />
                    </span>
                    <span className="sf-contact__text">{site.address}</span>
                  </li>
                )}
                {(site?.phonePrimary || site?.phoneSecondary) && (
                  <li>
                    <span className="sf-contact__icon">
                      <Icon name="phone" />
                    </span>
                    <span className="sf-contact__text sf-contact__text--stack">
                      {site.phonePrimary && (
                        <a href={telHref(site.phonePrimary)}>{formatPhoneDisplay(site.phonePrimary)}</a>
                      )}
                      {site.phoneSecondary && (
                        <a href={telHref(site.phoneSecondary)}>
                          {formatPhoneDisplay(site.phoneSecondary)}
                          {!hi && " (Call only)"}
                          {hi && " (केवल कॉल)"}
                        </a>
                      )}
                    </span>
                  </li>
                )}
                <li>
                  <span className="sf-contact__icon">
                    <Icon name="web" />
                  </span>
                  <span className="sf-contact__text">
                    <a href={PRODUCTION_URL} aria-label={`Visit Shreya Creation website (${SITE_DOMAIN})`}>
                      {SITE_DOMAIN}
                    </a>
                  </span>
                </li>
                {site?.email && (
                  <li>
                    <span className="sf-contact__icon">
                      <Icon name="mail" />
                    </span>
                    <span className="sf-contact__text">
                      <a href={`mailto:${site.email}`} className="break-all">
                        {site.email}
                      </a>
                    </span>
                  </li>
                )}
                {site?.studioHours && (
                  <li>
                    <span className="sf-contact__icon">
                      <Icon name="clock" />
                    </span>
                    <span className="sf-contact__text sf-contact__text--stack">
                      <span>{site.studioHours}</span>
                      {site.closedDays && (
                        <small className="text-subtle">
                          {hi ? `${site.closedDays} बंद` : `Closed on ${site.closedDays}`}
                        </small>
                      )}
                    </span>
                  </li>
                )}
              </ul>

              <p className="sf-follow-label">{hi ? "फ़ॉलो करें" : "Follow Us"}</p>
              <div className="sf-social-row">
                {site?.socials?.instagram && (
                  <SocialIcon href={site.socials.instagram} label="Shreya Creation on Instagram">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </SocialIcon>
                )}
                {site?.socials?.facebook && (
                  <SocialIcon href={site.socials.facebook} label="Shreya Creation on Facebook">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </SocialIcon>
                )}
                {site?.socials?.youtube && (
                  <SocialIcon href={site.socials.youtube} label="Shreya Creation on YouTube">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </SocialIcon>
                )}
                <SocialIcon href={wa} label="Shreya Creation on WhatsApp">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.436.002 9.861-4.417 9.864-9.858.002-2.636-1.02-5.115-2.879-6.978-1.859-1.862-4.331-2.887-6.974-2.889-5.439 0-9.864 4.417-9.868 9.86-.001 1.57.418 3.101 1.21 4.47l-.995 3.633 3.738-.979c1.378.75 2.766 1.139 4.239 1.14z" />
                  </svg>
                </SocialIcon>
                {site?.googleReviewsUrl && (
                  <SocialIcon href={site.googleReviewsUrl} label="Shreya Creation on Google Reviews">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.344-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
                    </svg>
                  </SocialIcon>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats band ── */}
        <div className="sf-band">
          <div className="mx-auto max-w-7xl px-4 sm:px-5 py-7 sm:py-9">
            <div className="sf-stats">
              {stats.slice(0, 3).map((s) => (
                <div key={s.label} className="sf-stat">
                  <span className="sf-stat__icon">
                    <Icon name={s.icon} className="h-5 w-5" />
                  </span>
                  {s.value && <strong className="sf-stat__value">{s.value}</strong>}
                  <span className="sf-stat__label">{s.label}</span>
                  <small className="sf-stat__note">{s.note}</small>
                </div>
              ))}

              <div className="sf-medal">
                <p className="sf-medal__hi">
                  मात्र {expressHours} घंटे में
                  <br />
                  सिले कपड़े प्राप्त करें
                </p>
                <p className="sf-medal__en">
                  {hi ? "एक्सप्रेस डिलीवरी" : "Express Delivery"}
                  <br />
                  <span>{hi ? `${expressHours} घंटे में*` : `In ${expressHours} Hours*`}</span>
                </p>
                <p className="sf-medal__strip">{hi ? "कोई अतिरिक्त शुल्क नहीं*" : "No Extra Charge*"}</p>
                <p className="sf-medal__disclaimer text-subtle text-xs mt-2 px-2">
                  {EXPRESS_DELIVERY_DISCLAIMER[hi ? "hi" : "en"]}
                </p>
              </div>

              {stats.slice(3).map((s) => (
                <div key={s.label} className="sf-stat">
                  <span className="sf-stat__icon">
                    <Icon name={s.icon} className="h-5 w-5" />
                  </span>
                  {s.value && <strong className="sf-stat__value">{s.value}</strong>}
                  <span className="sf-stat__label">{s.label}</span>
                  <small className="sf-stat__note">{s.note}</small>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Areas + brand promise strip ── */}
        <div className="sf-strip">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 sm:px-5 py-4 lg:flex-row lg:justify-between">
            <ul className="sf-strip__list">
              {areas.map((a) => (
                <li key={a}>
                  <Icon name="pin" className="h-3 w-3" />
                  {a}
                </li>
              ))}
            </ul>

            <p className="sf-strip__script">
              <span aria-hidden>✦</span>
              Kaushal Se Karobar Tak
              <span aria-hidden>✦</span>
            </p>

            <ul className="sf-strip__list sf-strip__list--end">
              {promises.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="sf-bottom site-footer-bottom">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 sm:px-5 py-4 text-center lg:flex-row lg:justify-between lg:gap-4 lg:text-left">
            <p className="sf-bottom__copy">
              © {new Date().getFullYear()} {brandName} {hi ? "बुटीक और इंस्टिट्यूट" : "Boutique & Institute"}.{" "}
              {hi ? "सर्वाधिकार सुरक्षित।" : "All Rights Reserved."}
              <span className="sf-bottom__sep" aria-hidden>
                |
              </span>
              {hi ? `${foundingYear} से` : `Since ${foundingYear}`}
              <span className="sf-bottom__sep" aria-hidden>
                |
              </span>
              {hi ? `${yearsLabel} वर्षों का भरोसा` : `${yearsLabel} Years of Trust`}
            </p>

            <div className="sf-bottom__links">
              {policyLinks.map((p) => (
                <Link key={p.href} href={p.href}>
                  {p.label}
                </Link>
              ))}
              <span className="sf-bottom__made">{hi ? "प्यार से बनाया गया" : "Made with Passion"}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
