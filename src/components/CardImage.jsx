"use client";

import { useCallback, useState } from "react";
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
  auto: "card-media card-media--auto",
};

const RATIO_SIZES = {
  "3/4": "(max-width: 768px) 100vw, 33vw",
  "4/5": "(max-width: 768px) 100vw, 33vw",
  "4/3": "(max-width: 768px) 100vw, 33vw",
  "16/9": "(max-width: 768px) 100vw, 33vw",
  "16/10": "(max-width: 768px) 100vw, 33vw",
  "1/1": "(max-width: 768px) 80vw, 25vw",
  fill: "100vw",
  auto: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw",
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
  quality,
  sizes,
}) {
  const resolved = resolveMediaSrc(src);
  const [naturalRatio, setNaturalRatio] = useState(null);

  const lockNaturalRatio = useCallback((img) => {
    if (!img?.naturalWidth || !img?.naturalHeight) return;
    setNaturalRatio(`${img.naturalWidth} / ${img.naturalHeight}`);
  }, []);

  if (!resolved) {
    return (
      <div
        className={cn(RATIO_CLASS[ratio] || RATIO_CLASS["3/4"], "card-media--empty", className)}
        aria-hidden
      />
    );
  }

  // Pinterest-style: box height matches the uploaded image's real aspect ratio
  if (ratio === "auto") {
    return (
      <div
        className={cn(
          RATIO_CLASS.auto,
          fit === "contain" && "card-media--contain",
          position === "top" && "card-media--top",
          className
        )}
        style={naturalRatio ? { aspectRatio: naturalRatio } : undefined}
      >
        <OptimizedImage
          src={resolved}
          alt={alt}
          fill
          sizes={sizes || RATIO_SIZES.auto}
          priority={priority}
          loading={loading}
          quality={quality}
          className={cn(
            "object-cover",
            fit === "contain" && "object-contain",
            position === "top" && "object-top"
          )}
          imgClassName={imgClassName}
          onLoadingComplete={lockNaturalRatio}
          onLoad={(e) => lockNaturalRatio(e.currentTarget)}
        />
      </div>
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
        quality={quality}
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
