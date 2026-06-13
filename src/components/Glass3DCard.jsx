"use client";

import { cn } from "@/lib/utils";

export const glassCardStyles =
  "relative group/card glass border border-ink/8 hover:shadow-lift hover:border-orange/30 hover:-translate-y-1 transition-all duration-500";

export function CardGlow({ className }) {
  return (
    <div
      className={cn(
        "absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[inherit] z-[1]",
        className
      )}
      style={{
        background:
          "radial-gradient(350px circle at 50% 50%, rgba(230, 92, 0, 0.08), transparent 80%)",
      }}
    />
  );
}

/** Glass card with hover glow (no 3D tilt). */
export function Glass3DCard({
  children,
  className,
  containerClassName,
  as,
  href,
  glow = true,
  layered: _layered,
  translateZ: _translateZ,
  ...rest
}) {
  const Tag = as || (href ? "a" : "div");
  const linkProps = href ? { href } : {};

  return (
    <div className={cn("py-0 w-full", containerClassName)}>
      <Tag
        {...linkProps}
        {...rest}
        className={cn(glassCardStyles, "h-auto w-full block", className)}
      >
        {glow && <CardGlow />}
        <div className="relative z-[2] w-full">{children}</div>
      </Tag>
    </div>
  );
}

/** @deprecated Alias kept for existing markup; renders a plain wrapper. */
export function Float3D({ children, className }) {
  return <div className={cn("w-full", className)}>{children}</div>;
}
