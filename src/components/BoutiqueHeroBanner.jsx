"use client";

import { resolveMediaSrc } from "@/lib/media";

export default function BoutiqueHeroBanner({
  fallbackImage,
  mobileImage,
  tabletImage,
  desktopImage,
  alt,
  fallbackPosition = "center center",
}) {
  const desktop = resolveMediaSrc(desktopImage || fallbackImage);
  const tablet = resolveMediaSrc(tabletImage || desktopImage || fallbackImage);
  const mobile = resolveMediaSrc(mobileImage || tabletImage || desktopImage || fallbackImage);
  const responsivePosition = {
    "--banner-position-desktop": desktopImage ? "center center" : fallbackPosition,
    "--banner-position-tablet": tabletImage || desktopImage ? "center center" : fallbackPosition,
    "--banner-position-mobile": mobileImage || tabletImage || desktopImage ? "center center" : fallbackPosition,
  };

  return (
    <section className="boutique-hero-banner" style={responsivePosition}>
      <picture className="boutique-hero-banner__media">
        <source media="(max-width: 639px)" srcSet={mobile} />
        <source media="(max-width: 1023px)" srcSet={tablet} />
        <img src={desktop} alt={alt} loading="eager" fetchPriority="high" decoding="async" />
      </picture>
    </section>
  );
}
