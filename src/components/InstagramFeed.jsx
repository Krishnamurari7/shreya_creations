"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { PAGE_CONTAINER, REVEAL, SECTION_EYEBROW, SECTION_TITLE } from "@/lib/ui";
import { DEFAULT_SOCIALS } from "@/lib/site-config";

const INSTAGRAM_EMBED_BASE = "https://www.instagram.com";

export default function InstagramFeed({ handle = "shreya.creationss", lang = "en", compact = false }) {
  const cleanHandle = String(handle || "shreya.creationss").replace(/^@/, "");
  const profileUrl = DEFAULT_SOCIALS.instagram || `${INSTAGRAM_EMBED_BASE}/${cleanHandle}/`;
  const embedSrc = `${INSTAGRAM_EMBED_BASE}/${cleanHandle}/embed`;
  const rootRef = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node || active) return undefined;

    if (typeof IntersectionObserver === "undefined") {
      setActive(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [active]);

  const hi = lang === "hi";

  return (
    <section
      ref={rootRef}
      className={cn(
        "instagram-feed",
        compact ? "social-feed-card" : cn(PAGE_CONTAINER, "py-10", "sm:py-14", "relative", "z-20")
      )}
      aria-label={hi ? "Instagram फ़ीड" : "Instagram feed"}
    >
      <div className={cn(REVEAL, "text-center", compact ? "mb-3" : "mb-6 sm:mb-8")}>
        <span className={SECTION_EYEBROW}>Instagram</span>
        <h2
          className={
            compact
              ? "font-display font-bold text-xl tracking-tight text-ink mt-1"
              : cn(SECTION_TITLE, "mt-2")
          }
        >
          @{cleanHandle}
        </h2>
        {!compact && (
          <p className="text-sm text-muted mt-2 max-w-lg mx-auto">
            {hi
              ? "स्टूडियो से ताज़ा रील्स और ब्राइडल फिटिंग — बिना साइट अपडेट किए।"
              : "Fresh reels and bridal fittings from our studio — always up to date."}
          </p>
        )}
      </div>

      <div className="instagram-feed__frame">
        {active ? (
          <iframe
            src={embedSrc}
            title={`Instagram @${cleanHandle}`}
            loading="lazy"
            className="instagram-feed__iframe"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="instagram-feed__placeholder" aria-hidden>
            <span className="instagram-feed__placeholder-icon">📷</span>
            <span>{hi ? "Instagram लोड हो रहा है…" : "Loading Instagram…"}</span>
          </div>
        )}
      </div>

      <p className="text-center mt-4">
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange text-sm font-semibold hover:underline"
        >
          {hi ? "Instagram पर फ़ॉलो करें" : "Follow on Instagram"} →
        </a>
      </p>
    </section>
  );
}
