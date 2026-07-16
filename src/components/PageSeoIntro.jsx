import { PAGE_CONTAINER, SECTION_LEAD } from "@/lib/ui";
import { cn } from "@/lib/utils";
import Link from "next/link";

/**
 * Keyword-rich intro for listing pages — keeps one H1 in the header above,
 * then natural internal links for topical SEO.
 */
export default function PageSeoIntro({ children, links = [], className }) {
  return (
    <div className={cn(PAGE_CONTAINER, "max-w-3xl", "relative", "z-20", "pb-4", "sm:pb-6", className)}>
      <p className={cn(SECTION_LEAD, "text-center", "mx-auto", "text-pretty")}>{children}</p>
      {links.length > 0 && (
        <p className="mt-3 text-center text-sm text-ink/80">
          {links.map((link, i) => (
            <span key={link.href}>
              {i > 0 && <span aria-hidden> · </span>}
              <Link href={link.href} className="text-orange font-medium underline-offset-2 hover:underline">
                {link.label}
              </Link>
            </span>
          ))}
        </p>
      )}
    </div>
  );
}
