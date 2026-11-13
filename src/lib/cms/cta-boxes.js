/** Match a CTA box to the public URL, including the Hindi route prefix. */
export function normalizeCtaPath(value) {
  const raw = typeof value === "string" ? value.trim().split(/[?#]/, 1)[0] : "";
  let path = raw.startsWith("/") ? raw : `/${raw}`;
  path = path.replace(/\/{2,}/g, "/");
  if (path === "/hi") path = "/";
  else if (path.startsWith("/hi/")) path = path.slice(3);
  return path.replace(/\/+$/, "") || "/";
}

export function findCtaBox(entries, pathname) {
  if (!Array.isArray(entries)) return null;
  const path = normalizeCtaPath(pathname);
  const exact = entries.find(
    (entry) =>
      typeof entry?.path === "string" &&
      !entry.path.endsWith("/*") &&
      normalizeCtaPath(entry.path) === path,
  );
  if (exact) return exact;

  return (
    entries
      .filter((entry) => {
        if (typeof entry?.path !== "string" || !entry.path.endsWith("/*")) return false;
        const prefix = normalizeCtaPath(entry.path.slice(0, -2));
        return prefix === "/" ? path !== "/" : path.startsWith(`${prefix}/`);
      })
      .sort((a, b) => b.path.length - a.path.length)[0] || null
  );
}
