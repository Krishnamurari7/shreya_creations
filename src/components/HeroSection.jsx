"use client";

import { ANIM_RISE_LCP, PAGE_CONTAINER } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { pickPage } from "@/lib/cms";
import { openInquiryPopup } from "@/lib/inquiryPopup";
import {
  demoClassMessage,
  premiumStitchingCourseMessage,
} from "@/lib/whatsapp";
import {
  DEFAULT_HERO_FEATURE_STRIP,
  DEFAULT_HERO_SERVICE_CARDS,
} from "@/lib/cms/home-blocks";
import {
  DEFAULT_FOUNDING_YEAR,
  SITE_FACTS,
} from "@/lib/site-config";
import { MEDIA, heroServiceImageAlt } from "@/lib/media";
import OptimizedImage from "@/components/OptimizedImage";

const HERO_STATS_EN = [
  { icon: "trust", highlight: "years", line1: "Years of Trust", line2: "Since 2012" },
  { icon: "clients", highlight: "students", line1: "Happy", line2: "Students" },
  { icon: "delivered", highlight: "outfits", line1: "Outfits", line2: "Delivered" },
  { icon: "training", highlight: "100%", line1: "Practical", line2: "Training" },
  { icon: "placement", highlight: "100%", line1: "Placement", line2: "Assistance" },
];

const HERO_STATS_HI = [
  { icon: "trust", highlight: "years", line1: "वर्षों का भरोसा", line2: "2012 से" },
  { icon: "clients", highlight: "students", line1: "खुश", line2: "छात्र" },
  { icon: "delivered", highlight: "outfits", line1: "आउटफिट", line2: "डिलीवर" },
  { icon: "training", highlight: "100%", line1: "प्रैक्टिकल", line2: "ट्रेनिंग" },
  { icon: "placement", highlight: "100%", line1: "प्लेसमेंट", line2: "सहायता" },
];

function HeroStatIcon({ type }) {
  const props = {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": true,
  };

  switch (type) {
    case "trust":
      return (
        <svg {...props}>
          <path d="M12 1.8 3.5 5v6.8c0 5.4 3.6 9.9 8.5 11.2 4.9-1.3 8.5-5.8 8.5-11.2V5L12 1.8z" />
          <path d="M12 4.4 6 6.6v5.2c0 3.9 2.5 7.2 6 8.3V4.4z" fill="#5c3d1a" opacity="0.35" />
          <path d="M12 4.4v15.7c3.5-1.1 6-4.4 6-8.3V6.6L12 4.4z" fill="#fff8f0" opacity="0.28" />
          <path d="M8.2 10.2h7.6M8.2 13.8h7.6" stroke="#fff8f0" strokeWidth="1.15" fill="none" opacity="0.55" />
        </svg>
      );
    case "clients":
      return (
        <svg {...props}>
          <circle cx="12" cy="6.8" r="2.8" />
          <circle cx="6.2" cy="8.2" r="2.2" />
          <circle cx="17.8" cy="8.2" r="2.2" />
          <path d="M4.2 18.8c.15-2.9 2-4.5 4.7-4.5.9 0 1.7.2 2.4.6-.05 1.5 0 3.9 0 3.9H4.2z" />
          <path d="M9.8 18.8c.1-2.8 1.9-4.6 4.7-4.6s4.6 1.8 4.8 4.6H9.8z" />
          <path d="M12.8 15c.6-.3 1.3-.5 2.1-.5 2.7 0 4.5 1.6 4.7 4.3h-2.8" opacity="0.001" />
        </svg>
      );
    case "delivered":
      return (
        <svg {...props}>
          <path d="M12 2.8c-1.6 0-2.9.85-3.5 2.15-.25.5-.35.95-.35 1.45h7.7c0-.5-.1-.95-.35-1.45C14.9 3.65 13.6 2.8 12 2.8z" />
          <path d="M6.8 7.2h10.4l.95 1.35-1.55 11.4c-.12.85-.85 1.45-1.7 1.45H9.1c-.85 0-1.58-.6-1.7-1.45L5.85 8.55 6.8 7.2z" />
          <path d="M9.3 11.4h5.4M9.7 14.6h4.6" stroke="#fff8f0" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.45" />
        </svg>
      );
    case "training":
      return (
        <svg {...props}>
          <rect x="3.8" y="16.2" width="12.2" height="2.4" rx="0.4" />
          <rect x="5.2" y="10.8" width="9.4" height="5.4" rx="0.35" />
          <rect x="6.6" y="7.6" width="2.4" height="3.2" rx="0.25" />
          <circle cx="7.8" cy="5.8" r="1.55" />
          <path d="M14.2 9.2h3.6c1.15 0 2.1.95 2.1 2.1v1.4h-2.35l-.85-1.5H14.2V9.2z" />
          <path d="M10.2 5.6h3.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <circle cx="7.8" cy="13.4" r="0.7" fill="#fff8f0" opacity="0.5" />
        </svg>
      );
    case "placement":
      return (
        <svg {...props}>
          <path d="M7.6 9.6c-1.55 0-2.8 1.25-2.8 2.8v2.2c0 .45.35.8.8.8h2v-5.8H7.6z" />
          <path d="M16.4 9.6c1.55 0 2.8 1.25 2.8 2.8v2.2c0 .45-.35.8-.8.8h-2v-5.8h0z" />
          <path d="M6.6 14.4h10.8c.75 0 1.35.6 1.35 1.35v.55c0 1.6-1.3 2.9-2.9 2.9H8.15c-1.6 0-2.9-1.3-2.9-2.9v-.55c0-.75.6-1.35 1.35-1.35z" />
          <path d="M8.8 9.6h6.4v4.8H8.8z" />
          <path d="M10.1 8.2a1.9 1.9 0 0 1 3.8 0" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
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

function HeroLazyVideo({ src, poster, alt, lang = "en", priorityPoster = false }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [activeSrc, setActiveSrc] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const activate = useCallback(() => {
    setActiveSrc(src);
  }, [src]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || activeSrc || isMobile) return undefined;

    if (typeof IntersectionObserver === "undefined") {
      activate();
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          activate();
          observer.disconnect();
        }
      },
      { rootMargin: "120px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [activeSrc, activate, isMobile]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !activeSrc) return;

    const play = () => {
      if (!isMobile) {
        video.play().catch(() => {});
      }
    };

    play();

    if (video.readyState >= 2) return undefined;

    video.addEventListener("loadeddata", play);
    return () => video.removeEventListener("loadeddata", play);
  }, [activeSrc, isMobile]);

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
  }, [activeSrc]);

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
  const startLabel = lang === "hi" ? "वीडियो चलाएं" : "Play video";

  if (!activeSrc) {
    return (
      <div ref={containerRef} className="home-hero__video-poster">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={poster}
          alt={alt}
          className="home-hero__video-thumb"
          loading={priorityPoster ? "eager" : "lazy"}
          fetchPriority={priorityPoster ? "low" : "auto"}
          decoding="async"
        />
        <button
          type="button"
          className="home-hero__video-overlay home-hero__video-overlay--interactive"
          onClick={(event) => {
            event.stopPropagation();
            activate();
          }}
          aria-label={startLabel}
        >
          <span className="home-hero__video-play" aria-hidden>
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      </div>
    );
  }

  return (
    <>
      <video
        ref={videoRef}
        className="home-hero__video-media"
        src={activeSrc}
        poster={poster}
        loop
        muted={isMuted}
        playsInline
        preload="none"
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

function GradCapIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 1.1 2.7 2 6 2s6-.9 6-2v-5" />
    </svg>
  );
}

function SewingMachineIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 17h12a2 2 0 0 0 2-2v-1H9a2 2 0 0 1-2-2V8h11" />
      <path d="M4 17v2a1 1 0 0 0 1 1h2" />
      <circle cx="18" cy="8" r="2" />
      <path d="M9 8V6a1 1 0 0 1 1-1h2" />
      <path d="M14 17v3" />
    </svg>
  );
}

function CtaArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function ServiceIcon({ type }) {
  const props = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  switch (type) {
    case "fashion":
      return (
        <svg {...props}>
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 1.1 2.7 2 6 2s6-.9 6-2v-5" />
        </svg>
      );
    case "boutique":
      return (
        <svg {...props}>
          <path d="M9 4h6l1.5 4H7.5L9 4z" />
          <path d="M8 8v12h8V8" />
          <path d="M10 12h4M10 16h4" />
        </svg>
      );
    case "blouse":
      return (
        <svg {...props}>
          <path d="M9 3.5 6 6.5 3.5 8l2 2.5V20h13V10.5l2-2.5L18 6.5 15 3.5" />
          <path d="M9 3.5c.8 1.2 1.7 1.8 3 1.8s2.2-.6 3-1.8" />
        </svg>
      );
    case "lehenga":
      return (
        <svg {...props}>
          <path d="M10 3h4v5l3.5 12h-11L10 8V3z" />
          <path d="M9 8h6" />
        </svg>
      );
    case "suit":
      return (
        <svg {...props}>
          <path d="M9 3.5 6.5 6.5 4 8l2 2v10h12V10l2-2-2.5-1.5L15 3.5" />
          <path d="M9 3.5c.7 1 1.6 1.5 3 1.5s2.3-.5 3-1.5" />
          <path d="M12 5v15" />
        </svg>
      );
    case "handwork":
      return (
        <svg {...props}>
          <path d="M5 19 14.5 9.5" />
          <path d="M13 8l3 3" />
          <circle cx="16.5" cy="7.5" r="2" />
          <path d="M4 20h4" />
        </svg>
      );
    case "express":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.5v5l3.2 1.8" />
        </svg>
      );
    default:
      return null;
  }
}

const FEATURE_STRIP_FALLBACK = DEFAULT_HERO_FEATURE_STRIP;

function FeatureStripIcon({ type }) {
  const props = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  switch (type) {
    case "sewing":
      return (
        <svg {...props}>
          <path d="M3.5 17.5h11.5a2 2 0 0 0 2-2v-1.2H9a2 2 0 0 1-2-2V8.5h10.5" />
          <path d="M3.5 17.5v2a1 1 0 0 0 1 1h2.2" />
          <circle cx="17.5" cy="8" r="2.2" />
          <path d="M8.5 8.5V6.2a1 1 0 0 1 1-1h2.2" />
          <path d="M13.5 17.5v3" />
          <path d="M5.2 14.2h2.8" />
        </svg>
      );
    case "dress":
      return (
        <svg {...props}>
          <path d="M12 3.2v2.4" />
          <circle cx="12" cy="2.4" r="0.7" fill="currentColor" stroke="none" />
          <path d="M9.2 5.6h5.6l1.6 3.4-2.1 1.1v3.6l3.2 7.1H6.5l3.2-7.1V10.1L7.6 9l1.6-3.4z" />
          <path d="M10.2 10.1h3.6" />
        </svg>
      );
    case "mannequin":
      return (
        <svg {...props}>
          <path d="M12 3.2v2.1" />
          <circle cx="12" cy="2.4" r="0.7" fill="currentColor" stroke="none" />
          <path d="M8.2 5.3h7.6l1.1 2.4-1.9.9v6.2l-2.8 6.6h-1.4l-2.8-6.6V8.6L7.1 7.7l1.1-2.4z" />
          <path d="M9.4 8.8h5.2M9.8 12.2h4.4" />
        </svg>
      );
    case "certificate":
      return (
        <svg {...props}>
          <path d="M5.5 3.5h13v13.5H5.5z" />
          <path d="M8.2 7.2h7.6M8.2 10.2h5.2" />
          <circle cx="14.8" cy="14.2" r="2.4" />
          <path d="M13.6 16.1 12.4 20.2l2.4-1.2 2.4 1.2-1.2-4.1" />
        </svg>
      );
    case "book":
      return (
        <svg {...props}>
          <path d="M12 6.2c-1.4-1-3.2-1.5-5.2-1.5H4.5v13.2H6.8c2 0 3.8.5 5.2 1.5 1.4-1 3.2-1.5 5.2-1.5h2.3V4.7H17.2c-2 0-3.8.5-5.2 1.5z" />
          <path d="M12 6.2v13.2" />
        </svg>
      );
    default:
      return null;
  }
}

const SERVICE_CARDS_FALLBACK = DEFAULT_HERO_SERVICE_CARDS;

function HeroCourseCta({ variant = "outline", icon, line1, line2, onClick }) {
  return (
    <button
      type="button"
      className={cn("home-hero__course-cta", `home-hero__course-cta--${variant}`)}
      onClick={onClick}
    >
      <span className="home-hero__course-cta-icon" aria-hidden>
        {icon}
      </span>
      <span className="home-hero__course-cta-label">
        <span>{line1}</span>
        <span>{line2}</span>
      </span>
    </button>
  );
}

function HeroVideoCard({
  headerLabel,
  footerTitle,
  footerSub,
  footerIcon,
  thumb,
  alt,
  href,
  videoSrc,
  onVideoClick,
  watchLabel,
  offset = false,
  lang = "en",
  priorityPoster = false,
}) {
  const isLive = Boolean(videoSrc);

  const inner = (
    <div className="home-hero__video-shell">
      <div className="home-hero__video-head">
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
        <span className="home-hero__video-watch" aria-hidden>
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M8 5v14l11-7z" />
          </svg>
          {watchLabel}
        </span>
        {videoSrc ? (
          <HeroLazyVideo src={videoSrc} poster={thumb} alt={alt} lang={lang} priorityPoster={priorityPoster} />
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
          </>
        )}
      </div>
      <div className="home-hero__video-foot">
        {footerIcon ? (
          <span className="home-hero__video-foot-icon" aria-hidden>
            {footerIcon}
          </span>
        ) : null}
        <span className="home-hero__video-foot-copy">
          <span className="home-hero__video-foot-title">{footerTitle}</span>
          <span className="home-hero__video-foot-sub">{footerSub}</span>
        </span>
      </div>
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

export default function HeroSection({ home = {}, lang = "en", phone: _phone = "", whatsapp: _whatsapp = "", site = {}, embedded = false }) {
  const defaultHeroBadge =
    lang === "hi"
      ? "बिहार का नं. 1 बुटीक और फैशन इंस्टिट्यूट"
      : "Bihar's No. 1 Boutique And Fashion Institute";
  const legacyBadges = new Set([
    "Bihar's No. 1 Fashion Boutique Institute",
    "Bihar No 1 Fashion Boutique Institute",
    "बिहार का नं. 1 फैशन बुटीक इंस्टिट्यूट",
  ]);
  const rawBadge =
    pickPage(home, lang, "heroBoutiqueBadge", "heroBoutiqueBadgeHi") ||
    pickPage(home, lang, "heroBadge", "heroBadgeHi") ||
    defaultHeroBadge;
  const heroBadge = legacyBadges.has(rawBadge) ? defaultHeroBadge : rawBadge;

  const defaultHeroTitle =
    lang === "hi"
      ? "पटना का बेस्ट फैशन डिज़ाइनिंग इंस्टिट्यूट"
      : "Patna's Best Fashion Designing Institute";
  const defaultHeroHighlight =
    lang === "hi" ? "और डिज़ाइनर बुटीक" : "& Designer Boutique";
  const defaultHeroSubtitle =
    lang === "hi"
      ? "2012 से प्रैक्टिकल बुटीक और फैशन डिज़ाइनिंग कोर्स — साथ ही ब्राइडल लहंगा व डिज़ाइनर ब्लाउज 24 घंटे में, बोरिंग रोड पर।"
      : "Practical boutique & fashion designing courses since 2012 — plus bridal lehengas and designer blouses stitched in 24 hours on Boring Road.";

  const legacyTitles = new Set([
    "Fashion Boutique & Stitching Institute in Patna",
    "पटना में फैशन बुटीक और सिलाई संस्थान",
    "Your Fashion Career",
    "आपका फैशन करियर",
    "Best Designer Boutique & Fashion Designing Institute",
    "बेस्ट डिज़ाइनर बुटीक और फैशन डिज़ाइनिंग इंस्टिट्यूट",
  ]);
  const legacyHighlights = new Set([
    "Starts in Patna",
    "पटना से शुरू",
    "in Patna Bihar, since 2012",
    "पटना बिहार में, 2012 से",
  ]);
  const legacySubtitles = new Set([
    "Learn boutique courses in Patna or get 24-hour custom stitching — bridal lehengas, designer blouses & more on Boring Road.",
    "पटना में बुटीक कोर्स सीखें या 24 घंटे में सिले कपड़े पाएं — ब्राइडल लहंगा, डिज़ाइनर ब्लाउज और अधिक।",
    "पटना में बुटीक कोर्स सीखें या 24 घंटे में सिले कपड़े पाएं — ब्राइडल लहंगा, डिज़ाइनर ब्लाउज और अधिक, बोरिंग रोड पर।",
    "Boutique courses with real studio training — plus bridal lehengas & designer blouses stitched in 24 hours on Boring Road.",
    "असली स्टूडियो ट्रेनिंग के साथ बुटीक कोर्स — ब्राइडल लहंगा व डिज़ाइनर ब्लाउज 24 घंटे में, बोरिंग रोड पर।",
  ]);

  const rawTitle =
    pickPage(home, lang, "heroBoutiqueTitle", "heroBoutiqueTitleHi") ||
    pickPage(home, lang, "heroTitleLine1", "heroTitleLine1Hi") ||
    defaultHeroTitle;
  const heroTitle = legacyTitles.has(rawTitle) ? defaultHeroTitle : rawTitle;

  const rawHighlight =
    pickPage(home, lang, "heroBoutiqueTitleHighlight", "heroBoutiqueTitleHighlightHi") ||
    pickPage(home, lang, "heroTitleHighlight", "heroTitleHighlightHi") ||
    "";
  const heroTitleHighlight = !rawHighlight || legacyHighlights.has(rawHighlight)
    ? defaultHeroHighlight
    : rawHighlight;

  const rawSubtitle = pickPage(home, lang, "heroBoutiqueSubtitle", "heroBoutiqueSubtitleHi") || defaultHeroSubtitle;
  const heroSubtitle = legacySubtitles.has(rawSubtitle) ? defaultHeroSubtitle : rawSubtitle;

  const stats = useMemo(() => {
    const base = lang === "hi" ? HERO_STATS_HI : HERO_STATS_EN;
    const years =
      site.yearsExperience != null ? `${site.yearsExperience}+` : SITE_FACTS.yearsOfExperience;
    const students =
      site.studentsTaught != null ? `${site.studentsTaught}+` : SITE_FACTS.studentsTrained;
    const outfits =
      site.outfitsDelivered != null ? `${site.outfitsDelivered}+` : SITE_FACTS.outfitsDelivered;
    const sinceYear = site.foundingYear || DEFAULT_FOUNDING_YEAR;
    return base.map((stat) => {
      let highlight = stat.highlight;
      let line2 = stat.line2;
      if (stat.highlight === "years") highlight = years;
      if (stat.highlight === "students") highlight = students;
      if (stat.highlight === "outfits") highlight = outfits;
      if (stat.icon === "trust") {
        line2 = lang === "hi" ? `${sinceYear} से` : `Since ${sinceYear}`;
      }
      return { ...stat, highlight, line2 };
    });
  }, [lang, site.yearsExperience, site.studentsTaught, site.outfitsDelivered, site.foundingYear]);

  const serviceCards = useMemo(() => {
    const raw =
      Array.isArray(home.heroServiceCards) && home.heroServiceCards.length
        ? home.heroServiceCards
        : SERVICE_CARDS_FALLBACK;
    return raw.map((card) => ({
      key: card.key,
      icon: card.icon,
      image: card.image || null,
      source: card.source || `hero_service_${card.key}`,
      title: lang === "hi" && (card.titleHi || card.title_hi) ? card.titleHi || card.title_hi : card.title,
      desc: lang === "hi" && (card.descHi || card.desc_hi) ? card.descHi || card.desc_hi : card.desc,
      cta: lang === "hi" && (card.ctaHi || card.cta_hi) ? card.ctaHi || card.cta_hi : card.cta,
    }));
  }, [home.heroServiceCards, lang]);

  const featureStrip = useMemo(() => {
    const raw =
      Array.isArray(home.heroFeatureStrip) && home.heroFeatureStrip.length
        ? home.heroFeatureStrip
        : FEATURE_STRIP_FALLBACK;
    return raw.map((item) => ({
      key: item.key,
      icon: item.icon,
      title: lang === "hi" && (item.titleHi || item.title_hi) ? item.titleHi || item.title_hi : item.title,
      subtitle:
        lang === "hi" && (item.subtitleHi || item.subtitle_hi)
          ? item.subtitleHi || item.subtitle_hi
          : item.subtitle,
    }));
  }, [home.heroFeatureStrip, lang]);

  const demoThumb = home.heroDemoThumb || MEDIA.slider1Poster;
  const bookThumb = home.heroBookThumb || MEDIA.slider2Poster;
  const heroLocalVideo = home.heroLocalVideo || "/video-1.mp4";
  const heroBookLocalVideo = home.heroBookLocalVideo || "/video-2.mp4";

  const demoMsg = demoClassMessage(lang);
  const premiumCourseMsg = premiumStitchingCourseMessage(lang);
  const fashionCourseMsg =
    lang === "hi"
      ? "नमस्ते श्रेया क्रिएशन! 👋 मैं फैशन डिज़ाइनिंग कोर्स बुक करना चाहता/चाहती हूँ। कृपया विवरण भेजें।"
      : "Hi Shreya Creation! 👋 I want to BOOK the FASHION DESIGNING COURSE. Please share the details.";
  const boutiqueMasterMsg =
    lang === "hi"
      ? "नमस्ते श्रेया क्रिएशन! 👋 मैं बुटीक मास्टर कोर्स बुक करना चाहता/चाहती हूँ। कृपया विवरण भेजें।"
      : "Hi Shreya Creation! 👋 I want to BOOK the BOUTIQUE MASTER COURSE. Please share the details.";

  const openHeroInquiryForm = (source, message) => {
    openInquiryPopup({ source, message });
  };

  const serviceBookMessage = (card) => {
    if (lang === "hi") {
      return `नमस्ते श्रेया क्रिएशन! 👋 मुझे *${card.title}* बुक करना है। कृपया विवरण भेजें।`;
    }
    return `Hi Shreya Creation! 👋 I want to BOOK *${card.title}*. Please share the details.`;
  };

  const courseCtas =
    lang === "hi"
      ? [
          {
            key: "fashion",
            variant: "filled",
            icon: <GradCapIcon />,
            line1: "फैशन डिज़ाइनिंग",
            line2: "कोर्स बुक करें",
            source: "hero_fashion_course",
            message: fashionCourseMsg,
          },
          {
            key: "boutique",
            variant: "outline",
            icon: <HeroCrownIcon />,
            line1: "बुटीक मास्टर",
            line2: "कोर्स बुक करें",
            source: "hero_boutique_master",
            message: boutiqueMasterMsg,
          },
          {
            key: "premium",
            variant: "outline",
            icon: <SewingMachineIcon />,
            line1: "प्रीमियम सिलाई",
            line2: "कोर्स बुक करें",
            source: "hero_premium_stitching",
            message: premiumCourseMsg,
          },
        ]
      : [
          {
            key: "fashion",
            variant: "filled",
            icon: <GradCapIcon />,
            line1: "BOOK FASHION",
            line2: "DESIGNING COURSE",
            source: "hero_fashion_course",
            message: fashionCourseMsg,
          },
          {
            key: "boutique",
            variant: "outline",
            icon: <HeroCrownIcon />,
            line1: "BOOK BOUTIQUE",
            line2: "MASTER COURSE",
            source: "hero_boutique_master",
            message: boutiqueMasterMsg,
          },
          {
            key: "premium",
            variant: "outline",
            icon: <SewingMachineIcon />,
            line1: "BOOK PREMIUM",
            line2: "STITCHING",
            source: "hero_premium_stitching",
            message: premiumCourseMsg,
          },
        ];

  const heroContent = (
    <>
      <div className={cn(PAGE_CONTAINER, "home-hero__top", "py-16 md:py-24")}>
        <div className="home-hero__grid">
          <div className="home-hero__copy">
            <div className="home-hero__glass-panel">
              <div className="home-hero__copy-stack">
                {heroBadge ? (
                  <p className={cn(ANIM_RISE_LCP, "home-hero__badge", "home-hero__badge--boutique", "anim-delay-1")}>
                    <HeroCrownIcon />
                    <span>{heroBadge}</span>
                  </p>
                ) : null}

                <h1 className={cn(ANIM_RISE_LCP, "home-hero__title-block", "anim-delay-2")}>
                  <span className="home-hero__title-lead">{heroTitle}</span>
                  {/* Whitespace node keeps the H1 text content spaced for SEO/screen readers */}
                  {heroTitleHighlight ? (
                    <>
                      {" "}
                      <span className="home-hero__title-highlight">{heroTitleHighlight}</span>
                    </>
                  ) : null}
                </h1>

                {heroSubtitle ? (
                  <p
                    role="doc-subtitle"
                    className={cn(ANIM_RISE_LCP, "home-hero__title-sub", "anim-delay-2")}
                  >
                    {heroSubtitle}
                  </p>
                ) : null}

                <div className={cn(ANIM_RISE_LCP, "home-hero__action-row", "anim-delay-3")}>
                  {courseCtas.map((cta) => (
                    <HeroCourseCta
                      key={cta.key}
                      variant={cta.variant}
                      icon={cta.icon}
                      line1={cta.line1}
                      line2={cta.line2}
                      onClick={() => openHeroInquiryForm(cta.source, cta.message)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="home-hero__visual anim-hero-media">
            <div className="home-hero__videos">
              <HeroVideoCard
                lang={lang}
                priorityPoster
                watchLabel={lang === "hi" ? "वीडियो देखें" : "Watch Video"}
                headerLabel={lang === "hi" ? "फ्री डेमो क्लास" : "FREE DEMO CLASS"}
                footerTitle={lang === "hi" ? "फ्री डेमो क्लास बुक करें" : "BOOK FREE DEMO CLASS"}
                footerSub={lang === "hi" ? "सीखें। प्रैक्टिस करें। कमाएँ।" : "Learn. Practice. Earn."}
                footerIcon={<GradCapIcon />}
                thumb={demoThumb}
                alt={lang === "hi" ? "पटना में डेमो क्लास और फैशन ट्रेनिंग" : "fashion designing demo class in Patna"}
                videoSrc={heroLocalVideo}
                href="/contact"
                onVideoClick={() => openHeroInquiryForm("hero_demo_video", demoMsg)}
              />
              <HeroVideoCard
                lang={lang}
                offset
                watchLabel={lang === "hi" ? "वीडियो देखें" : "Watch Video"}
                headerLabel={lang === "hi" ? "बुटीक सिलाई" : "BOUTIQUE STITCHING"}
                footerTitle={
                  lang === "hi"
                    ? "पटना बिहार में बेस्ट डिज़ाइनर बुटीक"
                    : "Best Designer Boutique in Patna Bihar"
                }
                footerSub={lang === "hi" ? "24 घंटे में डिलीवर" : "Delivered in 24 Hours"}
                footerIcon={<SewingMachineIcon />}
                thumb={bookThumb}
                alt={lang === "hi" ? "पटना में ब्राइडल लहंगा सिलाई" : "bridal lehenga stitching in Patna"}
                videoSrc={heroBookLocalVideo}
                href="/contact"
                onVideoClick={() => openHeroInquiryForm("hero_book_video", premiumCourseMsg)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="home-hero__lower">
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
                  <span className="home-hero__stat-lines">
                    <span className="home-hero__stat-line">{stat.line1}</span>
                    <span className="home-hero__stat-line">{stat.line2}</span>
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="home-hero__paths" aria-label={lang === "hi" ? "हमारी सेवाएँ" : "Our services"}>
          <div className={cn(PAGE_CONTAINER, "home-hero__paths-inner")}>
            <ul className="home-hero__services-track">
              {serviceCards.map((card) => (
                <li key={card.key} className="home-hero__service-card">
                  <div
                    className={cn(
                      "home-hero__service-media",
                      card.key === "express" && "home-hero__service-media--express"
                    )}
                  >
                    {card.image ? (
                      <OptimizedImage
                        src={card.image}
                        alt={heroServiceImageAlt(card.key, lang)}
                        fill
                        quality={65}
                        sizes="(max-width: 768px) 45vw, 200px"
                        loading="lazy"
                        className="home-hero__service-img"
                        imgClassName="home-hero__service-img"
                      />
                    ) : (
                      <div className="home-hero__service-clock" aria-hidden>
                        <span className="home-hero__service-clock-face">
                          <span className="home-hero__service-clock-24">24h</span>
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="home-hero__service-body">
                    <span className="home-hero__service-icon" aria-hidden>
                      <ServiceIcon type={card.icon} />
                    </span>
                    <h2 className="home-hero__service-title">{card.title}</h2>
                    <p className="home-hero__service-desc">{card.desc}</p>
                    <button
                      type="button"
                      className="home-hero__service-cta"
                      onClick={() => openHeroInquiryForm(card.source, serviceBookMessage(card))}
                    >
                      {card.cta}
                      <CtaArrowIcon />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="home-hero__feature-strip" aria-label={lang === "hi" ? "मुख्य विशेषताएँ" : "Key features"}>
              {featureStrip.map((item) => (
                <article key={item.key} className="home-hero__feature-card">
                  <span className="home-hero__feature-icon" aria-hidden>
                    <FeatureStripIcon type={item.icon} />
                  </span>
                  <div className="home-hero__feature-copy">
                    <h3 className="home-hero__feature-title">{item.title}</h3>
                    <p className="home-hero__feature-sub">{item.subtitle}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  if (embedded) {
    return heroContent;
  }

  return (
    <section
      className={`home-hero home-hero--boutique${lang === "hi" ? " home-hero--hi" : ""}`}
      aria-label={lang === "hi" ? "मुख्य बैनर" : "Hero banner"}
    >
      <div className="home-hero__ambient" aria-hidden>
        <OptimizedImage
          src={MEDIA.background}
          alt=""
          fill
          sizes="100vw"
          priority
          fetchPriority="high"
          quality={65}
          className="home-hero__bg-image"
          imgClassName="home-hero__bg-image"
        />
        <span className="home-hero__bg-overlay" />
      </div>
      {heroContent}
    </section>
  );
}
