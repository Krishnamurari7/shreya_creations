/** Canonical public origin for Open Graph, canonicals, sitemap, and JSON-LD. */
const PRODUCTION_URL = "https://www.shreyacreation.com";

export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  if (process.env.NODE_ENV === "development") return "http://localhost:3000";
  // Never fall back to Vercel preview URLs — those break OG/canonical signals.
  return PRODUCTION_URL;
}
