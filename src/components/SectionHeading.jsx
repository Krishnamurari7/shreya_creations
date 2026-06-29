"use client";

import { cn } from "@/lib/utils";
import { REVEAL, SECTION_EYEBROW, SECTION_LEAD, SECTION_ORNAMENT, SECTION_TITLE } from "@/lib/ui";

export default function SectionHeading({ eyebrow, title, subtitle, className = "", align = "center" }) {
  const alignClass = align === "left" ? "text-left" : "text-center";

  return (
    <div className={cn(REVEAL, "mb-4 sm:mb-6", alignClass, className)}>
      {eyebrow && <span className={SECTION_EYEBROW}>{eyebrow}</span>}
      {title && <h2 className={cn(SECTION_TITLE, "mt-2")}>{title}</h2>}
      {subtitle && (
        <p className={cn(SECTION_LEAD, "mt-3 max-w-xl", align === "left" ? "mx-0" : "mx-auto")}>
          {subtitle}
        </p>
      )}
      {(eyebrow || title) && (
        <div className={cn(SECTION_ORNAMENT, "mt-3 sm:mt-4", align === "left" && "justify-start")} aria-hidden>
          <span className="text-gold text-xs">✦</span>
        </div>
      )}
    </div>
  );
}
