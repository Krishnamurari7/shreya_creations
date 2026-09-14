/**
 * Single source of truth for site facts (brand, stats, contact, hours).
 * Backed by Supabase `settings` (id=1) via getSiteSettings() / buildSITE().
 * coursesCount is preferred from published courses; DEFAULT_COURSES_COUNT is the display fallback.
 */

import { BRAND_NAME, normalizeBrandName } from "@/lib/brand";

/** Brand founding year — years of experience = current year − this. */
export const DEFAULT_FOUNDING_YEAR = 2012;
/** @deprecated Prefer FOUNDED_YEAR — kept for existing imports. */
export const FOUNDED_YEAR = DEFAULT_FOUNDING_YEAR;

export const DEFAULT_STUDENTS_TAUGHT = 2000;
export const DEFAULT_OUTFITS_DELIVERED = 5000;
export const DEFAULT_COURSES_COUNT = 10;
export const DEFAULT_EXPRESS_DELIVERY_HOURS = 24;

/** E.164-style numbers for tel:/wa.me (no spaces). */
export const DEFAULT_PHONE_PRIMARY = "+919031105666";
export const DEFAULT_PHONE_SECONDARY = "+917903155125";
export const DEFAULT_WHATSAPP = "919031105666";

/** Confirmed business inbox — matches site host shreyacreation.com */
export const DEFAULT_EMAIL = "hello@shreyacreation.com";

export const DEFAULT_STUDIO_HOURS = "Mon–Sat, 11 AM–8 PM";
export const DEFAULT_CLOSED_DAYS = "Sunday";
export const DEFAULT_CITY = "Patna";
export const DEFAULT_PINCODE = "800001";
export const DEFAULT_ADDRESS_LINE =
  "Shreya Creation, Sisodiya Place, East Boring Canal Road, Sri Krishna Puri, Patna, Bihar 800001";

/**
 * Studio pin for LocalBusiness JSON-LD (GBP / Maps).
 * @type {{ latitude: number, longitude: number } | null}
 */
export const DEFAULT_GEO = {
  latitude: 25.610524557996968,
  longitude: 85.1189048153447,
};

export const DEFAULT_SOCIALS = {
  instagram: "https://www.instagram.com/shreya.creationss/",
  youtube: "https://www.youtube.com/@ShreyaCreations111/",
  facebook: "https://www.facebook.com/shreyascreation",
};

/** Stable YouTube channel id for @ShreyaCreations111 (uploads playlist = UU + rest). */
export const DEFAULT_YOUTUBE_CHANNEL_ID = "UCpPUrj0cpbzAe9-J4T4O3FQ";
export const DEFAULT_YOUTUBE_HANDLE = "ShreyaCreations111";
export const DEFAULT_FACEBOOK_HANDLE = "shreyascreation";

/** Keep the public Page URL the owner provided. */
export function canonicalFacebookUrl(url) {
  const fallback = DEFAULT_SOCIALS.facebook;
  if (!url || typeof url !== "string") return fallback;
  try {
    const slug = new URL(url).pathname.split("/").filter(Boolean)[0] || "";
    if (/^shreyacreations$/i.test(slug)) return fallback;
    return url;
  } catch {
    return fallback;
  }
}

/**
 * @param {number} foundingYear
 * @param {number} [nowYear]
 */
export function computeYearsExperience(foundingYear, nowYear = new Date().getFullYear()) {
  const y = Number(foundingYear) || DEFAULT_FOUNDING_YEAR;
  return Math.max(0, nowYear - y);
}

/** Canonical display exports — single source of truth for UI copy. */
export const YEARS_OF_TRUST = `${computeYearsExperience(DEFAULT_FOUNDING_YEAR)}+`;
export const COURSE_COUNT = `${DEFAULT_COURSES_COUNT}+`;
export const STUDENTS_TRAINED = `${DEFAULT_STUDENTS_TAUGHT}+`;
export const OUTFITS_DELIVERED = `${DEFAULT_OUTFITS_DELIVERED}+`;
export const PHONE_PRIMARY = DEFAULT_PHONE_PRIMARY;
export const PHONE_SECONDARY = DEFAULT_PHONE_SECONDARY;
export const WHATSAPP_NUMBER = DEFAULT_WHATSAPP;
export const EMAIL = DEFAULT_EMAIL;
export const ADDRESS = DEFAULT_ADDRESS_LINE;
export const HOURS = DEFAULT_STUDIO_HOURS;
export const SOCIAL_LINKS = { ...DEFAULT_SOCIALS };

/** Visible footnote for every 24-hour / express-delivery asterisk claim. */
export const EXPRESS_DELIVERY_DISCLAIMER = {
  en: "*Depends on design complexity and fabric availability. Confirm timeline on WhatsApp.",
  hi: "*डिज़ाइन की जटिलता और कपड़े की उपलब्धता पर निर्भर। WhatsApp पर समय कन्फर्म करें।",
};

/**
 * Display-ready business facts for UI copy. Prefer runtime site.* when available;
 * use these only as fallbacks so marketing numbers stay consistent.
 */
export const SITE_FACTS = {
  yearsOfExperience: `${computeYearsExperience(DEFAULT_FOUNDING_YEAR)}+`,
  studentsTrained: `${DEFAULT_STUDENTS_TAUGHT}+`,
  outfitsDelivered: `${DEFAULT_OUTFITS_DELIVERED}+`,
  coursesCount: COURSE_COUNT,
  phone1: DEFAULT_PHONE_PRIMARY,
  phone2: DEFAULT_PHONE_SECONDARY,
  email: DEFAULT_EMAIL,
  address: DEFAULT_ADDRESS_LINE,
  socials: { ...DEFAULT_SOCIALS },
};

/** Digits suitable for tel: / wa.me (keeps leading +). */
export function phoneDigits(phone) {
  if (!phone?.trim()) return "";
  return String(phone).replace(/[^\d+]/g, "");
}

/** Build a click-to-call href for a single number. */
export function telHref(phone) {
  const digits = phoneDigits(phone);
  return digits ? `tel:${digits}` : null;
}

/** Pretty display for E.164 Indian mobiles: +91 XXXXX XXXXX */
export function formatPhoneDisplay(phone) {
  const d = phoneDigits(phone).replace(/^\+/, "");
  if (d.length === 12 && d.startsWith("91")) {
    return `+91 ${d.slice(2, 7)} ${d.slice(7)}`;
  }
  if (d.length === 10) {
    return `+91 ${d.slice(0, 5)} ${d.slice(5)}`;
  }
  return String(phone || "").trim();
}

/**
 * Split a combined display string like "+91 90311 05666 / 79031 55125"
 * into primary + secondary E.164-ish values.
 */
export function parsePhonePair(combined, fallbackPrimary, fallbackSecondary) {
  const parts = String(combined || "")
    .split(/\s*[/|,]\s*|\s+or\s+/i)
    .map((p) => p.trim())
    .filter(Boolean);

  const toE164 = (raw, fallback) => {
    if (!raw) return fallback;
    let d = raw.replace(/[^\d]/g, "");
    if (d.length === 10) d = `91${d}`;
    if (d.length === 12 && d.startsWith("91")) return `+${d}`;
    if (d.length > 0) return raw.startsWith("+") ? `+${d}` : `+${d}`;
    return fallback;
  };

  return {
    primary: toE164(parts[0], fallbackPrimary),
    secondary: toE164(parts[1], fallbackSecondary),
  };
}

/**
 * Display helpers derived from numeric facts.
 * @param {{ foundingYear: number, studentsTaught: number, coursesCount: number, yearsExperience: number }} facts
 */
export function formatSiteStats(facts) {
  const years = facts.yearsExperience;
  const students = facts.studentsTaught;
  const courses = facts.coursesCount || DEFAULT_COURSES_COUNT;
  return {
    yearsEn: `${years}+ Years`,
    yearsHi: `${years}+ वर्ष`,
    studentsEn: `${students}+ Students`,
    studentsHi: `${students}+ छात्र`,
    coursesEn: `${courses}+ Courses`,
    coursesHi: `${courses}+ कोर्स`,
    lineEn: `${years}+ Years · ${students}+ Students`,
    lineHi: `${years}+ वर्ष · ${students}+ छात्र`,
  };
}

/**
 * Build default trust wall rows from SITE facts.
 * @param {ReturnType<typeof buildSITE>} site
 */
export function buildTrustFromSite(site) {
  return [
    {
      value: `${site.yearsExperience}+`,
      valueHi: `${site.yearsExperience}+`,
      label: "Years Experience",
      labelHi: "वर्ष अनुभव",
    },
    {
      value: `${site.studentsTaught}+`,
      valueHi: `${site.studentsTaught}+`,
      label: "Students Trained",
      labelHi: "प्रशिक्षित छात्र",
    },
    {
      value: `${site.coursesCount || DEFAULT_COURSES_COUNT}+`,
      valueHi: `${site.coursesCount || DEFAULT_COURSES_COUNT}+`,
      label: "Courses Offered",
      labelHi: "कोर्स उपलब्ध",
    },
    {
      value: `${site.expressDeliveryHours} Hours`,
      valueHi: `${site.expressDeliveryHours} घंटे`,
      label: "Delivery Service",
      labelHi: "डिलीवरी सेवा",
    },
  ];
}

function num(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

/** Google star average, or null when unset/out of range so callers can hide the card. */
function ratingOrNull(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 && n <= 5 ? Math.round(n * 10) / 10 : null;
}

function str(value, fallback) {
  if (value == null) return fallback;
  const s = String(value).trim();
  return s || fallback;
}

/**
 * Merge raw settings (DB or seed) + published course count into a canonical SITE object.
 * @param {Record<string, any>} [raw]
 * @param {{ coursesCount?: number }} [opts]
 */
export function buildSITE(raw = {}, opts = {}) {
  const foundingYear = num(raw.founding_year ?? raw.foundingYear, DEFAULT_FOUNDING_YEAR);
  const yearsExperience = computeYearsExperience(foundingYear);
  const studentsTaught = num(raw.students_taught ?? raw.studentsTaught, DEFAULT_STUDENTS_TAUGHT);
  const outfitsDelivered = num(raw.outfits_delivered ?? raw.outfitsDelivered, DEFAULT_OUTFITS_DELIVERED);
  const expressDeliveryHours = num(
    raw.express_delivery_hours ?? raw.expressDeliveryHours,
    DEFAULT_EXPRESS_DELIVERY_HOURS
  );
  const countedCourses = num(opts.coursesCount ?? raw.coursesCount, 0);
  const coursesCount = countedCourses > 0 ? countedCourses : DEFAULT_COURSES_COUNT;

  // Google numbers are typed in by hand, so there is no safe default: leaving
  // them null keeps the rating card hidden instead of publishing a made-up score.
  const googleRating = ratingOrNull(raw.google_rating ?? raw.googleRating);
  const googleReviewCount = googleRating == null ? 0 : num(raw.google_review_count ?? raw.googleReviewCount, 0);

  const legacyCombined = str(raw.phone, "");
  const parsed = parsePhonePair(legacyCombined, DEFAULT_PHONE_PRIMARY, DEFAULT_PHONE_SECONDARY);

  const phonePrimary = str(raw.phone_primary ?? raw.phonePrimary, parsed.primary);
  const phoneSecondary = str(raw.phone_secondary ?? raw.phoneSecondary, parsed.secondary);
  const phoneDisplay =
    legacyCombined ||
    [formatPhoneDisplay(phonePrimary), formatPhoneDisplay(phoneSecondary)].filter(Boolean).join(" / ");

  const whatsappNumber = str(
    raw.whatsapp_number ?? raw.whatsappNumber ?? raw.whatsapp,
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_WHATSAPP
  );

  const nextBatchDate = raw.next_batch_date ?? raw.nextBatchDate ?? null;
  const nextBatchSeats = raw.next_batch_seats ?? raw.nextBatchSeats ?? null;
  const feeStructurePdf = raw.fee_structure_pdf ?? raw.feeStructurePdf ?? null;
  const instagramHandle = raw.instagram_handle ?? raw.instagramHandle ?? "shreya.creationss";

  const addressLine = str(raw.address_line ?? raw.addressLine ?? raw.address, DEFAULT_ADDRESS_LINE);
  const city = str(raw.city, DEFAULT_CITY).replace(/,.*$/, "").trim() || DEFAULT_CITY;
  const pincode = str(raw.pincode, DEFAULT_PINCODE);
  const studioHours = str(raw.studio_hours ?? raw.studioHours, DEFAULT_STUDIO_HOURS);
  const closedDays = str(raw.closed_days ?? raw.closedDays, DEFAULT_CLOSED_DAYS);
  const email = str(raw.email, DEFAULT_EMAIL);

  const geoLat = Number(raw.geo_lat ?? raw.geoLat ?? raw.latitude);
  const geoLng = Number(raw.geo_lng ?? raw.geoLng ?? raw.longitude);
  const geoFromRaw =
    Number.isFinite(geoLat) &&
    Number.isFinite(geoLng) &&
    geoLat >= -90 &&
    geoLat <= 90 &&
    geoLng >= -180 &&
    geoLng <= 180
      ? { latitude: geoLat, longitude: geoLng }
      : null;
  const geo = geoFromRaw || DEFAULT_GEO;

  const stats = formatSiteStats({ foundingYear, studentsTaught, coursesCount, yearsExperience });

  const socialsIn = raw.socials && typeof raw.socials === "object" ? raw.socials : {};

  return {
    brandName: normalizeBrandName(str(raw.brand ?? raw.brandName, BRAND_NAME)),
    brand: normalizeBrandName(str(raw.brand ?? raw.brandName, BRAND_NAME)),
    tagline: str(raw.tagline, "Stitched outfits in 24 hours"),
    taglineHi: str(raw.tagline_hi ?? raw.taglineHi, "24 घंटे में सिले कपड़े"),
    boutique: str(raw.boutique, "From Skill to Business"),
    boutiqueHi: str(raw.boutique_hi ?? raw.boutiqueHi, "कौशल से कारोबार तक"),
    intro: raw.intro,
    introHi: raw.intro_hi ?? raw.introHi,
    aboutBody: raw.about_body ?? raw.aboutBody,
    aboutBodyHi: raw.about_body_hi ?? raw.aboutBodyHi,
    aboutPillars: raw.aboutPillars ?? raw.about_pillars ?? [],
    foundingYear,
    yearsExperience,
    studentsTaught,
    outfitsDelivered,
    expressDeliveryHours,
    coursesCount,
    phonePrimary,
    phoneSecondary,
    phone1: phonePrimary,
    phone2: phoneSecondary,
    phone: phoneDisplay,
    email,
    addressLine,
    address: addressLine,
    city,
    pincode,
    studioHours,
    closedDays,
    geo,
    whatsapp: whatsappNumber,
    whatsappNumber,
    mapEmbedUrl: raw.map_embed_url ?? raw.mapEmbedUrl,
    googleReviewsUrl: raw.google_reviews_url ?? raw.googleReviewsUrl ?? "",
    googleRating,
    googleReviewCount,
    socials: {
      instagram: str(socialsIn.instagram, DEFAULT_SOCIALS.instagram),
      youtube: str(socialsIn.youtube, DEFAULT_SOCIALS.youtube),
      facebook: str(socialsIn.facebook, DEFAULT_SOCIALS.facebook),
      whatsappNumber,
    },
    heroMarquee: Array.isArray(raw.hero_marquee ?? raw.heroMarquee)
      ? raw.hero_marquee ?? raw.heroMarquee
      : [
          "Fashion Boutique Institute",
          "पटना का भरोसेमंद फैशन बुटीक इंस्टिट्यूट",
          `${yearsExperience}+ वर्षों का अनुभव | Since ${foundingYear}`,
        ],
    founded: stats.yearsEn,
    foundedHi: stats.yearsHi,
    stats,
    pages: raw.pages,
    services: raw.services,
    processSteps: raw.processSteps ?? raw.process_steps,
    instagramEmbed: raw.instagramEmbed ?? raw.instagram_embed,
    instagramHandle,
    nextBatchDate,
    nextBatchSeats,
    feeStructurePdf,
    defaultLanguage: raw.defaultLanguage ?? raw.default_language ?? "en",
  };
}

/** Static defaults when DB is empty (seed uses this). */
export const SITE_DEFAULTS = buildSITE({}, { coursesCount: DEFAULT_COURSES_COUNT });

/**
 * Layout chrome (Navbar/Footer/contact bar) only needs contact/brand fields.
 * Omit `pages` so other routes' meta_title/description are not embedded in every HTML payload
 * (SEO tools otherwise report conflicting “Rendered” meta from JSON in the DOM).
 */
export function chromeSiteProps(site) {
  if (!site || typeof site !== "object") return site;
  const {
    pages: _pages,
    aboutBody: _aboutBody,
    aboutBodyHi: _aboutBodyHi,
    aboutPillars: _aboutPillars,
    services: _services,
    processSteps: _processSteps,
    intro: _intro,
    introHi: _introHi,
    ...chrome
  } = site;
  return chrome;
}
