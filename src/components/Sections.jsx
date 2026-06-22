"use client";

import { useEffect, useState } from "react";
import { Glass3DCard, Float3D } from "@/components/Glass3DCard";
import TrustStats from "@/components/TrustStats";

export function TrustWall({ items, localize = false }) {
  return <TrustStats items={items} localize={localize} />;
}

function TestimonialCard({ t, i }) {
  return (
    <Glass3DCard
      key={t.id || i}
      layered
      as="figure"
      className="snap-start shrink-0 w-[min(calc(100vw-2.5rem),300px)] sm:w-[300px] md:w-[360px] rounded-2xl sm:rounded-3xl p-5 sm:p-7"
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
  );
}

export function Testimonials({ items }) {
  const [marquee, setMarquee] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setMarquee(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const list = marquee ? [...items, ...items] : items;

  return (
    <div className="relative reveal min-w-0">
      <div className="testimonials-marquee no-bar">
        <div className="testimonials-marquee__track pb-4 px-1">
          {list.map((t, i) => (
            <TestimonialCard key={`${t.id || t.name}-${i}`} t={t} i={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
