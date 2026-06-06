"use client";

import { Glass3DCard, Float3D } from "@/components/Glass3DCard";
import TrustStats from "@/components/TrustStats";

export function TrustWall({ items, localize = false }) {
  return <TrustStats items={items} localize={localize} />;
}

export function Testimonials({ items }) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-0 top-0 bottom-4 w-6 sm:w-10 bg-gradient-to-r from-cream to-transparent z-10" aria-hidden />
      <div className="pointer-events-none absolute right-0 top-0 bottom-4 w-6 sm:w-10 bg-gradient-to-l from-cream to-transparent z-10" aria-hidden />
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
    </div>
  );
}
