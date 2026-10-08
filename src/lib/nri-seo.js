import { PAGE_DEFAULTS } from "@/lib/cms/defaults";
import { buildMetadata, DEFAULT_OG_IMAGE } from "@/lib/seo";

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
