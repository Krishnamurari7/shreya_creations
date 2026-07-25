/** Homepage block defaults used by Hero, Category cards, and Admin Pages editor. */

export const DEFAULT_HERO_SERVICE_CARDS = [
  {
    key: "fashion",
    icon: "fashion",
    image: "/slider1.png",
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
    image: "/botique.png",
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
    image: "/categories/bridal.png",
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
    image: "/slider3.png",
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
    image: "/categories/ethnic-wear.png",
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
    image: "/categories/stitching.png",
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
    desc: "Get Your Outfit in Just 24 Hours.",
    desc_hi: "सिर्फ 24 घंटे में अपना आउटफिट पाएँ।",
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
    subtitle: "Govt. Recognized Certification",
    subtitle_hi: "सरकारी मान्यता प्राप्त प्रमाणपत्र",
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
    title: "Boutique Services",
    title_hi: "बुटीक सेवाएँ",
    tagline: "Premium Custom Stitching",
    tagline_hi: "प्रीमियम कस्टम सिलाई",
    columns: [
      {
        heading: "Custom Stitching",
        heading_hi: "कस्टम सिलाई",
        items: [
          { label: "Designer Blouse", label_hi: "डिज़ाइनर ब्लाउज" },
          { label: "Suits & Kurtis", label_hi: "सूट व कुर्ती" },
          { label: "Alteration & Fitting", label_hi: "अल्टरेशन व फिटिंग" },
          { label: "24 Hour Delivery", label_hi: "24 घंटे डिलीवरी" },
        ],
      },
      {
        heading: "Designer Wear",
        heading_hi: "डिज़ाइनर वियर",
        items: [
          { label: "Bridal Lehengas", label_hi: "ब्राइडल लहंगा" },
          { label: "Gown & Indo-Western", label_hi: "गाउन व इंडो-वेस्टर्न" },
          { label: "Saree Pre-Stitching", label_hi: "साड़ी प्री-स्टिचिंग" },
          { label: "Premium Finishing", label_hi: "प्रीमियम फिनिशिंग" },
        ],
      },
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
      { label: "Order easily on WhatsApp", label_hi: "WhatsApp पर आसान ऑर्डर" },
    ],
    cta: "Browse & Order",
    cta_hi: "देखें और ऑर्डर करें",
  },
  {
    key: "student",
    href: "/portfolio",
    icon: "sewing",
    title: "Student Work",
    title_hi: "स्टूडेंट वर्क",
    tagline: "Real Hands. Real Skills.",
    tagline_hi: "असली हाथ. असली हुनर.",
    items: [
      { label: "Student Projects", label_hi: "स्टूडेंट प्रोजेक्ट" },
      { label: "Classroom Creations", label_hi: "क्लासरूम क्रिएशन्स" },
      { label: "Before & After Work", label_hi: "बिफोर एंड आफ्टर वर्क" },
      { label: "Practical Training Results", label_hi: "प्रैक्टिकल ट्रेनिंग रिजल्ट" },
    ],
    cta: "View Student Work",
    cta_hi: "स्टूडेंट वर्क देखें",
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
    key: "stories",
    href: "/about",
    icon: "trophy",
    title: "Success Stories",
    title_hi: "सफलता की कहानियाँ",
    tagline: "Trusted by Thousands",
    tagline_hi: "हज़ारों का भरोसा",
    items: [
      { label: "Google Reviews", label_hi: "Google रिव्यू" },
      { label: "Student Testimonials", label_hi: "स्टूडेंट टेस्टिमोनियल" },
      { label: "Customer Feedback", label_hi: "कस्टमर फीडबैक" },
      { label: "Success Journey", label_hi: "सफलता की यात्रा" },
    ],
    cta: "Read Reviews",
    cta_hi: "रिव्यू पढ़ें",
  },
  {
    key: "contact",
    href: "/contact",
    icon: "phone",
    title: "Contact & Visit",
    title_hi: "संपर्क व विज़िट",
    tagline: "We are here for you",
    tagline_hi: "हम आपके लिए यहाँ हैं",
    items: [
      { label: "WhatsApp Support", label_hi: "WhatsApp सपोर्ट" },
      { label: "Call Now", label_hi: "अभी कॉल करें" },
      { label: "Visit Our Studio", label_hi: "हमारा स्टूडियो देखें" },
      { label: "Get Direction", label_hi: "दिशा पाएँ" },
    ],
    cta: "Contact Us",
    cta_hi: "संपर्क करें",
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
  { key: "image", label: "Image path", wide: true },
  { key: "title", label: "Title (EN)", wide: true },
  { key: "title_hi", label: "Title (HI)", wide: true },
  { key: "desc", label: "Description (EN)", wide: true },
  { key: "desc_hi", label: "Description (HI)", wide: true },
  { key: "cta", label: "CTA (EN)", default: "BOOK NOW" },
  { key: "cta_hi", label: "CTA (HI)", default: "अभी बुक करें" },
  { key: "source", label: "Inquiry source", default: "hero_service" },
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

  return defaults.map((def, index) => {
    const match = raw.find((c) => c.key === def.key) || raw[index] || {};
    const merged = { ...def, ...match, key: def.key };
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
