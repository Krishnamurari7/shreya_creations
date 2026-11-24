"use client";

import Link from "next/link";
import {
  motion,
  useReducedMotion,
} from "framer-motion";
import {
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
import BoutiqueHeroBanner from "@/components/BoutiqueHeroBanner";
import SeoDisclosure from "@/components/SeoDisclosure";
import ShopBrowser from "@/components/ShopBrowser";
import { Testimonials } from "@/components/Sections";
import { useLanguage } from "@/components/LanguageProvider";
import { MEDIA } from "@/lib/media";
import { pickPage } from "@/lib/cms";
import { PAGE_DEFAULTS } from "@/lib/cms/defaults";
import { waLink, stitchOrderMessage } from "@/lib/whatsapp";

const EASE = [0.16, 1, 0.3, 1];
const SHOP_DEFAULTS = PAGE_DEFAULTS.shop;

function normalizeProcessFeatures(raw, hi) {
  const fallback = SHOP_DEFAULTS.process_features || [];
  if (!Array.isArray(raw) || !raw.length) {
    return fallback.map((item) => ({
      icon: item.icon,
      title: hi ? item.title_hi || item.title : item.title,
    }));
  }
  return raw.map((item, index) => {
    const def = fallback[index] || {};
    const icon = item.icon || def.icon || "star";
    const title = hi
      ? item.title_hi || item.titleHi || def.title_hi || def.title
      : item.title || def.title;
    return { icon, title };
  });
}

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

export default function BoutiqueClient({ site, shopPage, products = [], testimonials = [], initialCategory = "" }) {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const hi = lang === "hi";
  const shop = shopPage || site.pages?.shop || {};

  const hours = site.expressDeliveryHours || 24;

  const title =
    pickPage(shop, lang, "headerTitle", "headerTitleHi") ||
    (hi ? SHOP_DEFAULTS.header_title_hi : SHOP_DEFAULTS.header_title);
  const aboutTitle =
    pickPage(shop, lang, "aboutTitle", "aboutTitleHi") ||
    (hi ? SHOP_DEFAULTS.about_title_hi : SHOP_DEFAULTS.about_title);
  const aboutText =
    pickPage(shop, lang, "aboutBody", "aboutBodyHi") ||
    (hi ? SHOP_DEFAULTS.about_body_hi : SHOP_DEFAULTS.about_body);
  const processTitle =
    pickPage(shop, lang, "processTitle", "processTitleHi") ||
    (hi ? SHOP_DEFAULTS.process_title_hi : SHOP_DEFAULTS.process_title);
  const processFeatures = normalizeProcessFeatures(shop.processFeatures, hi);
  const closingTagline =
    pickPage(shop, lang, "closingTagline", "closingTaglineHi") ||
    (hi ? SHOP_DEFAULTS.closing_tagline_hi : SHOP_DEFAULTS.closing_tagline);

  const waHref = waLink(site.whatsapp, stitchOrderMessage(lang));

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

  const gallery = [
    { src: MEDIA.atelierDetails, alt: hi ? "कढ़ाई डिटेल" : "Embroidery detail on bridal lehenga at Shreya Creation, Patna" },
    { src: MEDIA.slider1, alt: hi ? "पटना में फैशन डिज़ाइनर स्टूडियो में डिज़ाइनर वियर" : "Designer wear at Shreya Creation fashion studio, Patna" },
    { src: MEDIA.slider2, alt: hi ? "पटना में श्रेया क्रिएशन पर ब्राइडल लहंगा और ब्लाउज़ सिलाई" : "Bridal lehenga and blouse stitching at Shreya Creation, Patna" },
    { src: MEDIA.slider3, alt: hi ? "पटना में श्रेया क्रिएशन स्टूडियो की हैंडवर्क और सिलाई" : "Handwork and studio craft at Shreya Creation, Patna" },
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

  const useSeoProcess = processFeatures.length > 0;

  const rise = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 24, filter: "blur(6px)" },
    whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.7, delay, ease: EASE },
  });

  return (
    <div className="boutique-page boutique-page--v2 relative min-w-0 w-full">
      {/* ——— Hero ——— */}
      <BoutiqueHeroBanner
        fallbackImage={shop.heroImage || MEDIA.boutique}
        mobileImage={shop.heroImageMobile}
        tabletImage={shop.heroImageTablet}
        desktopImage={shop.heroImageDesktop}
        alt={title}
      />
      <h1 className="sr-only">{title}</h1>

      {/* Trust strip */}
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
              title={aboutTitle}
              center={false}
            />
            <SeoDisclosure lang={lang} className="seo-disclosure--left mt-4">
              <p className="boutique-v2-about__text">{aboutText}</p>
            </SeoDisclosure>
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

      {/* ——— Process / expertise ——— */}
      <section className={cn(PAGE_CONTAINER, PAGE_SECTION, PAGE_SECTION_BORDERED, "max-w-6xl")}>
        <SectionHead
          eyebrow={hi ? "विशेषज्ञता" : "Expertise"}
          title={processTitle}
          subtitle={
            useSeoProcess
              ? undefined
              : hi
                ? "WhatsApp से डिलीवरी तक — साफ़ और आसान कदम।"
                : "From WhatsApp to delivery — a clear, simple path."
          }
        />

        <div className={cn("boutique-v2-process", useSeoProcess && "boutique-v2-process--pillars")}>
          {(useSeoProcess ? processFeatures : processSteps).map((step, i) => (
            <motion.div key={step.title} className="boutique-v2-process__step" {...rise(0.06 + i * 0.05)}>
              <div className="boutique-v2-process__num">
                <span>{String(i + 1).padStart(2, "0")}</span>
                <GoldIcon name={step.icon} />
              </div>
              <h3 className="boutique-v2-process__title">{step.title}</h3>
              {step.desc && <p className="boutique-v2-process__desc">{step.desc}</p>}
              {!useSeoProcess && i < processSteps.length - 1 && (
                <span className="boutique-v2-process__arrow" aria-hidden>
                  →
                </span>
              )}
            </motion.div>
          ))}
        </div>

        {closingTagline && (
          <motion.p
            className="boutique-v2-script text-center mt-8 sm:mt-10 max-w-3xl mx-auto"
            {...rise(0.1)}
          >
            {closingTagline}
          </motion.p>
        )}
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
        <ShopBrowser products={products} whatsapp={site.whatsapp} initialCategory={initialCategory} />
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
