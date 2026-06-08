"use client";

import { useLanguage } from "@/components/LanguageProvider";

const DEFAULT_ITEMS = [
  "24 घंटे में सिले कपड़े",
  "कौशल से कारोबार तक",
  "मात्र 24 घंटे में सिले कपड़े प्राप्त करें",
  "PREMIUM QUALITY",
  "FREE SHIPPING ON ORDERS ABOVE ₹999",
];

function resolveItems(raw, lang) {
  if (!Array.isArray(raw) || !raw.length) return DEFAULT_ITEMS;
  return raw
    .map((item) => {
      if (typeof item === "string") return item.trim();
      if (item && typeof item === "object") {
        const hi = item.text_hi ?? item.textHi;
        const en = item.text ?? item.en ?? "";
        return (lang === "hi" && hi ? hi : en).trim();
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
          <span>{text}</span>
        </span>
      ))}
    </span>
  );
}

function MarqueeTrack({ items }) {
  return (
    <div className="marquee-container announcement-bar__marquee">
      <div className="marquee-content announcement-bar__track" aria-hidden="true">
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
