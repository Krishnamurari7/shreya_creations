"use client";

import OptimizedImage from "@/components/OptimizedImage";
import InfiniteMarquee from "@/components/InfiniteMarquee";
import { pickPage } from "@/lib/cms";

export default function HomeAwardsMarquee({ home = {}, lang = "en" }) {
  const awards = Array.isArray(home.awardItems) ? home.awardItems.filter((item) => item?.image) : [];
  if (!awards.length) return null;

  const heading = pickPage(home, lang, "awardsHeading", "awardsHeadingHi") || "Recognized & Award Winning";

  return (
    <section className="home-awards-marquee" aria-label={heading}>
      <h2 className="home-awards-marquee__heading"><span aria-hidden>✧</span>{heading}<span aria-hidden>✧</span></h2>
      <InfiniteMarquee
        className="home-awards-marquee__viewport"
        label={heading}
        items={awards}
        minItems={8}
        secondsPerItem={3.8}
        renderItem={(item, index, isDuplicate) => {
          const title = lang === "hi" && (item.titleHi || item.title_hi) ? item.titleHi || item.title_hi : item.title;
          const alt = lang === "hi" && (item.imageAltHi || item.image_alt_hi)
            ? item.imageAltHi || item.image_alt_hi
            : item.imageAlt || item.image_alt || title;
          return (
            <li key={`${item.image}-${index}`} className="home-awards-marquee__item" aria-hidden={isDuplicate ? "true" : undefined}>
              <div className="home-awards-marquee__image">
                <OptimizedImage src={item.image} alt={isDuplicate ? "" : alt || ""} fill sizes="(max-width: 639px) 42vw, 210px" loading="lazy" />
              </div>
              {title && <p className="home-awards-marquee__caption">{title}</p>}
            </li>
          );
        }}
      />
    </section>
  );
}
