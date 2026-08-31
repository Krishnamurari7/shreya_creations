import HomepageClient from "@/components/HomepageClient";
import HeroBackgroundImage from "@/components/HeroBackgroundImage";
import WebMcpRegister from "@/components/WebMcpRegister";
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

export const revalidate = 3600;

const HOME_META_FALLBACK = {
  title:
    "Best Designer Boutique & Fashion Designing Institute in Boring Road, Patna | Shreya Creation",
  description:
    "Best boutique, ladies tailors & fashion designing institute on Boring Road, Patna, Bihar — bridal blouse, lehenga stitching, boutique master & silai courses. Call/WhatsApp today.",
};

export async function generateMetadata() {
  const site = await getSiteSettings();
  const home = site.pages?.home || {};
  const title = home.metaTitle || home.meta_title || HOME_META_FALLBACK.title;
  const description =
    home.metaDescription || home.meta_description || HOME_META_FALLBACK.description;

  return buildMetadata({
    title,
    description,
    path: "/",
    image: DEFAULT_OG_IMAGE,
    imageAlt: "Best designer boutique and fashion designing institute in Boring Road, Patna, Bihar",
  });
}

export default async function HomePage() {
  const [site, products, courses, portfolio, testimonials, trust] = await Promise.all([
    getSiteSettings(),
    getProducts(),
    getCourses(),
    getPortfolio(),
    getTestimonials(),
    getTrustStats(),
  ]);

  const home = site.pages?.home || {};

  return (
    <>
      <WebMcpRegister courses={courses} />
      <HomepageClient
      heroBackground={<HeroBackgroundImage />}
      home={home}
      site={site}
      products={products}
      courses={courses}
      portfolio={portfolio}
      testimonials={testimonials}
      trust={trust}
      processSteps={site.processSteps?.length ? site.processSteps : PROCESS}
    />
    </>
  );
}
