"use client";

import {
  HIGHLIGHT_SHIMMER,
  HOME_BAND_WHITE,
  PAGE_CONTAINER,
  PAGE_SECTION,
  PAGE_SECTION_BORDERED,
  PAGE_SECTION_TIGHT_TOP,
  REVEAL,
  SECTION_EYEBROW,
  SECTION_HEADER_GLASS,
  SECTION_TITLE,
  SPARKLE_PULSE,
} from "@/lib/ui";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { SITE } from "@/lib/seed";
import { greetingMessage, shaktiMessage, stitchOrderMessage, telLink, waLink } from "@/lib/whatsapp";

const CARDS = [
  {
    key: "courses",
    href: "/courses",
    icon: "graduation",
    title: "Institute Courses",
    titleHi: "इंस्टिट्यूट कोर्स",
    tagline: "Learn • Practice • Earn",
    taglineHi: "सीखें • प्रैक्टिस • कमाई",
    items: [
      { label: "Fashion Designing Courses", labelHi: "फैशन डिज़ाइनिंग कोर्स" },
      { label: "Boutique Management", labelHi: "बुटीक मैनेजमेंट" },
      { label: "NIFT • NID • UCEED Coaching", labelHi: "NIFT • NID • UCEED कोचिंग" },
      { label: "Embroidery & Pattern Making", labelHi: "एम्ब्रॉयडरी व पैटर्न मेकिंग" },
      { label: "Internship & Placement Support", labelHi: "इंटर्नशिप व प्लेसमेंट सपोर्ट" },
    ],
    cta: "Explore Courses",
    ctaHi: "कोर्स देखें",
  },
  {
    key: "boutique",
    href: "/shop",
    icon: "mannequin",
    title: "Boutique Services",
    titleHi: "बुटीक सेवाएँ",
    tagline: "Premium Custom Stitching",
    taglineHi: "प्रीमियम कस्टम सिलाई",
    columns: [
      {
        heading: "Custom Stitching",
        headingHi: "कस्टम सिलाई",
        items: [
          { label: "Designer Blouse", labelHi: "डिज़ाइनर ब्लाउज" },
          { label: "Suits & Kurtis", labelHi: "सूट व कुर्ती" },
          { label: "Alteration & Fitting", labelHi: "अल्टरेशन व फिटिंग" },
          { label: "24 Hour Delivery", labelHi: "24 घंटे डिलीवरी" },
        ],
      },
      {
        heading: "Designer Wear",
        headingHi: "डिज़ाइनर वियर",
        items: [
          { label: "Bridal Lehengas", labelHi: "ब्राइडल लहंगा" },
          { label: "Gown & Indo-Western", labelHi: "गाउन व इंडो-वेस्टर्न" },
          { label: "Saree Pre-Stitching", labelHi: "साड़ी प्री-स्टिचिंग" },
          { label: "Premium Finishing", labelHi: "प्रीमियम फिनिशिंग" },
        ],
      },
    ],
    cta: "Book Stitching",
    ctaHi: "सिलाई बुक करें",
  },
  {
    key: "collection",
    href: "/portfolio",
    icon: "blouse",
    title: "Designer Collection",
    titleHi: "डिज़ाइनर कलेक्शन",
    tagline: "Latest. Exclusive. Elegant.",
    taglineHi: "लेटेस्ट. एक्सक्लूसिव. एलिगेंट.",
    items: [
      { label: "Latest Blouse Designs", labelHi: "लेटेस्ट ब्लाउज डिज़ाइन" },
      { label: "Bridal & Party Wear", labelHi: "ब्राइडल व पार्टी वियर" },
      { label: "Saree & Lehenga Collection", labelHi: "साड़ी व लहंगा कलेक्शन" },
      { label: "Trending Designs Gallery", labelHi: "ट्रेंडिंग डिज़ाइन गैलरी" },
    ],
    cta: "View Collection",
    ctaHi: "कलेक्शन देखें",
  },
  {
    key: "shop",
    href: "/shop",
    icon: "bag",
    badge: "New",
    badgeHi: "नया",
    title: "Purchase Now",
    titleHi: "अभी खरीदें",
    tagline: "Shop Designer Wear Online",
    taglineHi: "ऑनलाइन डिज़ाइनर वियर खरीदें",
    items: [
      { label: "Designer Blouses", labelHi: "डिज़ाइनर ब्लाउज" },
      { label: "Ready-to-Wear Outfits", labelHi: "रेडी-टू-वेयर आउटफिट" },
      { label: "Accessories & More", labelHi: "एक्सेसरीज़ व अधिक" },
      { label: "Secure & Easy Shopping", labelHi: "सुरक्षित व आसान शॉपिंग" },
    ],
    cta: "Shop Now",
    ctaHi: "अभी खरीदें",
  },
  {
    key: "student",
    href: "/portfolio",
    icon: "sewing",
    title: "Student Work",
    titleHi: "स्टूडेंट वर्क",
    tagline: "Real Hands. Real Skills.",
    taglineHi: "असली हाथ. असली हुनर.",
    items: [
      { label: "Student Projects", labelHi: "स्टूडेंट प्रोजेक्ट" },
      { label: "Classroom Creations", labelHi: "क्लासरूम क्रिएशन्स" },
      { label: "Before & After Work", labelHi: "बिफोर एंड आफ्टर वर्क" },
      { label: "Practical Training Results", labelHi: "प्रैक्टिकल ट्रेनिंग रिजल्ट" },
    ],
    cta: "View Student Work",
    ctaHi: "स्टूडेंट वर्क देखें",
  },
  {
    key: "shakti",
    href: "/contact",
    icon: "shakti",
    title: "Shakti 50",
    titleHi: "शक्ति 50",
    tagline: "Kaushal se Karobar Tak",
    taglineHi: "कौशल से कारोबार तक",
    items: [
      { label: "Free Training for 50 Women", labelHi: "50 महिलाओं के लिए मुफ़्त ट्रेनिंग" },
      { label: "Skill Development", labelHi: "कौशल विकास" },
      { label: "Self-Reliance & Empowerment", labelHi: "आत्मनिर्भरता व सशक्तिकरण" },
      { label: "Internship & Business Support", labelHi: "इंटर्नशिप व बिज़नेस सपोर्ट" },
    ],
    cta: "Know More",
    ctaHi: "और जानें",
  },
  {
    key: "stories",
    href: "/about",
    icon: "trophy",
    title: "Success Stories",
    titleHi: "सफलता की कहानियाँ",
    tagline: "Trusted by Thousands",
    taglineHi: "हज़ारों का भरोसा",
    items: [
      { label: "Google Reviews", labelHi: "Google रिव्यू" },
      { label: "Student Testimonials", labelHi: "स्टूडेंट टेस्टिमोनियल" },
      { label: "Customer Feedback", labelHi: "कस्टमर फीडबैक" },
      { label: "Success Journey", labelHi: "सफलता की यात्रा" },
    ],
    cta: "Read Reviews",
    ctaHi: "रिव्यू पढ़ें",
  },
  {
    key: "contact",
    href: "/contact",
    icon: "phone",
    title: "Contact & Visit",
    titleHi: "संपर्क व विज़िट",
    tagline: "We are here for you",
    taglineHi: "हम आपके लिए यहाँ हैं",
    items: [
      { label: "WhatsApp Support", labelHi: "WhatsApp सपोर्ट" },
      { label: "Call Now", labelHi: "अभी कॉल करें" },
      { label: "Visit Our Studio", labelHi: "हमारा स्टूडियो देखें" },
      { label: "Get Direction", labelHi: "दिशा पाएँ" },
    ],
    cta: "Contact Us",
    ctaHi: "संपर्क करें",
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

function ExploreIcon({ type }) {
  const common = {
    viewBox: "0 0 64 64",
    fill: "none",
    "aria-hidden": true,
    className: "quick-explore-card__icon-svg",
  };

  switch (type) {
    case "graduation":
      return (
        <svg {...common}>
          <path d="M8 28l24-12 24 12-24 12L8 28z" fill="#CC4F06" opacity="0.9" />
          <path d="M16 34v10c0 4 8 8 16 8s16-4 16-8V34" stroke="#8B4513" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M52 28v14" stroke="#8B4513" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="18" y="40" width="10" height="3" rx="1" fill="#D4AF37" />
          <rect x="36" y="40" width="10" height="3" rx="1" fill="#D4AF37" />
        </svg>
      );
    case "mannequin":
      return (
        <svg {...common}>
          <ellipse cx="32" cy="14" rx="7" ry="6" fill="#C45C4A" />
          <path d="M22 22c0-2 4-4 10-4s10 2 10 4l-2 22H24L22 22z" fill="#C45C4A" />
          <path d="M24 44h16v4H24z" fill="#8B3A2F" />
          <path d="M14 30c8-6 28-6 36 0" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" fill="none" />
          <circle cx="14" cy="30" r="2.5" fill="#D4AF37" />
        </svg>
      );
    case "blouse":
      return (
        <svg {...common}>
          <path d="M32 8c-2 0-4 2-4 4v2h8v-2c0-2-2-4-4-4z" fill="#8B4513" />
          <path d="M20 18l-6 6v6l8-4 4 2h8l4-2 8 4v-6l-6-6-4 4h-8l-4-4z" fill="#CC4F06" />
          <path d="M22 28v24h20V28" fill="#E0681A" />
          <path d="M28 34h8M28 40h8M28 46h6" stroke="#F5E8C8" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="36" cy="32" r="1.5" fill="#D4AF37" />
        </svg>
      );
    case "bag":
      return (
        <svg {...common}>
          <path d="M18 24h28l-2 28H20L18 24z" fill="#8B5A2B" />
          <path d="M24 24v-4a8 8 0 0 1 16 0v4" stroke="#5C3A1A" strokeWidth="2.5" fill="none" />
          <rect x="26" y="34" width="12" height="10" rx="2" fill="#F5E8C8" />
          <circle cx="32" cy="39" r="2.5" fill="#CC4F06" />
          <path d="M32 41.5v4" stroke="#CC4F06" strokeWidth="1.5" />
        </svg>
      );
    case "sewing":
      return (
        <svg {...common}>
          <rect x="12" y="28" width="40" height="22" rx="3" fill="#CC4F06" />
          <rect x="16" y="18" width="18" height="12" rx="2" fill="#E0681A" />
          <circle cx="44" cy="24" r="8" fill="#F5E8C8" stroke="#8B4513" strokeWidth="2" />
          <circle cx="44" cy="24" r="3" fill="#8B4513" />
          <path d="M20 36h12M20 42h8" stroke="#F5E8C8" strokeWidth="1.75" strokeLinecap="round" />
          <rect x="22" y="50" width="20" height="4" rx="1" fill="#8B4513" />
        </svg>
      );
    case "shakti":
      return (
        <svg {...common}>
          <circle cx="32" cy="32" r="22" fill="#CC4F06" />
          <circle cx="32" cy="32" r="17" fill="#F5E8C8" />
          <circle cx="32" cy="28" r="7" fill="#8B4513" />
          <path d="M20 48c2-8 8-12 12-12s10 4 12 12" fill="#8B4513" />
          <text x="32" y="54" textAnchor="middle" fill="#CC4F06" fontSize="8" fontWeight="700" fontFamily="system-ui">
            50
          </text>
        </svg>
      );
    case "trophy":
      return (
        <svg {...common}>
          <path d="M22 14h20v10c0 8-4 14-10 16-6-2-10-8-10-16V14z" fill="#D4AF37" />
          <path d="M22 18H14c0 8 4 12 8 14M42 18h8c0 8-4 12-8 14" stroke="#D4AF37" strokeWidth="2.5" fill="none" />
          <rect x="28" y="40" width="8" height="6" fill="#B8860B" />
          <rect x="22" y="46" width="20" height="5" rx="1" fill="#D4AF37" />
          <path d="M32 20l1.5 3h3l-2.5 2 1 3-3-2-3 2 1-3-2.5-2h3L32 20z" fill="#F5E8C8" />
        </svg>
      );
    case "phone":
      return (
        <svg {...common}>
          <path
            d="M38 10c8 4 14 12 14 22 0 2-.3 4-.8 6L44 36l-4 2c-2-4-5-7-9-9l2-4-2-7.2C33 16.3 35 12.5 38 10z"
            fill="#CC4F06"
          />
          <path
            d="M18 42c1.5 3 4 6 7 8l4-3 6 2c-1.5 2.5-3.5 4.5-6 6-8-3-15-10-18-18 1.5-2.5 3.5-4.5 6-6l2 6-3 4z"
            fill="#25D366"
          />
          <circle cx="22" cy="46" r="1.5" fill="#fff" />
        </svg>
      );
    default:
      return null;
  }
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function ExploreCard({ card, lang, whatsapp }) {
  const title = lang === "hi" ? card.titleHi : card.title;
  const tagline = lang === "hi" ? card.taglineHi : card.tagline;
  const cta = lang === "hi" ? card.ctaHi : card.cta;
  const badge = card.badge ? (lang === "hi" ? card.badgeHi : card.badge) : null;

  const waNumber = whatsapp || null;
  let href = card.href;
  let external = false;
  if (card.key === "boutique" && waNumber) {
    href = waLink(waNumber, stitchOrderMessage(lang));
    external = true;
  } else if (card.key === "shakti" && waNumber) {
    href = waLink(waNumber, shaktiMessage(lang));
    external = true;
  }

  const ctaProps = external
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : { href };

  return (
    <article className="quick-explore-card">
      {badge && <span className="quick-explore-card__ribbon">{badge}</span>}

      <div className="quick-explore-card__icon" aria-hidden>
        <ExploreIcon type={card.icon} />
      </div>

      <h3 className="quick-explore-card__title font-display">{title}</h3>
      <p className="quick-explore-card__tagline">{tagline}</p>

      {card.columns ? (
        <div className="quick-explore-card__columns">
          {card.columns.map((col) => (
            <div key={col.heading} className="quick-explore-card__column">
              <p className="quick-explore-card__column-title">
                {lang === "hi" ? col.headingHi : col.heading}
              </p>
              <ul className="quick-explore-card__list">
                {col.items.map((row) => (
                  <li key={row.label}>
                    <span className="quick-explore-card__bullet" aria-hidden />
                    {lang === "hi" ? row.labelHi : row.label}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <ul className="quick-explore-card__list">
          {card.items.map((row) => (
            <li key={row.label}>
              <span className="quick-explore-card__bullet" aria-hidden />
              {lang === "hi" ? row.labelHi : row.label}
            </li>
          ))}
        </ul>
      )}

      {external ? (
        <a {...ctaProps} className="quick-explore-card__cta">
          {cta}
          <ArrowIcon />
        </a>
      ) : (
        <Link href={href} className="quick-explore-card__cta">
          {cta}
          <ArrowIcon />
        </Link>
      )}
    </article>
  );
}

function ContactBar({ site, whatsapp, lang }) {
  const phone = site?.phone || SITE.phone;
  const address = site?.address || SITE.address;
  const waNumber = whatsapp || site?.whatsapp || SITE.whatsapp;
  const directionsUrl = address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    : "#";
  const phoneHref = telLink(phone) || "#";
  const waHref = waLink(waNumber, greetingMessage(lang));

  const blocks = [
    {
      key: "visit",
      icon: "pin",
      title: lang === "hi" ? "हमारा स्टूडियो देखें" : "Visit Our Studio",
      body: lang === "hi" ? "श्रेया क्रिएशन बुटीक एंड इंस्टिट्यूट, पटना, बिहार" : "Shreya Creation Boutique & Institute, Patna, Bihar",
      cta: lang === "hi" ? "दिशा पाएँ" : "Get Direction",
      href: directionsUrl,
      external: true,
    },
    {
      key: "call",
      icon: "call",
      title: lang === "hi" ? "अभी कॉल करें" : "Call Us Now",
      body: `${phone}\n${lang === "hi" ? "सोम – रवि | सुबह 10 – रात 8" : "Mon – Sun | 10AM – 8PM"}`,
      cta: lang === "hi" ? "कॉल करें" : "Call Now",
      href: phoneHref,
    },
    {
      key: "wa",
      icon: "wa",
      title: lang === "hi" ? "WhatsApp चैट" : "WhatsApp Chat",
      body: lang === "hi" ? "त्वरित जवाब, हम ऑनलाइन हैं!" : "Quick Response, We're online!",
      cta: lang === "hi" ? "चैट करें" : "Chat Now",
      href: waHref,
      external: true,
    },
  ];

  return (
    <div className="quick-explore-contact">
      {blocks.map((block) => (
        <div key={block.key} className="quick-explore-contact__block">
          <span className="quick-explore-contact__icon" aria-hidden>
            <ContactIcon type={block.icon} />
          </span>
          <div className="quick-explore-contact__copy">
            <p className="quick-explore-contact__title">{block.title}</p>
            <p className="quick-explore-contact__body">{block.body}</p>
          </div>
          <a
            href={block.href}
            className="quick-explore-contact__btn"
            {...(block.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {block.cta}
          </a>
        </div>
      ))}

      <div className="quick-explore-contact__cta-block">
        <p className="quick-explore-contact__cta-title">
          {lang === "hi" ? "कोई सवाल है?" : "Have Questions?"}
        </p>
        <p className="quick-explore-contact__cta-body">
          {lang === "hi" ? "हम बस एक मैसेज दूर हैं!" : "We're Just a Message Away!"}
        </p>
        <Link href="/contact" className="quick-explore-contact__cta-btn">
          {lang === "hi" ? "पूछताछ करें" : "Enquire Now"}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

function ContactIcon({ type }) {
  const props = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.75",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  if (type === "pin") {
    return (
      <svg {...props}>
        <path d="M12 21s-6-5.33-6-10a6 6 0 1 1 12 0c0 4.67-6 10-6 10z" />
        <circle cx="12" cy="11" r="2.25" />
      </svg>
    );
  }
  if (type === "call") {
    return (
      <svg {...props}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    );
  }
  return (
    <svg {...props} fill="currentColor" stroke="none">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.436.002 9.861-4.417 9.864-9.858.002-2.636-1.02-5.115-2.879-6.978-1.859-1.862-4.331-2.887-6.974-2.889-5.439 0-9.864 4.417-9.868 9.86-.001 1.57.418 3.101 1.21 4.47l-.995 3.633 3.738-.979c1.378.75 2.766 1.139 4.239 1.14z" />
    </svg>
  );
}

export default function CategoryCards({ lang = "en", site = {}, whatsapp }) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className={cn(
        HOME_BAND_WHITE,
        PAGE_CONTAINER,
        PAGE_SECTION,
        PAGE_SECTION_BORDERED,
        PAGE_SECTION_TIGHT_TOP,
        "quick-explore",
        "max-w-7xl"
      )}
    >
      <div className={cn(REVEAL, SECTION_HEADER_GLASS, "text-center", "mb-5", "sm:mb-8")}>
        <span className={SECTION_EYEBROW}>
          <span className={cn(SPARKLE_PULSE, "text-gold", "text-[10px]")} aria-hidden>
            ✦
          </span>
          {lang === "hi" ? "क्विक एक्सप्लोर" : "Quick Explore"}
          <span className={cn(SPARKLE_PULSE, "text-gold", "text-[10px]")} aria-hidden>
            ✦
          </span>
        </span>
        <h2 className={cn(SECTION_TITLE, "mt-2", "text-balance")}>
          {lang === "hi" ? "आज आप क्या " : "What are you "}
          <span className={HIGHLIGHT_SHIMMER}>{lang === "hi" ? "खोज" : "looking"}</span>
          {lang === "hi" ? " रहे हैं?" : " for today?"}
        </h2>
        <p className="quick-explore__subtitle">
          {lang === "hi"
            ? "अपनी यात्रा जारी रखने के लिए एक विकल्प चुनें।"
            : "Choose one option to continue your journey."}
        </p>
      </div>

      <motion.div
        className="quick-explore__grid"
        variants={reduceMotion ? undefined : container}
        initial={reduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
      >
        {CARDS.map((card) => (
          <motion.div key={card.key} variants={reduceMotion ? undefined : item} className="quick-explore__cell">
            <ExploreCard card={card} lang={lang} whatsapp={whatsapp || site?.whatsapp} />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="quick-explore-contact-wrap"
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20px" }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <ContactBar site={site} whatsapp={whatsapp} lang={lang} />
      </motion.div>
    </section>
  );
}
