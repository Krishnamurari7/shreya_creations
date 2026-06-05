import { PAGE_DEFAULTS, DEFAULT_PILLARS } from "@/lib/cms/defaults";

function toCamel(s) {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function keysToCamel(obj) {
  if (Array.isArray(obj)) return obj.map(keysToCamel);
  if (!obj || typeof obj !== "object") return obj;
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [toCamel(k), keysToCamel(v)]));
}

export function mergePageDefaults(pages = {}) {
  const merged = {};
  for (const slug of Object.keys(PAGE_DEFAULTS)) {
    const base = PAGE_DEFAULTS[slug];
    const fromDb = pages[slug] && typeof pages[slug] === "object" ? pages[slug] : {};
    merged[slug] = { ...keysToCamel(base), ...keysToCamel(fromDb) };
  }
  return merged;
}

export function normalizePillars(raw) {
  if (!Array.isArray(raw) || !raw.length) return DEFAULT_PILLARS.map(keysToCamel);
  return raw.map((p) => ({
    emoji: p.emoji || "✦",
    title: p.title || "",
    titleHi: p.title_hi ?? p.titleHi ?? "",
    desc: p.desc || p.description || "",
    descHi: p.desc_hi ?? p.descHi ?? "",
  }));
}

export function pickPage(page, lang, enKey, hiKey) {
  const hi = hiKey || `${enKey}Hi`;
  if (lang === "hi" && page?.[hi]) return page[hi];
  return page?.[enKey] ?? "";
}

export function pickPillar(pillar, lang) {
  return {
    emoji: pillar.emoji,
    title: lang === "hi" && pillar.titleHi ? pillar.titleHi : pillar.title,
    desc: lang === "hi" && pillar.descHi ? pillar.descHi : pillar.desc,
  };
}

/** Map CMS page object to PageCTA props (snake_case already camelCased via mergePageDefaults). */
export function pageCtaProps(page) {
  if (!page) return {};
  const secondaryHref = page.ctaSecondaryHref;
  return {
    title: page.ctaTitle,
    titleHi: page.ctaTitleHi,
    titleHighlight: page.ctaTitleHighlight,
    titleHighlightHi: page.ctaTitleHighlightHi,
    subtitle: page.ctaSubtitle,
    subtitleHi: page.ctaSubtitleHi,
    primaryLabel: page.ctaPrimaryLabel,
    primaryLabelHi: page.ctaPrimaryLabelHi,
    secondaryHref: secondaryHref === "" ? null : secondaryHref ?? "/contact",
    secondaryLabel: page.ctaSecondaryLabel,
    secondaryLabelHi: page.ctaSecondaryLabelHi,
    waMessage: page.ctaWaMessage,
  };
}

export function pageBottomCtaProps(page) {
  if (!page) return pageCtaProps(page);
  const secondaryHref = page.bottomCtaSecondaryHref;
  return {
    title: page.bottomCtaTitle,
    titleHi: page.bottomCtaTitleHi,
    subtitle: page.bottomCtaSubtitle,
    subtitleHi: page.bottomCtaSubtitleHi,
    primaryLabel: page.bottomCtaPrimaryLabel,
    primaryLabelHi: page.bottomCtaPrimaryLabelHi,
    secondaryHref: secondaryHref === "" ? null : secondaryHref ?? "/contact",
    secondaryLabel: page.bottomCtaSecondaryLabel,
    secondaryLabelHi: page.bottomCtaSecondaryLabelHi,
    waMessage: page.bottomCtaWaMessage,
  };
}

export { PAGE_DEFAULTS, DEFAULT_PILLARS };
