"use client";

import { cn } from "@/lib/utils";

const RATIO_CLASS = {
  "3/4": "card-media",
  "4/5": "card-media card-media--45",
  "4/3": "card-media card-media--wide",
  "16/9": "card-media card-media--video",
  "16/10": "card-media card-media--1610",
  "1/1": "card-media card-media--square",
  fill: "card-media card-media--fill",
};

export default function CardImage({
  src,
  alt = "",
  ratio = "3/4",
  fit = "cover",
  position = "center",
  className,
  imgClassName,
  loading = "lazy",
}) {
  if (!src) {
    return (
      <div
        className={cn(RATIO_CLASS[ratio] || RATIO_CLASS["3/4"], "card-media--empty", className)}
        aria-hidden
      />
    );
  }

  return (
    <div
      className={cn(
        RATIO_CLASS[ratio] || RATIO_CLASS["3/4"],
        fit === "contain" && "card-media--contain",
        position === "top" && "card-media--top",
        className
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading={loading} className={imgClassName} />
    </div>
  );
}
