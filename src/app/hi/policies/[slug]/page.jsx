export { default } from "../../../policies/[slug]/page";
import { getPolicyPage } from "@/lib/data";
import { buildHiPolicyMetadata } from "@/lib/hi-seo";

const SLUGS = ["privacy", "shipping", "returns", "terms", "course-cancellation"];

export async function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = await getPolicyPage(slug);
  return buildHiPolicyMetadata(slug, page);
}
