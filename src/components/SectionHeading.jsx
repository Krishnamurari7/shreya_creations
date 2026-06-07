"use client";

export default function SectionHeading({ eyebrow, title, subtitle, className = "", align = "center" }) {
  const alignClass = align === "left" ? "text-left" : "text-center";

  return (
    <div className={`mb-6 sm:mb-10 reveal ${alignClass} ${className}`}>
      {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
      {title && <h2 className="section-title mt-2 text-balance">{title}</h2>}
      {subtitle && (
        <p className="mt-3 text-muted font-normal max-w-xl mx-auto text-sm sm:text-base leading-relaxed text-pretty">
          {subtitle}
        </p>
      )}
      {(eyebrow || title) && (
        <div className={`section-ornament mt-5 sm:mt-6 ${align === "left" ? "justify-start" : ""}`} aria-hidden>
          <span className="text-gold text-xs">✦</span>
        </div>
      )}
    </div>
  );
}
