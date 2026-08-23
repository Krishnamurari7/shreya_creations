export { default } from "../../../blog/[slug]/page";
import { getLookbookPostBySlug } from "@/lib/data";
import {
  buildMetadata,
  itemImage,
  itemImageAlt,
  lookbookMetaDescription,
  lookbookMetaTitle,
} from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getLookbookPostBySlug(slug);
  if (!post) {
    return buildMetadata({
      title: "ब्लॉग | Shreya Creation पटना",
      description: "Shreya Creation पटना से स्टाइल टिप्स और एटेलियर गाइड।",
      path: "/blog",
      locale: "hi",
    });
  }
  const path = `/blog/${post.slug}`;
  return buildMetadata({
    title: lookbookMetaTitle(post, "hi"),
    description: lookbookMetaDescription(post, "hi"),
    path,
    image: itemImage(post),
    imageAlt: itemImageAlt(post),
    type: "article",
    locale: "hi",
  });
}
