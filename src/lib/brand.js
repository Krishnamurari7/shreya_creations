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

/** Canonical brand logo — always served from /public/logo.png */
export const LOGO_SRC = "/3d.png";

/** Navbar logo — transparent PNG */
export const NAV_LOGO_SRC = "/logo-nav.png";
