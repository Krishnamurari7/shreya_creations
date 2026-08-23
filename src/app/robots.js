import { getSiteUrl, SITE_DOMAIN } from "@/lib/siteUrl";

/**
 * Site crawler rules for search engines and Pinterest.
 */
export default function robots() {
  const base = getSiteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/"],
      },
      {
        userAgent: "Pinterestbot",
        allow: "/",
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: SITE_DOMAIN,
  };
}
