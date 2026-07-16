"use client";

import { MARQUEE_CONTAINER, MARQUEE_CONTENT } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/LanguageProvider";

const DEFAULT_ITEMS_EN = [
  "Fashion Boutique Institute",
  "Bihar's No. 1",
  "Trusted Fashion Training | Patna",
];

const DEFAULT_ITEMS_HI = [
  "Fashion Boutique Institute",
  "बिहार का No. 1",
  "पटना का भरोसेमंद फैशन संस्थान",
];

function resolveItems(raw, lang) {
  if (!Array.isArray(raw) || !raw.length) {
    return lang === "hi" ? DEFAULT_ITEMS_HI : DEFAULT_ITEMS_EN;
  }
  return raw
    .map((item) => {
      if (typeof item === "string") return item.trim();
      if (item && typeof item === "object") {
        const hi = item.text_hi ?? item.textHi;
        const en = item.text ?? item.en ?? "";
        return (lang === "hi" ? hi || en : en || hi).trim();
      }
      return "";
    })
    .filter(Boolean);
}

function ItemGroup({ items, copy }) {
  return (
    <span className="announcement-bar__group">
      {items.map((text, i) => (
        <span key={`${copy}-${i}`} className="announcement-bar__item">
          {i > 0 && <span className="announcement-bar__sep" aria-hidden>✦</span>}
          <span>
            <span className="announcement-bar__sparkle" aria-hidden>✨</span>
            {text}
          </span>
        </span>
      ))}
    </span>
  );
}

function MarqueeTrack({ items }) {
  return (
    <div className={cn(MARQUEE_CONTAINER, "announcement-bar__marquee")}>
      <div className={cn(MARQUEE_CONTENT, "announcement-bar__track")} aria-hidden="true">
        <ItemGroup items={items} copy={0} />
        <ItemGroup items={items} copy={1} />
      </div>
    </div>
  );
}

export default function AnnouncementBar({ items: rawItems }) {
  const { lang } = useLanguage();
  const items = resolveItems(rawItems, lang);

  return (
    <div className="announcement-bar" role="region" aria-label="Announcements">
      <p className="sr-only">{items.join(" · ")}</p>
      <MarqueeTrack items={items} />
    </div>
  );
}
