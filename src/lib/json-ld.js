import { getSiteUrl } from "@/lib/siteUrl";
import { LOGO_SRC } from "@/lib/brand";
import {
  DEFAULT_FOUNDING_YEAR,
  DEFAULT_CITY,
  DEFAULT_PINCODE,
  DEFAULT_EMAIL,
  formatPhoneDisplay,
} from "@/lib/site-config";

const DEFAULT_OG_IMAGE = "/hero_studio_banner.webp";

function absoluteUrl(value = "") {
  if (!value) return getSiteUrl();
  if (/^https?:\/\//i.test(value)) return value;
  return `${getSiteUrl()}${value.startsWith("/") ? value : `/${value}`}`;
}

/** Postal street line for schema.org — distinct from full display address. */
export const SCHEMA_STREET_ADDRESS = "Sisodiya Place, East Boring Canal Road";

export function schemaIds(base = getSiteUrl()) {
  return {
    clothingStore: `${base}/#clothing-store`,
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

function sharedContact(site) {
  const phone = site?.phonePrimary || site?.phone1 || "";
  const phoneAlt = site?.phoneSecondary || site?.phone2 || "";
  const telephones = [phone, phoneAlt]
    .filter(Boolean)
    .map((p) => formatPhoneDisplay(p));

  return {
    telephone: [...new Set(telephones)],
    email: site?.email || DEFAULT_EMAIL,
  };
}

function sharedSocials(site) {
  return [
    site?.socials?.instagram,
    site?.socials?.facebook,
    site?.socials?.youtube,
  ].filter(Boolean);
}

function sharedDescription(site, locale = "en") {
  if (locale === "hi" && site?.introHi) return site.introHi;
  return (
    site?.intro ||
    "Fashion boutique institute & custom stitching in Patna — boutique courses, bridal wear, 24-hour stitching on East Boring Canal Road."
  );
}

/**
 * Sitewide @graph: ClothingStore + EducationalOrganization (linked by @id) + WebSite.
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

  const shared = {
    name: brand,
    url: base,
    logo: absoluteUrl(LOGO_SRC),
    image: absoluteUrl(DEFAULT_OG_IMAGE),
    description,
    ...contact,
    address,
    // TODO(owner): confirm exact lat/lng from Google Business Profile before adding geo
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "10:00",
        closes: "20:00",
      },
    ],
    sameAs: sharedSocials(site),
    areaServed: [
      { "@type": "City", name: "Patna" },
      { "@type": "State", name: "Bihar" },
    ],
    foundingDate: String(foundingYear),
    priceRange: "₹₹",
    inLanguage: lang,
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ClothingStore",
        "@id": ids.clothingStore,
        ...shared,
        department: { "@id": ids.educationalOrganization },
      },
      {
        "@type": "EducationalOrganization",
        "@id": ids.educationalOrganization,
        ...shared,
        location: { "@id": ids.clothingStore },
      },
      {
        "@type": "WebSite",
        "@id": ids.website,
        url: base,
        name: brand,
        description,
        publisher: { "@id": ids.clothingStore },
        about: { "@id": ids.clothingStore },
        inLanguage: ["en-IN", "hi-IN"],
        copyrightHolder: { "@id": ids.clothingStore },
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
      },
    ],
  };
}
