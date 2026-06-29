"use client";

import { HIGHLIGHT_SHIMMER, INTERACTIVE_CARD, REVEAL } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { Glass3DCard, Float3D } from "@/components/Glass3DCard";
import { staggerDelay } from "@/lib/motion";

export default function SyllabusGrid({ items }) {
  return (
    <ol className="grid sm:grid-cols-2 gap-4 sm:gap-6 list-none p-0 m-0">
      {items.map((s, i) => {
        const isPurple = i % 2 === 1;
        return (
          <li key={i} className="contents">
            <Glass3DCard
              layered
              className={cn(INTERACTIVE_CARD, REVEAL, "rounded-2xl", "sm:rounded-[2rem]", "p-5", "sm:p-6", "flex", "gap-4", "sm:gap-5", "group", "relative", "overflow-hidden")}
              style={staggerDelay(i, 80)}
            >
              <span
                className={`absolute left-0 top-0 h-full w-1 ${isPurple ? "bg-orange" : "bg-orange"} opacity-70 group-hover:w-1.5 transition-all duration-300 z-[3]`}
                aria-hidden
              />
              <Float3D translateZ="55">
                <span className={cn(HIGHLIGHT_SHIMMER, "font-display", "text-3xl", "font-medium", "shrink-0", "pt-0.5")}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </Float3D>
              <Float3D translateZ="45" className="self-center">
                <span className="text-ink font-normal text-sm sm:text-base leading-relaxed">{s}</span>
              </Float3D>
            </Glass3DCard>
          </li>
        );
      })}
    </ol>
  );
}
