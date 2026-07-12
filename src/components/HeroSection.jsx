"use client";

import { ANIM_RISE, PAGE_CONTAINER } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { pickPage } from "@/lib/cms";
import { openInquiryPopup } from "@/lib/inquiryPopup";
import {
  demoClassMessage,
  greetingMessage,
  premiumStitchingCourseMessage,
  stitchOrderMessage,
  telLink,
  waLink,
} from "@/lib/whatsapp";

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

function PathIcon({ type }) {
  const props = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.75",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  switch (type) {
    case "courses":
      return (
        <svg {...props}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      );
    case "stitching":
      return (
        <svg {...props}>
          <path d="M12 3 8 7v14h8V7l-4-4z" />
          <path d="M8 7h8" />
          <path d="M10 12h4M10 16h4" />
        </svg>
      );
    case "institute":
      return (
        <svg {...props}>
          <path d="M3 21h18" />
          <path d="M5 21V10l7-5 7 5v11" />
          <path d="M9 21v-6h6v6" />
          <path d="M9 13h.01M12 13h.01M15 13h.01" />
        </svg>
      );
    case "gallery":
      return (
        <svg {...props}>
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      );
    case "testimonials":
      return (
        <svg {...props}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <path d="m10.5 9.5 1.2 2.4 2.6.4-1.9 1.9.5 2.6-2.4-1.3-2.4 1.3.5-2.6-1.9-1.9 2.6-.4z" />
        </svg>
      );
    default:
      return null;
  }
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 6.045L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

const PATH_CARDS_EN = [
  {
    key: "courses",
    icon: "courses",
    title: "COURSES",
    desc: "Explore All Our Courses",
    cta: "EXPLORE COURSES",
    href: "/courses",
  },
  {
    key: "stitching",
    icon: "stitching",
    title: "BOUTIQUE STITCHING",
    desc: "24 Hours Custom Stitching",
    cta: "BOOK ORDER",
    href: "wa:stitch",
  },
  {
    key: "institute",
    icon: "institute",
    title: "INSTITUTE",
    desc: "About Our Institute & Facilities",
    cta: "KNOW MORE",
    href: "/about",
  },
  {
    key: "gallery",
    icon: "gallery",
    title: "GALLERY",
    desc: "Our Creations & Projects",
    cta: "VIEW GALLERY",
    href: "/portfolio",
  },
  {
    key: "testimonials",
    icon: "testimonials",
    title: "TESTIMONIALS",
    desc: "Student & Client Reviews",
    cta: "READ REVIEWS",
    href: "#testimonials",
  },
];

const PATH_CARDS_HI = [
  {
    key: "courses",
    icon: "courses",
    title: "कोर्स",
    desc: "हमारे सभी कोर्स देखें",
    cta: "कोर्स देखें",
    href: "/courses",
  },
  {
    key: "stitching",
    icon: "stitching",
    title: "बुटीक सिलाई",
    desc: "24 घंटे में कस्टम सिलाई",
    cta: "ऑर्डर बुक करें",
    href: "wa:stitch",
  },
  {
    key: "institute",
    icon: "institute",
    title: "इंस्टिट्यूट",
    desc: "हमारा संस्थान और सुविधाएँ",
    cta: "और जानें",
    href: "/about",
  },
  {
    key: "gallery",
    icon: "gallery",
    title: "गैलरी",
    desc: "हमारे क्रिएशन और प्रोजेक्ट",
    cta: "गैलरी देखें",
    href: "/portfolio",
  },
  {
    key: "testimonials",
    icon: "testimonials",
    title: "प्रशंसापत्र",
    desc: "छात्र और क्लाइंट रिव्यू",
    cta: "रिव्यू पढ़ें",
    href: "#testimonials",
  },
];

function HeroActionCard({ variant = "demo", icon, title, subtitle, href, onClick, external = false }) {
  const className = cn("home-hero__action-card", `home-hero__action-card--${variant}`);

  const inner = (
    <>
      <span className="home-hero__action-icon" aria-hidden>
        {icon}
      </span>
      <span className="home-hero__action-copy">
        <span className="home-hero__action-title">{title}</span>
        <span className="home-hero__action-sub">
          {subtitle}
          <span className="home-hero__action-arrow" aria-hidden>
            <CtaArrowIcon />
          </span>
        </span>
      </span>
    </>
  );

  if (onClick) {
    return (
      <button type="button" className={className} onClick={onClick}>
        {inner}
      </button>
    );
  }

  if (external) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {inner}
    </Link>
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

export default function HeroSection({ home = {}, lang = "en", phone = "", whatsapp = "" }) {
  const heroBadge =
    pickPage(home, lang, "heroBoutiqueBadge", "heroBoutiqueBadgeHi") ||
    pickPage(home, lang, "heroBadge", "heroBadgeHi") ||
    (lang === "hi"
      ? "बिहार का नं. 1 फैशन बुटीक इंस्टिट्यूट"
      : "Bihar's No. 1 Fashion Boutique Institute");

  const heroTitle =
    pickPage(home, lang, "heroBoutiqueTitle", "heroBoutiqueTitleHi") ||
    pickPage(home, lang, "heroTitleLine1", "heroTitleLine1Hi") ||
    (lang === "hi" ? "हुनर जो" : "Skill That");

  const heroTitleHighlight =
    pickPage(home, lang, "heroBoutiqueTitleHighlight", "heroBoutiqueTitleHighlightHi") ||
    (lang === "hi" ? "कमाई बनाए" : "Creates Income");

  const heroSubtitle =
    pickPage(home, lang, "heroBoutiqueSubtitle", "heroBoutiqueSubtitleHi") ||
    (lang === "hi"
      ? "सिलाई और फैशन डिज़ाइन सीखें — नौकरी पाएं या अपना बुटीक शुरू करें"
      : "Learn stitching & fashion design – get job-ready or start your own boutique");

  const stats = useMemo(() => (lang === "hi" ? HERO_STATS_HI : HERO_STATS_EN), [lang]);
  const pathCards = useMemo(() => (lang === "hi" ? PATH_CARDS_HI : PATH_CARDS_EN), [lang]);

  const demoThumb = home.heroDemoThumb || "/slider1.png";
  const bookThumb = home.heroBookThumb || "/slider2.png";
  const heroLocalVideo = home.heroLocalVideo || "/video%201.mp4";
  const heroBookLocalVideo = home.heroBookLocalVideo || "/video%202.mp4";

  const displayPhone = useMemo(() => {
    const raw = (phone || "91175 55125").trim();
    const first = raw.split(/\s*[/|,]\s*/)[0].trim();
    return first.replace(/^\+91\s*/, "");
  }, [phone]);
  const phoneHref = telLink(phone) || "tel:+919117555125";
  const chatWaHref = waLink(whatsapp || null, greetingMessage(lang));
  const stitchWaHref = waLink(whatsapp || null, stitchOrderMessage(lang));
  const demoMsg = demoClassMessage(lang);
  const premiumCourseMsg = premiumStitchingCourseMessage(lang);

  const openHeroInquiryForm = (source, message) => {
    openInquiryPopup({ source, message });
  };

  const resolvePathHref = (href) => {
    if (href === "wa:stitch") return stitchWaHref;
    return href;
  };

  return (
    <section
      className={`home-hero home-hero--boutique${lang === "hi" ? " home-hero--hi" : ""}`}
      aria-label={lang === "hi" ? "मुख्य बैनर" : "Hero banner"}
    >
      <div className="home-hero__ambient" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/background.png"
          alt=""
          className="home-hero__bg-image"
          width={1920}
          height={1080}
          decoding="async"
          fetchPriority="high"
        />
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
                  <span className="home-hero__title-lead">{heroTitle}</span>
                  {heroTitleHighlight ? (
                    <span className="home-hero__title-highlight">{heroTitleHighlight}</span>
                  ) : null}
                </h1>

                {heroSubtitle ? (
                  <p className={cn(ANIM_RISE, "home-hero__title-sub", "anim-delay-2")}>{heroSubtitle}</p>
                ) : null}

                <div className={cn(ANIM_RISE, "home-hero__action-row", "anim-delay-3")}>
                  <HeroActionCard
                    variant="demo"
                    icon={<GradCapIcon />}
                    title={lang === "hi" ? "फ्री डेमो क्लास" : "FREE DEMO CLASS"}
                    subtitle={lang === "hi" ? "अभी सीट बुक करें" : "Book Your Spot Now"}
                    onClick={() => openHeroInquiryForm("hero_demo_cta", demoMsg)}
                  />
                  <HeroActionCard
                    variant="stitch"
                    icon={<SewingMachineIcon />}
                    title="मात्र 24 घंटे में सिले कपड़े"
                    subtitle={lang === "hi" ? "कस्टम सिलाई ऑर्डर" : "Custom Stitching Order"}
                    href={stitchWaHref}
                    external
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="home-hero__visual anim-hero-media">
            <div className="home-hero__videos">
              <HeroVideoCard
                lang={lang}
                watchLabel={lang === "hi" ? "वीडियो देखें" : "Watch Video"}
                headerLabel={lang === "hi" ? "फ्री डेमो क्लास" : "FREE DEMO CLASS"}
                footerTitle={lang === "hi" ? "फ्री डेमो क्लास बुक करें" : "BOOK FREE DEMO CLASS"}
                footerSub={lang === "hi" ? "सीखें। प्रैक्टिस करें। कमाएँ।" : "Learn. Practice. Earn."}
                footerIcon={<GradCapIcon />}
                thumb={demoThumb}
                alt={lang === "hi" ? "डेमो क्लास वीडियो" : "Demo class video"}
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
                  lang === "hi" ? "प्रीमियम सिलाई कोर्स बुक करें" : "BOOK PREMIUM STITCHING COURSE"
                }
                footerSub={lang === "hi" ? "24 घंटे में डिलीवर" : "Delivered in 24 Hours"}
                footerIcon={<SewingMachineIcon />}
                thumb={bookThumb}
                alt={lang === "hi" ? "बुटीक सिलाई वीडियो" : "Boutique stitching video"}
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
                  <span className="home-hero__stat-line">{stat.label}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="home-hero__paths" aria-label={lang === "hi" ? "अपना रास्ता चुनें" : "Choose your path"}>
          <div className={cn(PAGE_CONTAINER, "home-hero__paths-inner")}>
            <h2 className="home-hero__paths-title">
              <span className="home-hero__paths-rule" aria-hidden />
              {lang === "hi" ? "अपना रास्ता चुनें" : "CHOOSE YOUR PATH"}
              <span className="home-hero__paths-rule" aria-hidden />
            </h2>

            <div className="home-hero__paths-grid">
              {pathCards.map((card) => {
                const href = resolvePathHref(card.href);
                const external = href.startsWith("http") || href.startsWith("https://wa.me");
                const content = (
                  <>
                    <span className="home-hero__path-head">
                      <span className="home-hero__path-icon" aria-hidden>
                        <PathIcon type={card.icon} />
                      </span>
                      <span className="home-hero__path-copy">
                        <span className="home-hero__path-title">{card.title}</span>
                        <span className="home-hero__path-desc">{card.desc}</span>
                      </span>
                    </span>
                    <span className="home-hero__path-cta">
                      {card.cta}
                      <CtaArrowIcon />
                    </span>
                  </>
                );

                if (external) {
                  return (
                    <a
                      key={card.key}
                      href={href}
                      className="home-hero__path-card"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {content}
                    </a>
                  );
                }

                return (
                  <Link key={card.key} href={href} className="home-hero__path-card">
                    {content}
                  </Link>
                );
              })}
            </div>

            <div className="home-hero__journey-bar">
              <a href={phoneHref} className="home-hero__journey-contact">
                <span className="home-hero__journey-contact-icon" aria-hidden>
                  <PhoneIcon />
                </span>
                <span className="home-hero__journey-contact-copy">
                  <span className="home-hero__journey-contact-label">
                    {lang === "hi" ? "अभी कॉल करें" : "Call Now"}
                  </span>
                  <span className="home-hero__journey-contact-value">{displayPhone}</span>
                </span>
              </a>

              <span className="home-hero__journey-divider" aria-hidden />

              <a
                href={chatWaHref}
                className="home-hero__journey-contact"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="home-hero__journey-contact-icon home-hero__journey-contact-icon--wa" aria-hidden>
                  <WhatsAppIcon />
                </span>
                <span className="home-hero__journey-contact-copy">
                  <span className="home-hero__journey-contact-label">WhatsApp</span>
                  <span className="home-hero__journey-contact-value">
                    {lang === "hi" ? "अभी चैट करें" : "Chat Now"}
                  </span>
                </span>
              </a>

              <span className="home-hero__journey-divider home-hero__journey-divider--desktop" aria-hidden />

              <div className="home-hero__journey-message">
                <p className="home-hero__journey-headline">
                  {lang === "hi" ? "आज ही अपनी यात्रा शुरू करें!" : "Start Your Journey Today!"}
                </p>
                <p className="home-hero__journey-sub">
                  {lang === "hi"
                    ? "सीखें। प्रैक्टिस करें। कमाएँ। आत्मनिर्भर बनें।"
                    : "Learn. Practice. Earn. Become Independent."}
                </p>
              </div>

              <button
                type="button"
                className="home-hero__journey-cta"
                onClick={() => openHeroInquiryForm("hero_journey_demo", demoMsg)}
              >
                {lang === "hi" ? "फ्री डेमो क्लास बुक करें" : "BOOK FREE DEMO CLASS"}
                <span className="home-hero__journey-cta-arrow" aria-hidden>
                  <CtaArrowIcon />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
