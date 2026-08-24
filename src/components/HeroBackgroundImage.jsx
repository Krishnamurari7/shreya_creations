import { MEDIA } from "@/lib/media";

/**
 * Server-rendered LCP background — native <picture> so preload URLs match
 * (avoids /_next/image round-trip competing with the real LCP request).
 */
export default function HeroBackgroundImage() {
  return (
    <div className="home-hero__ambient" aria-hidden>
      <picture>
        <source media="(max-width: 767px)" srcSet="/background-mobile.webp" type="image/webp" />
        <img
          src={MEDIA.background}
          alt=""
          width={2142}
          height={734}
          fetchPriority="high"
          decoding="async"
          className="home-hero__bg-image"
        />
      </picture>
      <span className="home-hero__bg-overlay" />
    </div>
  );
}
