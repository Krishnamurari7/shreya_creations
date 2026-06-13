"use client";

import Link from "next/link";
import CardImage from "@/components/CardImage";
import { waLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export default function ProductCard({ product, variant = "boutique", whatsapp }) {
  const cover = product.images?.[0] || product.image;

  if (variant === "boutique") {
    const wa = whatsapp
      ? waLink(whatsapp, `Hello! I would like to order: ${product.title}`)
      : `/shop/${product.slug}`;

    return (
      <div className="boutique-product-card group flex flex-col h-full">
        <Link href={`/shop/${product.slug}`} className="product-card-media relative block">
          <CardImage src={cover} alt={product.title} ratio="3/4" position="top" />
          <div className="product-card-overlay" aria-hidden>
            <span className="product-card-overlay__label">
              View details <span>→</span>
            </span>
          </div>
          <button
            type="button"
            className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-surface/90 text-purple shadow-sm transition-colors hover:text-orange"
            aria-label="Add to wishlist"
            onClick={(e) => e.preventDefault()}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M12 21s-7-4.5-9.5-9C.5 8.5 2 5 5.5 5 8 5 12 8.5 12 8.5S16 5 18.5 5 23.5 8.5 21.5 12C19 16.5 12 21 12 21z" />
            </svg>
          </button>
        </Link>

        <div className="flex flex-col flex-1 p-3 sm:p-4">
          <Link href={`/shop/${product.slug}`}>
            <h3 className="font-body text-xs sm:text-sm text-ink leading-snug group-hover:text-purple transition-colors line-clamp-2">
              {product.title}
            </h3>
          </Link>
          {product.price && (
            <span className="mt-1 sm:mt-1.5 font-medium text-sm sm:text-base text-orange">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </span>
          )}
          <a
            href={wa}
            target={whatsapp ? "_blank" : undefined}
            rel={whatsapp ? "noopener noreferrer" : undefined}
            className="btn-purple mt-auto pt-3 sm:pt-4 w-full py-2.5 sm:py-3 text-center text-[9px] sm:text-[11px] tracking-widest min-h-[44px] flex items-center justify-center"
          >
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
        <span className="absolute top-3 left-3 text-[10px] uppercase tracking-wider bg-purple text-white px-3 py-1 rounded-full z-10">
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
        <span className="text-xs uppercase tracking-widest text-purple font-semibold">
          Explore →
        </span>
      </div>
    </Link>
  );
}
