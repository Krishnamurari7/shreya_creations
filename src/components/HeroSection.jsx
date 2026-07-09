"use client";

import { ANIM_RISE, PAGE_CONTAINER } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { CareerCtaButton } from "@/components/CareerCtaSection";
import { pickPage } from "@/lib/cms";
import { openInquiryPopup } from "@/lib/inquiryPopup";

const HERO_STATS_EN = [
  { icon: "clients", highlight: "30K+", label: "Happy Clients Served" },
  { icon: "courses", highlight: "50+", label: "Courses & Products & Books" },
  { icon: "delivered", highlight: "Thousands of", label: "Successful Designs Delivered" },
  { icon: "training", highlight: "100%", label: "Practical Training" },
  { icon: "placement", highlight: "100%", label: "Placement Assistance" },
];

const HERO_STATS_HI = [
  { icon: "clients", highlight: "30K+", label: "खुश ग्राहक सेवित" },
  { icon: "courses", highlight: "50+", label: "कोर्स, प्रोडक्ट और बुक्स" },
  { icon: "delivered", highlight: "हज़ारों", label: "सफल डिज़ाइन डिलीवर" },
  { icon: "training", highlight: "100%", label: "प्रैक्टिकल ट्रेनिंग" },
  { icon: "placement", highlight: "100%", label: "प्लेसमेंट सहायता" },
];

function HeroStatIcon({ type }) {
  const props = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.25",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  switch (type) {
    case "clients":
      return (
        <svg {...props}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "courses":
      return (
        <svg {...props}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          <path d="M12 3 2 8l10 5 10-5-10-5z" />
          <path d="M6 10.5V16l6 3 6-3v-5.5" />
        </svg>
      );
    case "delivered":
      return (
        <svg {...props}>
          <path d="M10 17h4" />
          <path d="M3 7h11v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7z" />
          <path d="M14 9h4l3 3v3a2 2 0 0 1-2 2h-1" />
          <circle cx="7.5" cy="17.5" r="1.5" />
          <circle cx="17.5" cy="17.5" r="1.5" />
          <path d="m16 9 2 2" />
        </svg>
      );
    case "training":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9 12.5 11 15l5.5-6" />
        </svg>
      );
    case "placement":
      return (
        <svg {...props}>
          <path d="M8 21h8" />
          <path d="M12 17v4" />
          <path d="M7 4h10v3a5 5 0 0 1-10 0V4z" />
          <path d="M5 4H3v2a3 3 0 0 0 3 3" />
          <path d="M19 4h2v2a3 3 0 0 1-3 3" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7-6.3-4.6L5.7 21l2.3-7-6-4.6h7.6L12 2z" />
        </svg>
      );
  }
}

function splitHeroTitle(title = "", lang = "en") {
  const trimmed = title.trim();
  if (!trimmed) return { main: "", highlight: "" };

  if (lang === "hi") {
    const incomeSplit = trimmed.match(/^(.+?\s)(आय\s.+)$/);
    if (incomeSplit) {
      return { main: incomeSplit[1].trim(), highlight: incomeSplit[2].trim() };
    }
    return { main: trimmed, highlight: "" };
  }

  const words = trimmed.split(/\s+/);
  if (words.length <= 2) return { main: trimmed, highlight: "" };
  const highlight = words.pop();
  return { main: words.join(" "), highlight };
}

function parseKeywordPills(text = "") {
  return text
    .split(/[/|·,•]+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

const HERO_KEYWORD_CHIP_IMAGES = ["/job.png", "/botique.png", "/institute.png"];
const HERO_KEYWORD_LINKS = ["/courses", "/shop", "/about"];

function HeroVideoPlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function HeroVideoPauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
    </svg>
  );
}

function HeroVideoVolumeOnIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M11 5 6 9H3v6h3l5 4V5z" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a9 9 0 0 1 0 12.73" />
    </svg>
  );
}

function HeroVideoVolumeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M11 5 6 9H3v6h3l5 4V5z" />
      <path d="m22 9-6 6M16 9l6 6" />
    </svg>
  );
}

function HeroAutoplayVideo({ src, alt, lang = "en" }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const play = () => {
      video.play().catch(() => {});
    };

    play();

    if (video.readyState >= 2) return undefined;

    video.addEventListener("loadeddata", play);
    return () => video.removeEventListener("loadeddata", play);
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, [src]);

  const togglePlay = useCallback((event) => {
    event.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {});
      return;
    }

    video.pause();
  }, []);

  const toggleMute = useCallback((event) => {
    event.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
  }, []);

  const playLabel = lang === "hi" ? (isPlaying ? "रोकें" : "चलाएं") : isPlaying ? "Pause" : "Play";
  const muteLabel = lang === "hi" ? (isMuted ? "आवाज़ चालू करें" : "आवाज़ बंद करें") : isMuted ? "Unmute" : "Mute";

  return (
    <>
      <video
        ref={videoRef}
        className="home-hero__video-media"
        src={src}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        preload="auto"
        aria-label={alt}
      />
      <div className="home-hero__video-controls home-hero__video-controls--live">
        <button
          type="button"
          className="home-hero__video-controls-btn home-hero__video-controls-btn--play"
          onClick={togglePlay}
          aria-label={playLabel}
        >
          {isPlaying ? <HeroVideoPauseIcon /> : <HeroVideoPlayIcon />}
        </button>
        <button
          type="button"
          className="home-hero__video-controls-btn home-hero__video-controls-btn--volume"
          onClick={toggleMute}
          aria-label={muteLabel}
        >
          {isMuted ? <HeroVideoVolumeOffIcon /> : <HeroVideoVolumeOnIcon />}
        </button>
      </div>
    </>
  );
}

function HeroCrownIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="home-hero__badge-crown">
      <path d="M2.5 19h19v2h-19v-2zm2.1-9.2 2.8 3.2 3.4-6.1 3.4 6.1 2.8-3.2L19.5 17h-15l-1.9-7.2z" />
    </svg>
  );
}

function HeroVideoCard({
  headerIcon,
  headerLabel,
  footerIcon,
  footerText,
  thumb,
  alt,
  href,
  videoSrc,
  onVideoClick,
  tag,
  offset = false,
  lang = "en",
}) {
  const isLive = Boolean(videoSrc);

  const inner = (
    <div className="home-hero__video-shell">
      <div className="home-hero__video-head">
        <span className="home-hero__video-head-icon" aria-hidden>
          {headerIcon}
        </span>
        <span className="home-hero__video-head-label">{headerLabel}</span>
      </div>
      <div
        className="home-hero__video-body"
        onClick={isLive ? onVideoClick : undefined}
        onKeyDown={
          isLive
            ? (event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onVideoClick?.();
                }
              }
            : undefined
        }
        role={isLive ? "button" : undefined}
        tabIndex={isLive ? 0 : undefined}
      >
        {tag ? (
          <span className="home-hero__video-tag" aria-hidden>
            {tag}
          </span>
        ) : null}
        {videoSrc ? (
          <HeroAutoplayVideo src={videoSrc} alt={alt} lang={lang} />
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={thumb} alt={alt} className="home-hero__video-thumb" loading="eager" />
            <div className="home-hero__video-overlay" aria-hidden>
              <span className="home-hero__video-play">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </div>
            <div className="home-hero__video-controls" aria-hidden>
              <span className="home-hero__video-controls-play" />
              <span className="home-hero__video-controls-track" />
              <span className="home-hero__video-controls-time" />
            </div>
          </>
        )}
      </div>
      {footerText ? (
        <div className="home-hero__video-foot">
          {footerIcon ? (
            <span className="home-hero__video-foot-icon" aria-hidden>
              {footerIcon}
            </span>
          ) : null}
          <span className="home-hero__video-foot-label">{footerText}</span>
        </div>
      ) : null}
    </div>
  );

  const cardClass = [
    "home-hero__video-card",
    isLive ? "home-hero__video-card--live" : "",
    offset ? "home-hero__video-card--offset" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (isLive) {
    return (
      <div className={cardClass} aria-label={alt}>
        {inner}
      </div>
    );
  }

  return (
    <Link href={href} className={cardClass} aria-label={alt}>
      {inner}
    </Link>
  );
}

export default function HeroSection({ home = {}, lang = "en" }) {
  const heroBadge =
    pickPage(home, lang, "heroBoutiqueBadge", "heroBoutiqueBadgeHi") ||
    pickPage(home, lang, "heroBadge", "heroBadgeHi") ||
    (lang === "hi"
      ? "बिहार का नं. 1 फैशन बुटीक इंस्टिट्यूट"
      : "Bihar's No. 1 Fashion Boutique Institute");

  const heroTitle =
    pickPage(home, lang, "heroBoutiqueTitle", "heroBoutiqueTitleHi") ||
    pickPage(home, lang, "heroTitleLine1", "heroTitleLine1Hi") ||
    (lang === "hi" ? "हुनर जो भविष्य संवारे," : "Skill That");

  const heroTitleHighlight =
    pickPage(home, lang, "heroBoutiqueTitleHighlight", "heroBoutiqueTitleHighlightHi") ||
    (lang === "hi" ? "कमाई कमाओ" : "Creates Income");

  const { main: heroTitleMain, highlight: heroTitleAccent } = heroTitleHighlight
    ? { main: heroTitle, highlight: heroTitleHighlight }
    : splitHeroTitle(heroTitle, lang);

  const heroSubtitle =
    pickPage(home, lang, "heroBoutiqueSubtitle", "heroBoutiqueSubtitleHi") ||
    (lang === "hi"
      ? "सिलाई और फैशन डिज़ाइन सीखें — नौकरी पाएं या अपना बुटीक शुरू करें"
      : "Learn stitching & fashion design — get job-ready or start your own boutique");

  const heroKeywords =
    pickPage(home, lang, "heroBoutiqueKeywords", "heroBoutiqueKeywordsHi") ||
    pickPage(home, lang, "heroSubtitle", "heroSubtitleHi") ||
    (lang === "hi" ? "कोर्स / बुटीक / इंस्टिट्यूट" : "Course / Boutique / Institute");

  const stats = useMemo(() => (lang === "hi" ? HERO_STATS_HI : HERO_STATS_EN), [lang]);
  const keywordPills = useMemo(() => parseKeywordPills(heroKeywords), [heroKeywords]);

  const demoThumb = home.heroDemoThumb || "/slider1.png";
  const bookThumb = home.heroBookThumb || "/slider2.png";
  const heroLocalVideo = home.heroLocalVideo || "/video%201.mp4";
  const heroBookLocalVideo = home.heroBookLocalVideo || "/video%202.mp4";

  const openHeroInquiryForm = (source, message) => {
    openInquiryPopup({ source, message });
  };

  return (
    <section
      className={`home-hero home-hero--boutique${lang === "hi" ? " home-hero--hi" : ""}`}
      aria-label={lang === "hi" ? "मुख्य बैनर" : "Hero banner"}
    >
      <div className="home-hero__ambient" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/background.png" alt="" className="home-hero__bg-image" />
        <span className="home-hero__bg-overlay" />
      </div>

      <div className={cn(PAGE_CONTAINER, "home-hero__top")}>
        <div className="home-hero__grid">
          <div className="home-hero__copy">
            <div className="home-hero__glass-panel">
            <div className="home-hero__copy-stack">
              {heroBadge ? (
                <p className={cn(ANIM_RISE, "home-hero__badge", "home-hero__badge--boutique", "anim-delay-1")}>
                  <HeroCrownIcon />
                  <span>{heroBadge}</span>
                </p>
              ) : null}

              <h1 className={cn(ANIM_RISE, "home-hero__title-block", "anim-delay-2")}>
                <span className="home-hero__title-lead">{heroTitleMain || heroTitle}</span>
                {heroTitleAccent ? (
                  <span className="home-hero__title-highlight">{heroTitleAccent}</span>
                ) : null}
              </h1>

              {heroSubtitle ? (
                <p className={cn(ANIM_RISE, "home-hero__title-sub", "anim-delay-2")}>{heroSubtitle}</p>
              ) : null}

              <div className={cn(ANIM_RISE, "home-hero__path-cards", "anim-delay-3")}>
              <div
                className={`home-hero__cta-stack${lang === "hi" ? " career-cta-section--hi" : ""}`}
              >
                <CareerCtaButton home={home} lang={lang} />
              </div>
              {keywordPills.length > 0 ? (
                <ul className="home-hero__keyword-chips">
                  {keywordPills.map((pill, index) => (
                    <li key={pill} className="home-hero__keyword-chip-item">
                      <Link
                        href={HERO_KEYWORD_LINKS[index] || "/contact"}
                        className="home-hero__keyword-chip"
                        aria-label={pill}
                      >
                        {HERO_KEYWORD_CHIP_IMAGES[index] ? (
                          <span className="home-hero__keyword-chip-icon-wrap">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={HERO_KEYWORD_CHIP_IMAGES[index]}
                              alt=""
                              className="home-hero__keyword-chip-img"
                              loading="eager"
                            />
                          </span>
                        ) : null}
                        <span className="home-hero__keyword-chip-label">{pill}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="home-hero__keywords">{heroKeywords}</p>
              )}
              </div>
            </div>
            </div>
          </div>

          <div className="home-hero__visual anim-hero-media">
            <div className="home-hero__videos">
            <HeroVideoCard
              lang={lang}
              tag={lang === "hi" ? "मुफ़्त" : "FREE"}
              headerIcon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <circle cx="12" cy="9" r="5" />
                  <path d="M8.5 14.5 7 21l5-2.5L17 21l-1.5-6.5" />
                </svg>
              }
              footerIcon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c0 1.1 2.7 2 6 2s6-.9 6-2v-5" />
                </svg>
              }
              footerText={
                lang === "hi"
                  ? "विशेषज्ञों से सीखें। उज्ज्वल भविष्य बनाएं।"
                  : "Learn from Experts. Build a Brighter Future."
              }
              headerLabel={lang === "hi" ? "फ्री डेमो क्लास" : "Free Demo Class"}
              thumb={demoThumb}
              alt={lang === "hi" ? "डेमो क्लास वीडियो" : "Demo class video"}
              videoSrc={heroLocalVideo}
              href="/contact"
              onVideoClick={() =>
                openHeroInquiryForm(
                  "hero_demo_video",
                  lang === "hi"
                    ? "मुझे फ्री ऑफलाइन डेमो क्लास में दिलचस्पी है।"
                    : "I am interested in the FREE OFFLINE DEMO CLASS."
                )
              }
            />
            <HeroVideoCard
              lang={lang}
              offset
              tag={lang === "hi" ? "सिलाई" : "Stitching"}
              headerIcon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              }
              footerIcon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              }
              footerText={
                lang === "hi"
                  ? "अपने सपने की ओर पहला कदम बढ़ाएं।"
                  : "Take the First Step towards Your Dream."
              }
              headerLabel={lang === "hi" ? "कस्टम सिलाई" : "Customise stitching"}
              thumb={bookThumb}
              alt={lang === "hi" ? "बुकिंग वीडियो" : "Booking video"}
              videoSrc={heroBookLocalVideo}
              href="/contact"
              onVideoClick={() =>
                openHeroInquiryForm(
                  "hero_book_video",
                  lang === "hi"
                    ? "मैं अभी बुकिंग / एडमिशन करना चाहता/चाहती हूँ।"
                    : "I want to BOOK NOW / take admission."
                )
              }
            />
            </div>
          </div>
        </div>
      </div>

      <div className="home-hero__stats-bar" aria-label={lang === "hi" ? "मुख्य आंकड़े" : "Key highlights"}>
        <div className="home-hero__stats-inner">
          {stats.map((stat, i) => (
            <div key={stat.icon} className="home-hero__stat">
              {i > 0 && <span className="home-hero__stat-divider" aria-hidden />}
              <span className="home-hero__stat-icon">
                <HeroStatIcon type={stat.icon} />
              </span>
              <p className="home-hero__stat-text">
                <strong className="home-hero__stat-highlight">{stat.highlight}</strong>
                <span className="home-hero__stat-line">{stat.label}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
