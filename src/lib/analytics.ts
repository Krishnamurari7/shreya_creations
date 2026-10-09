/**
 * Unified analytics for Meta Pixel + GA4 (via GTM dataLayer).
 * Never pass PII (names, phone numbers, emails, full wa.me URLs) as event parameters.
 */

export type AnalyticsEventName =
  | "PageView"
  | "Contact"
  | "Lead"
  | "ViewContent"
  | "InitiateCheckout";

export type ContactMethod = "whatsapp" | "phone";

export type LeadType = "contact_form" | "demo_booking" | "brochure_download";

export type ContentType = "product" | "course";

export type AnalyticsParams = Record<string, string | number | boolean | undefined>;

const CONSENT_KEY = "sc_analytics_consent";
const OPT_OUT_KEY = "sc_analytics_opt_out";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function getMetaPixelId(): string | undefined {
  return process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || undefined;
}

export function getGa4MeasurementId(): string | undefined {
  return process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID?.trim() || undefined;
}

export function getGtmId(): string | undefined {
  return process.env.NEXT_PUBLIC_GTM_ID?.trim() || undefined;
}

/** Indian SMB default: analytics allowed; user may opt out without blocking first paint. */
export function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return true;
  if (window.localStorage.getItem(OPT_OUT_KEY) === "1") return false;
  const stored = window.localStorage.getItem(CONSENT_KEY);
  return stored !== "denied";
}

export function grantAnalyticsConsent(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CONSENT_KEY, "granted");
  window.localStorage.removeItem(OPT_OUT_KEY);
}

export function denyAnalyticsConsent(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CONSENT_KEY, "denied");
  window.localStorage.setItem(OPT_OUT_KEY, "1");
}

const PHONE_RE = /(?:\+?\d[\d\s\-().]{7,}\d)/g;
const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const WA_URL_RE = /wa\.me\/\d+|api\.whatsapp\.com\/send\?phone=\d+/gi;

/** Strip PII patterns from string values before sending to analytics. */
function sanitizeValue(value: string): string {
  return value
    .replace(WA_URL_RE, "[whatsapp]")
    .replace(PHONE_RE, "[phone]")
    .replace(EMAIL_RE, "[email]")
    .trim();
}

function sanitizeParams(params: AnalyticsParams = {}): AnalyticsParams {
  const clean: AnalyticsParams = {};
  for (const [key, raw] of Object.entries(params)) {
    if (raw === undefined || raw === null || raw === "") continue;
    if (typeof raw === "number" || typeof raw === "boolean") {
      clean[key] = raw;
      continue;
    }
    const str = sanitizeValue(String(raw));
    if (!str || str === "[phone]" || str === "[email]" || str === "[whatsapp]") continue;
    clean[key] = str.slice(0, 120);
  }
  return clean;
}

function pushDataLayer(event: string, params: AnalyticsParams): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

function sendMeta(event: AnalyticsEventName, params: AnalyticsParams): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  if (!getMetaPixelId()) return;

  if (event === "PageView") {
    window.fbq("track", "PageView");
    return;
  }

  const metaParams: AnalyticsParams = { ...params };
  if (event === "ViewContent" && params.price != null) {
    metaParams.value = params.price;
    metaParams.currency = "INR";
    if (params.item_name) metaParams.content_name = params.item_name;
  }
  if (event === "InitiateCheckout" && params.price != null) {
    metaParams.value = params.price;
    metaParams.currency = "INR";
  }

  window.fbq("track", event, metaParams);
}

function sendGa4ViaGtm(event: AnalyticsEventName, params: AnalyticsParams): void {
  if (!getGtmId() && !getGa4MeasurementId()) return;

  const gaParams: AnalyticsParams = { ...params };

  if (event === "ViewContent") {
    gaParams.content_type = params.content_type;
    if (params.item_name) gaParams.item_name = params.item_name;
    if (params.price != null) {
      gaParams.value = params.price;
      gaParams.currency = "INR";
    }
  }

  if (event === "Lead") {
    gaParams.lead_type = params.lead_type;
  }

  if (event === "Contact") {
    gaParams.contact_method = params.contact_method;
  }

  pushDataLayer(event, gaParams);
}

/**
 * Single entry point for all conversion and engagement events.
 * Routes to Meta Pixel (fbq) and GTM dataLayer (GA4 configured in GTM).
 */
export function trackEvent(name: AnalyticsEventName, params: AnalyticsParams = {}): void {
  if (typeof window === "undefined") return;
  if (!hasAnalyticsConsent()) return;

  const safe = sanitizeParams({
    ...params,
    source_page:
      params.source_page ??
      (typeof window !== "undefined" ? window.location.pathname : undefined),
  });

  sendMeta(name, safe);
  sendGa4ViaGtm(name, safe);
}

export function isWhatsAppHref(href: string): boolean {
  if (!href) return false;
  return /wa\.me\/|api\.whatsapp\.com|whatsapp:\/\//i.test(href);
}

export function isPhoneHref(href: string): boolean {
  if (!href) return false;
  return /^tel:/i.test(href);
}

/** Infer CTA placement from DOM — no PII, stable labels for reporting. */
export function inferCtaLabel(target: EventTarget | null): string {
  if (!target || !(target instanceof Element)) return "unknown";

  const explicit =
    target.closest("[data-track-cta]")?.getAttribute("data-track-cta") ||
    target.closest("a[href]")?.getAttribute("data-track-cta");
  if (explicit) return explicit;

  const root =
    target.closest("a[href]") ||
    target.closest("button") ||
    target;

  if (root.closest(".wa-assistant-root")) return "whatsapp_fab";
  if (root.closest(".course-detail__sticky")) return "sticky_bar";
  if (root.closest(".course-detail__enroll-btn")) return "course_enroll";
  if (root.closest(".page-cta")) return "page_cta";
  if (root.closest(".home-hero")) return "hero";
  if (root.closest(".contact-bento-whatsapp")) return "contact_card";
  if (root.closest(".contact-quick-action")) return "contact_quick";
  if (root.closest(".contact-form-card")) return "contact_form";
  if (root.closest(".sf-cta--wa")) return "footer_cta";
  if (root.closest("footer")) return "footer";
  if (root.closest(".nav-wa-circle") || root.closest(".navbar-wa-link")) return "navbar";
  if (root.closest(".home-courses-preview__demo")) return "courses_demo";
  if (root.closest(".home-shop-preview") || root.closest(".product-card")) return "product_card";
  if (root.closest(".course-card")) return "course_card";
  if (root.closest(".review-cta--whatsapp")) return "reviews";
  if (root.closest(".category-cards") || root.closest(".explore-card")) return "category_card";
  if (root.closest(".inquiry-popup-root")) return "inquiry_popup";
  if (root.closest(".boutique-client")) return "boutique";
  if (root.closest(".nri-page")) return "nri_course";

  const aria = root.getAttribute("aria-label");
  if (aria && !PHONE_RE.test(aria) && !EMAIL_RE.test(aria)) {
    return aria.slice(0, 40).toLowerCase().replace(/\s+/g, "_");
  }

  return "unknown";
}

/** Product or course title from detail page or card data attribute. */
export function inferItemName(target: EventTarget | null): string | undefined {
  if (!target || !(target instanceof Element)) return undefined;

  const explicit =
    target.closest("[data-track-item]")?.getAttribute("data-track-item") ||
    target.closest("a[href]")?.closest("[data-track-item]")?.getAttribute("data-track-item");
  if (explicit) return explicit.slice(0, 120);

  const heading = document.querySelector(".course-detail__title, h1");
  const text = heading?.textContent?.trim();
  return text ? text.slice(0, 120) : undefined;
}

export function trackWhatsAppClick(
  target: EventTarget | null,
  overrides: AnalyticsParams = {}
): void {
  trackEvent("Contact", {
    contact_method: "whatsapp",
    cta_label: inferCtaLabel(target),
    item_name: inferItemName(target),
    ...overrides,
  });
}

export function trackPhoneClick(
  target: EventTarget | null,
  overrides: AnalyticsParams = {}
): void {
  trackEvent("Contact", {
    contact_method: "phone",
    cta_label: inferCtaLabel(target),
    ...overrides,
  });
}

export function trackLead(
  leadType: LeadType,
  overrides: AnalyticsParams = {}
): void {
  trackEvent("Lead", {
    lead_type: leadType,
    ...overrides,
  });
}

export function trackViewContent(
  contentType: ContentType,
  itemName: string,
  price?: number | null,
  overrides: AnalyticsParams = {}
): void {
  trackEvent("ViewContent", {
    content_type: contentType,
    item_name: itemName,
    ...(price != null ? { price } : {}),
    ...overrides,
  });
}

export function trackInitiateCheckout(
  itemName: string,
  price?: number | null,
  overrides: AnalyticsParams = {}
): void {
  trackEvent("InitiateCheckout", {
    item_name: itemName,
    ...(price != null ? { price } : {}),
    ...overrides,
  });
}

export function trackPageView(pagePath?: string): void {
  trackEvent("PageView", pagePath ? { page_path: pagePath } : {});
}

let metaInitialized = false;
let gtmBootstrapped = false;

/** Load Meta Pixel base script and init — called once afterInteractive from Analytics component. */
export function initMetaPixel(): void {
  if (typeof window === "undefined" || metaInitialized) return;
  const pixelId = getMetaPixelId();
  if (!pixelId) return;

  if (typeof window.fbq !== "function") {
    const n = function (...args: unknown[]) {
      const stub = n as unknown as {
        callMethod?: (...a: unknown[]) => void;
        queue: unknown[];
      };
      if (stub.callMethod) {
        stub.callMethod(...args);
      } else {
        stub.queue.push(args);
      }
    };
    const stub = n as unknown as {
      queue: unknown[];
      loaded: boolean;
      version: string;
    };
    stub.queue = [];
    stub.loaded = true;
    stub.version = "2.0";
    window.fbq = n as Window["fbq"];
    if (!window._fbq) window._fbq = n as Window["fbq"];

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
  }

  window.fbq!("init", pixelId);
  metaInitialized = true;
}

/** Bootstrap GTM dataLayer — container script loaded separately via next/script. */
export function initGtmDataLayer(): void {
  if (typeof window === "undefined" || gtmBootstrapped) return;
  window.dataLayer = window.dataLayer || [];
  if (getGtmId()) {
    window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
  }
  gtmBootstrapped = true;
}

/** Fallback GA4 when GTM is not configured — loads gtag via script tag injection. */
export function initGa4Fallback(): void {
  if (typeof window === "undefined") return;
  const ga4Id = getGa4MeasurementId();
  if (!ga4Id || getGtmId()) return;

  window.dataLayer = window.dataLayer || [];
  const gtag = (...args: unknown[]) => {
    window.dataLayer!.push(args as unknown as Record<string, unknown>);
  };
  (window as Window & { gtag?: typeof gtag }).gtag = gtag;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`;
  document.head.appendChild(script);

  gtag("js", new Date());
  gtag("config", ga4Id, { send_page_view: false });
}

