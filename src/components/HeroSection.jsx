"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import HeroBackgroundSlider from "@/components/HeroBackgroundSlider";
import { waLink, greetingMessage } from "@/lib/whatsapp";
import { pickPage } from "@/lib/cms";

const AUTOPLAY_MS = 5500;

const HERO_SLIDES = ["/slider1.png", "/slider2.png", "/slider3.png", "/slider4.png"];

const CHECKLIST_EN = [
  "Fashion Designing Course",
  "Boutique Mastery Course",
  "NIFT • NID • UCEED Coaching",
  "Certificate + Placement Support",
];

const CHECKLIST_HI = [
  "फैशन डिज़ाइनिंग कोर्स",
  "बुटीक मास्टरी कोर्स",
  "NIFT • NID • UCEED कोचिंग",
  "सर्टिफिकेट + प्लेसमेंट सपोर्ट",
];

export default function HeroSection({ home = {}, lang = "en", whatsapp }) {
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

  const heroCtaHref = home.heroCtaHref || "/contact";
  const checklist = lang === "hi" ? CHECKLIST_HI : CHECKLIST_EN;
  const waChat = waLink(whatsapp, greetingMessage());

  const heroTitle =
    pickPage(home, lang, "heroTitleLine1", "heroTitleLine1Hi") ||
    (lang === "hi"
      ? "लक्ज़री बुटीक फैशन इंस्टिट्यूट NIFT/NID/UCEED कोचिंग"
      : "Luxury Boutique Fashion Institute NIFT/NID/UCEED Coaching");

  return (
    <section
      className="home-hero home-hero--rrc home-hero--luxury relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
    >
      <div className="home-hero__deco" aria-hidden>
        <div className="home-hero__glow home-hero__glow--orange" />
        <div className="home-hero__glow home-hero__glow--gold" />
        <div className="home-hero__ring home-hero__ring--1" />
        <div className="home-hero__ring home-hero__ring--2" />
      </div>

      <HeroBackgroundSlider slides={slides} active={active} />

      <div className="page-container relative z-[2]">
        <div className="home-hero__grid grid lg:grid-cols-[1.05fr_0.95fr] gap-3 sm:gap-6 lg:gap-8 xl:gap-10 items-start lg:items-center min-w-0 w-full">
          <div className="home-hero__content order-2 lg:order-1 text-center lg:text-left lg:py-1">
            <span className="anim-rise home-hero__badge">
              <span className="home-hero__badge-dot" aria-hidden />
              {lang === "hi" ? "📍 पटना, बिहार" : "📍 PATNA, BIHAR"}
            </span>

            <h1 className="anim-rise anim-delay-1 home-hero__title home-hero__title--tagline text-balance">
              <span className="home-hero__title-line home-hero__title-accent home-hero__title-accent--gold">
                {heroTitle}
              </span>
            </h1>

            <p className="anim-rise anim-delay-2 home-hero__since">
              {lang === "hi" ? "2007 से • 17+ वर्षों का अनुभव" : "Since 2007 • 17+ Years Experience"}
            </p>

            <ul className="anim-rise anim-delay-2 home-hero__checklist mx-auto lg:mx-0 max-w-xl">
              {checklist.map((item) => (
                <li key={item} className="home-hero__check-item">
                  <span className="home-hero__check-icon" aria-hidden>✔</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="anim-rise anim-delay-3 home-hero__cta-row mt-5 sm:mt-6">
              <Link
                href={heroCtaHref}
                className="btn-primary home-hero__cta-primary home-hero__cta-primary--bold inline-flex items-center justify-center gap-2 px-7 sm:px-9 py-3.5 sm:py-4 w-full sm:w-auto text-xs sm:text-sm uppercase tracking-wider"
              >
                {lang === "hi" ? "एडमिशन खुला" : "Admission Open"}
                <span className="home-hero__cta-arrow" aria-hidden>→</span>
              </Link>
              <a
                href={waChat}
                target="_blank"
                rel="noopener noreferrer"
                className="home-hero__cta-wa inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 w-full sm:w-auto text-xs sm:text-sm uppercase tracking-wider"
              >
                <span className="home-hero__wa-icon" aria-hidden>🟢</span>
                {lang === "hi" ? "WhatsApp अभी" : "WhatsApp Now"}
              </a>
            </div>
          </div>

          <div className="home-hero__media-stage order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="anim-hero-media home-hero__media home-hero__media--rrc home-hero__media-frame home-hero__media--glass relative w-full max-w-full sm:max-w-[400px] lg:max-w-[440px] xl:max-w-[480px]">
              <div className="gradient-ring gradient-ring--hero shadow-glow">
                <div className="gradient-ring__inner glass">
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
        </div>
      </div>
    </section>
  );
}
