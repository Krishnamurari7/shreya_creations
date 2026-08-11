export { default } from "../../../shop/[slug]/page";
import { getProductBySlug } from "@/lib/data";
import {
  buildMetadata,
  itemImage,
  itemImageAlt,
  productMetaDescription,
  productMetaTitle,
} from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return buildMetadata({
      title: "शॉप | Shreya Creation",
      description: "Shreya Creation पटना में डिज़ाइनर वियर और कस्टम सिलाई।",
      path: "/shop",
      locale: "hi",
    });
  }
  const path = `/shop/${product.slug}`;
  return buildMetadata({
    title: productMetaTitle(product, "hi"),
    description: productMetaDescription(product, "hi"),
    path,
    image: itemImage(product),
    imageAlt: itemImageAlt(product),
    locale: "hi",
  });
}
