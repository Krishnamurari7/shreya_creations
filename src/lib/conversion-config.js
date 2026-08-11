/**
 * Owner-configurable conversion settings (PHASE 7).
 * TODO(owner): set next batch date and seat count before go-live.
 * TODO(owner): upload fee structure PDF to public/courses/pdfs/fee-structure.pdf
 */

/** ISO date string YYYY-MM-DD — auto-hide batch banner when in the past. */
export const DEFAULT_NEXT_BATCH_DATE = null; // TODO(owner): set next batch date

/** Remaining seats for the upcoming batch. */
export const DEFAULT_NEXT_BATCH_SEATS = null; // TODO(owner): set seat count

/** Path to downloadable fee structure PDF (relative to /public). */
export const FEE_STRUCTURE_PDF_PATH = "/courses/pdfs/fee-structure.pdf"; // TODO(owner): upload fee structure PDF

export function parseBatchDate(value) {
  if (!value) return null;
  const raw = String(value).trim();
  if (!raw) return null;
  const date = new Date(`${raw}T23:59:59+05:30`);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Batch urgency banner is shown only when date is today or in the future. */
export function isBatchBannerActive(batchDate, now = new Date()) {
  const parsed = parseBatchDate(batchDate);
  if (!parsed) return false;
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const batchDay = new Date(parsed);
  batchDay.setHours(0, 0, 0, 0);
  return batchDay >= today;
}

export function formatBatchDate(batchDate, lang = "en") {
  const parsed = parseBatchDate(batchDate);
  if (!parsed) return "";
  const locale = lang === "hi" ? "hi-IN" : "en-IN";
  return parsed.toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

export function mergeConversionConfig(site = {}) {
  const batchDate =
    site.nextBatchDate ?? site.next_batch_date ?? DEFAULT_NEXT_BATCH_DATE;
  const batchSeats =
    site.nextBatchSeats ?? site.next_batch_seats ?? DEFAULT_NEXT_BATCH_SEATS;
  const feePdf =
    site.feeStructurePdf ?? site.fee_structure_pdf ?? FEE_STRUCTURE_PDF_PATH;
  const instagramHandle =
    site.instagramHandle ?? site.instagram_handle ?? "shreya.creationss";

  return {
    nextBatchDate: batchDate,
    nextBatchSeats: batchSeats != null ? Number(batchSeats) : null,
    feeStructurePdf: feePdf,
    instagramHandle: String(instagramHandle).replace(/^@/, ""),
    batchBannerActive: isBatchBannerActive(batchDate),
  };
}
