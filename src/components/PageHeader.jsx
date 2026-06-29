import { cn } from "@/lib/utils";
import { ANIM_RISE, FLOAT_SOFT, HAIRLINE, PAGE_HERO_TITLE, SPARKLE_PULSE, SURFACE_BADGE } from "@/lib/ui";

export default function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <header className="relative pt-[calc(var(--header-offset)+1.25rem)] sm:pt-[calc(var(--header-offset)+2rem)] md:pt-[calc(var(--header-offset)+3rem)] pb-8 sm:pb-10 md:pb-12 text-center mx-auto max-w-4xl px-4 sm:px-5 overflow-hidden">
      <div className={cn(FLOAT_SOFT, "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-orange/5 blur-3xl -z-10 pointer-events-none")} aria-hidden />
      <div className={cn(FLOAT_SOFT, "absolute top-1/3 left-1/4 w-60 h-60 rounded-full bg-orange/5 blur-3xl -z-10 pointer-events-none [animation-delay:-2s]")} aria-hidden />

      {eyebrow && (
        <span className={cn(ANIM_RISE, SURFACE_BADGE, "inline-flex items-center gap-1.5 text-orange px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase mb-6")}>
          <span className={cn(SPARKLE_PULSE, "text-gold")} aria-hidden>✦</span>
          {eyebrow}
        </span>
      )}
      <h1 className={cn(ANIM_RISE, PAGE_HERO_TITLE, "anim-delay-1 mt-2 text-balance px-1")}>
        {title}
      </h1>
      {subtitle && (
        <p className={cn(ANIM_RISE, "anim-delay-2 mt-5 text-ink font-normal text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-pretty px-1")}>
          {subtitle}
        </p>
      )}
      <div className={cn(ANIM_RISE, HAIRLINE, "anim-delay-3 mt-8 max-w-xs mx-auto")} />
    </header>
  );
}
