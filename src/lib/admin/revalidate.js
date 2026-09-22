/** Revalidate public pages after admin CMS saves. */
import { BOUTIQUE_SERVICES } from "@/lib/boutique-services";

export async function revalidateSiteContent(paths = []) {
  const boutiquePaths = BOUTIQUE_SERVICES.map((s) => s.href);
  const defaults = ["/", "/courses", "/shop", "/portfolio", "/blog", "/contact", ...boutiquePaths];
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
