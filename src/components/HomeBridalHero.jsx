"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { pickPage } from "@/lib/cms";
import { PAGE_DEFAULTS } from "@/lib/cms/defaults";
import { DEFAULT_FOUNDING_YEAR, DEFAULT_OUTFITS_DELIVERED, DEFAULT_STUDENTS_TAUGHT, computeYearsExperience } from "@/lib/site-config";
import { localizedPath } from "@/lib/locale";
import { resolveMediaSrc } from "@/lib/media";
import styles from "./HomeBridalHero.module.css";

const defaults = PAGE_DEFAULTS.home;

function localized(item, field, lang) {
  const hi = item[`${field}Hi`] ?? item[`${field}_hi`];
  return lang === "hi" && hi ? hi : item[field] || "";
}

function formatStat(value) {
  const number = Number(value);
  return `${Number.isFinite(number) ? number.toLocaleString("en-IN") : value}+`;
}

function PinIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.7"/></svg>;
}

function SoundIcon({ muted }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z"/>{muted ? <path d="m16 9 5 6m0-6-5 6"/> : <path d="M15.5 8.5a5 5 0 0 1 0 7m3-10a9 9 0 0 1 0 13"/>}</svg>;
}

export default function HomeBridalHero({ home = {}, site = {}, lang = "en" }) {
  const reducedMotion = useReducedMotion();
  const configuredSlides = Array.isArray(home.heroBridalSlides) ? home.heroBridalSlides : defaults.hero_bridal_slides;
  const videoSlides = configuredSlides.filter((slide) => slide?.videoUrl || slide?.video_url);
  const slides = videoSlides.length ? videoSlides : defaults.hero_bridal_slides;
  const configuredCtas = Array.isArray(home.heroBridalCtas) ? home.heroBridalCtas : defaults.hero_bridal_ctas;
  const ctas = configuredCtas.filter((cta) => cta?.label && cta?.href);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);

  const slide = slides[activeIndex] || slides[0] || null;
  const videoUrl = slide?.videoUrl || slide?.video_url || "";
  const tabletVideo = slide?.videoTablet || slide?.video_tablet || "";
  const mobileVideo = slide?.videoMobile || slide?.video_mobile || "";

  const goTo = (index) => {
    setProgress(0);
    setMuted(true);
    const next = (index + slides.length) % slides.length;
    if (next === activeIndex && videoRef.current) videoRef.current.currentTime = 0;
    setActiveIndex(next);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = muted;
    if (paused || reducedMotion) video.pause();
    else video.play().catch(() => {});
  }, [activeIndex, muted, paused, reducedMotion, videoUrl]);

  const badge = pickPage(home, lang, "heroBridalBadge", "heroBridalBadgeHi") || (lang === "hi" ? defaults.hero_bridal_badge_hi : defaults.hero_bridal_badge);
  const title = pickPage(home, lang, "heroBridalTitle", "heroBridalTitleHi") || (lang === "hi" ? defaults.hero_bridal_title_hi : defaults.hero_bridal_title);
  const highlight = pickPage(home, lang, "heroBridalHighlight", "heroBridalHighlightHi") || (lang === "hi" ? defaults.hero_bridal_highlight_hi : defaults.hero_bridal_highlight);
  const subtitle = pickPage(home, lang, "heroBridalSubtitle", "heroBridalSubtitleHi") || (lang === "hi" ? defaults.hero_bridal_subtitle_hi : defaults.hero_bridal_subtitle);
  const location = pickPage(home, lang, "heroBridalLocation", "heroBridalLocationHi") || (lang === "hi" ? defaults.hero_bridal_location_hi : defaults.hero_bridal_location);
  const foundingYear = site.foundingYear || DEFAULT_FOUNDING_YEAR;
  const stats = [
    { value: site.yearsExperience ?? computeYearsExperience(foundingYear), label: lang === "hi" ? "सालों का अनुभव" : "Years of experience" },
    { value: site.studentsTaught ?? DEFAULT_STUDENTS_TAUGHT, label: lang === "hi" ? "प्रशिक्षित छात्र" : "Students trained" },
    { value: site.outfitsDelivered ?? DEFAULT_OUTFITS_DELIVERED, label: lang === "hi" ? "तैयार परिधान" : "Outfits delivered" },
  ];

  const poster = slide?.image ? resolveMediaSrc(slide.image) : "";
  const tabletPoster = slide?.imageTablet || slide?.image_tablet ? resolveMediaSrc(slide.imageTablet || slide.image_tablet) : poster;
  const mobilePoster = slide?.imageMobile || slide?.image_mobile ? resolveMediaSrc(slide.imageMobile || slide.image_mobile) : tabletPoster;
  const imageAlt = localized(slide || {}, "imageAlt", lang) || localized(slide || {}, "image_alt", lang);
  const slideLabel = localized(slide || {}, "label", lang);
  const slideCaption = localized(slide || {}, "caption", lang);

  return (
    <section className={styles.hero} aria-label={lang === "hi" ? "मुख्य बैनर" : "Homepage hero"}>
      <div className={styles.inner}>
        <div className={styles.content}>
          {badge && <p className={styles.badge}><span className={styles.badgeDot} aria-hidden="true" />{badge.replaceAll("{{year}}", String(foundingYear))}</p>}
          <h1 className={styles.heading}>
            <span className={styles.headingMain}>{title}</span>{" "}
            {highlight && <span className={styles.headingAccent}>{highlight}</span>}
          </h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          {ctas.length > 0 && (
            <div className={styles.actions}>
              {ctas.map((cta, index) => {
                const href = String(cta.href || "").trim();
                const label = localized(cta, "label", lang);
                const variant = ["gold", "dark", "outline"].includes(cta.variant) ? cta.variant : "outline";
                const className = `${styles.action} ${styles[`action_${variant}`]}`;
                const content = <>{label}<span aria-hidden="true">→</span></>;
                return href.startsWith("/") && !href.startsWith("//") ? (
                  <Link key={`${href}-${index}`} href={localizedPath(href, lang)} className={className}>{content}</Link>
                ) : /^https?:\/\//i.test(href) ? (
                  <a key={`${href}-${index}`} href={href} target="_blank" rel="noopener noreferrer" className={className}>{content}</a>
                ) : null;
              })}
            </div>
          )}
          {location && <p className={styles.location}><PinIcon />{location}</p>}
          <div className={styles.stats} aria-label={lang === "hi" ? "हमारे आंकड़े" : "Our achievements"}>
            {stats.map((stat) => <div className={styles.stat} key={stat.label}><strong>{formatStat(stat.value)}</strong><span>{stat.label}</span></div>)}
          </div>
        </div>

        <div className={styles.stage}>
          <span className={styles.stackGold} aria-hidden="true" />
          <span className={styles.stackRed} aria-hidden="true" />
          <div className={styles.frame}>
            <div className={styles.media}>
              {poster && <picture key={`${activeIndex}-${poster}`}>
                <source media="(max-width: 639px)" srcSet={mobilePoster} />
                <source media="(max-width: 1023px)" srcSet={tabletPoster} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={poster} alt={imageAlt} fetchPriority={activeIndex === 0 ? "high" : undefined} loading={activeIndex === 0 ? "eager" : "lazy"} />
              </picture>}
              <video
                key={`${activeIndex}-${videoUrl}`}
                ref={videoRef}
                poster={poster || undefined}
                autoPlay
                loop={slides.length === 1}
                muted={muted}
                playsInline
                preload="metadata"
                onTimeUpdate={(event) => {
                  const player = event.currentTarget;
                  if (Number.isFinite(player.duration) && player.duration > 0) setProgress(Math.min(100, player.currentTime / player.duration * 100));
                }}
                onEnded={() => slides.length > 1 && goTo(activeIndex + 1)}
              >
                {mobileVideo && <source media="(max-width: 639px)" src={mobileVideo} />}
                {tabletVideo && <source media="(max-width: 1023px)" src={tabletVideo} />}
                <source src={videoUrl} />
              </video>
            </div>
            <div className={styles.shade} aria-hidden="true" />
            <div className={styles.topMeta}>
              {slideLabel && <span className={styles.slideLabel}>{slideLabel}</span>}
              <span className={styles.counter}>{String(activeIndex + 1).padStart(2, "0")} / {String(Math.max(1, slides.length)).padStart(2, "0")}</span>
            </div>
            <div className={styles.bottom}>
              {slideCaption && <p className={styles.caption}>{slideCaption}</p>}
              <div className={styles.controls}>
                <button type="button" className={styles.playButton} onClick={() => setPaused((value) => !value)} aria-label={paused ? (lang === "hi" ? "स्लाइड चलाएं" : "Play carousel") : (lang === "hi" ? "स्लाइड रोकें" : "Pause carousel")}>
                  {paused ? "▶" : "Ⅱ"}
                </button>
                <div className={styles.progressList} aria-label={lang === "hi" ? "स्लाइड चुनें" : "Choose slide"}>
                  {slides.map((item, index) => <button key={`${item.videoUrl || item.video_url || index}-${index}`} type="button" className={styles.progressTrack} onClick={() => goTo(index)} aria-label={`${lang === "hi" ? "स्लाइड" : "Slide"} ${index + 1} / ${slides.length}`} aria-current={index === activeIndex ? "true" : undefined}><span style={{ width: `${index < activeIndex ? 100 : index === activeIndex ? progress : 0}%` }} /></button>)}
                </div>
                {videoUrl && <button type="button" className={styles.soundButton} onClick={() => setMuted((value) => !value)} aria-label={muted ? (lang === "hi" ? "आवाज़ चालू करें" : "Turn sound on") : (lang === "hi" ? "आवाज़ बंद करें" : "Mute video")}><SoundIcon muted={muted} /><span>{muted ? (lang === "hi" ? "आवाज़ चालू करें" : "Tap for sound") : (lang === "hi" ? "आवाज़ बंद करें" : "Sound on")}</span></button>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
