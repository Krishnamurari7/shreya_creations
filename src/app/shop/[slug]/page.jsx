import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getSiteSettings } from "@/lib/data";
import { ProductActions } from "@/components/WhatsAppActions";
import ProductGallery from "@/components/ProductGallery";
import { Glass3DCard } from "@/components/Glass3DCard";

export async function generateMetadata({ params }) {
  const product = await getProductBySlug(params.slug);
  return { title: product ? `${product.title} — Shreya creation` : "Shop — Shreya creation" };
}

export default async function ProductDetail({ params }) {
  const [product, site] = await Promise.all([getProductBySlug(params.slug), getSiteSettings()]);
  if (!product) return notFound();

  const images = product.images?.length ? product.images : product.image ? [product.image] : [];

  return (
    <div className="relative z-10 w-full overflow-x-hidden">
      <div className="grid-overlay" />

      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-orange/5 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-80 h-80 rounded-full bg-purple/5 blur-3xl -z-10 pointer-events-none" />

      <div className="pt-[calc(var(--header-offset)+1rem)] sm:pt-[calc(var(--header-offset)+2rem)] pb-10 sm:pb-12 mx-auto max-w-6xl px-4 sm:px-5 relative z-20">
        {/* Back Link */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-orange hover:text-orange-dark text-sm font-semibold tracking-wider uppercase group transition-colors mb-8"
        >
          <span className="group-hover:-translate-x-1.5 transition-transform duration-300">←</span>
          Back to Shop
        </Link>

        {/* Detail Container */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Gallery Column */}
          <div className="lg:col-span-6 w-full">
            <ProductGallery images={images} title={product.title} />
          </div>

          {/* Info Column */}
          <div className="lg:col-span-6 lg:pl-6 space-y-6">
            <div>
              <span className="inline-flex bg-orange/10 border border-orange/20 text-orange px-4 py-1.5 rounded-full text-[10px] font-semibold tracking-widest uppercase mb-4 shadow-sm">
                {product.category}
              </span>
              <h1 className="font-display text-3xl sm:text-5xl md:text-6xl text-ink leading-tight font-normal">
                {product.title}
              </h1>
            </div>

            {product.price && (
              <div className="py-2 border-y border-ink/15">
                <span className="text-[10px] uppercase tracking-widest text-ink block mb-1">Estimated Price</span>
                <p className="text-3xl sm:text-4xl text-gold-gradient font-display font-medium">
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </p>
              </div>
            )}

            <p className="text-ink font-normal leading-relaxed text-base">
              {product.description}
            </p>

            {/* Specifications list inside custom glass pills */}
            {(product.fabric || product.sizes) && (
              <Glass3DCard className="rounded-2xl sm:rounded-[2rem] p-5 sm:p-6 border-ink/15 space-y-4">
                <h3 className="text-[11px] uppercase tracking-[0.2em] text-orange font-semibold mb-2">Specifications</h3>
                <dl className="space-y-4 text-sm">
                  {product.fabric && (
                    <div className="flex flex-col sm:flex-row sm:gap-4 sm:items-center gap-1">
                      <dt className="text-gold uppercase tracking-wider text-[10px] sm:w-24 shrink-0 font-medium">Fabric</dt>
                      <dd className="text-ink font-normal">{product.fabric}</dd>
                    </div>
                  )}
                  {product.sizes && (
                    <div className="flex flex-col sm:flex-row sm:gap-4 sm:items-start gap-1">
                      <dt className="text-gold uppercase tracking-wider text-[10px] sm:w-24 shrink-0 font-medium">Sizing</dt>
                      <dd className="text-ink font-normal leading-relaxed">{product.sizes}</dd>
                    </div>
                  )}
                </dl>
              </Glass3DCard>
            )}

            {/* Actions Widget */}
            <div className="space-y-4 pt-4">
              <ProductActions product={product} number={site.whatsapp} />
              
              <Glass3DCard className="rounded-2xl p-4 border-purple/15 bg-purple/5 flex items-start gap-3">
                <span className="text-base">💬</span>
                <p className="text-xs text-ink font-normal leading-relaxed">
                  <strong className="text-purple-dark font-medium uppercase tracking-wider text-[9px] block mb-0.5">WhatsApp Customization Flow</strong>
                  No online checkout needed. We consult, take custom sizing, review boutique templates, and process payments directly with you in chat.
                </p>
              </Glass3DCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
