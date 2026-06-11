"use client";

export function DesignProcess({ steps }) {
  return (
    <div className="relative grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
      <div className="hidden lg:block absolute top-7 left-[12%] right-[12%] hairline" />
      {steps.map((s, i) => (
        <div key={i} className="process-step relative text-center reveal" style={{ transitionDelay: `${i * 100}ms` }}>
          <div className="process-step__num mx-auto grid place-items-center h-12 w-12 sm:h-14 sm:w-14 rounded-full glass text-gold font-display text-xl sm:text-2xl relative z-10 border border-gold/25">
            {i + 1}
          </div>
          <h3 className="font-display text-lg sm:text-xl md:text-2xl text-ink mt-3 sm:mt-4 text-balance">{s.step}</h3>
          <p className="mt-2 text-muted font-normal text-sm leading-relaxed max-w-xs mx-auto text-pretty">{s.text}</p>
        </div>
      ))}
    </div>
  );
}
