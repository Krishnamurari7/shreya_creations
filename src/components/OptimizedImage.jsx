"use client";

import Image from "next/image";
import { resolveMediaSrc } from "@/lib/media";
import { cn } from "@/lib/utils";

function isOptimizableSrc(src) {
  if (!src || typeof src !== "string") return false;
  if (src.startsWith("/")) return true;
  if (src.startsWith("https://") && src.includes("supabase.co")) return true;
  return false;
}

/**
 * next/image wrapper with WebP/AVIF, responsive srcset, and legacy path resolution.
 */
export default function OptimizedImage({
  src,
  alt = "",
  width,
  height,
  fill = false,
  sizes,
  priority = false,
  loading,
  className,
  imgClassName,
  style,
  onClick,
  ...rest
}) {
  const resolved = resolveMediaSrc(src);

  if (!resolved) return null;

  if (!isOptimizableSrc(resolved)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={resolved}
        alt={alt}
        width={width}
        height={height}
        className={cn(className, imgClassName)}
        loading={priority ? "eager" : loading || "lazy"}
        decoding="async"
        style={style}
        onClick={onClick}
        {...rest}
      />
    );
  }

  const shared = {
    src: resolved,
    alt,
    className: cn(className, imgClassName),
    sizes: sizes || (fill ? "100vw" : undefined),
    priority,
    style,
    onClick,
    ...rest,
  };

  if (fill) {
    return (
      <Image
        {...shared}
        fill
        loading={priority ? undefined : loading || "lazy"}
      />
    );
  }

  return (
    <Image
      {...shared}
      width={width || 800}
      height={height || 600}
      loading={priority ? undefined : loading || "lazy"}
    />
  );
}
