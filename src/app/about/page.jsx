import PageShell from "@/components/PageShell";
import AboutClient from "@/components/AboutClient";
import PageCTA from "@/components/PageCTA";
import JsonLdScript from "@/components/JsonLdScript";
import { getSiteSettings } from "@/lib/data";
import { pageCtaProps } from "@/lib/cms";
import { getRequestLocale } from "@/lib/locale";
import { buildMetadata, breadcrumbJsonLd, breadcrumbLabel, DEFAULT_OG_IMAGE } from "@/lib/seo";

export const revalidate = 3600;

const ABOUT_META_FALLBACK = {
  title: "Best Fashion Designing in Patna | Shreya Creation",
  description:
    "Discover Shreya Creation for the best fashion designing in Patna, with practical training, boutique skills, bridal wear, designer stitching and hands-on learning.",
};

export async function generateMetadata() {
  const site = await getSiteSettings();
  const about = site.pages?.about || {};
  const title = about.metaTitle || about.meta_title || ABOUT_META_FALLBACK.title;
  const description =
    about.metaDescription || about.meta_description || ABOUT_META_FALLBACK.description;

  return buildMetadata({
    title,
    description,
    path: "/about",
    image: DEFAULT_OG_IMAGE,
    imageAlt: "About Shreya Creation — best fashion designing in Patna",
  });
}

export default async function AboutPage() {
  const locale = await getRequestLocale();
  const site = await getSiteSettings();
  const about = site.pages?.about || {};

  return (
    <PageShell>
      <JsonLdScript
        data={breadcrumbJsonLd(
          [
            { name: breadcrumbLabel("home", locale), path: "/" },
            { name: breadcrumbLabel("about", locale), path: "/about" },
          ],
          locale
        )}
      />
      <AboutClient site={site} aboutPage={about} />
      <PageCTA whatsapp={site.whatsapp} {...pageCtaProps(about)} />
    </PageShell>
  );
}
