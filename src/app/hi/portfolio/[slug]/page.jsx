export { default } from "../../../portfolio/[slug]/page";
import { getPortfolioBySlug } from "@/lib/data";
import {
  buildMetadata,
  itemImage,
  itemImageAlt,
  portfolioMetaDescription,
  portfolioMetaTitle,
} from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const item = await getPortfolioBySlug(slug);
  if (!item) {
    return buildMetadata({
      title: "पोर्टफोलियो | Shreya Creation पटना",
      description: "Shreya Creation पटना से ब्राइडल और डिज़ाइनर काम।",
      path: "/portfolio",
      locale: "hi",
    });
  }
  const path = `/portfolio/${item.slug}`;
  return buildMetadata({
    title: portfolioMetaTitle(item, "hi"),
    description: portfolioMetaDescription(item, "hi"),
    path,
    image: itemImage(item),
    imageAlt: itemImageAlt(item),
    locale: "hi",
  });
}
