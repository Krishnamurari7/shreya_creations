import { cn } from "@/lib/utils";
import Link from "next/link";

/**
 * Local SEO H3 cluster nested under a section H2.
 * Keeps keyword phrases in the heading hierarchy without card clutter.
 */
export default function SeoSubheadings({ items = [], className, linkHref }) {
  if (!items.length) return null;

  return (
    <ul className={cn("seo-subheadings", className)} aria-label="Related searches">
      {items.map((item) => {
        const label = typeof item === "string" ? item : item.label;
        const href = (typeof item === "object" && item.href) || linkHref;
        return (
          <li key={label} className="seo-subheadings__item">
            <h3 className="seo-subheadings__title">
              {href ? (
                <Link href={href} className="seo-subheadings__link">
                  {label}
                </Link>
              ) : (
                label
              )}
            </h3>
          </li>
        );
      })}
    </ul>
  );
}
