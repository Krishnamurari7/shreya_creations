import { notFound } from "next/navigation";
import { getProductBySlug, getSiteSettings } from "@/lib/data";
import ProductDetailClient from "@/components/ProductDetailClient";
import PageCTA from "@/components/PageCTA";
import JsonLdScript from "@/components/JsonLdScript";
import { getRequestLocale } from "@/lib/locale";
import {
  buildMetadata,
  breadcrumbJsonLd,
  breadcrumbLabel,
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
  const locale = await getRequestLocale();
  const [product, site] = await Promise.all([getProductBySlug(slug), getSiteSettings()]);
  if (!product) return notFound();

  const images = product.images?.length ? product.images : product.image ? [product.image] : [];
  const productTitle =
    locale === "hi" && (product.title_hi || product.titleHi)
      ? product.title_hi || product.titleHi
      : product.title;

  return (
    <>
      <JsonLdScript data={productJsonLd(product, locale)} />
      <JsonLdScript
        data={breadcrumbJsonLd(
          [
            { name: breadcrumbLabel("home", locale), path: "/" },
            { name: breadcrumbLabel("shop", locale), path: "/shop" },
            { name: productTitle, path: `/shop/${product.slug}` },
          ],
          locale
        )}
      />
      <ProductDetailClient product={product} site={site} images={images} />
      <PageCTA whatsapp={site.whatsapp} overrides={site.pages?.ctaBoxes?.entries} />
    </>
  );
}
