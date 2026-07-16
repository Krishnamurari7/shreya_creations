import HomepageClient from "@/components/HomepageClient";
import {
  getProducts,
  getCourses,
  getPortfolio,
  getTestimonials,
  getSiteSettings,
  getTrustStats,
} from "@/lib/data";
import { PROCESS } from "@/lib/seed";
import { buildMetadata, DEFAULT_OG_IMAGE } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Fashion Boutique Institute & 24hr Stitching in Patna | Shreya Creation",
  description:
    "Learn fashion designing & boutique courses in Patna, or get custom outfits stitched in 24 hours — bridal lehengas, designer blouses & more. Call/WhatsApp today.",
  path: "/",
  image: DEFAULT_OG_IMAGE,
  imageAlt: "Fashion boutique institute and 24-hour stitching studio in Patna",
});

export default async function HomePage() {
  const [site, products, courses, portfolio, testimonials, trust] = await Promise.all([
    getSiteSettings(),
    getProducts(),
    getCourses(),
    getPortfolio(),
    getTestimonials(),
    getTrustStats(),
  ]);

  return (
    <HomepageClient
      site={site}
      products={products}
      courses={courses}
      portfolio={portfolio}
      testimonials={testimonials}
      trust={trust}
      processSteps={site.processSteps?.length ? site.processSteps : PROCESS}
    />
  );
}
