"use client";

import { PAGE_CONTAINER, SECTION_LEAD } from "@/lib/ui";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { localizedPath } from "@/lib/locale";

/**
 * Keyword-rich intro for listing pages — keeps one H1 in the header above,
 * then natural internal links for topical SEO.
 */
export default function PageSeoIntro({ children, childrenHi, links = [], className }) {
  const { lang } = useLanguage();
  const body = lang === "hi" && childrenHi ? childrenHi : children;

  return (
    <div className={cn(PAGE_CONTAINER, "max-w-3xl", "relative", "z-20", "pb-4", "sm:pb-6", className)}>
      <p className={cn(SECTION_LEAD, "text-center", "mx-auto", "text-pretty")}>{body}</p>
      {links.length > 0 && (
        <p className="mt-3 text-center text-sm text-ink/80">
          {links.map((link, i) => {
            const label = lang === "hi" && link.labelHi ? link.labelHi : link.label;
            const href = localizedPath(link.href, lang);
            return (
              <span key={link.href}>
                {i > 0 && <span aria-hidden> · </span>}
                <Link href={href} className="text-orange font-medium underline-offset-2 hover:underline">
                  {label}
                </Link>
              </span>
            );
          })}
        </p>
      )}
    </div>
  );
}
