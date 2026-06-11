export default function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <header className="relative pt-[calc(var(--header-offset)+1.25rem)] sm:pt-[calc(var(--header-offset)+2rem)] md:pt-[calc(var(--header-offset)+3rem)] pb-8 sm:pb-10 md:pb-12 text-center mx-auto max-w-4xl px-4 sm:px-5 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-orange/5 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-60 h-60 rounded-full bg-purple/5 blur-3xl -z-10 pointer-events-none" />

      {eyebrow && (
        <span className="inline-flex items-center gap-1.5 bg-orange/10 border border-orange/20 text-orange px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6 shadow-sm">
          {eyebrow}
        </span>
      )}
      <h1 className="page-hero-title mt-2 font-normal text-balance px-1">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-5 text-ink font-normal text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-pretty px-1">
          {subtitle}
        </p>
      )}
      <div className="hairline mt-8 max-w-xs mx-auto" />
    </header>
  );
}
