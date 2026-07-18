import { notFound } from "next/navigation";
import { getProductBySlug, getSiteSettings } from "@/lib/data";
import ProductDetailClient from "@/components/ProductDetailClient";
import JsonLdScript from "@/components/JsonLdScript";
import {
  buildMetadata,
  breadcrumbJsonLd,
  itemImage,
  itemImageAlt,
  productJsonLd,
  productMetaDescription,
  productMetaTitle,
} from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return buildMetadata({
      title: "Shop | Shreya Creation",
      description: "Designer wear and custom stitching in Patna.",
      path: "/shop",
    });
  }
  const path = `/shop/${product.slug}`;
  const title = productMetaTitle(product);
  const description = productMetaDescription(product);
  const image = itemImage(product);
  return buildMetadata({
    title,
    description,
    path,
    image,
    imageAlt: itemImageAlt(product),
  });
}

export default async function ProductDetail({ params }) {
  const { slug } = await params;
  const [product, site] = await Promise.all([getProductBySlug(slug), getSiteSettings()]);
  if (!product) return notFound();

  const images = product.images?.length ? product.images : product.image ? [product.image] : [];

  return (
    <>
      <JsonLdScript data={productJsonLd(product)} />
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Shop", path: "/shop" },
          { name: product.title, path: `/shop/${product.slug}` },
        ])}
      />
      <ProductDetailClient product={product} site={site} images={images} />
    </>
  );
}
