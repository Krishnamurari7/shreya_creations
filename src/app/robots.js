import { getSiteUrl, SITE_DOMAIN } from "@/lib/siteUrl";

export default function robots() {
  const base = getSiteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: SITE_DOMAIN,
  };
}
