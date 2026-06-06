"use client";

import { Glass3DCard, Float3D } from "@/components/Glass3DCard";

export function Services({ items }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {items.map((s, i) => {
        const isPurple = s.accent === "purple" || s.accent === "teal";
        return (
          <Glass3DCard
            key={i}
            layered
            className="group rounded-2xl sm:rounded-3xl p-5 sm:p-7 relative overflow-hidden reveal"
            style={{ transitionDelay: `${(i % 3) * 80}ms` }}
            glow={false}
          >
            <span
              className={`absolute left-0 top-0 h-full w-1 ${isPurple ? "bg-purple" : "bg-orange"} opacity-70 group-hover:w-1.5 transition-all z-[3]`}
            />
            <Float3D translateZ="50">
              <div className="flex items-baseline gap-3">
                <span
                  className={`font-display text-4xl ${isPurple ? "text-purple-gradient" : "text-gold-gradient"}`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-xl sm:text-2xl text-ink">{s.title}</h3>
              </div>
            </Float3D>
            <Float3D translateZ="35" className="mt-3">
              <p className="text-ink font-normal leading-relaxed">{s.text}</p>
            </Float3D>
          </Glass3DCard>
        );
      })}
    </div>
  );
}

export function DesignProcess({ steps }) {
  return (
    <div className="relative grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
      <div className="hidden lg:block absolute top-7 left-[12%] right-[12%] hairline" />
      {steps.map((s, i) => (
        <div key={i} className="relative text-center reveal" style={{ transitionDelay: `${i * 100}ms` }}>
          <div className="mx-auto grid place-items-center h-12 w-12 sm:h-14 sm:w-14 rounded-full glass text-gold font-display text-xl sm:text-2xl relative z-10 border border-gold/25">
            {i + 1}
          </div>
          <h3 className="font-display text-xl sm:text-2xl text-ink mt-3 sm:mt-4">{s.step}</h3>
          <p className="mt-2 text-ink font-normal text-sm leading-relaxed max-w-xs mx-auto">{s.text}</p>
        </div>
      ))}
    </div>
  );
}
