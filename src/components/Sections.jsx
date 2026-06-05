"use client";

import { Glass3DCard, Float3D } from "@/components/Glass3DCard";

export function TrustWall({ items }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      {items.map((t, i) => (
        <Glass3DCard
          key={i}
          layered
          className="rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center reveal"
          style={{ transitionDelay: `${i * 80}ms` }}
        >
          <Float3D translateZ="55">
            <div className="font-display text-2xl sm:text-4xl md:text-5xl text-gold-gradient">{t.value}</div>
          </Float3D>
          <Float3D translateZ="30" className="mt-2">
            <div className="text-xs uppercase tracking-[0.18em] text-ink">{t.label}</div>
          </Float3D>
        </Glass3DCard>
      ))}
    </div>
  );
}

export function Testimonials({ items }) {
  return (
    <div className="flex gap-4 sm:gap-5 overflow-x-auto no-bar pb-4 snap-x snap-mandatory -mx-1 px-1">
      {items.map((t, i) => (
        <Glass3DCard
          key={t.id || i}
          layered
          as="figure"
          className="snap-start shrink-0 w-[min(85vw,300px)] sm:w-[300px] md:w-[360px] rounded-2xl sm:rounded-3xl p-5 sm:p-7"
        >
          <Float3D translateZ="40">
            <div className="flex text-gold mb-3">{"★".repeat(t.rating || 5)}</div>
          </Float3D>
          <Float3D translateZ="55" className="mt-1">
            <blockquote className="text-ink font-normal leading-relaxed italic">
              &ldquo;{t.text}&rdquo;
            </blockquote>
          </Float3D>
          <Float3D translateZ="35" className="mt-5">
            <figcaption className="flex items-center gap-3">
              {t.photo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={t.photo}
                  alt={t.name}
                  className="h-11 w-11 rounded-full object-cover border border-gold/40"
                />
              )}
              <span className="font-display text-lg text-ink font-medium">{t.name}</span>
            </figcaption>
          </Float3D>
        </Glass3DCard>
      ))}
    </div>
  );
}
