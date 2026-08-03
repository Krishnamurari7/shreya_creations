/** Canonical public origin for Open Graph, canonicals, sitemap, and JSON-LD.
 *  Must match the live apex host — Cloudflare redirects www → apex. */
export const PRODUCTION_URL = "https://shreyacreation.com";

/** Host shown in marketing copy — never the preview/localhost origin. */
export const SITE_DOMAIN = PRODUCTION_URL.replace(/^https?:\/\//, "");

export function getSiteUrl() {
  if (process.env.NODE_ENV === "development") {
    const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
    if (configured) return configured.replace(/\/$/, "");
    return "http://localhost:3000";
  }
  // Always use the apex production origin — never www or preview URLs.
  return PRODUCTION_URL;
}
