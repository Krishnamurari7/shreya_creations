/** Homepage block defaults used by Hero, Category cards, and Admin Pages editor. */

import { MEDIA } from "@/lib/media";

export const DEFAULT_HOME_BRIDAL_SLIDES = [
  {
    image: "/home-bridal-slide.webp",
    video_url: "/video-1.mp4",
    video_tablet: "",
    video_mobile: "",
    label: "INSIDE SHREYA CREATION",
    label_hi: "श्रेया क्रिएशन के अंदर",
    caption: "Crafted for your special moments.",
    caption_hi: "आपके खास पलों के लिए बनाया गया।",
    image_alt: "Bride in a red embroidered sari inside Shreya Creation boutique",
    image_alt_hi: "श्रेया क्रिएशन बुटीक में लाल कढ़ाई वाली साड़ी पहने दुल्हन",
  },
  {
    image: MEDIA.slider4,
    video_url: "/video-2.mp4",
    video_tablet: "",
    video_mobile: "",
    label: "DESIGNED WITH CARE",
    label_hi: "खास डिज़ाइन",
    caption: "From first sketch to perfect fit.",
    caption_hi: "पहले स्केच से परफेक्ट फिट तक।",
    image_alt: "Designer boutique studio at Shreya Creation",
    image_alt_hi: "श्रेया क्रिएशन का डिज़ाइनर बुटीक स्टूडियो",
  },
];

export const DEFAULT_HOME_BRIDAL_CTAS = [
  { label: "Fashion Design", label_hi: "फैशन डिज़ाइन", href: "/courses/fashion-designing-course", variant: "gold" },
  { label: "Boutique Master", label_hi: "बुटीक मास्टर", href: "/courses/basic-boutique-course", variant: "dark" },
  { label: "Book Stitching", label_hi: "सिलाई बुक करें", href: "/shop", variant: "outline" },
];

export const HOME_BRIDAL_SLIDE_FIELDS = [
  { key: "video_url", label: "Desktop video (required MP4/WebM)", type: "video", wide: true },
  { key: "video_tablet", label: "Tablet video (optional MP4/WebM)", type: "video", wide: true },
  { key: "video_mobile", label: "Mobile video (optional MP4/WebM)", type: "video", wide: true },
  { key: "image", label: "Poster image (optional, shown while video loads)", type: "image", wide: true },
  { key: "label", label: "Top label (EN)" },
  { key: "label_hi", label: "Top label (HI)" },
  { key: "caption", label: "Bottom caption (EN)", wide: true },
  { key: "caption_hi", label: "Bottom caption (HI)", wide: true },
];

export const HOME_BRIDAL_CTA_FIELDS = [
  { key: "label", label: "Button text (EN)" },
  { key: "label_hi", label: "Button text (HI)" },
  { key: "href", label: "Destination path", default: "/contact", wide: true },
  { key: "variant", label: "Style", type: "select", options: ["gold", "dark", "outline"], default: "outline" },
];

export const DEFAULT_HERO_SERVICE_CARDS = [
  {
    key: "fashion",
    icon: "fashion",
    image: MEDIA.slider1,
    title: "FASHION DESIGNING COURSE",
    title_hi: "फैशन डिज़ाइनिंग कोर्स",
    desc: "Learn Fashion Design from Experts.",
    desc_hi: "एक्सपर्ट्स से फैशन डिज़ाइन सीखें।",
    cta: "BOOK NOW",
    cta_hi: "अभी बुक करें",
    source: "hero_service_fashion",
  },
  {
    key: "boutique",
    icon: "boutique",
    image: MEDIA.boutique,
    title: "BOUTIQUE COURSE",
    title_hi: "बुटीक कोर्स",
    desc: "Master Stitching & Boutique Skills.",
    desc_hi: "सिलाई और बुटीक स्किल्स मास्टर करें।",
    cta: "BOOK NOW",
    cta_hi: "अभी बुक करें",
    source: "hero_service_boutique",
  },
  {
    key: "blouse",
    icon: "blouse",
    image: MEDIA.categories.bridal,
    title: "BRIDAL BLOUSE BOOKING",
    title_hi: "ब्राइडल ब्लाउज़ बुकिंग",
    desc: "Designer & Bridal Blouse Stitching.",
    desc_hi: "डिज़ाइनर और ब्राइडल ब्लाउज़ सिलाई।",
    cta: "BOOK NOW",
    cta_hi: "अभी बुक करें",
    source: "hero_service_blouse",
  },
  {
    key: "lehenga",
    icon: "lehenga",
    image: MEDIA.slider3,
    title: "BRIDAL LEHENGA BOOKING",
    title_hi: "ब्राइडल लहंगा बुकिंग",
    desc: "Custom Bridal Lehenga Stitching.",
    desc_hi: "कस्टम ब्राइडल लहंगा सिलाई।",
    cta: "BOOK NOW",
    cta_hi: "अभी बुक करें",
    source: "hero_service_lehenga",
  },
  {
    key: "suit",
    icon: "suit",
    image: MEDIA.categories.ethnicWear,
    title: "SUIT STITCHING",
    title_hi: "सूट सिलाई",
    desc: "Designer Suits Perfectly Tailored.",
    desc_hi: "डिज़ाइनर सूट परफेक्टली टेलर्ड।",
    cta: "BOOK NOW",
    cta_hi: "अभी बुक करें",
    source: "hero_service_suit",
  },
  {
    key: "handwork",
    icon: "handwork",
    image: MEDIA.categories.stitching,
    title: "HAND WORK & EMBROIDERY",
    title_hi: "हैंड वर्क और एम्ब्रॉयडरी",
    desc: "Exquisite Handwork for Every Occasion.",
    desc_hi: "हर अवसर के लिए बेहतरीन हैंडवर्क।",
    cta: "BOOK NOW",
    cta_hi: "अभी बुक करें",
    source: "hero_service_handwork",
  },
  {
    key: "express",
    icon: "express",
    image: "",
    title: "EXPRESS 24-HOUR STITCHING",
    title_hi: "एक्सप्रेस 24 घंटे सिलाई",
    desc: "Get Your Outfit in Just 24 Hours*.",
    desc_hi: "सिर्फ 24 घंटे में अपना आउटफिट पाएँ*।",
    cta: "BOOK NOW",
    cta_hi: "अभी बुक करें",
    source: "hero_service_express",
  },
];

export const DEFAULT_HERO_FEATURE_STRIP = [
  {
    key: "tailoring",
    icon: "sewing",
    title: "BEST LADIES TAILORING SERVICE",
    title_hi: "सर्वश्रेष्ठ लेडीज़ टेलरिंग सेवा",
    subtitle: "Perfect Fit. Perfect You. Every Time.",
    subtitle_hi: "परफेक्ट फिट। परफेक्ट यू। हर बार।",
  },
  {
    key: "boutique",
    icon: "dress",
    title: "DESIGNER BOUTIQUE",
    title_hi: "डिज़ाइनर बुटीक",
    subtitle: "Trendy Designs. Premium Finishing.",
    subtitle_hi: "ट्रेंडी डिज़ाइन। प्रीमियम फिनिशिंग।",
  },
  {
    key: "stitching",
    icon: "mannequin",
    title: "PREMIUM STITCHING",
    title_hi: "प्रीमियम सिलाई",
    subtitle: "High Quality Fabrics. Finest Craftsmanship.",
    subtitle_hi: "उच्च गुणवत्ता वाले कपड़े। बेहतरीन कारीगरी।",
  },
  {
    key: "diploma",
    icon: "certificate",
    title: "DIPLOMA & CERTIFICATE COURSES",
    title_hi: "डिप्लोमा और सर्टिफिकेट कोर्स",
    subtitle: "Certificate on Completion", // TODO(owner): confirm certifying authority
    subtitle_hi: "पूर्णता पर प्रमाणपत्र", // TODO(owner): confirm certifying authority
  },
  {
    key: "entrance",
    icon: "book",
    title: "NIFT / NID / CEED PREPARATION",
    title_hi: "NIFT / NID / CEED तैयारी",
    subtitle: "Entrance Coaching by Experts",
    subtitle_hi: "विशेषज्ञों द्वारा एंट्रेंस कोचिंग",
  },
];

export const DEFAULT_CATEGORY_CARDS = [
  {
    key: "courses",
    href: "/courses",
    icon: "graduation",
    title: "Institute Courses",
    title_hi: "इंस्टिट्यूट कोर्स",
    tagline: "Learn • Practice • Earn",
    tagline_hi: "सीखें • प्रैक्टिस • कमाई",
    items: [
      { label: "Fashion Designing Courses", label_hi: "फैशन डिज़ाइनिंग कोर्स" },
      { label: "Boutique Management", label_hi: "बुटीक मैनेजमेंट" },
      { label: "NIFT • NID • UCEED Coaching", label_hi: "NIFT • NID • UCEED कोचिंग" },
      { label: "Embroidery & Pattern Making", label_hi: "एम्ब्रॉयडरी व पैटर्न मेकिंग" },
      { label: "Internship & Placement Support", label_hi: "इंटर्नशिप व प्लेसमेंट सपोर्ट" },
    ],
    cta: "Explore Courses",
    cta_hi: "कोर्स देखें",
  },
  {
    key: "boutique",
    href: "/shop",
    icon: "mannequin",
    title: "Boutique Stitching",
    title_hi: "बुटीक सिलाई",
    tagline: "Premium Custom Stitching",
    tagline_hi: "प्रीमियम कस्टम सिलाई",
    items: [
      { label: "Designer Blouse, Suits & Kurtis", label_hi: "डिज़ाइनर ब्लाउज, सूट व कुर्ती" },
      { label: "Bridal Lehenga & Gowns", label_hi: "ब्राइडल लहंगा व गाउन" },
      { label: "Saree Pre-Stitching", label_hi: "साड़ी प्री-स्टिचिंग" },
      { label: "Alteration & Perfect Fitting", label_hi: "अल्टरेशन व परफेक्ट फिटिंग" },
      { label: "24 Hour Express Delivery*", label_hi: "24 घंटे एक्सप्रेस डिलीवरी*" },
    ],
    cta: "Book Stitching",
    cta_hi: "सिलाई बुक करें",
  },
  {
    key: "collection",
    href: "/portfolio",
    icon: "blouse",
    title: "Designer Collection",
    title_hi: "डिज़ाइनर कलेक्शन",
    tagline: "Latest. Exclusive. Elegant.",
    tagline_hi: "लेटेस्ट. एक्सक्लूसिव. एलिगेंट.",
    items: [
      { label: "Latest Blouse Designs", label_hi: "लेटेस्ट ब्लाउज डिज़ाइन" },
      { label: "Bridal & Party Wear", label_hi: "ब्राइडल व पार्टी वियर" },
      { label: "Saree & Lehenga Collection", label_hi: "साड़ी व लहंगा कलेक्शन" },
      { label: "Trending Designs Gallery", label_hi: "ट्रेंडिंग डिज़ाइन गैलरी" },
    ],
    cta: "View Collection",
    cta_hi: "कलेक्शन देखें",
  },
  {
    key: "shakti",
    href: "/contact",
    icon: "shakti",
    title: "Shakti 50",
    title_hi: "शक्ति 50",
    tagline: "Kaushal se Karobar Tak",
    tagline_hi: "कौशल से कारोबार तक",
    items: [
      { label: "Free Training for 50 Women", label_hi: "50 महिलाओं के लिए मुफ़्त ट्रेनिंग" },
      { label: "Skill Development", label_hi: "कौशल विकास" },
      { label: "Self-Reliance & Empowerment", label_hi: "आत्मनिर्भरता व सशक्तिकरण" },
      { label: "Internship & Business Support", label_hi: "इंटर्नशिप व बिज़नेस सपोर्ट" },
    ],
    cta: "Know More",
    cta_hi: "और जानें",
  },
  {
    key: "shop",
    href: "/shop",
    icon: "bag",
    badge: "New",
    badge_hi: "नया",
    title: "Order on WhatsApp",
    title_hi: "WhatsApp पर ऑर्डर करें",
    tagline: "Custom fit, 24-hr stitching",
    tagline_hi: "कस्टम फिट, 24 घंटे सिलाई",
    items: [
      { label: "Designer Blouses", label_hi: "डिज़ाइनर ब्लाउज" },
      { label: "Ready-to-Wear Outfits", label_hi: "रेडी-टू-वेयर आउटफिट" },
      { label: "Accessories & More", label_hi: "एक्सेसरीज़ व अधिक" },
      { label: "Share your size, get a quote", label_hi: "साइज़ भेजें, कोटेशन पाएँ" },
    ],
    cta: "Chat & Order",
    cta_hi: "चैट कर ऑर्डर करें",
  },
];

export const DEFAULT_ABOUT_JOURNEY = [
  {
    year_key: "founding",
    title: "Founded in Patna",
    title_hi: "पटना में स्थापना",
    desc: "Started with a vision to empower women through fashion skills.",
    desc_hi: "फैशन कौशल से महिलाओं को सशक्त बनाने की दृष्टि के साथ शुरुआत।",
    icon: "🏛️",
  },
  {
    year_key: "students",
    title: "Students Trained",
    title_hi: "छात्र प्रशिक्षित",
    desc: "Learners who turned skill into self-employment.",
    desc_hi: "छात्राओं ने कौशल को स्वरोजगार में बदला।",
    icon: "🎓",
  },
  {
    year_key: "courses",
    title: "Professional Courses",
    title_hi: "प्रोफेशनल कोर्स",
    desc: "Boutique, blouse, suit, kids wear, fashion design & lehenga.",
    desc_hi: "बुटीक, ब्लाउज, सूट, किड्स वियर, फैशन डिज़ाइन और लहंगा।",
    icon: "📚",
  },
  {
    year_key: "express",
    title: "Stitching Service",
    title_hi: "सिलाई सेवा",
    desc: "Custom outfits delivered fast for urgent needs.",
    desc_hi: "जरूरी ऑर्डर के लिए तेज़ कस्टम सिलाई।",
    icon: "⚡",
  },
];

export const HERO_SERVICE_FIELDS = [
  { key: "key", label: "Key", default: "service" },
  { key: "icon", label: "Icon key", default: "fashion" },
  { key: "image", label: "Card image", type: "image", wide: true },
  { key: "image_alt", label: "Image description (EN)", wide: true },
  { key: "image_alt_hi", label: "Image description (HI)", wide: true },
  { key: "title", label: "Title (EN)", wide: true },
  { key: "title_hi", label: "Title (HI)", wide: true },
  { key: "desc", label: "Description (EN)", wide: true },
  { key: "desc_hi", label: "Description (HI)", wide: true },
  { key: "cta", label: "CTA (EN)", default: "BOOK NOW" },
  { key: "cta_hi", label: "CTA (HI)", default: "अभी बुक करें" },
  { key: "source", label: "Inquiry source", default: "hero_service" },
];

export const HOME_AWARD_FIELDS = [
  { key: "image", label: "Award or media photo", type: "image", wide: true },
  { key: "title", label: "Caption (EN)", wide: true },
  { key: "title_hi", label: "Caption (HI)", wide: true },
  { key: "image_alt", label: "Image description (EN)", wide: true },
  { key: "image_alt_hi", label: "Image description (HI)", wide: true },
];

export const HERO_FEATURE_FIELDS = [
  { key: "key", label: "Key", default: "feature" },
  { key: "icon", label: "Icon key", default: "sewing" },
  { key: "title", label: "Title (EN)", wide: true },
  { key: "title_hi", label: "Title (HI)", wide: true },
  { key: "subtitle", label: "Subtitle (EN)", wide: true },
  { key: "subtitle_hi", label: "Subtitle (HI)", wide: true },
];

export const CATEGORY_CARD_FIELDS = [
  { key: "key", label: "Key", default: "card" },
  { key: "href", label: "Link", default: "/contact" },
  { key: "icon", label: "Icon key", default: "graduation" },
  { key: "badge", label: "Badge (EN)" },
  { key: "badge_hi", label: "Badge (HI)" },
  { key: "title", label: "Title (EN)", wide: true },
  { key: "title_hi", label: "Title (HI)", wide: true },
  { key: "tagline", label: "Tagline (EN)", wide: true },
  { key: "tagline_hi", label: "Tagline (HI)", wide: true },
  { key: "cta", label: "CTA (EN)" },
  { key: "cta_hi", label: "CTA (HI)" },
  {
    key: "items_text",
    label: "Items EN|HI (one per line)",
    type: "textarea",
    wide: true,
    rows: 4,
  },
];

export const ABOUT_JOURNEY_FIELDS = [
  { key: "year_key", label: "Stat key (founding/students/courses/express)", default: "founding" },
  { key: "icon", label: "Emoji", default: "✦" },
  { key: "title", label: "Title (EN)" },
  { key: "title_hi", label: "Title (HI)" },
  { key: "desc", label: "Description (EN)", type: "textarea", wide: true },
  { key: "desc_hi", label: "Description (HI)", type: "textarea", wide: true },
];

/** Flatten card items for the admin textarea. */
export function categoryItemsToText(card) {
  if (Array.isArray(card?.columns) && card.columns.length) {
    return card.columns
      .flatMap((col) => [
        `# ${col.heading || ""}|${col.heading_hi || col.headingHi || ""}`,
        ...(col.items || []).map((row) => `${row.label || ""}|${row.label_hi || row.labelHi || ""}`),
      ])
      .join("\n");
  }
  return (card?.items || [])
    .map((row) => `${row.label || ""}|${row.label_hi || row.labelHi || ""}`)
    .join("\n");
}

/** Parse admin textarea back into items (or columns when lines start with #). */
export function categoryItemsFromText(text) {
  const lines = String(text || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (!lines.length) return { items: [] };

  const hasColumns = lines.some((l) => l.startsWith("#"));
  if (!hasColumns) {
    return {
      items: lines.map((line) => {
        const [label = "", label_hi = ""] = line.split("|");
        return { label: label.trim(), label_hi: label_hi.trim() };
      }),
    };
  }

  const columns = [];
  let current = null;
  for (const line of lines) {
    if (line.startsWith("#")) {
      const body = line.replace(/^#\s*/, "");
      const [heading = "", heading_hi = ""] = body.split("|");
      current = { heading: heading.trim(), heading_hi: heading_hi.trim(), items: [] };
      columns.push(current);
      continue;
    }
    if (!current) {
      current = { heading: "", heading_hi: "", items: [] };
      columns.push(current);
    }
    const [label = "", label_hi = ""] = line.split("|");
    current.items.push({ label: label.trim(), label_hi: label_hi.trim() });
  }
  return { columns, items: [] };
}

export function categoryCardsForEditor(raw) {
  const defaults = DEFAULT_CATEGORY_CARDS;
  if (!Array.isArray(raw) || !raw.length) {
    return defaults.map((card) => ({
      ...card,
      items_text: categoryItemsToText(card),
    }));
  }

  return raw.map((match, index) => {
    const def = defaults.find((c) => c.key === match.key) || defaults[index] || {};
    const merged = { ...def, ...match, key: match.key || def.key };
    if (!merged.items_text) merged.items_text = categoryItemsToText(merged);
    return merged;
  });
}

export function categoryCardsFromEditor(cards) {
  if (!Array.isArray(cards)) return DEFAULT_CATEGORY_CARDS.map((c) => ({ ...c }));
  return cards.map((card) => {
    const { items_text, ...rest } = card;
    const parsed = categoryItemsFromText(items_text);
    const next = { ...rest };
    if (parsed.columns?.length) {
      next.columns = parsed.columns;
      delete next.items;
    } else {
      next.items = parsed.items;
      delete next.columns;
    }
    return next;
  });
}
