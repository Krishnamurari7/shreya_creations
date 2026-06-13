"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const AUTOPLAY_MS = 5000;
const SWIPE_THRESHOLD = 48;

export default function HeroImageSlider({
  slides = [],
  lang = "en",
  overlay = null,
  className = "",
}) {
  const count = slides.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const touchStart = useRef(null);
  const frameRef = useRef(null);

  const goTo = useCallback(
    (index) => {
      if (count < 1) return;
      setActive(((index % count) + count) % count);
      setDragOffset(0);
    },
    [count]
  );

  const goNext = useCallback(() => goTo(active + 1), [active, goTo]);
  const goPrev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    if (count < 2 || paused) return undefined;
    const id = setInterval(() => setActive((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [count, paused]);

  const onTouchStart = (e) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    setDragOffset(0);
  };

  const onTouchMove = (e) => {
    if (!touchStart.current) return;
    const dx = e.touches[0].clientX - touchStart.current.x;
    const dy = e.touches[0].clientY - touchStart.current.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      setDragOffset(dx);
    }
  };

  const onTouchEnd = () => {
    if (dragOffset > SWIPE_THRESHOLD) goPrev();
    else if (dragOffset < -SWIPE_THRESHOLD) goNext();
    touchStart.current = null;
    setDragOffset(0);
  };

  if (!count) return null;

  const showControls = count > 1;

  return (
    <div
      className={`hero-slider ${className}`}
      style={{ "--hero-slider-duration": `${AUTOPLAY_MS}ms` }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
    >
      <div
        ref={frameRef}
        className="gradient-ring gradient-ring--arch shadow-glow"
        role="region"
        aria-roledescription="carousel"
        aria-label={lang === "hi" ? "हीरो इमेज स्लाइडर" : "Hero image slider"}
      >
        <div
          className="gradient-ring__inner hero-arch-frame hero-arch-frame--clipped hero-slider__frame border-0 shadow-none"
          onTouchStart={showControls ? onTouchStart : undefined}
          onTouchMove={showControls ? onTouchMove : undefined}
          onTouchEnd={showControls ? onTouchEnd : undefined}
        >
          <div
            className="hero-slider__track"
            style={dragOffset ? { transform: `translateX(${dragOffset * 0.35}px)` } : undefined}
          >
            {slides.map((slide, i) => {
              const src = typeof slide === "string" ? slide : slide.src;
              const alt =
                (typeof slide === "object" && slide.alt) ||
                (lang === "hi" ? "श्रेया क्रिएशन स्टूडियो" : "Shreya creation studio");
              const isActive = i === active;

              return (
                <div
                  key={`${src}-${i}`}
                  className={`hero-slider__slide ${isActive ? "is-active" : ""}`}
                  aria-hidden={!isActive}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={alt} draggable={false} loading={i === 0 ? "eager" : "lazy"} />
                </div>
              );
            })}
          </div>

          {overlay}

          {showControls && (
            <>
              <button
                type="button"
                className="hero-slider__arrow hero-slider__arrow--prev"
                onClick={goPrev}
                aria-label={lang === "hi" ? "पिछली तस्वीर" : "Previous image"}
              >
                ‹
              </button>
              <button
                type="button"
                className="hero-slider__arrow hero-slider__arrow--next"
                onClick={goNext}
                aria-label={lang === "hi" ? "अगली तस्वीर" : "Next image"}
              >
                ›
              </button>
            </>
          )}
        </div>
      </div>

      {showControls && (
        <div className="hero-slider__footer">
          <div className="hero-slider__dots" role="tablist" aria-label={lang === "hi" ? "स्लाइड चुनें" : "Choose slide"}>
            {slides.map((slide, i) => {
              const src = typeof slide === "string" ? slide : slide.src;
              return (
                <button
                  key={`dot-${src}-${i}`}
                  type="button"
                  role="tab"
                  className={`hero-slider__dot ${i === active ? "is-active" : ""}`}
                  onClick={() => goTo(i)}
                  aria-label={`${lang === "hi" ? "स्लाइड" : "Slide"} ${i + 1}`}
                  aria-selected={i === active}
                />
              );
            })}
          </div>
          <div className="hero-slider__progress" aria-hidden>
            <span
              key={active}
              className={`hero-slider__progress-bar ${paused ? "is-paused" : ""}`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
