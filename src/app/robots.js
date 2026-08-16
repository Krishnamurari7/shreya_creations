import { getSiteUrl, SITE_DOMAIN } from "@/lib/siteUrl";

/** AI / LLM crawlers — same public access as search bots; llms.txt at /llms.txt for context. */
const AI_USER_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "Google-Extended",
  "PerplexityBot",
  "Applebot-Extended",
  "cohere-ai",
  "Bytespider",
  "FacebookBot",
  "meta-externalagent",
];

const PUBLIC_RULE = {
  allow: "/",
  disallow: ["/admin", "/admin/", "/api/"],
};

export default function robots() {
  const base = getSiteUrl();
  return {
    rules: [
      { userAgent: "*", ...PUBLIC_RULE },
      ...AI_USER_AGENTS.map((userAgent) => ({ userAgent, ...PUBLIC_RULE })),
    ],
    sitemap: `${base}/sitemap.xml`,
    host: SITE_DOMAIN,
  };
}
