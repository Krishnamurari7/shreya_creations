import { PAGE_DEFAULTS, DEFAULT_PILLARS, DEFAULT_JOURNEY_CARDS } from "@/lib/cms/defaults";
import {
  DEFAULT_ABOUT_JOURNEY,
  DEFAULT_CATEGORY_CARDS,
  DEFAULT_HERO_FEATURE_STRIP,
  DEFAULT_HERO_SERVICE_CARDS,
  categoryCardsForEditor,
  categoryCardsFromEditor,
} from "@/lib/cms/home-blocks";

function toCamel(s) {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function keysToCamel(obj) {
  if (Array.isArray(obj)) return obj.map(keysToCamel);
  if (!obj || typeof obj !== "object") return obj;
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [toCamel(k), keysToCamel(v)]));
}

/** Prefer DB values, but keep defaults when CMS stores blank strings. */
function mergePreferFilled(base, fromDb) {
  if (Array.isArray(fromDb)) {
    return fromDb.length ? fromDb.map(keysToCamel) : base;
  }
  if (!fromDb || typeof fromDb !== "object") {
    return fromDb === "" || fromDb == null ? base : fromDb;
  }
  const out = { ...(base && typeof base === "object" && !Array.isArray(base) ? base : {}) };
  for (const [key, value] of Object.entries(fromDb)) {
    if (value === "" || value == null) continue;
    if (Array.isArray(value)) {
      out[key] = value.length ? value : out[key];
      continue;
    }
    if (typeof value === "object") {
      out[key] = mergePreferFilled(out[key], value);
      continue;
    }
    out[key] = value;
  }
  return out;
}

export function mergePageDefaults(pages = {}) {
  const merged = {};
  for (const slug of Object.keys(PAGE_DEFAULTS)) {
    const base = keysToCamel(PAGE_DEFAULTS[slug]);
    const fromDb = pages[slug] && typeof pages[slug] === "object" ? keysToCamel(pages[slug]) : {};
    merged[slug] = mergePreferFilled(base, fromDb);
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

function normalizeJourneyFeatures(raw, fallback = []) {
  const base = fallback.map(keysToCamel);
  if (!Array.isArray(raw) || !raw.length) return base;
  return base.map((def, index) => {
    const fromDb = keysToCamel(raw[index] || {});
    return {
      icon: fromDb.icon || def.icon,
      label: fromDb.label || def.label,
      labelHi: fromDb.labelHi || def.labelHi,
    };
  });
}

export function normalizeJourneyCards(raw) {
  const defaults = DEFAULT_JOURNEY_CARDS.map((card) => keysToCamel(card));
  if (!Array.isArray(raw) || !raw.length) return defaults;

  return defaults.map((def, index) => {
    const match = raw.find((card) => (card.key || keysToCamel(card).key) === def.key) || raw[index];
    const fromDb = match ? keysToCamel(match) : {};
    return {
      ...def,
      ...fromDb,
      key: def.key,
      theme: fromDb.theme || def.theme,
      icon: fromDb.icon || def.icon,
      image: fromDb.image || def.image,
      href: fromDb.href || def.href,
      title: fromDb.title || def.title,
      titleHi: fromDb.titleHi || def.titleHi,
      cta: fromDb.cta || def.cta,
      ctaHi: fromDb.ctaHi || def.ctaHi,
      features: normalizeJourneyFeatures(fromDb.features || match?.features, DEFAULT_JOURNEY_CARDS[index].features),
    };
  });
}

/** Merge saved journey cards with defaults for the admin editor (snake_case). */
export function mergeJourneyCardsForEditor(raw) {
  return DEFAULT_JOURNEY_CARDS.map((def, index) => {
    const fromDb = Array.isArray(raw)
      ? raw.find((card) => card.key === def.key) || raw[index]
      : null;
    if (!fromDb) {
      return {
        ...def,
        features: def.features.map((feature) => ({ ...feature })),
      };
    }

    return {
      ...def,
      ...fromDb,
      key: def.key,
      image: fromDb.image || def.image,
      href: fromDb.href || def.href,
      theme: fromDb.theme || def.theme,
      icon: fromDb.icon || def.icon,
      title: fromDb.title ?? def.title,
      title_hi: fromDb.title_hi ?? def.title_hi,
      cta: fromDb.cta ?? def.cta,
      cta_hi: fromDb.cta_hi ?? def.cta_hi,
      features: def.features.map((feature, featureIndex) => ({
        ...feature,
        ...(fromDb.features?.[featureIndex] || {}),
        icon: fromDb.features?.[featureIndex]?.icon || feature.icon,
        label: fromDb.features?.[featureIndex]?.label ?? feature.label,
        label_hi: fromDb.features?.[featureIndex]?.label_hi ?? feature.label_hi,
      })),
    };
  });
}

function mergeKeyedList(raw, defaults) {
  if (!Array.isArray(raw) || !raw.length) {
    return defaults.map((item) => ({ ...item }));
  }
  return defaults.map((def, index) => {
    const match = raw.find((item) => item.key === def.key) || raw[index] || {};
    return { ...def, ...match, key: def.key };
  });
}

export function mergeHeroServiceCardsForEditor(raw) {
  return mergeKeyedList(raw, DEFAULT_HERO_SERVICE_CARDS);
}

export function mergeHeroFeatureStripForEditor(raw) {
  return mergeKeyedList(raw, DEFAULT_HERO_FEATURE_STRIP);
}

export function mergeAboutJourneyForEditor(raw) {
  if (!Array.isArray(raw) || !raw.length) {
    return DEFAULT_ABOUT_JOURNEY.map((step) => ({ ...step }));
  }
  return DEFAULT_ABOUT_JOURNEY.map((def, index) => {
    const match =
      raw.find((step) => (step.year_key || step.yearKey) === def.year_key) || raw[index] || {};
    return {
      ...def,
      ...match,
      year_key: match.year_key || match.yearKey || def.year_key,
    };
  });
}

export { categoryCardsForEditor, categoryCardsFromEditor, DEFAULT_CATEGORY_CARDS };

export function pickPage(page, lang, enKey, hiKey) {
  const hi = hiKey || `${enKey}Hi`;
  const enVal = page?.[enKey];
  if (lang === "hi") {
    const hiVal = page?.[hi];
    if (hiVal) return hiVal;
  }
  return enVal || "";
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

export { PAGE_DEFAULTS, DEFAULT_PILLARS, DEFAULT_JOURNEY_CARDS };
