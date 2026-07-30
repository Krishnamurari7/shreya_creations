/** Canonical public origin for Open Graph, canonicals, sitemap, and JSON-LD. */
export const PRODUCTION_URL = "https://www.shreyacreation.com";

/** Host shown in marketing copy — never the preview/localhost origin. */
export const SITE_DOMAIN = PRODUCTION_URL.replace(/^https?:\/\//, "");

export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  if (process.env.NODE_ENV === "development") return "http://localhost:3000";
  // Never fall back to Vercel preview URLs — those break OG/canonical signals.
  return PRODUCTION_URL;
}
