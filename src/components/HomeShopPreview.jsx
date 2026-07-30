"use client";

import {
  FILTER_PILLS,
  HIGHLIGHT_SHIMMER,
  HOME_BAND_WHITE,
  PAGE_CONTAINER,
  PAGE_SECTION,
  REVEAL,
  SECTION_EYEBROW,
  SECTION_HEADER_GLASS,
  SECTION_TITLE,
  SPARKLE_PULSE,
} from "@/lib/ui";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import CardImage from "@/components/CardImage";
import { pickPage } from "@/lib/cms";
import { productMessage, waLink } from "@/lib/whatsapp";

const HOME_SHOP_LIMIT = 8;
const MIN_TAB_COUNT = 4;
const SKELETON_COUNT = 4;

function ShopSectionHeader({ home, lang }) {
  const eyebrow =
    pickPage(home, lang, "shopPreviewEyebrow", "shopPreviewEyebrowHi") ||
    (lang === "hi" ? "बुटीक शॉप" : "Boutique Shop");
  const title =
    pickPage(home, lang, "shopPreviewTitle", "shopPreviewTitleHi") ||
    (lang === "hi" ? "क्यूरेटेड" : "Curated");
  const highlight =
    pickPage(home, lang, "shopPreviewTitleHighlight", "shopPreviewTitleHighlightHi") ||
    (lang === "hi" ? "कउचर" : "Couture");

  return (
    <div className={cn(REVEAL, SECTION_HEADER_GLASS, "home-shop-showcase__header", "text-center")}>
      <span className={SECTION_EYEBROW}>
        <span className={cn(SPARKLE_PULSE, "text-gold", "text-[10px]")} aria-hidden>
          ✦
        </span>
        {eyebrow}
      </span>
      <h2 className={cn(SECTION_TITLE, "mt-3", "sm:mt-4")}>
        {title}
        {highlight && (
          <>
            {" "}
            <span className={HIGHLIGHT_SHIMMER}>{highlight}</span>
          </>
        )}
      </h2>
    </div>
  );
}

function formatStartingPrice(price, lang) {
  const amount = Number(price).toLocaleString("en-IN");
  return lang === "hi" ? `शुरुआत ₹${amount}` : `Starting ₹${amount}`;
}

function WhatsAppIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function ShopProductCard({ product, whatsapp, lang, index }) {
  const cover = product.images?.[0] || product.image;
  const productUrl = `/shop/${product.slug}`;
  const wa = whatsapp ? waLink(whatsapp, productMessage(product, productUrl)) : productUrl;

  return (
    <article
      className="home-shop-showcase__card group"
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <Link href={productUrl} className="home-shop-showcase__card-media" aria-label={product.title}>
        <CardImage
          src={cover}
          alt={product.image_alt || product.imageAlt || `${product.title} Patna`}
          ratio="3/4"
          position="top"
        />
        <span className="home-shop-showcase__delivery">
          {lang === "hi" ? "24 घंटे डिलीवरी" : "24hr delivery"}
        </span>
      </Link>

      <div className="home-shop-showcase__card-body">
        <Link href={productUrl} className="home-shop-showcase__card-title-link">
          <h3 className="home-shop-showcase__card-title">{product.title}</h3>
        </Link>

        {product.price != null && product.price !== "" && (
          <p className="home-shop-showcase__card-price">
            {formatStartingPrice(product.price, lang)}
          </p>
        )}

        <a
          href={wa}
          target={whatsapp ? "_blank" : undefined}
          rel={whatsapp ? "noopener noreferrer" : undefined}
          className="home-shop-showcase__card-wa"
        >
          <WhatsAppIcon />
          {lang === "hi" ? "WhatsApp पर ऑर्डर" : "Order on WhatsApp"}
        </a>
      </div>
    </article>
  );
}

function ShopSkeletonCard() {
  return (
    <div className="home-shop-showcase__card home-shop-showcase__card--skeleton" aria-hidden>
      <div className="home-shop-showcase__skel home-shop-showcase__skel-media" />
      <div className="home-shop-showcase__card-body">
        <div className="home-shop-showcase__skel home-shop-showcase__skel-title" />
        <div className="home-shop-showcase__skel home-shop-showcase__skel-price" />
        <div className="home-shop-showcase__skel home-shop-showcase__skel-btn" />
      </div>
    </div>
  );
}

function ShopSkeletonGrid({ count = SKELETON_COUNT }) {
  return (
    <div
      className="home-shop-showcase__grid"
      aria-busy="true"
      aria-label="Loading products"
    >
      {Array.from({ length: count }, (_, i) => (
        <ShopSkeletonCard key={`shop-skel-${i}`} />
      ))}
    </div>
  );
}

export default function HomeShopPreview({
  products = [],
  home = {},
  lang = "en",
  whatsapp,
  loading = false,
}) {
  const categories = useMemo(() => {
    const counts = new Map();
    for (const product of products) {
      if (!product?.category) continue;
      counts.set(product.category, (counts.get(product.category) || 0) + 1);
    }

    const eligible = [...counts.entries()]
      .filter(([, count]) => count >= MIN_TAB_COUNT)
      .map(([category]) => category);

    if (!eligible.length) return [];
    return ["All", ...eligible];
  }, [products]);

  const [active, setActive] = useState("All");

  useEffect(() => {
    if (!categories.length) {
      if (active !== "All") setActive("All");
      return;
    }
    if (!categories.includes(active)) setActive("All");
  }, [categories, active]);

  const filtered = useMemo(() => {
    const list = active === "All" ? products : products.filter((p) => p.category === active);
    return list.slice(0, HOME_SHOP_LIMIT);
  }, [products, active]);

  if (!loading && !products.length) return null;

  const perks = (home.shopPreviewPerks || [])
    .map((perk) => ({
      icon: perk.icon || "✦",
      label:
        lang === "hi" && (perk.label_hi || perk.labelHi)
          ? perk.label_hi || perk.labelHi
          : perk.label || "",
    }))
    .filter((p) => p.label);

  const defaultPerks = [
    { icon: "📏", label: lang === "hi" ? "आपके माप पर" : "Custom Fit" },
    { icon: "⚡", label: lang === "hi" ? "24 घंटे सिलाई" : "24hr Stitching" },
    { icon: "💬", label: lang === "hi" ? "WhatsApp ऑर्डर" : "WhatsApp Order" },
  ];

  const ribbonPerks = perks.length ? perks : defaultPerks;
  const shopCta =
    pickPage(home, lang, "shopPreviewCta", "shopPreviewCtaHi") ||
    (lang === "hi" ? "पूरी शॉप देखें" : "Explore Full Collection");

  return (
    <section
      className={cn(
        HOME_BAND_WHITE,
        PAGE_SECTION,
        "home-shop-showcase",
        "relative",
        "overflow-hidden"
      )}
    >
      <div className="home-shop-showcase__bg" aria-hidden />
      <div className="home-shop-showcase__pattern" aria-hidden />

      <div className={cn(PAGE_CONTAINER, "relative", "z-[1]")}>
        <ShopSectionHeader home={home} lang={lang} />

        {!loading && categories.length > 1 && (
          <div className={cn(REVEAL, "home-shop-showcase__filters")}>
            <div className={cn(FILTER_PILLS, "home-shop-showcase__filter-pills")}>
              {categories.map((cat) => {
                const isSelected = active === cat;
                const label = cat === "All" ? (lang === "hi" ? "सभी" : "All") : cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActive(cat)}
                    className={
                      isSelected
                        ? "home-shop-showcase__pill home-shop-showcase__pill--active"
                        : "home-shop-showcase__pill"
                    }
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className={cn(REVEAL, "home-shop-showcase__stage")}>
          {loading ? (
            <ShopSkeletonGrid />
          ) : (
            <div className="home-shop-showcase__grid" data-stagger>
              {filtered.map((product, idx) => (
                <ShopProductCard
                  key={product.id}
                  product={product}
                  whatsapp={whatsapp}
                  lang={lang}
                  index={idx}
                />
              ))}
            </div>
          )}

          <div className="home-shop-showcase__ribbon" aria-hidden>
            {ribbonPerks.map((perk) => (
              <span key={perk.label} className="home-shop-showcase__ribbon-item">
                <span className="home-shop-showcase__ribbon-icon">{perk.icon}</span>
                {perk.label}
              </span>
            ))}
          </div>
        </div>

        <div className={cn(REVEAL, "home-shop-showcase__footer")}>
          <Link href="/shop" className="home-shop-showcase__cta">
            <span>{shopCta}</span>
            <span className="home-shop-showcase__cta-arrow" aria-hidden>
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
