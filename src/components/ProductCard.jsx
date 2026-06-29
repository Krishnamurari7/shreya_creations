"use client";

import { BTN_GOLD } from "@/lib/ui";
import Link from "next/link";
import CardImage from "@/components/CardImage";
import { waLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export default function ProductCard({ product, variant = "boutique", whatsapp, compact = false }) {
  const cover = product.images?.[0] || product.image;

  if (variant === "boutique") {
    const wa = whatsapp
      ? waLink(whatsapp, `Hello! I would like to order: ${product.title}`)
      : `/shop/${product.slug}`;

    return (
      <div className={cn("boutique-product-card group flex flex-col h-full", compact && "boutique-product-card--compact")}>
        <Link href={`/shop/${product.slug}`} className="product-card-media relative block">
          <CardImage src={cover} alt={product.title} ratio={compact ? "4/5" : "3/4"} position="top" />
          {!compact && (
            <div className="product-card-overlay" aria-hidden>
              <span className="product-card-overlay__label">
                View details <span>→</span>
              </span>
            </div>
          )}
          {!compact && (
            <button
              type="button"
              className="product-card-wishlist absolute top-3 right-3 z-10 flex h-11 w-11 min-h-11 min-w-11 items-center justify-center rounded-full shadow-sm transition-colors"
              aria-label="Add to wishlist"
              onClick={(e) => e.preventDefault()}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M12 21s-7-4.5-9.5-9C.5 8.5 2 5 5.5 5 8 5 12 8.5 12 8.5S16 5 18.5 5 23.5 8.5 21.5 12C19 16.5 12 21 12 21z" />
              </svg>
            </button>
          )}
        </Link>

        <div className={cn("boutique-product-card__body flex flex-col flex-1", compact ? "p-2.5 sm:p-3" : "p-3 sm:p-4")}>
          <Link href={`/shop/${product.slug}`}>
            <h3 className={cn(
              "product-card-title font-body text-ink leading-snug group-hover:text-orange transition-colors line-clamp-2",
              compact ? "text-[11px] sm:text-xs" : "text-xs sm:text-sm"
            )}>
              {product.title}
            </h3>
          </Link>
          {product.price && (
            <span className={cn("product-price mt-1 font-semibold", compact ? "text-xs sm:text-sm" : "sm:mt-1.5 text-sm sm:text-base")}>
              ₹{Number(product.price).toLocaleString("en-IN")}
            </span>
          )}
          <a
            href={wa}
            target={whatsapp ? "_blank" : undefined}
            rel={whatsapp ? "noopener noreferrer" : undefined}
            className={cn(
              BTN_GOLD,
              "product-card-wa-btn mt-auto w-full text-center tracking-widest flex items-center justify-center gap-1.5",
              compact
                ? "pt-2 py-2 text-[10px] sm:text-[11px] min-h-[44px]"
                : "pt-3 sm:pt-4 py-2.5 sm:py-3 text-[11px] sm:text-xs min-h-[44px]"
            )}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="shrink-0 opacity-90">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            ORDER ON WHATSAPP
          </a>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/shop/${product.slug}`}
      className={cn("boutique-product-card group block rounded-2xl p-4 w-full max-w-full h-full")}
    >
      <div className="relative">
        <CardImage src={cover} alt={product.title} ratio="3/4" position="top" className="rounded-xl" />
        <span className="absolute top-3 left-3 text-[10px] uppercase tracking-wider bg-orange text-white px-3 py-1 rounded-full z-10">
          {product.category}
        </span>
      </div>

      <h3 className="mt-4 font-display text-xl text-ink leading-snug group-hover:text-orange transition-colors line-clamp-2">
        {product.title}
      </h3>

      <div className="mt-3 flex items-center justify-between">
        {product.price && (
          <span className="font-medium text-lg text-orange">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </span>
        )}
        <span className="text-xs uppercase tracking-widest text-orange font-semibold">
          Explore →
        </span>
      </div>
    </Link>
  );
}
