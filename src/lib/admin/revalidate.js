/** Revalidate public pages after admin CMS saves. */
import { BOUTIQUE_SERVICES } from "@/lib/boutique-services";

export async function revalidateSiteContent(paths = []) {
  const boutiquePaths = BOUTIQUE_SERVICES.map((s) => s.href);
  const defaults = [
    "/",
    "/hi",
    "/about",
    "/hi/about",
    "/courses",
    "/hi/courses",
    "/shop",
    "/hi/shop",
    "/portfolio",
    "/hi/portfolio",
    "/blog",
    "/hi/blog",
    "/contact",
    "/hi/contact",
    "/faq",
    "/hi/faq",
    "/nri-clients",
    "/hi/nri-clients",
    "/ladies-tailor-patna",
    "/hi/ladies-tailor-patna",
    "/boutique-boring-road",
    "/hi/boutique-boring-road",
    ...boutiquePaths,
    ...boutiquePaths.map((path) => `/hi${path}`),
  ];
  const all = [...new Set([...defaults, ...paths])];
  try {
    await fetch("/api/admin/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paths: all, tags: ["site-content"] }),
    });
  } catch {
    // Non-fatal — content still saved in DB
  }
}
