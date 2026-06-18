"use client";

/**
 * Full-bleed background image crossfade for the homepage hero.
 * Foreground content stays static; only these layers animate.
 */
export default function HeroBackgroundSlider({ slides = [], active = 0 }) {
  if (!slides.length) return null;

  return (
    <div className="hero-bg-slider" aria-hidden>
      {slides.map((slide, i) => {
        const src = typeof slide === "string" ? slide : slide.src;
        return (
          <div
            key={`${src}-${i}`}
            className={`hero-bg-slider__slide${i === active ? " is-active" : ""}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" draggable={false} loading={i === 0 ? "eager" : "lazy"} />
          </div>
        );
      })}
      <div className="hero-bg-slider__wash" />
      <div className="hero-bg-slider__gradient" />
    </div>
  );
}
