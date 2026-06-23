"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Glass3DCard, Float3D } from "@/components/Glass3DCard";
import { useLanguage } from "@/components/LanguageProvider";
import { pickPage } from "@/lib/cms";
import { withYoutubeEmbedParams, youtubeIframeCommand, youtubeVideoId } from "@/lib/youtube";

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

  return (
    <section id="video-showcase" className="video-showcase-section page-section relative overflow-hidden">
      <div className="pointer-events-none absolute top-16 left-[8%] h-48 w-48 rounded-full bg-orange/8 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute bottom-10 right-[6%] h-56 w-56 rounded-full bg-orange/6 blur-3xl" aria-hidden />
      <span className="pointer-events-none absolute top-24 right-[18%] text-gold text-sm sparkle-pulse hidden sm:block" aria-hidden>
        ✦
      </span>
      <span
        className="pointer-events-none absolute bottom-28 left-[14%] text-orange text-xs sparkle-pulse hidden sm:block [animation-delay:-1.2s]"
        aria-hidden
      >
        ✦
      </span>

      <div className="page-container relative z-10 max-w-6xl">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center min-w-0 w-full">
          <div className="lg:col-span-5 text-center lg:text-left reveal reveal-left min-w-0">
            {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
            {title && (
              <h2 className="section-title mt-2 leading-tight text-balance">
                {title}
                {highlight && (
                  <>
                    {" "}
                    <span className="highlight-shimmer">{highlight}</span>
                  </>
                )}
              </h2>
            )}
            {subtitle && (
              <p className="mt-4 text-muted font-normal text-sm sm:text-base leading-relaxed max-w-md mx-auto lg:mx-0 text-pretty">
                {subtitle}
              </p>
            )}
            {(eyebrow || title) && (
              <div className="section-ornament mt-5 sm:mt-6 lg:mx-0 mx-auto" aria-hidden>
                <span className="text-gold text-xs">✦</span>
              </div>
            )}

            <ul className="mt-8 space-y-3 max-w-sm mx-auto lg:mx-0">
              {perks.map((perk, i) => (
                <li
                  key={perk}
                  className="flex items-center gap-3 rounded-xl border border-ink/10 bg-cream/60 px-4 py-3 text-sm text-ink backdrop-blur-sm"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <span
                    className={`grid place-items-center h-8 w-8 shrink-0 rounded-lg text-xs font-display font-semibold ${
                      i % 2 === 0 ? "bg-orange/10 text-orange" : "bg-orange/10 text-orange"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-medium">{perk}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7 reveal reveal-right min-w-0 w-full">
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
    </section>
  );
}
