"use client";

import OptimizedImage from "@/components/OptimizedImage";
import { resolveMediaSrc } from "@/lib/media";
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

const RATIO_SIZES = {
  "3/4": "(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 320px",
  "4/5": "(max-width: 640px) 85vw, (max-width: 1024px) 40vw, 280px",
  "4/3": "(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 400px",
  "16/9": "(max-width: 640px) 95vw, (max-width: 1024px) 60vw, 560px",
  "16/10": "(max-width: 640px) 95vw, (max-width: 1024px) 55vw, 480px",
  "1/1": "(max-width: 640px) 80vw, (max-width: 1024px) 30vw, 240px",
  fill: "100vw",
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
  priority = false,
  sizes,
}) {
  const resolved = resolveMediaSrc(src);

  if (!resolved) {
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
      <OptimizedImage
        src={resolved}
        alt={alt}
        fill
        sizes={sizes || RATIO_SIZES[ratio] || RATIO_SIZES["3/4"]}
        priority={priority}
        loading={loading}
        className={cn(
          "object-cover",
          fit === "contain" && "object-contain",
          position === "top" && "object-top"
        )}
        imgClassName={imgClassName}
      />
    </div>
  );
}
