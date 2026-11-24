import { cn } from "@/lib/utils";

// Native details keeps the copy in the initial HTML and lets visitors read it on demand.
export default function SeoDisclosure({ children, lang = "en", className, contentClassName }) {
  if (!children) return null;

  return (
    <details className={cn("seo-disclosure", className)}>
      <summary className="seo-disclosure__summary">
        {lang === "hi" ? "और जानकारी पढ़ें" : "Read more"}
      </summary>
      <div className={cn("seo-disclosure__content", contentClassName)}>{children}</div>
    </details>
  );
}
