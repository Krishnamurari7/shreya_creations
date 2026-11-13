/** Supabase public media — site-defaults uploads + known studio assets. */
const SB_MEDIA = "https://mvnllmfidxslxfqexkxs.supabase.co/storage/v1/object/public/media";
const SB_DEFAULTS = `${SB_MEDIA}/site-defaults`;

// Keep the current large CMS homepage images as editable settings while serving
// compact local copies until an admin uploads a replacement.
const OPTIMIZED_HOMEPAGE_IMAGES = {
  [`${SB_MEDIA}/1782239288560-v7jdgv.png`]: "/hero-demo-poster.webp",
  [`${SB_MEDIA}/1782239324371-pvtg8u.png`]: "/hero-book-poster.webp",
  [`${SB_MEDIA}/1794594656732-mos6w1.png`]: "/home-popup-banner.webp",
};

/** Canonical media URLs (Supabase Storage). Local /public paths are remapped via resolveMediaSrc. */
export const MEDIA = {
  heroStudioBanner: `${SB_DEFAULTS}/hero_studio_banner.webp`,
  // Keep critical chrome assets local for LCP / favicon reliability.
  background: "/background.webp",
  backgroundMobile: "/background-mobile.webp",
  slider1: `${SB_DEFAULTS}/slider1.webp`,
  slider2: `${SB_DEFAULTS}/slider2.webp`,
  slider3: `${SB_DEFAULTS}/slider3.webp`,
  slider4: `${SB_DEFAULTS}/slider4.webp`,
  slider1Poster: `${SB_DEFAULTS}/slider1-poster.webp`,
  slider2Poster: `${SB_DEFAULTS}/slider2-poster.webp`,
  boutique: `${SB_DEFAULTS}/boutique.webp`,
  logo3d: "/3d-sm.webp",
  logoNav: "/logo-nav-sm.webp",
  institute: `${SB_DEFAULTS}/institute.webp`,
  job: `${SB_DEFAULTS}/job.webp`,
  atelierDetails: `${SB_DEFAULTS}/atelier_details.webp`,
  founderSanjay: `${SB_MEDIA}/1781886543737-7cnjnu.jpeg`,
  founderShreya: `${SB_MEDIA}/1781196462114-6xdquf.jpeg`,
  categories: {
    bridal: `${SB_DEFAULTS}/categories/bridal.webp`,
    ethnicWear: `${SB_DEFAULTS}/categories/ethnic-wear.webp`,
    stitching: `${SB_DEFAULTS}/categories/stitching.webp`,
    fashionDesigning: `${SB_DEFAULTS}/categories/fashion-designing.webp`,
    beauty: `${SB_DEFAULTS}/categories/beauty.webp`,
  },
};

/** Local public paths → Supabase (legacy CMS / seed / hardcoded). */
const LOCAL_TO_SUPABASE = {
  "/hero_studio_banner.webp": MEDIA.heroStudioBanner,
  "/hero_studio_banner.png": MEDIA.heroStudioBanner,
  "/slider1.webp": MEDIA.slider1,
  "/slider1.png": MEDIA.slider1,
  "/slider2.webp": MEDIA.slider2,
  "/slider2.png": MEDIA.slider2,
  "/slider3.webp": MEDIA.slider3,
  "/slider3.png": MEDIA.slider3,
  "/slider4.webp": MEDIA.slider4,
  "/slider4.png": MEDIA.slider4,
  "/slider5.png": MEDIA.slider4,
  "/slider1-poster.webp": MEDIA.slider1Poster,
  "/slider2-poster.webp": MEDIA.slider2Poster,
  "/boutique.webp": MEDIA.boutique,
  "/boutique.png": MEDIA.boutique,
  "/botique.png": MEDIA.boutique,
  "/institute.webp": MEDIA.institute,
  "/institute.png": MEDIA.institute,
  "/job.webp": MEDIA.job,
  "/job.png": MEDIA.job,
  "/atelier_details.webp": MEDIA.atelierDetails,
  "/atelier_details.png": MEDIA.atelierDetails,
  "/founders/sanjay-kumar-mishra.webp": MEDIA.founderSanjay,
  "/founders/sangi-shreya.webp": MEDIA.founderShreya,
  "/categories/bridal.webp": MEDIA.categories.bridal,
  "/categories/bridal.png": MEDIA.categories.bridal,
  "/categories/ethnic-wear.webp": MEDIA.categories.ethnicWear,
  "/categories/ethnic-wear.png": MEDIA.categories.ethnicWear,
  "/categories/stitching.webp": MEDIA.categories.stitching,
  "/categories/stitching.png": MEDIA.categories.stitching,
  "/categories/fashion-designing.webp": MEDIA.categories.fashionDesigning,
  "/categories/fashion-designing.png": MEDIA.categories.fashionDesigning,
  "/categories/beauty.webp": MEDIA.categories.beauty,
  "/categories/beauty.png": MEDIA.categories.beauty,
  // Legacy journey-card placeholders (files were never in /public)
  "/5.jpeg": MEDIA.slider1,
  "/7.jpeg": MEDIA.slider2,
  "/8.jpeg": MEDIA.slider3,
};

const LEGACY_PNG_EXT = /\.png$/i;

/** Map legacy local paths to Supabase; leave already-remote URLs unchanged. */
export function resolveMediaSrc(src) {
  if (!src || typeof src !== "string") return src;
  if (OPTIMIZED_HOMEPAGE_IMAGES[src]) return OPTIMIZED_HOMEPAGE_IMAGES[src];
  if (src.includes("supabase.co/storage")) return src;
  if (LOCAL_TO_SUPABASE[src]) return LOCAL_TO_SUPABASE[src];
  if (src.startsWith("/") && !src.startsWith("//") && LEGACY_PNG_EXT.test(src)) {
    const webp = src.replace(LEGACY_PNG_EXT, ".webp");
    return LOCAL_TO_SUPABASE[webp] || LOCAL_TO_SUPABASE[src] || webp;
  }
  return src;
}

export function resolveFounderImage(src, fallback = MEDIA.founderSanjay) {
  const resolved = resolveMediaSrc(src);
  return resolved || fallback;
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
