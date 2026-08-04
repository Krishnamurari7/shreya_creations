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
  title: "Best Designer Boutique & Fashion Designing Institute in Boring Road, Patna | Shreya Creation",
  description:
    "Best boutique, ladies tailors & fashion designing institute on Boring Road, Patna, Bihar — bridal blouse, lehenga stitching, boutique master & silai courses. Call/WhatsApp today.",
  path: "/",
  image: DEFAULT_OG_IMAGE,
  imageAlt: "Best designer boutique and fashion designing institute in Boring Road, Patna, Bihar",
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
