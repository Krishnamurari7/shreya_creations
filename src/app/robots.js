import { getSiteUrl, SITE_DOMAIN } from "@/lib/siteUrl";

/**
 * Site crawler rules for search engines.
 * Do not emit per-bot Allow rules for AI scrapers (GPTBot, ClaudeBot, etc.) —
 * Cloudflare Managed robots already Disallows those agents; re-Allowing them
 * here creates a conflicting robots.txt.
 */
export default function robots() {
  const base = getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/", "/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
    host: SITE_DOMAIN,
  };
}
