import { getSiteUrl, SITE_DOMAIN } from "@/lib/siteUrl";

/**
 * Site crawler rules — allow listed bots and the default crawler;
 * keep admin/API private and block legacy cgi-bin.
 */
export default function robots() {
  const base = getSiteUrl();

  const allowedBots = [
    "Googlebot",
    "Googlebot-Image",
    "Bingbot",
    "Yandex",
    "Baiduspider",
    "Yeti",
    "Applebot",
    "DuckDuckBot",
    "Slurp",
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "Google-Extended",
    "ClaudeBot",
    "anthropic-ai",
    "PerplexityBot",
    "Perplexity-User",
    "CCBot",
    "Bytespider",
    "Amazonbot",
    "Applebot-Extended",
    "Meta-ExternalAgent",
    "cohere-ai",
    "AhrefsBot",
    "SemrushBot",
    "MJ12bot",
    "DotBot",
    "BLEXBot",
    "DataForSeoBot",
    "archive.org_bot",
  ];

  const privatePaths = ["/admin", "/admin/", "/api/", "/cgi-bin/"];

  return {
    rules: [
      ...allowedBots.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: privatePaths,
      })),
      {
        userAgent: "*",
        allow: "/",
        disallow: privatePaths,
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: SITE_DOMAIN,
  };
}
