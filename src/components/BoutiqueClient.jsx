"use client";

import { useRef } from "react";
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
import ShopBrowser from "@/components/ShopBrowser";
import { Testimonials } from "@/components/Sections";
import { useLanguage } from "@/components/LanguageProvider";
import { resolveMediaSrc, MEDIA } from "@/lib/media";
import { pickPage } from "@/lib/cms";
import { waLink, stitchOrderMessage } from "@/lib/whatsapp";
import {
  DEFAULT_OUTFITS_DELIVERED,
  computeYearsExperience,
  DEFAULT_FOUNDING_YEAR,
  EXPRESS_DELIVERY_DISCLAIMER,
} from "@/lib/site-config";

const EASE = [0.16, 1, 0.3, 1];

const ICONS = {
  measure: (
    <>
      <path d="M4 20 L20 4" />
      <path d="M8 20h12v-4" />
      <path d="M4 16V4h4" />
      <path d="M9 15l2-2M12 12l2-2M15 9l2-2" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  trial: (
    <>
      <path d="M8 4h8l1.5 5H6.5z" />
      <path d="M7 9l-1.5 11h13L17 9" />
      <path d="M10 14h4" />
    </>
  ),
  fabric: (
    <>
      <path d="M7 5c3.5 0 3.5 3 7 3s3.5-3 7-3v14c-3.5 0-3.5-3-7-3s-3.5 3-7 3z" />
      <path d="M7 9c3.5 0 3.5 3 7 3s3.5-3 7-3M7 13c3.5 0 3.5 3 7 3s3.5-3 7-3" />
    </>
  ),
  hand: (
    <>
      <path d="M9 11V7.5a1.5 1.5 0 013 0V11" />
      <path d="M12 11V6.5a1.5 1.5 0 013 0V11" />
      <path d="M15 11V7.8a1.5 1.5 0 013 0V14c0 3-2.2 5.5-6 5.5h-1c-2.8 0-5-1.8-5-4.5v-3A1.5 1.5 0 019 11" />
    </>
  ),
  star: (
    <path d="M12 3.2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.6l-4.8 2.5.9-5.4-3.9-3.8 5.4-.8z" />
  ),
  blouse: (
    <>
      <path d="M8.5 4.5l3.5 2.2L15.5 4.5" />
      <path d="M8.5 4.5 6 8.5v9h12v-9L15.5 4.5" />
      <path d="M6 10.5h12" />
    </>
  ),
  lehenga: (
    <>
      <path d="M9 4.5h6l1 4.5H8z" />
      <path d="M8 9l-2.5 11h13L16 9" />
      <path d="M10 13h4" />
    </>
  ),
  saree: (
    <>
      <path d="M5 5c4 0 4 3.5 8 3.5S17 5 21 5v14c-4 0-4-3.5-8-3.5S9 19 5 19z" />
      <path d="M5 9.5c4 0 4 2.5 8 2.5s4-2.5 8-2.5" />
    </>
  ),
  bridal: (
    <>
      <path d="M12 3.5l1.8 3.6 4 .6-2.9 2.8.7 4L12 12.7l-3.6 1.8.7-4-2.9-2.8 4-.6z" />
      <path d="M6 19.5h12" />
    </>
  ),
  suit: (
    <>
      <path d="M8 5.5h8v3H8z" />
      <path d="M7 8.5l-1.5 11h13L17 8.5" />
      <path d="M12 8.5v11" />
    </>
  ),
  gown: (
    <>
      <path d="M9.5 3.5l2.5 2 2.5-2" />
      <path d="M9.5 3.5l-1.2 5L12 10.5l3.7-2 1.2-5" />
      <path d="M8.3 8.5 5.5 20.5h13L15.7 8.5" />
    </>
  ),
  embroidery: (
    <>
      <circle cx="12" cy="12" r="2" />
      <path d="M12 4.5v3M12 16.5v3M4.5 12h3M16.5 12h3" />
      <path d="M6.8 6.8l2.1 2.1M15.1 15.1l2.1 2.1M17.2 6.8l-2.1 2.1M8.9 15.1l-2.1 2.1" />
    </>
  ),
  redesign: (
    <>
      <path d="M4.5 8.5h7v7h-7z" />
      <path d="M12.5 8.5h7v7h-7z" />
      <path d="M8 5.5V4M16 5.5V4M8 18.5V20M16 18.5V20" />
    </>
  ),
  kids: (
    <>
      <circle cx="12" cy="7" r="2.5" />
      <path d="M8 20v-5.5a4 4 0 018 0V20" />
      <path d="M7 12.5h10" />
    </>
  ),
  western: (
    <>
      <path d="M9 4.5h6l1.5 4H7.5z" />
      <path d="M7.5 8.5 6 20.5h12L16.5 8.5" />
      <path d="M10 13h4" />
    </>
  ),
  consult: (
    <>
      <path d="M5 6.5h14v9H9l-4 3.5z" />
      <path d="M9 10.5h6M9 13h4" />
    </>
  ),
  design: (
    <>
      <path d="M5 19l4.2-1.2 9.3-9.3a2 2 0 00-2.8-2.8L6.4 15z" />
      <path d="M14.5 6.5l3 3" />
    </>
  ),
  stitch: (
    <>
      <rect x="4" y="10" width="16" height="8" rx="1.5" />
      <path d="M7 10V8.2a2 2 0 012-2h0a2 2 0 012 2V10" />
      <circle cx="16.5" cy="14" r="1.4" />
      <path d="M4 14h7" />
    </>
  ),
  pack: (
    <>
      <path d="M4.5 8.5 12 4.5l7.5 4v9L12 21.5 4.5 17.5z" />
      <path d="M12 12v9.5M4.5 8.5 12 12l7.5-3.5" />
    </>
  ),
  truck: (
    <>
      <path d="M3 7.5h11v8H3z" />
      <path d="M14 10.5h4.2l2.3 3v2H14z" />
      <circle cx="7" cy="17.5" r="1.6" />
      <circle cx="17" cy="17.5" r="1.6" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 12.2l2.4 2.4 4.6-5" />
    </>
  ),
  spark: (
    <>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="M6.2 6.2l2.8 2.8M15 15l2.8 2.8M17.8 6.2 15 9M9 15l-2.8 2.8" />
    </>
  ),
  nri: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.4 2.5 3.6 5.4 3.6 8.5s-1.2 6-3.6 8.5c-2.4-2.5-3.6-5.4-3.6-8.5s1.2-6 3.6-8.5z" />
    </>
  ),
};

function GoldIcon({ name, className = "boutique-v2-icon" }) {
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
      {ICONS[name] || ICONS.star}
    </svg>
  );
}

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
      {subtitle && <p className={cn(SECTION_LEAD, "mt-3", "max-w-2xl", center && "mx-auto")}>{subtitle}</p>}
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

export default function BoutiqueClient({ site, shopPage, products = [], testimonials = [] }) {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const hi = lang === "hi";
  const shop = shopPage || site.pages?.shop || {};
  const home = site.pages?.home || {};

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });
  const rawY = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  const imageY = useSpring(rawY, { stiffness: 90, damping: 24 });
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1, 1.05]);

  const years = site.yearsExperience ?? computeYearsExperience(site.foundingYear ?? DEFAULT_FOUNDING_YEAR);
  const outfits = site.outfitsDelivered || DEFAULT_OUTFITS_DELIVERED;
  const hours = site.expressDeliveryHours || 24;

  const title = hi ? "बुटीक" : "BOUTIQUE";
  const tagline = hi ? "जहाँ परंपरा मिलती है सिलाई की बारीकी से" : "Where Tradition Meets Perfection";
  const heroLead =
    pickPage(shop, lang, "headerSubtitle", "headerSubtitleHi") ||
    (hi
      ? "पटना में डिज़ाइनर ब्लाउज़, ब्राइडल लहंगा और कस्टम सिलाई — अक्सर 24 घंटे में तैयार*।"
      : "Designer blouses, bridal lehengas & custom stitching in Patna — often ready in 24 hours*.");

  const heroImage = resolveMediaSrc(shop.heroImage || home.heroImage || MEDIA.boutique);
  const waHref = waLink(site.whatsapp, stitchOrderMessage(lang));

  const heroPerks = hi
    ? [
        { icon: "measure", text: "परफेक्ट माप और फिट" },
        { icon: "hand", text: "आरी / ज़रदोज़ी हैंडवर्क" },
        { icon: "clock", text: `${hours} घंटे एक्सप्रेस सिलाई*` },
      ]
    : [
        { icon: "measure", text: "Perfect measurement & fit" },
        { icon: "hand", text: "Aari / Zardozi handwork" },
        { icon: "clock", text: `${hours}-hour express stitching*` },
      ];

  const trustRail = [
    {
      value: `${years}+`,
      label: hi ? "वर्षों का भरोसा" : "Years of Trust",
    },
    {
      value: `${outfits}+`,
      label: hi ? "कस्टम आउटफ़िट्स" : "Outfits Customised",
    },
    {
      value: "100%",
      label: hi ? "क्लाइंट संतुष्टि" : "Client Satisfaction",
    },
  ];

  const trustStrip = hi
    ? [
        { icon: "measure", label: "परफेक्ट माप" },
        { icon: "clock", label: "समय पर डिलीवरी" },
        { icon: "trial", label: "ट्रायल सुविधा" },
        { icon: "fabric", label: "प्रीमियम फैब्रिक" },
        { icon: "hand", label: "हैंडवर्क विशेषज्ञ" },
        { icon: "star", label: "100% संतुष्टि" },
      ]
    : [
        { icon: "measure", label: "Perfect Measurement" },
        { icon: "clock", label: "On-time Delivery" },
        { icon: "trial", label: "Trial Facility" },
        { icon: "fabric", label: "Premium Fabrics" },
        { icon: "hand", label: "Handwork Experts" },
        { icon: "star", label: "100% Satisfaction" },
      ];

  const aboutText = hi
    ? "श्रेया क्रिएशन बुटीक — बोरिंग रोड, पटना का भरोसेमंद डिज़ाइनर स्टूडियो। हम ब्लाउज़, लहंगा, साड़ी कस्टमाइज़ेशन, ब्राइडल वियर और हाथ की कढ़ाई में विशेषज्ञ हैं। हर आउटफ़िट आपके माप और पसंद पर सिला जाता है।"
    : "Shreya Creation Boutique is Patna’s trusted designer studio on Boring Road — specialising in blouses, lehengas, saree customisation, bridal wear and hand embroidery. Every outfit is cut and finished to your measurements and taste.";

  const gallery = [
    { src: "/atelier_details.png", alt: hi ? "कढ़ाई डिटेल" : "Embroidery detail" },
    { src: "/slider1.webp", alt: hi ? "पटना में फैशन डिज़ाइनर स्टूडियो में डिज़ाइनर वियर" : "Designer wear at Shreya Creation fashion studio, Patna" },
    { src: "/slider2.webp", alt: hi ? "पटना में श्रेया क्रिएशन पर ब्राइडल लहंगा और ब्लाउज़ सिलाई" : "Bridal lehenga and blouse stitching at Shreya Creation, Patna" },
    { src: "/slider3.webp", alt: hi ? "पटना में श्रेया क्रिएशन स्टूडियो की हैंडवर्क और सिलाई" : "Handwork and studio craft at Shreya Creation, Patna" },
  ];

  const services = hi
    ? [
        { icon: "blouse", title: "डिज़ाइनर ब्लाउज़ सिलाई", desc: "10+ नेक और स्लीव स्टाइल — परफेक्ट फिट।" },
        { icon: "lehenga", title: "लहंगा सिलाई", desc: "ब्राइडल और फेस्टिव लहंगा — कस्टम कट और फिनिश।" },
        { icon: "saree", title: "साड़ी कस्टमाइज़ेशन", desc: "ब्लाउज़, पल्लू वर्क और रीस्टाइलिंग।" },
        { icon: "bridal", title: "ब्राइडल वियर", desc: "शादी और रिसेप्शन के लिए कॉउचर लुक।" },
        { icon: "suit", title: "सूट / अनारकली", desc: "डेली और पार्टी वियर — सटीक माप पर।" },
        { icon: "gown", title: "गाउन सिलाई", desc: "रिसेप्शन और इवेंट के लिए फ़्लोइंग गाउन।" },
        { icon: "embroidery", title: "आरी / ज़रदोज़ी", desc: "हाथ की कढ़ाई और प्रीमियम हैंडवर्क।" },
        { icon: "redesign", title: "पुरानी साड़ी रीडिज़ाइन", desc: "पुरानी साड़ी को नया डिज़ाइनर लुक।" },
        { icon: "kids", title: "किड्स वियर", desc: "फ्रॉक, एथनिक और वेस्टर्न — सुरक्षित फिनिश।" },
        { icon: "western", title: "वेस्टर्न अल्टरेशन", desc: "फिटिंग, हेम और रीस्टाइलिंग।" },
        { icon: "fabric", title: "फैब्रिक कंसल्टेशन", desc: "अवसर के हिसाब से कपड़ा और रंग सलाह।" },
        { icon: "spark", title: "एम्बेलिशमेंट", desc: "सीक्विन, मिरर, लेस और बॉर्डर वर्क।" },
        { icon: "clock", title: `${hours} घंटे एक्सप्रेस`, desc: "कई स्टाइल एक दिन में तैयार।" },
        { icon: "nri", title: "NRI ऑर्डर सपोर्ट", desc: "WhatsApp गाइडेंस और शिपिंग सहायता।" },
        { icon: "consult", title: "स्टाइलिंग सलाह", desc: "सिल्हूट, रंग और लुक प्लानिंग।" },
      ]
    : [
        { icon: "blouse", title: "Designer Blouse Stitching", desc: "10+ neck & sleeve styles — perfect fit." },
        { icon: "lehenga", title: "Lehenga Stitching", desc: "Bridal & festive lehengas, custom cut & finish." },
        { icon: "saree", title: "Saree Customisation", desc: "Blouse, pallu work and restyling." },
        { icon: "bridal", title: "Bridal Wear", desc: "Couture looks for wedding & reception." },
        { icon: "suit", title: "Suit / Anarkali", desc: "Daily & party wear — stitched to size." },
        { icon: "gown", title: "Gown Stitching", desc: "Flowing gowns for receptions & events." },
        { icon: "embroidery", title: "Aari / Zardozi", desc: "Hand embroidery and premium handwork." },
        { icon: "redesign", title: "Old Saree Redesign", desc: "Transform heirloom sarees into new looks." },
        { icon: "kids", title: "Kids Wear", desc: "Frocks, ethnic & western with safe finishing." },
        { icon: "western", title: "Western Alteration", desc: "Fitting, hems and restyling." },
        { icon: "fabric", title: "Fabric Consultation", desc: "Fabric & colour advice for your occasion." },
        { icon: "spark", title: "Embellishment", desc: "Sequins, mirror, lace and border work." },
        { icon: "clock", title: `${hours}hr Express`, desc: "Many styles ready within a day." },
        { icon: "nri", title: "NRI Order Support", desc: "WhatsApp guidance and shipping help." },
        { icon: "consult", title: "Styling Advice", desc: "Silhouette, colour and look planning." },
      ];

  const processSteps = hi
    ? [
        { icon: "consult", title: "कंसल्टेशन", desc: "अवसर, बजट और रेफ़रेंस WhatsApp पर शेयर करें।" },
        { icon: "design", title: "डिज़ाइन व फैब्रिक", desc: "डिज़ाइन, कपड़ा और लुक साथ मिलकर फाइनल करें।" },
        { icon: "measure", title: "माप व ट्रायल", desc: "सटीक माप — ज़रूरत पर ट्रायल सुविधा।" },
        { icon: "stitch", title: "सिलाई", desc: "एक्सपर्ट कटिंग, सिलाई और हैंडवर्क।" },
        { icon: "pack", title: "क्वालिटी चेक", desc: "फिनिशिंग जाँच और सुरक्षित पैकिंग।" },
        { icon: "truck", title: "एक्सप्रेस डिलीवरी", desc: "पिकअप या डिलीवरी — कई स्टाइल 24 घंटे में।" },
      ]
    : [
        { icon: "consult", title: "Consultation", desc: "Share occasion, budget and references on WhatsApp." },
        { icon: "design", title: "Design & Fabric", desc: "Finalise design, fabric and look together." },
        { icon: "measure", title: "Measurement & Trial", desc: "Exact measurements — trial facility when needed." },
        { icon: "stitch", title: "Stitching", desc: "Expert cutting, stitching and handwork." },
        { icon: "pack", title: "Quality Check", desc: "Finish inspection and secure packing." },
        { icon: "truck", title: "Express Delivery", desc: "Pickup or delivery — many styles in 24 hours." },
      ];

  const rise = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 24, filter: "blur(6px)" },
    whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.7, delay, ease: EASE },
  });

  return (
    <div className="boutique-page boutique-page--v2 relative min-w-0 w-full">
      {/* ——— Hero ——— */}
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

        <div className="grid lg:grid-cols-12 gap-7 sm:gap-9 lg:gap-10 items-center">
          <div className="lg:col-span-6 min-w-0 text-center lg:text-left space-y-4 sm:space-y-5">
            <motion.span
              className={cn(SECTION_EYEBROW, "boutique-v2-eyebrow")}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              <span className={cn(SPARKLE_PULSE, "text-gold", "text-[10px]")} aria-hidden>
                ✦
              </span>
              {hi ? "श्रेया क्रिएशन" : "Shreya Creation"}
            </motion.span>

            <motion.h1
              className="boutique-v2-title"
              initial={reduceMotion ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.08, ease: EASE }}
            >
              {title}
            </motion.h1>

            <motion.p
              className="boutique-v2-script"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18, ease: EASE }}
            >
              {tagline}
            </motion.p>

            <motion.p
              className="boutique-v2-lead"
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.28, ease: EASE }}
            >
              {heroLead}
            </motion.p>

            <motion.ul
              className="boutique-v2-perks"
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.36, ease: EASE }}
            >
              {heroPerks.map((perk) => (
                <li key={perk.text} className="boutique-v2-perk">
                  <GoldIcon name={perk.icon} />
                  <span>{perk.text}</span>
                </li>
              ))}
            </motion.ul>

            <p className="boutique-v2-express-note text-subtle text-xs mt-2">
              {EXPRESS_DELIVERY_DISCLAIMER[hi ? "hi" : "en"]}
            </p>

            <motion.div
              className="boutique-v2-hero-ctas"
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.44, ease: EASE }}
            >
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(BTN_PRIMARY, "boutique-v2-wa")}
              >
                <WhatsAppGlyph />
                {hi ? "WhatsApp पर चैट करें" : "Chat on WhatsApp"}
              </a>
              <Link href="/portfolio" className={cn(BTN_SECONDARY)}>
                {hi ? "हमारा काम देखें" : "Our Work Speaks"}
              </Link>
            </motion.div>
          </div>

          <motion.div
            className="lg:col-span-6 relative min-w-0"
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
                      ? "श्रेया क्रिएशन बुटीक — डिज़ाइनर आउटफ़िट"
                      : "Shreya Creation Boutique — designer outfit"
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

            <aside className="boutique-v2-rail" aria-label={hi ? "ट्रस्ट आँकड़े" : "Trust stats"}>
              {trustRail.map((item) => (
                <div key={item.label} className="boutique-v2-rail__item">
                  <span className="boutique-v2-rail__value">{item.value}</span>
                  <span className="boutique-v2-rail__label">{item.label}</span>
                </div>
              ))}
            </aside>
          </motion.div>
        </div>
      </section>

      {/* ——— Trust strip ——— */}
      <section className={cn(PAGE_CONTAINER, "boutique-v2-strip-wrap", "max-w-6xl", "relative z-20")}>
        <motion.div className="boutique-v2-strip" {...rise(0.05)}>
          {trustStrip.map((item, i) => (
            <motion.div
              key={item.label}
              className="boutique-v2-strip__item"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: 0.08 + i * 0.06, duration: 0.5, ease: EASE }}
            >
              <GoldIcon name={item.icon} className="boutique-v2-icon boutique-v2-icon--lg" />
              <span>{item.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ——— About ——— */}
      <section className={cn(PAGE_CONTAINER, PAGE_SECTION, "boutique-v2-about", "max-w-6xl")}>
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <motion.div className="lg:col-span-5 min-w-0" {...rise(0.05)}>
            <SectionHead
              eyebrow={hi ? "हमारी कहानी" : "About"}
              title={hi ? "हमारे बुटीक के बारे में" : "About Our Boutique"}
              center={false}
            />
            <p className="boutique-v2-about__text mt-4">{aboutText}</p>
            <Link href="/portfolio" className={cn(BTN_SECONDARY, "mt-6")}>
              {hi ? "हमारा काम देखें" : "Our Work Speaks"}
            </Link>
          </motion.div>

          <motion.div
            className="lg:col-span-7 boutique-v2-gallery"
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          >
            {gallery.map((img) => (
              <motion.div
                key={img.src}
                className="boutique-v2-gallery__item"
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.96 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { type: "spring", stiffness: 220, damping: 20 },
                  },
                }}
              >
                <CardImage
                  src={img.src}
                  alt={img.alt}
                  ratio="1/1"
                  position="center"
                  className="boutique-v2-gallery__media rounded-xl"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ——— Services ——— */}
      <section className={cn(PAGE_CONTAINER, PAGE_SECTION, PAGE_SECTION_BORDERED, "max-w-6xl")}>
        <SectionHead
          eyebrow={hi ? "सेवाएँ" : "Services"}
          title={hi ? "हमारी बुटीक सेवाएँ" : "Our Boutique Services"}
          subtitle={
            hi
              ? "कस्टम सिलाई से ब्राइडल कॉउचर तक — WhatsApp पर कंसल्ट करें।"
              : "From custom stitching to bridal couture — consult on WhatsApp."
          }
        />

        <motion.div
          className="boutique-v2-services"
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        >
          {services.map((svc) => (
            <motion.a
              key={svc.title}
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="boutique-v2-service"
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
              <GoldIcon name={svc.icon} className="boutique-v2-icon boutique-v2-icon--lg" />
              <h3 className="boutique-v2-service__title">{svc.title}</h3>
              <p className="boutique-v2-service__desc">{svc.desc}</p>
            </motion.a>
          ))}
        </motion.div>
      </section>

      {/* ——— Process ——— */}
      <section className={cn(PAGE_CONTAINER, PAGE_SECTION, PAGE_SECTION_BORDERED, "max-w-6xl")}>
        <SectionHead
          eyebrow={hi ? "प्रक्रिया" : "Process"}
          title={hi ? "हमारी कस्टमाइज़ेशन प्रक्रिया" : "Our Customisation Process"}
          subtitle={
            hi
              ? "WhatsApp से डिलीवरी तक — साफ़ और आसान कदम।"
              : "From WhatsApp to delivery — a clear, simple path."
          }
        />

        <div className="boutique-v2-process">
          {processSteps.map((step, i) => (
            <motion.div key={step.title} className="boutique-v2-process__step" {...rise(0.06 + i * 0.05)}>
              <div className="boutique-v2-process__num">
                <span>{String(i + 1).padStart(2, "0")}</span>
                <GoldIcon name={step.icon} />
              </div>
              <h3 className="boutique-v2-process__title">{step.title}</h3>
              <p className="boutique-v2-process__desc">{step.desc}</p>
              {i < processSteps.length - 1 && (
                <span className="boutique-v2-process__arrow" aria-hidden>
                  →
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ——— Shop catalogue ——— */}
      <section id="shop-catalogue" className={cn(PAGE_SECTION, PAGE_SECTION_BORDERED, "min-w-0")}>
        <div className={cn(PAGE_CONTAINER, "max-w-6xl", "mb-2")}>
          <SectionHead
            eyebrow={hi ? "कलेक्शन" : "Collection"}
            title={hi ? "डिज़ाइनर वियर शॉप" : "Shop Designer Wear"}
            subtitle={
              hi
                ? "ब्लाउज़, लहंगा और सूट देखें — WhatsApp पर ऑर्डर करें।"
                : "Browse blouses, lehengas & suits — order on WhatsApp."
            }
          />
        </div>
        <ShopBrowser products={products} whatsapp={site.whatsapp} />
      </section>

      {/* ——— Testimonials ——— */}
      {testimonials.length > 0 && (
        <section className={cn(PAGE_SECTION, PAGE_SECTION_BORDERED, "overflow-hidden", "min-w-0")}>
          <div className={cn(PAGE_CONTAINER, "max-w-6xl", "mb-6")}>
            <SectionHead
              eyebrow={hi ? "रिव्यूज़" : "Reviews"}
              title={hi ? "हमारे क्लाइंट्स क्या कहते हैं" : "What Our Clients Say"}
              subtitle={
                hi
                  ? "पटना और बाहर से असली क्लाइंट कहानियाँ।"
                  : "Real stories from clients across Patna and beyond."
              }
            />
          </div>
          <Testimonials items={testimonials} site={site} />
        </section>
      )}
    </div>
  );
}
