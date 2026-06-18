"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import HeroBackgroundSlider from "@/components/HeroBackgroundSlider";
import { pickPage } from "@/lib/cms";

const AUTOPLAY_MS = 5500;

const HERO_SLIDES = ["/slider1.png", "/slider2.png", "/slider3.png", "/slider4.png"];

export default function HeroSection({ home = {}, lang = "en" }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const slides = HERO_SLIDES;

  const count = slides.length;

  const goTo = useCallback(
    (index) => {
      if (count < 1) return;
      setActive(((index % count) + count) % count);
    },
    [count]
  );

  useEffect(() => {
    if (count < 2 || paused) return undefined;
    const id = setInterval(() => setActive((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [count, paused]);

  const heroCtaLabel =
    pickPage(home, lang, "heroCtaLabel", "heroCtaLabelHi") ||
    (lang === "hi" ? "आज ही सीखना शुरू करें" : "Start Learning Today");
  const heroCtaHref = home.heroCtaHref || "/courses";

  const heroTitleLine1 =
    pickPage(home, lang, "heroTitleLine1", "heroTitleLine1Hi") ||
    (lang === "hi" ? "फैशन ट्रेनिंग" : "Fashion Training");
  const heroTitleLine2 =
    pickPage(home, lang, "heroTitleLine2", "heroTitleLine2Hi") ||
    (lang === "hi" ? "इंस्टिट्यूट" : "Institute");
  const heroTitleHighlight =
    pickPage(home, lang, "heroTitleHighlight", "heroTitleHighlightHi") ||
    (lang === "hi" ? "और डिज़ाइनर बुटीक" : "& Designer Boutique");

  const showTitleLine2 =
    Boolean(heroTitleLine2) &&
    !heroTitleLine1.toLowerCase().includes(heroTitleLine2.toLowerCase());

  return (
    <section
      className="home-hero home-hero--rrc relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
    >
      <HeroBackgroundSlider slides={slides} active={active} />

      <div className="page-container relative z-[2]">
        <div className="home-hero__grid grid lg:grid-cols-[1.05fr_0.95fr] gap-5 sm:gap-6 lg:gap-8 xl:gap-10 items-start lg:items-center">
          {/* Left — static copy */}
          <div className="home-hero__content order-2 lg:order-1 text-center lg:text-left lg:py-1">
            <h1 className="anim-rise home-hero__title text-balance">
              <span className="home-hero__title-line home-hero__title-line--dark">
                {heroTitleLine1}
              </span>
              {showTitleLine2 && (
                <span className="home-hero__title-line home-hero__title-line--dark">
                  {heroTitleLine2}
                </span>
              )}
              <span className="home-hero__title-line home-hero__title-accent home-hero__title-accent--gold">
                {heroTitleHighlight}
              </span>
            </h1>

            <p className="anim-rise anim-delay-1 mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-muted max-w-xl mx-auto lg:mx-0 leading-relaxed text-pretty">
              {pickPage(home, lang, "heroSubtitle", "heroSubtitleHi") ||
                (lang === "hi"
                  ? "सिलाई, फैशन डिज़ाइन और कढ़ाई में 10+ जॉब-ओरिएंटेड कोर्स सीखें"
                  : "Learn 10+ job-oriented courses in stitching, fashion design & embroidery")}
            </p>

            <div className="anim-rise anim-delay-2 home-hero__cta-row mt-5 sm:mt-6">
              <Link
                href={heroCtaHref}
                className="btn-primary home-hero__cta-primary home-hero__cta-primary--bold inline-flex items-center justify-center gap-2 px-7 sm:px-9 py-3.5 sm:py-4 w-full sm:w-auto text-xs sm:text-sm uppercase tracking-wider"
              >
                {heroCtaLabel}
                <span className="home-hero__cta-arrow" aria-hidden>
                  →
                </span>
              </Link>
            </div>
          </div>

          {/* Right — synced foreground image */}
          <div className="home-hero__media-stage order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="anim-hero-media home-hero__media home-hero__media--rrc relative w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[440px] xl:max-w-[480px]">
              <div
                className="home-hero__foreground"
                role="region"
                aria-roledescription="carousel"
                aria-label={lang === "hi" ? "हीरो इमेज स्लाइडर" : "Hero image slider"}
              >
                {slides.map((slide, i) => {
                  const src = typeof slide === "string" ? slide : slide.src;
                  return (
                    <div
                      key={`fg-${src}-${i}`}
                      className={`home-hero__foreground-slide${i === active ? " is-active" : ""}`}
                      aria-hidden={i !== active}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={
                          lang === "hi"
                            ? "श्रेया क्रिएशन फैशन स्टूडियो"
                            : "Shreya creation fashion studio"
                        }
                        draggable={false}
                        loading={i === 0 ? "eager" : "lazy"}
                      />
                    </div>
                  );
                })}

                {count > 1 && (
                  <div className="home-hero__slide-controls">
                    <button
                      type="button"
                      className="home-hero__slide-btn"
                      onClick={() => goTo(active - 1)}
                      aria-label={lang === "hi" ? "पिछली तस्वीर" : "Previous image"}
                    >
                      ‹
                    </button>
                    <div className="home-hero__slide-dots" role="tablist">
                      {slides.map((slide, i) => {
                        const src = typeof slide === "string" ? slide : slide.src;
                        return (
                          <button
                            key={`dot-${src}-${i}`}
                            type="button"
                            role="tab"
                            className={`home-hero__slide-dot${i === active ? " is-active" : ""}`}
                            onClick={() => goTo(i)}
                            aria-label={`${lang === "hi" ? "स्लाइड" : "Slide"} ${i + 1}`}
                            aria-selected={i === active}
                          />
                        );
                      })}
                    </div>
                    <button
                      type="button"
                      className="home-hero__slide-btn"
                      onClick={() => goTo(active + 1)}
                      aria-label={lang === "hi" ? "अगली तस्वीर" : "Next image"}
                    >
                      ›
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
