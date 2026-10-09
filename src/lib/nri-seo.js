import { PAGE_DEFAULTS } from "@/lib/cms/defaults";
import { educationalOrganizationId, SCHEMA_STREET_ADDRESS } from "@/lib/json-ld";
import { absoluteUrl, buildMetadata, DEFAULT_OG_IMAGE, seoDescription } from "@/lib/seo";
import { localizedPath } from "@/lib/locale";
import { DEFAULT_CITY, DEFAULT_PINCODE } from "@/lib/site-config";

/** Search + social metadata for /nri-clients, using CMS copy with defaults. */
export function buildNriPageMetadata(nri = {}, locale = "en") {
  const defaults = PAGE_DEFAULTS.nri || {};
  const hi = locale === "hi";
  const title = hi
    ? nri.metaTitleHi || nri.meta_title_hi || defaults.meta_title_hi
    : nri.metaTitle || nri.meta_title || defaults.meta_title;
  const description = hi
    ? nri.metaDescriptionHi || nri.meta_description_hi || defaults.meta_description_hi
    : nri.metaDescription || nri.meta_description || defaults.meta_description;
  const image =
    nri.ogImage ||
    nri.og_image ||
    nri.heroImage ||
    nri.hero_image ||
    defaults.og_image ||
    defaults.hero_image ||
    DEFAULT_OG_IMAGE;
  const imageAlt = hi
    ? nri.imageAltHi || nri.image_alt_hi || defaults.image_alt_hi
    : nri.imageAlt || nri.image_alt || defaults.image_alt;

  return buildMetadata({
    title,
    description,
    path: "/nri-clients",
    locale,
    image,
    imageAlt,
  });
}

/** Course + provider schema for the NRI Fashion Designing Course landing page. */
export function nriCourseJsonLd(nri = {}, site = {}, locale = "en") {
  const defaults = PAGE_DEFAULTS.nri || {};
  const hi = locale === "hi";
  const name = hi ? "NRI फैशन डिजाइनिंग कोर्स" : "NRI Fashion Designing Course";
  const description = seoDescription(
    hi
      ? nri.metaDescriptionHi || nri.meta_description_hi || defaults.meta_description_hi
      : nri.metaDescription || nri.meta_description || defaults.meta_description
  );
  const image =
    nri.ogImage ||
    nri.og_image ||
    nri.heroImage ||
    nri.hero_image ||
    defaults.og_image ||
    defaults.hero_image ||
    DEFAULT_OG_IMAGE;
  const url = absoluteUrl(localizedPath("/nri-clients", locale));
  const providerName = site?.brandName || site?.brand || "Shreya Creation";

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    url,
    image: absoluteUrl(image),
    inLanguage: hi ? "hi-IN" : "en-IN",
    provider: {
      "@id": educationalOrganizationId(),
    },
    educationalCredentialAwarded: hi ? "कोर्स पूर्णता प्रमाणपत्र" : "Course completion certificate",
    teaches: "Fashion designing, boutique stitching, pattern basics, ready-to-wear saree preparation",
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: ["Online", "Blended"],
      availableLanguage: ["English", "Hindi"],
      location: {
        "@type": "Place",
        name: providerName,
        address: {
          "@type": "PostalAddress",
          streetAddress: SCHEMA_STREET_ADDRESS,
          addressLocality: site?.city || DEFAULT_CITY,
          addressRegion: "Bihar",
          postalCode: site?.pincode || DEFAULT_PINCODE,
          addressCountry: "IN",
        },
      },
    },
  };
}
