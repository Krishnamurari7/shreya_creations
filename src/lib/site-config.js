/**
 * Single source of truth for site facts (brand, stats, contact, hours).
 * Backed by Supabase `settings` (id=1) via getSiteSettings() / buildSITE().
 * coursesCount is always computed from published courses — never hardcode.
 */

/** @typedef {import('./site-config.types').SiteConfig} SiteConfig */

// TODO(owner): set the ONE real number — site previously showed 1000+, 2000+, and 30,000+ / 30K+
export const DEFAULT_STUDENTS_TAUGHT = 2000;

// TODO(owner): confirm outfits delivered claim (was shown as 5,000+ in some places)
export const DEFAULT_OUTFITS_DELIVERED = 5000;

// TODO(owner): pick one founding year — 2007 is used almost everywhere; CMS founder quote said 2011
export const DEFAULT_FOUNDING_YEAR = 2007;

// TODO(owner): confirm real studio hours & closed day — conflicts were Mon–Sun 10–8 vs 11 AM–8 Closed Tuesdays
export const DEFAULT_STUDIO_HOURS = "Mon–Sat, 10 AM–8 PM";
export const DEFAULT_CLOSED_DAYS = "Sunday";

// TODO(owner): prefer an @shreyacreation.com inbox if it exists; otherwise keep the working inbox
export const DEFAULT_EMAIL = "hello@shreyacreations.in";

export const DEFAULT_EXPRESS_DELIVERY_HOURS = 24;

export const DEFAULT_PHONE_PRIMARY = "+91 91175 55125";
export const DEFAULT_PHONE_SECONDARY = "+91 95073 63125";
export const DEFAULT_WHATSAPP = "919031105666";
export const DEFAULT_CITY = "Patna";
export const DEFAULT_PINCODE = "800001";
export const DEFAULT_ADDRESS_LINE =
  "Shreya Creation, Sisodiya Place, East Boring Canal Road, Sri Krishna Puri, Patna, Bihar 800001";

/**
 * @param {number} foundingYear
 * @param {number} [nowYear]
 */
export function computeYearsExperience(foundingYear, nowYear = new Date().getFullYear()) {
  const y = Number(foundingYear) || DEFAULT_FOUNDING_YEAR;
  return Math.max(0, nowYear - y);
}

/**
 * Display helpers derived from numeric facts.
 * @param {{ foundingYear: number, studentsTaught: number, coursesCount: number, yearsExperience: number }} facts
 */
export function formatSiteStats(facts) {
  const years = facts.yearsExperience;
  const students = facts.studentsTaught;
  const courses = facts.coursesCount;
  return {
    yearsEn: `${years}+ Years`,
    yearsHi: `${years}+ वर्ष`,
    studentsEn: `${students}+ Students`,
    studentsHi: `${students}+ छात्र`,
    coursesEn: `${courses} Courses`,
    coursesHi: `${courses} कोर्स`,
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
      value: `${site.coursesCount}`,
      valueHi: `${site.coursesCount}`,
      label: "Job-Oriented Courses",
      labelHi: "जॉब ओरिएंटेड कोर्स",
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
  const coursesCount = num(opts.coursesCount ?? raw.coursesCount, 0);

  const phonePrimary = str(raw.phone_primary ?? raw.phonePrimary, DEFAULT_PHONE_PRIMARY);
  const phoneSecondary = str(raw.phone_secondary ?? raw.phoneSecondary, DEFAULT_PHONE_SECONDARY);
  const legacyPhone = str(raw.phone, `${phonePrimary} / ${phoneSecondary}`);

  const whatsappNumber = str(
    raw.whatsapp_number ?? raw.whatsappNumber ?? raw.whatsapp,
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_WHATSAPP
  );

  const addressLine = str(raw.address_line ?? raw.addressLine ?? raw.address, DEFAULT_ADDRESS_LINE);
  const city = str(raw.city, DEFAULT_CITY).replace(/,.*$/, "").trim() || DEFAULT_CITY;
  const pincode = str(raw.pincode, DEFAULT_PINCODE);
  const studioHours = str(raw.studio_hours ?? raw.studioHours, DEFAULT_STUDIO_HOURS);
  const closedDays = str(raw.closed_days ?? raw.closedDays, DEFAULT_CLOSED_DAYS);
  const email = str(raw.email, DEFAULT_EMAIL);

  const stats = formatSiteStats({ foundingYear, studentsTaught, coursesCount, yearsExperience });

  const socialsIn = raw.socials && typeof raw.socials === "object" ? raw.socials : {};

  return {
    brandName: str(raw.brand ?? raw.brandName, "Shreya creation"),
    brand: str(raw.brand ?? raw.brandName, "Shreya creation"),
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
    phone: legacyPhone,
    email,
    addressLine,
    address: addressLine,
    city,
    pincode,
    studioHours,
    closedDays,
    whatsapp: whatsappNumber,
    whatsappNumber,
    mapEmbedUrl: raw.map_embed_url ?? raw.mapEmbedUrl,
    socials: {
      instagram: str(socialsIn.instagram, "https://www.instagram.com/shreya.creationss/"),
      youtube: str(socialsIn.youtube, ""),
      facebook: str(socialsIn.facebook, "https://www.facebook.com/shreyascreation"),
      whatsappNumber,
    },
    heroMarquee: Array.isArray(raw.hero_marquee ?? raw.heroMarquee)
      ? raw.hero_marquee ?? raw.heroMarquee
      : [
          "Fashion Boutique Institute",
          "बिहार का No. 1",
          `${yearsExperience}+ वर्षों का अनुभव | Since ${foundingYear}`,
        ],
    founded: stats.yearsEn,
    foundedHi: stats.yearsHi,
    stats,
    pages: raw.pages,
    services: raw.services,
    processSteps: raw.processSteps ?? raw.process_steps,
    instagramEmbed: raw.instagramEmbed ?? raw.instagram_embed,
    defaultLanguage: raw.defaultLanguage ?? raw.default_language ?? "en",
  };
}

/** Static defaults when DB is empty (seed uses this). */
export const SITE_DEFAULTS = buildSITE({}, { coursesCount: 0 });
