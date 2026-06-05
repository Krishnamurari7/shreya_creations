"use client";

import { useState } from "react";

export default function ProductGallery({ images, title }) {
  const [active, setActive] = useState(0);

  if (!images?.length) {
    return (
      <div className="aspect-[4/5] glass rounded-[2rem] border border-ink/15 grid place-items-center text-ink">
        <div className="text-center">
          <span className="text-3xl block">🖼</span>
          <span className="text-xs uppercase tracking-wider block mt-2">No image available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image View */}
      <div className="aspect-[4/5] overflow-hidden rounded-2xl sm:rounded-[2.5rem] glass border border-orange/20 p-2 sm:p-2.5 shadow-2xl relative group">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none z-10 rounded-[2.5rem]" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[active]}
          alt={title}
          className="h-full w-full object-cover rounded-[2rem] transition-transform duration-700 group-hover:scale-102"
        />
      </div>

      {/* Thumbnail Selection */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto no-bar pt-2 pb-1 -mx-1 px-1 sm:flex-wrap sm:overflow-visible">
          {images.map((img, i) => {
            const isSelected = i === active;
            return (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-20 w-16 sm:h-24 sm:w-20 shrink-0 rounded-xl sm:rounded-2xl overflow-hidden p-1 transition-all duration-300 ${
                  isSelected
                    ? "glass border-orange shadow-[0_4px_15px_rgba(230,92,0,0.2)] scale-95"
                    : "glass border-ink/15 opacity-55 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={`${title} thumbnail ${i + 1}`}
                  className="h-full w-full object-cover rounded-xl"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
