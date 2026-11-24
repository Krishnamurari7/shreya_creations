"use client";

import { cn } from "@/lib/utils";

/** Two identical groups make the end of one pass meet the start of the next. */
export default function InfiniteMarquee({ items = [], renderItem, className, label, minItems = 6, secondsPerItem = 5 }) {
  if (!items.length) return null;

  const repeatCount = Math.max(1, Math.ceil(minItems / items.length));
  const sequence = Array.from({ length: repeatCount }, () => items).flat();
  const duration = Math.max(24, sequence.length * secondsPerItem);

  return (
    <div className={cn("infinite-marquee", className)} aria-label={label}>
      <div className="infinite-marquee__track" style={{ "--marquee-duration": `${duration}s` }}>
        {[false, true].map((duplicate) => (
          <ul key={String(duplicate)} className="infinite-marquee__group" aria-hidden={duplicate ? "true" : undefined}>
            {sequence.map((item, index) => renderItem(item, index, duplicate || index >= items.length))}
          </ul>
        ))}
      </div>
    </div>
  );
}
