"use client";

import { cn } from "@/lib/utils";
import { formatBatchDate, mergeConversionConfig } from "@/lib/conversion-config";

export default function NextBatchBanner({ site = {}, lang = "en" }) {
  const { nextBatchDate, nextBatchSeats, batchBannerActive } = mergeConversionConfig(site);
  const hi = lang === "hi";

  if (!batchBannerActive || !nextBatchDate) return null;

  const formatted = formatBatchDate(nextBatchDate, lang);
  const seats =
    nextBatchSeats != null && Number.isFinite(nextBatchSeats) && nextBatchSeats > 0
      ? nextBatchSeats
      : null;

  return (
    <div
      className={cn("next-batch-banner", hi && "next-batch-banner--hi")}
      role="status"
      aria-live="polite"
    >
      <span className="next-batch-banner__icon" aria-hidden>
        📅
      </span>
      <p className="next-batch-banner__text">
        {hi ? (
          <>
            अगला बैच: <strong>{formatted}</strong>
            {seats != null ? (
              <>
                {" "}
                · <strong>{seats}</strong> सीटें बाकी
              </>
            ) : null}
          </>
        ) : (
          <>
            Next batch: <strong>{formatted}</strong>
            {seats != null ? (
              <>
                {" "}
                · <strong>{seats}</strong> seats left
              </>
            ) : null}
          </>
        )}
      </p>
    </div>
  );
}
