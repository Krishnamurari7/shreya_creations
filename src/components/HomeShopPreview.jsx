"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import CardImage from "@/components/CardImage";
import { pickPage } from "@/lib/cms";
import { waLink } from "@/lib/whatsapp";

const HOME_SHOP_LIMIT = 5;

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
  const subtitle =
    pickPage(home, lang, "shopPreviewSubtitle", "shopPreviewSubtitleHi") ||
    (lang === "hi"
      ? "कलेक्शन देखें और WhatsApp पर अपने माप पर ऑर्डर करें।"
      : "Browse the collection and order stitched to your size on WhatsApp.");

  return (
    <div className="home-shop-showcase__header reveal">
      <span className="home-shop-showcase__eyebrow">
        <span className="sparkle-pulse text-gold text-[10px]" aria-hidden>
          ✦
        </span>
        {eyebrow}
      </span>
      <h2 className="home-shop-showcase__title">
        {title}
        {highlight && (
          <>
            {" "}
            <span className="highlight-shimmer">{highlight}</span>
          </>
        )}
      </h2>
      {subtitle && <p className="home-shop-showcase__subtitle">{subtitle}</p>}
      <div className="home-shop-showcase__rule" aria-hidden>
        <span />
        <span className="home-shop-showcase__rule-gem">✦</span>
        <span />
      </div>
    </div>
  );
}

function ShopProductCard({ product, whatsapp, lang, index, featured = false }) {
  const cover = product.images?.[0] || product.image;
  const wa = whatsapp
    ? waLink(whatsapp, `Hello! I would like to order: ${product.title}`)
    : `/shop/${product.slug}`;

  return (
    <article
      className={`home-shop-showcase__item home-shop-showcase__item--${index + 1} group ${featured ? "home-shop-showcase__item--featured" : ""}`}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <Link href={`/shop/${product.slug}`} className="home-shop-showcase__item-link" aria-label={product.title}>
        <div className="home-shop-showcase__item-media">
          <CardImage src={cover} alt={product.title} ratio="fill" position="top" />
          <div className="home-shop-showcase__item-shade" aria-hidden />
        </div>

        {product.category && (
          <span className="home-shop-showcase__item-cat">{product.category}</span>
        )}
        {product.stitchable && (
          <span className="home-shop-showcase__item-stitch">
            <span className="home-shop-showcase__item-stitch-dot" aria-hidden />
            {lang === "hi" ? "24 घंटे" : "24hr"}
          </span>
        )}

        <div className="home-shop-showcase__item-overlay">
          <div className="home-shop-showcase__item-meta">
            {product.fabric && featured && (
              <span className="home-shop-showcase__item-fabric">{product.fabric}</span>
            )}
            <h3 className="home-shop-showcase__item-title">{product.title}</h3>
            <div className="home-shop-showcase__item-row">
              {product.price && (
                <span className="home-shop-showcase__item-price">
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </span>
              )}
              <span className="home-shop-showcase__item-arrow" aria-hidden>
                ↗
              </span>
            </div>
          </div>
        </div>

        {featured && (
          <>
            <span className="home-shop-showcase__corner home-shop-showcase__corner--tl" aria-hidden />
            <span className="home-shop-showcase__corner home-shop-showcase__corner--br" aria-hidden />
          </>
        )}
      </Link>

      <div className="home-shop-showcase__item-actions">
        <a
          href={wa}
          target={whatsapp ? "_blank" : undefined}
          rel={whatsapp ? "noopener noreferrer" : undefined}
          className="home-shop-showcase__item-wa"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          {lang === "hi" ? "ऑर्डर करें" : "Order"}
        </a>
      </div>
    </article>
  );
}

export default function HomeShopPreview({ products = [], home = {}, lang = "en", whatsapp }) {
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ["All", ...set];
  }, [products]);

  const [active, setActive] = useState("All");

  const filtered = useMemo(() => {
    const list = active === "All" ? products : products.filter((p) => p.category === active);
    return list.slice(0, HOME_SHOP_LIMIT);
  }, [products, active]);

  if (!products.length) return null;

  const perks = (home.shopPreviewPerks || []).map((perk) => ({
    icon: perk.icon || "✦",
    label:
      lang === "hi" && (perk.label_hi || perk.labelHi)
        ? perk.label_hi || perk.labelHi
        : perk.label || "",
  })).filter((p) => p.label);

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
    <section className="home-shop-showcase page-section relative overflow-hidden">
      <div className="home-shop-showcase__bg" aria-hidden />
      <div className="home-shop-showcase__pattern" aria-hidden />

      <div className="page-container relative z-[1] max-w-6xl">
        <ShopSectionHeader home={home} lang={lang} />

        {categories.length > 1 && (
          <div className="home-shop-showcase__filters reveal">
            <div className="filter-pills home-shop-showcase__filter-pills">
              {categories.map((cat) => {
                const isSelected = active === cat;
                const label =
                  cat === "All" ? (lang === "hi" ? "सभी" : "All") : cat;
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

        <div className="home-shop-showcase__stage reveal" key={active}>
          {filtered.length > 0 ? (
            <div className="home-shop-showcase__grid" data-stagger>
              {filtered.map((product, idx) => (
                <ShopProductCard
                  key={product.id}
                  product={product}
                  whatsapp={whatsapp}
                  lang={lang}
                  index={idx}
                  featured={idx === 0}
                />
              ))}
            </div>
          ) : (
            <p className="home-shop-showcase__empty text-center text-muted text-sm py-16">
              {lang === "hi" ? "इस श्रेणी में कोई आइटम नहीं।" : "No items in this category."}
            </p>
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

        <div className="home-shop-showcase__footer reveal">
          <Link href="/shop" className="home-shop-showcase__cta">
            <span>{shopCta}</span>
            <span className="home-shop-showcase__cta-arrow" aria-hidden>→</span>
          </Link>
          <p className="home-shop-showcase__footer-note">
            {lang === "hi"
              ? `${products.length}+ डिज़ाइन उपलब्ध · कोई चेकआउट नहीं`
              : `${products.length}+ designs available · No checkout needed`}
          </p>
        </div>
      </div>
    </section>
  );
}
