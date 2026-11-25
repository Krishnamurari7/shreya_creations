import { getSiteUrl } from "@/lib/siteUrl";
import { LOGO_SRC } from "@/lib/brand";
import {
  DEFAULT_FOUNDING_YEAR,
  DEFAULT_CITY,
  DEFAULT_PINCODE,
  DEFAULT_EMAIL,
  formatPhoneDisplay,
} from "@/lib/site-config";

/** Direct CDN URL for LocalBusiness / Organization schema image (avoid ephemeral /_next/image URLs). */
export const SCHEMA_BUSINESS_IMAGE =
  "https://mvnllmfidxslxfqexkxs.supabase.co/storage/v1/object/public/media/1783527114529-jmf764.jpeg";

function absoluteUrl(value = "") {
  if (!value) return getSiteUrl();
  if (/^https?:\/\//i.test(value)) return value;
  return `${getSiteUrl()}${value.startsWith("/") ? value : `/${value}`}`;
}

/** Postal street line for schema.org — distinct from full display address. */
export const SCHEMA_STREET_ADDRESS =
  "J469+4GQ Sisodiya Place, E Boring Canal Rd, Sri Krishna Puri";

export function schemaIds(base = getSiteUrl()) {
  return {
    localBusiness: `${base}/#local-business`,
    /** @deprecated Prefer localBusiness — kept so existing @id references remain stable. */
    clothingStore: `${base}/#local-business`,
    organization: `${base}/#organization`,
    educationalOrganization: `${base}/#educational-organization`,
    website: `${base}/#website`,
  };
}

export function educationalOrganizationId() {
  return `${getSiteUrl()}/#educational-organization`;
}

function schemaLanguage(locale = "en") {
  return locale === "hi" ? "hi-IN" : "en-IN";
}

function sharedPostalAddress(site) {
  return {
    "@type": "PostalAddress",
    streetAddress: SCHEMA_STREET_ADDRESS,
    addressLocality: site?.city || DEFAULT_CITY,
    addressRegion: "Bihar",
    postalCode: site?.pincode || DEFAULT_PINCODE,
    addressCountry: "IN",
  };
}

/** Schema telephone — primary national digits as provided for GBP/NAP consistency. */
function schemaTelephone(site) {
  const phone = site?.phonePrimary || site?.phone1 || "";
  const digits = String(phone).replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 10) return digits;
  return formatPhoneDisplay(phone) || "9031105666";
}

function sharedContact(site) {
  const phone = schemaTelephone(site);
  const phoneAlt = site?.phoneSecondary || site?.phone2 || "";
  const altDigits = String(phoneAlt).replace(/\D/g, "");
  const alt =
    altDigits.length === 12 && altDigits.startsWith("91")
      ? altDigits.slice(2)
      : altDigits.length === 10
        ? altDigits
        : null;

  return {
    telephone: alt && alt !== phone ? [phone, alt] : phone,
    email: site?.email || DEFAULT_EMAIL,
  };
}

function sharedSocials(site) {
  return [
    site?.socials?.facebook || "https://www.facebook.com/shreyascreation",
    site?.socials?.instagram || "https://www.instagram.com/shreya.creationss/",
    site?.socials?.youtube || "https://www.youtube.com/@ShreyaCreations111",
    site?.socials?.x,
  ].filter(Boolean);
}

function sharedDescription(site, locale = "en") {
  if (locale === "hi" && site?.introHi) return site.introHi;
  return (
    site?.intro ||
    "Fashion boutique institute & custom stitching in Patna — boutique courses, bridal wear, 24-hour stitching on East Boring Canal Road."
  );
}

/** Only emit geo when lat/lng were confirmed (site.geo / DEFAULT_GEO) — never invent. */
function sharedGeo(site) {
  const lat = Number(site?.geo?.latitude);
  const lng = Number(site?.geo?.longitude);
  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    lat < -90 ||
    lat > 90 ||
    lng < -180 ||
    lng > 180
  ) {
    return null;
  }
  return {
    "@type": "GeoCoordinates",
    latitude: lat,
    longitude: lng,
  };
}

const WEEKDAY_HOURS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/**
 * Sitewide @graph: LocalBusiness + Organization + EducationalOrganization + WebSite.
 * Drives Google Maps / local pack — values from site settings / site-config.
 */
export function buildSitewideGraph(site, locale = "en") {
  const base = getSiteUrl();
  const ids = schemaIds(base);
  const brand = site?.brandName || site?.brand || "Shreya Creation";
  const lang = schemaLanguage(locale);
  const contact = sharedContact(site);
  const address = sharedPostalAddress(site);
  const description = sharedDescription(site, locale);
  const foundingYear = site?.foundingYear || DEFAULT_FOUNDING_YEAR;
  const geo = sharedGeo(site);
  const logoUrl = absoluteUrl(LOGO_SRC);
  const imageUrl = SCHEMA_BUSINESS_IMAGE;
  const sameAs = sharedSocials(site);
  const telephone = Array.isArray(contact.telephone)
    ? contact.telephone[0]
    : contact.telephone;

  const openingHoursSpecification = WEEKDAY_HOURS.map((dayOfWeek) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek,
    opens: "11:00",
    closes: "20:00",
  }));

  const localBusiness = {
    "@type": "LocalBusiness",
    "@id": ids.localBusiness,
    name: brand,
    image: imageUrl,
    url: base,
    telephone,
    address,
    ...(geo ? { geo } : {}),
    openingHoursSpecification,
    sameAs,
    email: contact.email,
    description,
    areaServed: [
      { "@type": "City", name: "Patna" },
      { "@type": "State", name: "Bihar" },
    ],
    foundingDate: String(foundingYear),
    priceRange: "₹₹",
    inLanguage: lang,
    department: { "@id": ids.educationalOrganization },
  };

  const organization = {
    "@type": "Organization",
    "@id": ids.organization,
    name: brand,
    url: base,
    logo: logoUrl,
    image: imageUrl,
    contactPoint: {
      "@type": "ContactPoint",
      telephone,
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["en", "hi"],
    },
    sameAs,
    address,
    ...(geo ? { geo } : {}),
  };

  const educationalOrganization = {
    "@type": "EducationalOrganization",
    "@id": ids.educationalOrganization,
    name: brand,
    url: base,
    logo: logoUrl,
    image: imageUrl,
    description,
    telephone: contact.telephone,
    email: contact.email,
    address,
    ...(geo ? { geo } : {}),
    openingHoursSpecification,
    sameAs,
    location: { "@id": ids.localBusiness },
    inLanguage: lang,
  };

  const website = {
    "@type": "WebSite",
    "@id": ids.website,
    url: base,
    name: brand,
    description,
    publisher: { "@id": ids.organization },
    about: { "@id": ids.localBusiness },
    inLanguage: ["en-IN", "hi-IN"],
    copyrightHolder: { "@id": ids.organization },
    potentialAction: {
      "@type": "CommunicateAction",
      name: "Contact via WhatsApp",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `https://wa.me/${String(site?.whatsapp || site?.whatsappNumber || "919031105666").replace(/\D/g, "")}`,
        actionPlatform: [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform",
        ],
      },
    },
  };

  return {
    "@context": "https://schema.org",
    "@graph": [localBusiness, organization, educationalOrganization, website],
  };
}
