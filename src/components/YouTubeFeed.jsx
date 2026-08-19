"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { PAGE_CONTAINER, REVEAL, SECTION_EYEBROW, SECTION_TITLE } from "@/lib/ui";
import {
  DEFAULT_SOCIALS,
  DEFAULT_YOUTUBE_HANDLE,
} from "@/lib/site-config";
import { BRAND_NAME, LOGO_SRC } from "@/lib/brand";
import { youtubeHandleFromUrl } from "@/lib/youtube";
import SocialProfileEmbed from "@/components/SocialProfileEmbed";

export default function YouTubeFeed({
  channelUrl = DEFAULT_SOCIALS.youtube,
  lang = "en",
  compact = false,
}) {
  const profileUrl = channelUrl || DEFAULT_SOCIALS.youtube;
  const handle = youtubeHandleFromUrl(profileUrl, DEFAULT_YOUTUBE_HANDLE);
  const [displayName, setDisplayName] = useState(BRAND_NAME);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const hi = lang === "hi";

  useEffect(() => {
    let cancelled = false;
    fetch("/api/social/youtube")
      .then((res) => (res.ok ? res.json() : { name: "", videos: [] }))
      .then((data) => {
        if (cancelled) return;
        if (data.name) setDisplayName(data.name);
        setItems(data.videos || []);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const titleClass = compact
    ? "font-display font-bold text-xl tracking-tight text-ink mt-1"
    : cn(SECTION_TITLE, "mt-2");
  const stats = items.length
    ? hi
      ? `${items.length} वीडियो`
      : `${items.length} videos`
    : hi
      ? "YouTube चैनल"
      : "YouTube channel";

  return (
    <section
      className={cn(
        "youtube-feed",
        compact ? "social-feed-card" : cn(PAGE_CONTAINER, "py-10", "sm:py-14", "relative", "z-20")
      )}
      aria-label={hi ? "YouTube फ़ीड" : "YouTube feed"}
    >
      <div className={cn(REVEAL, "text-center", compact ? "mb-3" : "mb-6 sm:mb-8")}>
        <span className={SECTION_EYEBROW}>YouTube</span>
        <h2 className={titleClass}>@{handle}</h2>
        {!compact && (
          <p className="text-sm text-muted mt-2 max-w-lg mx-auto">
            {hi
              ? "क्लास, ब्राइडल लुक और स्टूडियो वीडियो — हमेशा ताज़ा।"
              : "Classes, bridal looks and studio videos from our channel — always up to date."}
          </p>
        )}
      </div>

      <div className="youtube-feed__frame">
        <SocialProfileEmbed
          platform="youtube"
          handle={handle}
          displayName={displayName}
          stats={stats}
          profileUrl={profileUrl}
          avatarSrc={LOGO_SRC}
          items={items}
          loading={loading}
        />
      </div>

      <p className="text-center mt-3">
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange text-sm font-semibold hover:underline"
        >
          {hi ? "YouTube पर सब्सक्राइब करें" : "Subscribe on YouTube"} →
        </a>
      </p>
    </section>
  );
}
