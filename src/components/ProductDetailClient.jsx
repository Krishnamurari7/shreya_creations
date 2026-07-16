"use client";

import { HIGHLIGHT_SHIMMER, PAGE_CONTAINER, PAGE_HERO_TITLE } from "@/lib/ui";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ProductActions } from "@/components/WhatsAppActions";
import ProductGallery from "@/components/ProductGallery";
import { Glass3DCard } from "@/components/Glass3DCard";
import AmbientGlows from "@/components/AmbientGlows";
import { fadeUp } from "@/lib/motion";

export default function ProductDetailClient({ product, site, images }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative z-10 w-full min-w-0 overflow-x-hidden">
      <div className="grid-overlay" />
      <AmbientGlows variant="subtle" className="z-0" />

      <div className={cn(PAGE_CONTAINER, "pt-[calc(var(--header-offset)+1rem)]", "sm:pt-[calc(var(--header-offset)+2rem)]", "pb-10", "sm:pb-12", "max-w-6xl", "relative", "z-20")}>
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          custom={0}
          variants={fadeUp}
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-orange hover:text-orange-dark text-sm font-semibold tracking-wider uppercase group transition-colors mb-8"
          >
            <span className="group-hover:-translate-x-1.5 transition-transform duration-300">←</span>
            Back to Shop
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start min-w-0 w-full">
          <motion.div
            className="lg:col-span-6 w-full min-w-0 order-1"
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
            custom={0.1}
            variants={fadeUp}
          >
            <ProductGallery
              images={images}
              title={product.image_alt || product.imageAlt || `${product.title} Patna`}
            />
          </motion.div>

          <motion.div
            className="lg:col-span-6 lg:pl-0 xl:pl-6 space-y-6 order-2 min-w-0"
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
            custom={0.2}
            variants={fadeUp}
          >
            <div>
              <span className="inline-flex bg-orange/10 border border-orange/20 text-orange px-4 py-1.5 rounded-full text-[10px] font-semibold tracking-widest uppercase mb-4 shadow-sm">
                {product.category}
              </span>
              <h1 className={cn(PAGE_HERO_TITLE, "text-balance")}>
                {product.title}
              </h1>
            </div>

            {product.price && (
              <div className="py-2 border-y border-ink/15">
                <span className="text-[10px] uppercase tracking-widest text-ink block mb-1">Estimated Price</span>
                <p className={cn(HIGHLIGHT_SHIMMER, "text-3xl", "sm:text-4xl", "font-display", "font-medium")}>
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </p>
              </div>
            )}

            <p className="text-ink font-normal leading-relaxed text-base text-pretty">
              {product.description_long || product.description}
            </p>

            {(product.fabric || product.sizes || product.care || product.colours || product.estimated_delivery) && (
              <Glass3DCard className="rounded-2xl sm:rounded-[2rem] p-5 sm:p-6 border-ink/15 space-y-4 transition-transform duration-300 hover:-translate-y-0.5">
                <h2 className="text-[11px] uppercase tracking-[0.2em] text-orange font-semibold mb-2">Specifications</h2>
                <dl className="space-y-4 text-sm">
                  {product.fabric && (
                    <div className="flex flex-col sm:flex-row sm:gap-4 sm:items-center gap-1">
                      <dt className="text-gold uppercase tracking-wider text-[10px] sm:w-28 shrink-0 font-medium">Fabric</dt>
                      <dd className="text-ink font-normal">{product.fabric}</dd>
                    </div>
                  )}
                  {product.colours && (
                    <div className="flex flex-col sm:flex-row sm:gap-4 sm:items-center gap-1">
                      <dt className="text-gold uppercase tracking-wider text-[10px] sm:w-28 shrink-0 font-medium">Colour</dt>
                      <dd className="text-ink font-normal">{product.colours}</dd>
                    </div>
                  )}
                  {product.sizes && (
                    <div className="flex flex-col sm:flex-row sm:gap-4 sm:items-start gap-1">
                      <dt className="text-gold uppercase tracking-wider text-[10px] sm:w-28 shrink-0 font-medium">Sizing</dt>
                      <dd className="text-ink font-normal leading-relaxed">{product.sizes}</dd>
                    </div>
                  )}
                  {product.care && (
                    <div className="flex flex-col sm:flex-row sm:gap-4 sm:items-start gap-1">
                      <dt className="text-gold uppercase tracking-wider text-[10px] sm:w-28 shrink-0 font-medium">Care</dt>
                      <dd className="text-ink font-normal leading-relaxed">{product.care}</dd>
                    </div>
                  )}
                  {product.estimated_delivery && (
                    <div className="flex flex-col sm:flex-row sm:gap-4 sm:items-start gap-1">
                      <dt className="text-gold uppercase tracking-wider text-[10px] sm:w-28 shrink-0 font-medium">Delivery</dt>
                      <dd className="text-ink font-normal leading-relaxed">{product.estimated_delivery}</dd>
                    </div>
                  )}
                </dl>
              </Glass3DCard>
            )}

            <div className="space-y-4 pt-4">
              <ProductActions product={product} number={site.whatsapp} />
              <Glass3DCard className="rounded-2xl p-4 border-orange/15 bg-orange/5 flex items-start gap-3 transition-transform duration-300 hover:-translate-y-0.5">
                <span className="text-base">💬</span>
                <p className="text-xs text-ink font-normal leading-relaxed">
                  <strong className="text-orange-dark font-medium uppercase tracking-wider text-[9px] block mb-0.5">
                    WhatsApp Customization Flow
                  </strong>
                  No online checkout needed. We consult, take custom sizing, review boutique templates, and process
                  payments directly with you in chat.
                </p>
              </Glass3DCard>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
