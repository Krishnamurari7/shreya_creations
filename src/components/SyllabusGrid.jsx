"use client";

import { Glass3DCard, Float3D } from "@/components/Glass3DCard";

export default function SyllabusGrid({ items }) {
  return (
    <ol className="grid sm:grid-cols-2 gap-6 list-none p-0 m-0">
      {items.map((s, i) => (
        <li key={i} className="contents">
          <Glass3DCard layered className="rounded-[2rem] p-6 flex gap-5 group relative overflow-hidden">
            <Float3D translateZ="55">
              <span className="font-display text-3xl text-gold-gradient font-medium shrink-0 pt-0.5">
                {String(i + 1).padStart(2, "0")}
              </span>
            </Float3D>
            <Float3D translateZ="45" className="self-center">
              <span className="text-ink font-normal text-sm sm:text-base leading-relaxed">{s}</span>
            </Float3D>
          </Glass3DCard>
        </li>
      ))}
    </ol>
  );
}
