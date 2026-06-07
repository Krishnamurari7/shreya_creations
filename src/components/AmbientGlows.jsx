"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function AmbientGlows({ variant = "default", className = "" }) {
  const reduceMotion = useReducedMotion();

  const presets = {
    default: [
      { className: "-top-16 right-1/4 h-48 w-48 bg-orange/8", duration: 8, delay: 0 },
      { className: "bottom-0 -left-20 h-56 w-56 bg-purple/6", duration: 10, delay: 1 },
    ],
    header: [
      { className: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange/6", duration: 9, delay: 0 },
      { className: "top-1/3 left-1/4 w-60 h-60 bg-purple/5", duration: 11, delay: 0.5 },
      { className: "bottom-0 right-1/4 w-48 h-48 bg-golden/5", duration: 8, delay: 1.2 },
    ],
    subtle: [
      { className: "top-1/4 left-1/4 w-72 h-72 bg-orange/5", duration: 10, delay: 0 },
      { className: "top-1/2 right-1/4 w-64 h-64 bg-purple/5", duration: 12, delay: 1 },
    ],
  };

  const blobs = presets[variant] || presets.default;

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden -z-10 ${className}`} aria-hidden>
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-3xl ${blob.className}`}
          animate={
            reduceMotion
              ? undefined
              : { scale: [1, 1.1, 1], opacity: [0.45, 0.75, 0.45] }
          }
          transition={{ duration: blob.duration, repeat: Infinity, ease: "easeInOut", delay: blob.delay }}
        />
      ))}
    </div>
  );
}
