import HomepageClient from "@/components/HomepageClient";
import HeroBackgroundImage from "@/components/HeroBackgroundImage";
import WebMcpRegister from "@/components/WebMcpRegister";
import {
  getCourses,
  getPortfolio,
  getTestimonials,
  getSiteSettings,
  getTrustStats,
} from "@/lib/data";
import { PROCESS } from "@/lib/seed";
import { buildMetadata } from "@/lib/seo";
import { MEDIA } from "@/lib/media";
import { chromeSiteProps } from "@/lib/site-config";

export const revalidate = 3600;

const HOME_META_FALLBACK = {
  title: "Best Boutique in Patna | Shreya Creation",
  description:
    "Discover Shreya Creation, the best boutique in Patna, offering designer bridal wear, custom stitching, stylish outfits, exquisite detailing, and personalised fashion solutions.",
};

const HOME_OG_IMAGE = MEDIA.slider3;

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
    image: home.ogImage || home.og_image || HOME_OG_IMAGE,
    imageSecureUrl: MEDIA.slider1,
    imageAlt: "Best Boutique in Patna",
  });
}

export default async function HomePage() {
  const [site, courses, portfolio, testimonials, trust] = await Promise.all([
    getSiteSettings(),
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
      site={chromeSiteProps(site)}
      courses={courses}
      portfolio={portfolio}
      testimonials={testimonials}
      trust={trust}
      processSteps={site.processSteps?.length ? site.processSteps : PROCESS}
    />
    </>
  );
}
