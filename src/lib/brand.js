/** Canonical brand name — the single source of truth for sitewide display copy. */
export const BRAND_NAME = "Shreya Creation";

/**
 * Normalizes legacy/mis-cased brand values (e.g. "Shreya creation", "Shreya Creations")
 * to BRAND_NAME so CMS-stored copy stays consistent without a data migration.
 */
export function normalizeBrandName(value) {
  const trimmed = typeof value === "string" ? value.trim() : "";
  if (!trimmed) return BRAND_NAME;
  return /^shreya\s+creations?$/i.test(trimmed) ? BRAND_NAME : trimmed;
}

/** Canonical brand logo — compact WebP for footer/icons (~400px wide) */
export const LOGO_SRC = "/3d-sm.webp";

/** Navbar logo — compact transparent WebP (~360px wide) */
export const NAV_LOGO_SRC = "/logo-nav-sm.webp";
