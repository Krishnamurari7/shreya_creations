"use client";

import Link from "next/link";
import { CardGlow, glassCardStyles } from "@/components/Glass3DCard";
import { cn } from "@/lib/utils";

export default function ProductCard({ product }) {
  const cover = product.images?.[0] || product.image;

  return (
    <Link
      href={`/shop/${product.slug}`}
      className={cn(glassCardStyles, "rounded-2xl sm:rounded-3xl p-4 sm:p-5 w-full max-w-full block")}
    >
      <CardGlow />

      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.55)]">
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover/card:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-90" />

        <span className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.2em] bg-black/75 text-white px-3.5 py-1.5 rounded-full border border-white/20 backdrop-blur-md">
          {product.category}
        </span>

        {product.stitchable && (
          <span className="absolute top-4 right-4 text-[10px] uppercase tracking-wider bg-orange text-white px-3.5 py-1.5 rounded-full shadow-sm">
            Stitchable
          </span>
        )}
      </div>

      <h3 className="mt-4 sm:mt-5 font-display text-xl sm:text-2xl text-ink leading-snug group-hover/card:text-orange transition-colors duration-300">
        {product.title}
      </h3>

      <div className="mt-5 flex items-center justify-between">
        {product.price && (
          <span className="font-medium text-lg text-ink group-hover/card:text-gold-gradient transition-colors">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </span>
        )}
        <span className="text-xs uppercase tracking-widest text-orange font-semibold group-hover/card:translate-x-1 transition-transform duration-300 block">
          Explore →
        </span>
      </div>
    </Link>
  );
}
