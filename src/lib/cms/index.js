import { PAGE_DEFAULTS, DEFAULT_PILLARS, DEFAULT_JOURNEY_CARDS } from "@/lib/cms/defaults";
import { STALE_NRI_H1S, STALE_NRI_META_TITLES } from "@/lib/nri-content";
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

/** Prefer DB values; honor explicit blanks/empty arrays saved from admin. */
function mergePreferFilled(base, fromDb) {
  if (Array.isArray(fromDb)) {
    return fromDb.map(keysToCamel);
  }
  if (!fromDb || typeof fromDb !== "object") {
    return fromDb === "" || fromDb == null ? base : fromDb;
  }
  const out = { ...(base && typeof base === "object" && !Array.isArray(base) ? base : {}) };
  for (const [key, value] of Object.entries(fromDb)) {
    if (value == null) continue;
    if (value === "") {
      out[key] = "";
      continue;
    }
    if (Array.isArray(value)) {
      out[key] = value.map(keysToCamel);
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

function isStaleNriPage(fromDb = {}) {
  const meta = fromDb.metaTitle || "";
  const h1 = fromDb.headerTitle || "";
  const stitchCta = fromDb.heroCtaStitch || "";
  return (
    STALE_NRI_META_TITLES.includes(meta) ||
    STALE_NRI_H1S.includes(h1) ||
    stitchCta === "Book Custom Stitching"
  );
}

export function mergePageDefaults(pages = {}) {
  const merged = {};
  for (const slug of Object.keys(PAGE_DEFAULTS)) {
    const base = keysToCamel(PAGE_DEFAULTS[slug]);
    const fromDb = pages[slug] && typeof pages[slug] === "object" ? keysToCamel(pages[slug]) : {};
    if (slug === "nri" && isStaleNriPage(fromDb)) {
      merged[slug] = base;
      continue;
    }
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

  return raw.map((match, index) => {
    const def =
      defaults.find((card) => card.key === (match.key || keysToCamel(match).key)) ||
      defaults[index] ||
      {};
    const fromDb = match ? keysToCamel(match) : {};
    return {
      ...def,
      ...fromDb,
      key: fromDb.key || def.key,
      theme: fromDb.theme || def.theme,
      icon: fromDb.icon || def.icon,
      image: fromDb.image || def.image,
      href: fromDb.href || def.href,
      title: fromDb.title || def.title,
      titleHi: fromDb.titleHi || def.titleHi,
      cta: fromDb.cta || def.cta,
      ctaHi: fromDb.ctaHi || def.ctaHi,
      features: normalizeJourneyFeatures(fromDb.features || match?.features, def.features),
    };
  });
}

/** Merge saved journey cards with defaults for the admin editor (snake_case). */
export function mergeJourneyCardsForEditor(raw) {
  if (!Array.isArray(raw) || !raw.length) {
    return DEFAULT_JOURNEY_CARDS.map((def) => ({
      ...def,
      features: def.features.map((feature) => ({ ...feature })),
    }));
  }

  return raw.map((fromDb, index) => {
    const def =
      DEFAULT_JOURNEY_CARDS.find((card) => card.key === fromDb.key) ||
      DEFAULT_JOURNEY_CARDS[index] ||
      {};
    return {
      ...def,
      ...fromDb,
      key: fromDb.key || def.key,
      image: fromDb.image || def.image,
      href: fromDb.href || def.href,
      theme: fromDb.theme || def.theme,
      icon: fromDb.icon || def.icon,
      title: fromDb.title ?? def.title,
      title_hi: fromDb.title_hi ?? def.title_hi,
      cta: fromDb.cta ?? def.cta,
      cta_hi: fromDb.cta_hi ?? def.cta_hi,
      features: (fromDb.features?.length ? fromDb.features : def.features || []).map(
        (feature, featureIndex) => ({
          ...(def.features?.[featureIndex] || {}),
          ...feature,
        }),
      ),
    };
  });
}

function mergeKeyedList(raw, defaults) {
  if (!Array.isArray(raw) || !raw.length) {
    return defaults.map((item) => ({ ...item }));
  }
  return raw.map((item) => {
    if (!item?.key) return { ...item };
    const def = defaults.find((d) => d.key === item.key) || {};
    return { ...def, ...item, key: item.key };
  });
}

export function mergeHeroServiceCardsForEditor(raw) {
  if (Array.isArray(raw) && raw.length === 0) return [];
  return mergeKeyedList(raw, DEFAULT_HERO_SERVICE_CARDS);
}

export function mergeHeroFeatureStripForEditor(raw) {
  return mergeKeyedList(raw, DEFAULT_HERO_FEATURE_STRIP);
}

export function mergeAboutJourneyForEditor(raw) {
  if (!Array.isArray(raw) || !raw.length) {
    return DEFAULT_ABOUT_JOURNEY.map((step) => ({ ...step }));
  }
  return raw.map((match, index) => {
    const def =
      DEFAULT_ABOUT_JOURNEY.find(
        (step) => (step.year_key || step.yearKey) === (match.year_key || match.yearKey),
      ) ||
      DEFAULT_ABOUT_JOURNEY[index] ||
      {};
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
  const primaryHref = page.ctaPrimaryHref;
  return {
    title: page.ctaTitle,
    titleHi: page.ctaTitleHi,
    titleHighlight: page.ctaTitleHighlight,
    titleHighlightHi: page.ctaTitleHighlightHi,
    subtitle: page.ctaSubtitle,
    subtitleHi: page.ctaSubtitleHi,
    primaryHref: primaryHref === "" ? null : primaryHref ?? undefined,
    primaryLabel: page.ctaPrimaryLabel,
    primaryLabelHi: page.ctaPrimaryLabelHi,
    secondaryHref: secondaryHref === "" ? null : secondaryHref ?? "/contact",
    secondaryLabel: page.ctaSecondaryLabel,
    secondaryLabelHi: page.ctaSecondaryLabelHi,
    eyebrow: page.ctaEyebrow,
    eyebrowHi: page.ctaEyebrowHi,
    reply: page.ctaReply,
    replyHi: page.ctaReplyHi,
    perks: Array.isArray(page.ctaPerks) ? page.ctaPerks.map((item) => item.text).filter(Boolean) : undefined,
    perksHi: Array.isArray(page.ctaPerks)
      ? page.ctaPerks.map((item) => item.textHi || item.text).filter(Boolean)
      : undefined,
    waMessage: page.ctaWaMessage,
    waMessageHi: page.ctaWaMessageHi,
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
