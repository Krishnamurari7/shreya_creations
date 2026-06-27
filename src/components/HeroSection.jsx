"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { waLink, greetingMessage } from "@/lib/whatsapp";
import { pickPage } from "@/lib/cms";
import { openInquiryPopup } from "@/lib/inquiryPopup";

const HERO_STATS_EN = [
  { icon: "clients", highlight: "30K+", label: "Happy clients served!" },
  { icon: "courses", highlight: "50+", label: "Courses, Products & Books" },
  { icon: "delivered", highlight: "Delivered", label: "Thousands of successful designers" },
  { icon: "training", highlight: "100%", label: "Practical Training" },
  { icon: "placement", highlight: "100%", label: "Placement Assistance since 2018" },
];

const HERO_STATS_HI = [
  { icon: "clients", highlight: "30K+", label: "खुश ग्राहक!" },
  { icon: "courses", highlight: "50+", label: "कोर्स, प्रोडक्ट और बुक्स" },
  { icon: "delivered", highlight: "डिलीवर", label: "हज़ारों सफल डिज़ाइनर" },
  { icon: "training", highlight: "100%", label: "प्रैक्टिकल ट्रेनिंग" },
  { icon: "placement", highlight: "100%", label: "2018 से प्लेसमेंट सहायता" },
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

function HeroAutoplayVideo({ src, alt, preview = false }) {
  const videoRef = useRef(null);

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

  return (
    <video
      ref={videoRef}
      className={`home-hero__video-media${preview ? " home-hero__video-media--preview" : ""}`}
      src={src}
      autoPlay
      loop={preview}
      muted={preview}
      playsInline
      preload="auto"
      aria-hidden={preview}
      aria-label={preview ? undefined : alt}
    />
  );
}

function HeroVideoCard({
  headerIcon,
  headerLabel,
  thumb,
  alt,
  href,
  videoSrc,
  onVideoClick,
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
      <div className="home-hero__video-body">
        {videoSrc ? (
          <>
            <HeroAutoplayVideo src={videoSrc} alt={alt} preview />
            <div className="home-hero__video-overlay home-hero__video-overlay--tap" aria-hidden>
              <span className="home-hero__video-play">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </div>
          </>
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
    </div>
  );

  const cardClass = ["home-hero__video-card", isLive ? "home-hero__video-card--live" : ""]
    .filter(Boolean)
    .join(" ");

  if (isLive) {
    return (
      <button
        type="button"
        className={cardClass}
        onClick={onVideoClick}
        aria-label={alt}
      >
        {inner}
      </button>
    );
  }

  return (
    <Link href={href} className={cardClass} aria-label={alt}>
      {inner}
    </Link>
  );
}

export default function HeroSection({ home = {}, lang = "en", whatsapp }) {
  const heroBadge =
    pickPage(home, lang, "heroBoutiqueBadge", "heroBoutiqueBadgeHi") ||
    pickPage(home, lang, "heroBadge", "heroBadgeHi") ||
    (lang === "hi" ? "बिहार का नं. 1 फैशन बुटीक इंस्टिट्यूट" : "Bihar No 1 Fashion Boutique Institute");

  const heroTitle =
    pickPage(home, lang, "heroBoutiqueTitle", "heroBoutiqueTitleHi") ||
    pickPage(home, lang, "heroTitleLine1", "heroTitleLine1Hi") ||
    (lang === "hi" ? "कौशल जो आय पैदा करे" : "Skill That Create Income");

  const heroTitleHighlight =
    pickPage(home, lang, "heroBoutiqueTitleHighlight", "heroBoutiqueTitleHighlightHi") || "";

  const { main: heroTitleMain, highlight: heroTitleAccent } = heroTitleHighlight
    ? { main: heroTitle, highlight: heroTitleHighlight }
    : splitHeroTitle(heroTitle, lang);

  const heroKeywords =
    pickPage(home, lang, "heroBoutiqueKeywords", "heroBoutiqueKeywordsHi") ||
    pickPage(home, lang, "heroSubtitle", "heroSubtitleHi") ||
    (lang === "hi" ? "नौकरी • बुटीक • इंस्टिट्यूट" : "Job • Boutique • Institute");

  const careerBanner =
    pickPage(home, lang, "heroBoutiqueCta", "heroBoutiqueCtaHi") ||
    pickPage(home, lang, "heroCtaLabel", "heroCtaLabelHi") ||
    (lang === "hi" ? "आपका करियर यहीं से शुरू" : "Your career start here");

  const waChat = waLink(whatsapp, greetingMessage());

  const stats = useMemo(() => (lang === "hi" ? HERO_STATS_HI : HERO_STATS_EN), [lang]);
  const keywordPills = useMemo(() => parseKeywordPills(heroKeywords), [heroKeywords]);

  const actionLinks = useMemo(
    () => [
      {
        href: "/courses",
        tone: "courses",
        lines:
          lang === "hi" ? ["हमारे कोर्स", "जॉइन करें"] : ["Join Our", "Courses"],
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="M12 3 2 8l10 5 10-5-10-5z" />
            <path d="M6 10.5V16l6 3 6-3v-5.5" />
          </svg>
        ),
      },
      {
        href: "/shop",
        tone: "stitch",
        lines: lang === "hi" ? ["सिलाई", "बुक करें"] : ["Book", "Stitching"],
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="M12 7v14" />
            <path d="M5.5 5.5A7 7 0 0 1 12 5a7 7 0 0 1 6.5 4.5" />
            <path d="M5.5 5.5V19.5" />
          </svg>
        ),
      },
      {
        href: waChat,
        external: true,
        tone: "whatsapp",
        lines: lang === "hi" ? ["WhatsApp", "अभी"] : ["WhatsApp", "Now"],
        icon: (
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        ),
      },
    ],
    [lang, waChat]
  );

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
        <span className="home-hero__glow home-hero__glow--warm" />
        <span className="home-hero__glow home-hero__glow--gold" />
      </div>

      <div className="page-container home-hero__top">
        <div className="home-hero__grid">
          <div className="home-hero__copy">
            <div className="home-hero__copy-stack">
              <span className="home-hero__badge home-hero__badge--boutique anim-rise anim-delay-1">
                <span className="home-hero__badge-gem" aria-hidden>✦</span>
                {heroBadge}
              </span>

              <h1 className="home-hero__title-block anim-rise anim-delay-2">
                <span className="home-hero__serif-title">{heroTitleMain || heroTitle}</span>
                {heroTitleAccent ? (
                  <span className="home-hero__title-highlight">{heroTitleAccent}</span>
                ) : null}
              </h1>

              {keywordPills.length > 0 ? (
                <ul className="home-hero__keyword-pills anim-rise anim-delay-3">
                  {keywordPills.map((pill, i) => (
                    <li key={pill} className="home-hero__keyword-pill">
                      {i > 0 && <span className="home-hero__keyword-dot" aria-hidden>•</span>}
                      <span>{pill}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="home-hero__keywords anim-rise anim-delay-3">{heroKeywords}</p>
              )}

              <div className="home-hero__cta-stack anim-rise anim-delay-4">
                <div className="home-hero__career-box">
                  <span className="home-hero__career-box-text">{careerBanner}</span>
                  <span className="home-hero__career-box-arrow" aria-hidden>→</span>
                </div>

                <div className="home-hero__quick-actions">
                  {actionLinks.map((item) => {
                    const label = (
                      <span className="home-hero__quick-btn-label">
                        {item.lines.map((line) => (
                          <span key={line} className="home-hero__quick-btn-line">
                            {line}
                          </span>
                        ))}
                      </span>
                    );
                    const content = (
                      <>
                        <span className="home-hero__quick-btn-icon">{item.icon}</span>
                        {label}
                      </>
                    );

                    const btnClass = `home-hero__quick-btn home-hero__quick-btn--${item.tone}`;

                    return item.external ? (
                      <a
                        key={item.lines.join("-")}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={btnClass}
                      >
                        {content}
                      </a>
                    ) : (
                      <Link key={item.lines.join("-")} href={item.href} className={btnClass}>
                        {content}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="home-hero__visual anim-hero-media">
            <div className="home-hero__videos">
            <HeroVideoCard
              headerIcon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              }
              headerLabel={lang === "hi" ? "फ्री ऑफलाइन डेमो क्लास" : "FREE OFFLINE DEMO CLASS"}
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
              headerIcon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              }
              headerLabel={lang === "hi" ? "अभी बुक करें" : "BOOK NOW"}
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
