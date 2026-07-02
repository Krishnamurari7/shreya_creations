"use client";

import { HIGHLIGHT_SHIMMER, HOME_BAND_BRAND, PAGE_CONTAINER, PAGE_SECTION, REVEAL, REVEAL_LEFT, REVEAL_RIGHT, SECTION_EYEBROW, SECTION_HEADER_GLASS, SECTION_LEAD, SECTION_ORNAMENT, SECTION_TITLE, SPARKLE_PULSE } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState, useMemo } from "react";
import { Glass3DCard, Float3D } from "@/components/Glass3DCard";
import { useLanguage } from "@/components/LanguageProvider";
import { pickPage } from "@/lib/cms";
import { withYoutubeEmbedParams, youtubeIframeCommand, youtubeVideoId } from "@/lib/youtube";

const PERK_ICONS = [
  (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 0a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0 0L14.121 14.121m0 0a3 3 0 105.657 5.657 3 3 0 00-5.657-5.657z" />
    </svg>
  ),
  (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
];

function VideoPlayer({ embedUrl, title }) {
  const containerRef = useRef(null);
  const iframeRef = useRef(null);
  const [iframeSrc, setIframeSrc] = useState("");
  const [isActive, setIsActive] = useState(false);
  const mountedRef = useRef(false);
  const inViewRef = useRef(false);

  const videoId = youtubeVideoId(embedUrl);
  const thumbUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "";

  useEffect(() => {
    mountedRef.current = false;
    setIframeSrc("");
    setIsActive(false);
  }, [embedUrl]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !embedUrl) return undefined;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setIframeSrc(withYoutubeEmbedParams(embedUrl));
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
        setIsActive(entry.isIntersecting);

        if (entry.isIntersecting) {
          if (!mountedRef.current) {
            mountedRef.current = true;
            setIframeSrc(withYoutubeEmbedParams(embedUrl, { autoplay: true }));
            return;
          }
          youtubeIframeCommand(iframeRef.current, "playVideo");
          return;
        }

        if (mountedRef.current) {
          youtubeIframeCommand(iframeRef.current, "pauseVideo");
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -6% 0px" }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [embedUrl]);

  const handleLoad = () => {
    if (inViewRef.current) {
      youtubeIframeCommand(iframeRef.current, "playVideo");
    }
  };

  return (
    <div ref={containerRef} className="video-showcase-player relative h-full w-full">
      <span
        className={`video-showcase-live ${isActive && iframeSrc ? "video-showcase-live--on" : "video-showcase-live--idle"}`}
      >
        <span className="video-showcase-live__dot" />
        {isActive && iframeSrc ? "Now playing" : "Scroll to play"}
      </span>

      {iframeSrc ? (
        <iframe
          ref={iframeRef}
          src={iframeSrc}
          title={title}
          onLoad={handleLoad}
          className="video-showcase-iframe"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <div className="video-showcase-placeholder">
          {thumbUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumbUrl} alt="" className="video-showcase-placeholder__thumb" />
          )}
          <div className="video-showcase-placeholder__veil" aria-hidden />
          <div className="video-showcase-play" aria-hidden>
            <span className="video-showcase-play__ring" />
            <span className="video-showcase-play__btn">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 sm:h-6 sm:w-6 ml-0.5">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VideoShowcase({ home, embedUrl }) {
  const { lang } = useLanguage();

  const eyebrow = pickPage(home, lang, "videoEyebrow", "videoEyebrowHi");
  const title = pickPage(home, lang, "videoTitle", "videoTitleHi");
  const highlight = pickPage(home, lang, "videoTitleHighlight", "videoTitleHighlightHi");
  const subtitle = pickPage(home, lang, "videoSubtitle", "videoSubtitleHi");
  const videoTitle = title || "Studio Video";

  const perks = useMemo(() => {
    const fromCms = (home.videoPerks || [])
      .map((p) => (lang === "hi" && (p.text_hi || p.textHi) ? p.text_hi || p.textHi : p.text))
      .filter(Boolean);
    if (fromCms.length) return fromCms;
    return lang === "hi"
      ? ["स्टूडियो टूर", "लाइव सिलाई डेमो", "मेंटर से मिलें"]
      : ["Studio tour", "Live stitching demo", "Meet the mentors"];
  }, [home.videoPerks, lang]);

  const studioBadge =
    lang === "hi" ? "पटना, बिहार" : "Patna, Bihar";

  return (
    <section id="video-showcase" className={cn(HOME_BAND_BRAND, PAGE_SECTION, "video-showcase-section", "relative", "overflow-hidden")}>
      <div className="video-showcase-section__bg" aria-hidden />
      <div className="video-showcase-section__pattern" aria-hidden />
      <div className="pointer-events-none absolute top-16 left-[8%] h-48 w-48 rounded-full bg-white/10 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute bottom-10 right-[6%] h-56 w-56 rounded-full bg-black/10 blur-3xl" aria-hidden />
      <span className={cn(SPARKLE_PULSE, "pointer-events-none", "absolute", "top-24", "right-[18%]", "text-gold", "text-sm", "hidden", "sm:block")} aria-hidden>
        ✦
      </span>
      <span
        className={cn(SPARKLE_PULSE, "pointer-events-none", "absolute", "bottom-28", "left-[14%]", "text-gold", "text-xs", "hidden", "sm:block", "[animation-delay:-1.2s]")}
        aria-hidden
      >
        ✦
      </span>

      <div className={cn(PAGE_CONTAINER, "relative", "z-10", "max-w-6xl")}>
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-center min-w-0 w-full">
          <div className={cn(REVEAL, REVEAL_LEFT, "lg:col-span-5", "text-center", "lg:text-left", "min-w-0")}>
            <div className={cn("video-showcase-panel", SECTION_HEADER_GLASS)}>
              {eyebrow && (
                <span className={SECTION_EYEBROW}>
                  <span className={cn(SPARKLE_PULSE, "text-gold", "text-[10px]")} aria-hidden>
                    ✦
                  </span>
                  {eyebrow}
                </span>
              )}
              {title && (
                <h2 className={cn(SECTION_TITLE, "mt-3", "leading-tight", "text-balance")}>
                  {title}
                  {highlight && (
                    <>
                      {" "}
                      <span className={HIGHLIGHT_SHIMMER}>{highlight}</span>
                    </>
                  )}
                </h2>
              )}
              {subtitle && (
                <p className={cn(SECTION_LEAD, "mt-4", "max-w-md", "mx-auto", "lg:mx-0")}>
                  {subtitle}
                </p>
              )}
              {(eyebrow || title) && (
                <div className={cn(SECTION_ORNAMENT, "mt-4", "sm:mt-5", "lg:mx-0", "mx-auto")} aria-hidden>
                  <span className="text-gold text-xs">✦</span>
                </div>
              )}

              <ul className="video-showcase-perks mt-6 sm:mt-7 space-y-2.5 max-w-sm mx-auto lg:mx-0" data-stagger>
                {perks.map((perk, i) => (
                  <li
                    key={perk}
                    className="video-showcase-perk group/perk flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm backdrop-blur-sm"
                    style={{ transitionDelay: `${i * 90}ms` }}
                  >
                    <span className="video-showcase-perk__icon grid place-items-center h-9 w-9 shrink-0 rounded-lg">
                      {PERK_ICONS[i % PERK_ICONS.length]}
                    </span>
                    <span className="flex-1 min-w-0 text-left">
                      <span className="video-showcase-perk__label block font-medium leading-snug">{perk}</span>
                    </span>
                    <span className="video-showcase-perk__num grid place-items-center h-7 w-7 shrink-0 rounded-md text-[0.65rem] font-display font-semibold tracking-wide">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={cn(REVEAL, REVEAL_RIGHT, "lg:col-span-7", "min-w-0", "w-full")}>
            <div className="video-showcase-video-wrap">
              <span className="video-showcase-studio-badge" aria-hidden>
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3 shrink-0 opacity-90" aria-hidden>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                </svg>
                {studioBadge}
              </span>
              <Glass3DCard
                layered
                glow
                className="video-showcase-card group rounded-2xl sm:rounded-[1.75rem] p-2 sm:p-3 overflow-hidden"
              >
                <span className="video-showcase-card__accent" aria-hidden />
                <Float3D translateZ="60" className="relative z-[2]">
                  <div className="video-showcase-frame">
                    <VideoPlayer embedUrl={embedUrl} title={videoTitle} />
                  </div>
                </Float3D>
              </Glass3DCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
