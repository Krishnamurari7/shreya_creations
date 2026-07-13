import { notFound } from "next/navigation";
import { getProductBySlug, getSiteSettings } from "@/lib/data";
import ProductDetailClient from "@/components/ProductDetailClient";

export async function generateMetadata({ params }) {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return { title: "Shop", alternates: { canonical: "/shop" } };
  }
  const description =
    product.description ||
    `Order ${product.title} from Shreya creation Patna — custom fit, boutique finishing, WhatsApp ordering.`;
  const images = product.images?.length
    ? product.images
    : product.image
      ? [product.image]
      : undefined;
  return {
    title: product.title,
    description,
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: {
      title: `${product.title} | Shreya creation`,
      description,
      type: "website",
      ...(images?.[0] ? { images: [{ url: images[0], alt: product.title }] } : {}),
    },
  };
}

export default async function ProductDetail({ params }) {
  const [product, site] = await Promise.all([getProductBySlug(params.slug), getSiteSettings()]);
  if (!product) return notFound();

  const images = product.images?.length ? product.images : product.image ? [product.image] : [];

  return <ProductDetailClient product={product} site={site} images={images} />;
}
