/** Self-hosted media paths (WebP). */
export const MEDIA = {
  heroStudioBanner: "/hero_studio_banner.webp",
  background: "/background.webp",
  slider1: "/slider1.webp",
  slider2: "/slider2.webp",
  slider3: "/slider3.webp",
  boutique: "/boutique.webp",
  logo3d: "/3d.webp",
  logoNav: "/logo-nav.webp",
  founderSanjay: "/founders/sanjay-kumar-mishra.webp",
  founderShreya: "/founders/sangi-shreya.webp",
  categories: {
    bridal: "/categories/bridal.webp",
    ethnicWear: "/categories/ethnic-wear.webp",
    stitching: "/categories/stitching.webp",
  },
};

const LEGACY_WEBP = {
  "/hero_studio_banner.png": MEDIA.heroStudioBanner,
  "/background.png": MEDIA.background,
  "/slider1.png": MEDIA.slider1,
  "/slider2.png": MEDIA.slider2,
  "/slider3.png": MEDIA.slider3,
  "/boutique.png": MEDIA.boutique,
  "/boutique.png": MEDIA.boutique,
  "/3d.png": MEDIA.logo3d,
  "/logo-nav.png": MEDIA.logoNav,
  "/categories/bridal.png": MEDIA.categories.bridal,
  "/categories/ethnic-wear.png": MEDIA.categories.ethnicWear,
  "/categories/stitching.png": MEDIA.categories.stitching,
};

const SUPABASE_FOUNDER_IDS = {
  "1781886543737": MEDIA.founderSanjay,
  "1781196462114": MEDIA.founderShreya,
};

/** Map legacy PNG paths and Supabase founder URLs to self-hosted WebP. */
export function resolveMediaSrc(src) {
  if (!src || typeof src !== "string") return src;
  if (src.includes("supabase.co/storage")) {
    for (const [id, local] of Object.entries(SUPABASE_FOUNDER_IDS)) {
      if (src.includes(id)) return local;
    }
  }
  return LEGACY_WEBP[src] || src;
}

export function resolveFounderImage(src, fallback) {
  const resolved = resolveMediaSrc(src);
  if (!resolved || resolved.includes("supabase.co/storage")) return fallback;
  return resolved;
}

/** Alt text for hero service card images (EN / HI). */
export function heroServiceImageAlt(key, lang = "en") {
  const hi = lang === "hi";
  const alts = {
    fashion: hi
      ? "पटना में फैशन डिज़ाइनर स्टूडियो में स्केचिंग और ब्राइडल गाउन, श्रेया क्रिएशन"
      : "Fashion designer sketching beside a blush-pink bridal gown at Shreya Creation studio, Patna",
    boutique: hi
      ? "श्रेया क्रिएशन बुटीक — पटना में डिज़ाइनर सिलाई और बुटीक कोर्स"
      : "Shreya Creation boutique icon — designer stitching and boutique courses in Patna",
    blouse: hi
      ? "पटना में श्रेया क्रिएशन पर सिला ब्राइडल ब्लाउज़ और लहंगा"
      : "Bridal blouse and lehenga stitched at Shreya Creation, Patna",
    lehenga: hi
      ? "पटना में श्रेया क्रिएशन स्टूडियो में डिज़ाइनर ब्राइडल लहंगा"
      : "Designer bridal lehenga on mannequin at Shreya Creation fashion studio, Patna",
    suit: hi
      ? "पटना में श्रेया क्रिएशन पर कस्टम एथनिक सूट सिलाई"
      : "Custom ethnic suit stitching at Shreya Creation, Patna",
    handwork: hi
      ? "पटना में श्रेया क्रिएशन की प्रीमियम हैंडवर्क और एम्ब्रॉयडरी सिलाई"
      : "Premium hand embroidery and stitching services at Shreya Creation, Patna",
  };
  return alts[key] || (hi ? "श्रेया क्रिएशन सेवा" : "Shreya Creation service");
}

/** Alt text for explore category card images. */
export function exploreCategoryAlt(key, lang = "en") {
  const hi = lang === "hi";
  const alts = {
    boutique: hi ? "फैशन डिज़ाइनिंग कोर्स, श्रेया क्रिएशन पटना" : "Fashion designing courses at Shreya Creation, Patna",
    "blouse-making": hi ? "ब्लाउज मेकिंग कोर्स, श्रेया क्रिएशन" : "Blouse making course at Shreya Creation, Patna",
    "fashion-designing": hi ? "फैशन डिज़ाइन कोर्स, पटना" : "Fashion design course in Patna at Shreya Creation",
    stitching: hi ? "सूट और किड्स वियर सिलाई कोर्स, पटना" : "Suit and kids wear stitching course in Patna",
    beauty: hi ? "ब्यूटी और एक्सेसरीज़, श्रेया क्रिएशन" : "Beauty and accessories at Shreya Creation",
    bridal: hi
      ? "पटना में श्रेया क्रिएशन पर मैरून और गोल्ड ब्राइडल लहंगा"
      : "Maroon and gold bridal lehenga stitched at Shreya Creation, Patna",
    "ethnic-wear": hi ? "पटना में कस्टम एथनिक वियर और सूट सिलाई" : "Custom ethnic wear and suit stitching in Patna",
  };
  return alts[key] || (hi ? "श्रेया क्रिएशन श्रेणी" : "Shreya Creation category");
}
