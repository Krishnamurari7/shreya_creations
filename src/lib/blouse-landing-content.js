/**
 * @deprecated Prefer `@/lib/boutique-service-landing` (getBoutiqueLanding("blouse")).
 * Kept for any legacy imports.
 */
export {
  getBoutiqueLanding as getBlouseLanding,
} from "@/lib/boutique-service-landing";

import { BOUTIQUE_LANDINGS } from "@/lib/boutique-service-landing";

const b = BOUTIQUE_LANDINGS.blouse;

export const BLOUSE_HERO_IMAGE = b.heroImage;
export const BLOUSE_DESIGNS = b.designs;
export const BLOUSE_SERVICES = b.services;
export const BLOUSE_PRICES = b.prices;
export const BLOUSE_PROCESS = b.process;
export const BLOUSE_FAQS = b.faqs;
export const BLOUSE_POPULAR_SEARCHES = b.popularSearches;
export const BLOUSE_HERO_USPS = b.usps;
export const BLOUSE_TYPE_OPTIONS = b.typeOptions;
export const BLOUSE_MEASURE_OPTIONS = b.measureOptions;
