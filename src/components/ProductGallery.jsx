"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import CardImage from "@/components/CardImage";

export default function ProductGallery({ images, title }) {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();

  if (!images?.length) {
    return (
      <div className="card-media card-media--45 rounded-[2rem] glass border border-ink/15 grid place-items-center text-ink reveal">
        <div className="text-center relative z-10">
          <span className="text-3xl block">🖼</span>
          <span className="text-xs uppercase tracking-wider block mt-2">No image available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 reveal">
      <motion.div
        className="rounded-2xl sm:rounded-[2.5rem] glass border border-orange/20 p-2 sm:p-2.5 shadow-2xl relative group overflow-hidden"
        animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none z-10 rounded-[2rem]" />
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardImage
              src={images[active]}
              alt={title}
              ratio="3/4"
              fit="contain"
              className="rounded-[1.75rem]"
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

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
                    ? "glass border-orange shadow-[0_4px_15px_rgba(212,129,49,0.2)] scale-95"
                    : "glass border-ink/15 opacity-55 hover:opacity-100 hover:scale-[0.98]"
                }`}
              >
                <div className="relative h-full w-full overflow-hidden rounded-lg card-media card-media--45">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={`${title} thumbnail ${i + 1}`} />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
