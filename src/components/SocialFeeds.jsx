"use client";

import { cn } from "@/lib/utils";
import { PAGE_CONTAINER } from "@/lib/ui";
import InstagramFeed from "@/components/InstagramFeed";
import YouTubeFeed from "@/components/YouTubeFeed";

export default function SocialFeeds({ site, lang = "en" }) {
  const hi = lang === "hi";

  return (
    <section
      className={cn("social-feeds", PAGE_CONTAINER, "relative", "z-20", "py-10", "sm:py-14")}
      aria-label={hi ? "सोशल फ़ीड" : "Social feeds"}
    >
      <div className="social-feeds__row">
        <InstagramFeed
          compact
          handle={site?.instagramHandle || "shreya.creationss"}
          lang={lang}
        />
        <YouTubeFeed compact channelUrl={site?.socials?.youtube} lang={lang} />
      </div>
    </section>
  );
}
