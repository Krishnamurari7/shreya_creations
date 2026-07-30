"use client";

import { FILTER_PILL, FILTER_PILL_ACTIVE, FILTER_PILLS, GLASS, INTERACTIVE_CARD, PAGE_CONTAINER, REVEAL, TEXT_GOLD_GRADIENT } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { useState, useMemo, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import CardImage from "@/components/CardImage";
import { Glass3DCard } from "@/components/Glass3DCard";
import { staggerDelay } from "@/lib/motion";

export default function PortfolioGallery({ items = [], fullPage = false }) {
  const [mounted, setMounted] = useState(false);
  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category).filter(Boolean));
    return ["All", ...Array.from(set).sort()];
  }, [items]);

  const [active, setActive] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filtered = active === "All" ? items : items.filter((i) => i.category === active);
  const lightbox = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  const openLightbox = useCallback((item) => {
    const idx = filtered.findIndex((i) => (i.id && i.id === item.id) || i === item);
    setLightboxIndex(idx >= 0 ? idx : 0);
  }, [filtered]);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goPrev = useCallback(() => {
    if (!filtered.length) return;
    setLightboxIndex((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length));
  }, [filtered.length]);

  const goNext = useCallback(() => {
    if (!filtered.length) return;
    setLightboxIndex((i) => (i === null ? null : (i + 1) % filtered.length));
  }, [filtered.length]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightboxIndex, closeLightbox, goPrev, goNext]);

  const filterBar = (
    <div className={cn(FILTER_PILLS, "gap-2.5", fullPage ? "justify-start" : "justify-center")}>
      {categories.map((c) => {
        const isSelected = active === c;
        return (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={cn(
              "min-h-11 shrink-0 whitespace-nowrap px-4 py-2.5 rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-300",
              isSelected
                ? cn(FILTER_PILL_ACTIVE, "tab-active-glow")
                : cn(FILTER_PILL, "tracking-wider font-medium")
            )}
          >
            {c}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className={fullPage ? cn(PAGE_CONTAINER, "max-w-7xl pb-6 sm:pb-8 relative z-20") : ""}>
      {fullPage ? (
        <Glass3DCard className={cn(REVEAL, "rounded-2xl", "sm:rounded-[2rem]", "p-4", "sm:p-6", "md:p-8", "border-ink/15", "mb-8", "sm:mb-10", "flex", "flex-col", "sm:flex-row", "gap-4", "sm:gap-5", "items-stretch", "sm:items-center", "justify-between", "shadow-xl")}>
          {filterBar}
          <p className="text-xs uppercase tracking-widest text-ink shrink-0">
            {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
          </p>
        </Glass3DCard>
      ) : (
        <div className="mb-12">{filterBar}</div>
      )}

      {filtered.length === 0 ? (
        <Glass3DCard className="rounded-[2rem] border-ink/15 p-16 sm:p-20 text-center">
          <span className="text-4xl">✨</span>
          <p className="text-ink mt-4 font-normal">No pieces in this category yet. Check back soon!</p>
        </Glass3DCard>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 [&>*]:mb-4">
          {filtered.map((item, idx) => {
            const alt = item.image_alt || item.imageAlt || `${item.title || "Portfolio piece"} Patna`;
            const href = item.slug ? `/portfolio/${item.slug}` : null;
            const className = cn(
              GLASS,
              REVEAL,
              INTERACTIVE_CARD,
              "group",
              "relative",
              "block",
              "w-full",
              "overflow-hidden",
              "rounded-3xl",
              "border",
              "border-ink/15",
              "hover:border-orange/35",
              "shadow-lg",
              "break-inside-avoid"
            );
            const content = (
              <>
                <CardImage src={item.image} alt={alt} ratio="3/4" position="top" />
                <div className="portfolio-card-overlay absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 sm:p-5 text-left backdrop-blur-[2px]">
                  {item.category && (
                    <span className="text-[10px] uppercase tracking-widest text-orange font-semibold mb-1">
                      {item.category}
                    </span>
                  )}
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-display text-xl text-white leading-tight text-left">
                      {item.title}
                    </span>
                    <span className="h-7 w-7 rounded-full bg-orange/90 text-white flex items-center justify-center text-xs shrink-0 shadow-md">
                      ↗
                    </span>
                  </div>
                </div>
              </>
            );

            if (href) {
              return (
                <Link
                  key={item.id || `${item.title}-${idx}`}
                  href={href}
                  className={className}
                  style={staggerDelay(idx % 8, 50)}
                >
                  {content}
                </Link>
              );
            }

            return (
              <button
                key={item.id || `${item.title}-${idx}`}
                type="button"
                onClick={() => openLightbox(item)}
                className={className}
                style={staggerDelay(idx % 8, 50)}
              >
                {content}
              </button>
            );
          })}
        </div>
      )}

      {mounted &&
        createPortal(
          <AnimatePresence>
            {lightbox && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeLightbox}
                className="fixed inset-0 z-[10050] bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
                role="dialog"
                aria-modal="true"
                aria-label={lightbox.title}
              >
                {filtered.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        goPrev();
                      }}
                      className={cn(GLASS, "hidden", "sm:grid", "place-items-center", "absolute", "left-3", "sm:left-6", "top-1/2", "-translate-y-1/2", "h-11", "w-11", "rounded-full", "border", "border-orange/25", "text-ink", "hover:border-orange/50", "transition-colors", "z-10")}
                      aria-label="Previous"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        goNext();
                      }}
                      className={cn(GLASS, "hidden", "sm:grid", "place-items-center", "absolute", "right-3", "sm:right-6", "top-1/2", "-translate-y-1/2", "h-11", "w-11", "rounded-full", "border", "border-orange/25", "text-ink", "hover:border-orange/50", "transition-colors", "z-10")}
                      aria-label="Next"
                    >
                      ›
                    </button>
                  </>
                )}

                <motion.div
                  key={lightbox.id || lightbox.title}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  onClick={(e) => e.stopPropagation()}
                className={cn(GLASS, "portfolio-lightbox-panel", "relative", "w-full", "max-w-4xl", "rounded-3xl", "p-3", "sm:p-4", "border", "border-orange/25", "shadow-2xl", "bg-surface")}
                >
                  <div className="portfolio-lightbox-media flex items-center justify-center rounded-2xl overflow-hidden bg-cream/30 min-h-[200px] max-h-[min(70vh,720px)] sm:max-h-[min(78vh,720px)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={lightbox.image}
                      alt={lightbox.image_alt || lightbox.imageAlt || `${lightbox.title || "Portfolio piece"} Patna`}
                      className="block max-h-[min(70vh,720px)] sm:max-h-[min(78vh,720px)] max-w-full w-auto h-auto object-contain"
                    />
                  </div>

                  {filtered.length > 1 && (
                    <div className="mt-3 flex items-center justify-center gap-3 sm:hidden">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          goPrev();
                        }}
                        className={cn(GLASS, "grid", "place-items-center", "h-11", "w-11", "rounded-full", "border", "border-orange/25", "text-ink")}
                        aria-label="Previous"
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          goNext();
                        }}
                        className={cn(GLASS, "grid", "place-items-center", "h-11", "w-11", "rounded-full", "border", "border-orange/25", "text-ink")}
                        aria-label="Next"
                      >
                        ›
                      </button>
                    </div>
                  )}

                  <div className="p-4 text-center">
                    {lightbox.category && (
                      <span className="text-xs uppercase tracking-widest text-orange font-semibold">
                        {lightbox.category}
                      </span>
                    )}
                    <p className={cn(TEXT_GOLD_GRADIENT, "font-display", "text-2xl", "sm:text-3xl", "mt-1")}>{lightbox.title}</p>
                    {filtered.length > 1 && (
                      <p className="text-[10px] uppercase tracking-widest text-ink mt-2">
                        {(lightboxIndex ?? 0) + 1} / {filtered.length}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={closeLightbox}
                    className="absolute top-2 right-2 sm:-top-3 sm:-right-3 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-orange text-white border border-orange-light/20 flex items-center justify-center text-sm shadow-lg hover:rotate-90 hover:scale-105 transition-all duration-300"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
