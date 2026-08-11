/** Locale routing — English at root URLs, Hindi under /hi/ prefix. */

export const DEFAULT_LOCALE = "en";
export const HINDI_LOCALE = "hi";

/** Strip /hi prefix to get the canonical English path segment. */
export function stripLocalePrefix(pathname = "/") {
  if (pathname === "/hi") return "/";
  if (pathname.startsWith("/hi/")) {
    const rest = pathname.slice(3);
    return rest.startsWith("/") ? rest : `/${rest}`;
  }
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

/** Detect locale from a pathname. */
export function localeFromPathname(pathname = "/") {
  return pathname === "/hi" || pathname.startsWith("/hi/") ? HINDI_LOCALE : DEFAULT_LOCALE;
}

/** Build a locale-prefixed path. English keeps unprefixed URLs. */
export function localizedPath(path = "/", locale = DEFAULT_LOCALE) {
  const base = stripLocalePrefix(path);
  if (locale === HINDI_LOCALE) {
    return base === "/" ? "/hi" : `/hi${base}`;
  }
  return base;
}

/** Alternate language URL for the language toggle. */
export function alternateLanguagePath(pathname = "/") {
  const locale = localeFromPathname(pathname);
  const base = stripLocalePrefix(pathname);
  return localizedPath(base, locale === HINDI_LOCALE ? DEFAULT_LOCALE : HINDI_LOCALE);
}

/** hreflang pair paths (without origin) for metadata and sitemap. */
export function hreflangPaths(path = "/") {
  const base = stripLocalePrefix(path);
  const enPath = base === "/" ? "" : base;
  const hiPath = base === "/" ? "/hi" : `/hi${base}`;
  return { enPath, hiPath };
}

/** Read request locale set by middleware (for JSON-LD / server components). */
export async function getRequestLocale() {
  const { headers } = await import("next/headers");
  const headersList = await headers();
  const locale = headersList.get("x-locale");
  return locale === HINDI_LOCALE ? HINDI_LOCALE : DEFAULT_LOCALE;
}
