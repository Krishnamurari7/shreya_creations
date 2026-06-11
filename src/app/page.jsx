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
