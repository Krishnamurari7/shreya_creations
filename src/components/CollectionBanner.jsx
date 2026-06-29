"use client";

import { BTN_GOLD_OUTLINE } from "@/lib/ui";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { pickPage } from "@/lib/cms";

function ShowcaseFrame({ src, alt, side }) {
  return (
    <div className={`collection-showcase__frame collection-showcase__frame--${side}`}>
      <div className="collection-showcase__frame-inner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} loading="lazy" />
        <div className="collection-showcase__frame-shine" aria-hidden />
      </div>
      <span className="collection-showcase__frame-corner collection-showcase__frame-corner--tl" aria-hidden />
      <span className="collection-showcase__frame-corner collection-showcase__frame-corner--br" aria-hidden />
    </div>
  );
}

export default function CollectionBanner({ home, fallbackLeft, fallbackRight }) {
  const { lang } = useLanguage();

  const eyebrow = pickPage(home, lang, "collectionEyebrow", "collectionEyebrowHi") || "NEW COLLECTION";
  const title = pickPage(home, lang, "collectionTitle", "collectionTitleHi") || "Grace in Every Thread";
  const body =
    pickPage(home, lang, "collectionBody", "collectionBodyHi") ||
    "Explore our latest ethnic wear collection — handcrafted with love and timeless elegance.";
  const ctaLabel = pickPage(home, lang, "collectionCtaLabel", "collectionCtaLabelHi") || "EXPLORE COLLECTION";
  const ctaHref = home.collectionCtaHref || "/portfolio";

  const leftImage = home.collectionImageLeft || fallbackLeft;
  const rightImage = home.collectionImageRight || fallbackRight;

  return (
    <section className="collection-showcase" aria-labelledby="collection-showcase-title">
      <div className="collection-showcase__bg" aria-hidden>
        <div className="collection-showcase__orb collection-showcase__orb--left" />
        <div className="collection-showcase__orb collection-showcase__orb--right" />
        <div className="collection-showcase__pattern" />
      </div>

      {(leftImage || rightImage) && (
        <div className="collection-showcase__mobile-frames" aria-hidden>
          {leftImage && (
            <div className="collection-showcase__mobile-frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={leftImage} alt="" />
            </div>
          )}
          {rightImage && (
            <div className="collection-showcase__mobile-frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={rightImage} alt="" />
            </div>
          )}
        </div>
      )}

      <div className="collection-showcase__inner">
        {leftImage && (
          <ShowcaseFrame src={leftImage} alt="" side="left" />
        )}

        <div className="collection-showcase__content">
          <span className="collection-showcase__eyebrow">{eyebrow}</span>
          <div className="collection-showcase__rule" aria-hidden>
            <span />
            <span className="collection-showcase__gem" aria-hidden>✦</span>
            <span />
          </div>
          <h2 id="collection-showcase-title" className="collection-showcase__title font-display">
            {title}
          </h2>
          <p className="collection-showcase__body">{body}</p>
          <Link href={ctaHref} className={cn(BTN_GOLD_OUTLINE, "collection-showcase__cta")}>
            {ctaLabel} <span aria-hidden>›</span>
          </Link>
        </div>

        {rightImage && (
          <ShowcaseFrame src={rightImage} alt="" side="right" />
        )}
      </div>
    </section>
  );
}
