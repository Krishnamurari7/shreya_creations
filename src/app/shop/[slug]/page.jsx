import { notFound } from "next/navigation";
import { getProductBySlug, getSiteSettings } from "@/lib/data";
import ProductDetailClient from "@/components/ProductDetailClient";

export async function generateMetadata({ params }) {
  const product = await getProductBySlug(params.slug);
  return { title: product ? `${product.title} — Shreya creation` : "Shop — Shreya creation" };
}

export default async function ProductDetail({ params }) {
  const [product, site] = await Promise.all([getProductBySlug(params.slug), getSiteSettings()]);
  if (!product) return notFound();

  const images = product.images?.length ? product.images : product.image ? [product.image] : [];

  return <ProductDetailClient product={product} site={site} images={images} />;
}
