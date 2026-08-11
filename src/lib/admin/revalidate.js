/** Revalidate public pages after admin CMS saves. */
export async function revalidateSiteContent(paths = []) {
  const defaults = ["/", "/courses", "/shop", "/portfolio", "/blog", "/contact"];
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
