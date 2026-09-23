import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import BoutiqueServiceLandingClient from "@/components/BoutiqueServiceLandingClient";
import JsonLdScript from "@/components/JsonLdScript";
import { getProducts, getSiteSettings, getTestimonials } from "@/lib/data";
import { PAGE_DEFAULTS } from "@/lib/cms/defaults";
import { getRequestLocale } from "@/lib/locale";
import { buildMetadata, breadcrumbJsonLd, breadcrumbLabel } from "@/lib/seo";
import {
  BOUTIQUE_SERVICE_SLUGS,
  filterProductsForBoutiqueService,
  getBoutiqueService,
} from "@/lib/boutique-services";
import { getBoutiqueLanding, resolveBoutiqueLanding } from "@/lib/boutique-service-landing";

export const revalidate = 3600;

export function generateStaticParams() {
  return BOUTIQUE_SERVICE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = getBoutiqueService(slug);
  if (!service) return {};

  const locale = await getRequestLocale();
  const site = await getSiteSettings();
  const defaults = PAGE_DEFAULTS[service.cmsKey] || {};
  const page = site.pages?.[service.cmsKey] || {};
  const landing = resolveBoutiqueLanding(slug, page) || getBoutiqueLanding(slug);
  const hi = locale === "hi";

  return buildMetadata({
    title:
      (hi && (page.metaTitleHi || page.meta_title_hi)) ||
      page.metaTitle ||
      page.meta_title ||
      (hi ? `${service.navLabelHi} | Shreya Creation` : defaults.meta_title),
    description:
      (hi && (page.metaDescriptionHi || page.meta_description_hi)) ||
      page.metaDescription ||
      page.meta_description ||
      defaults.meta_description,
    path: service.href,
    locale,
    image:
      page.ogImage ||
      page.og_image ||
      page.heroImage ||
      page.hero_image ||
      defaults.og_image ||
      landing?.heroImage,
    imageAlt:
      page.headerTitle ||
      page.header_title ||
      (hi ? landing?.h1Hi || service.navLabelHi : landing?.h1 || service.navLabel),
  });
}

export default async function BoutiqueServicePage({ params }) {
  const { slug } = await params;
  const service = getBoutiqueService(slug);
  if (!service) notFound();

  const landing = getBoutiqueLanding(slug);
  if (!landing) notFound();

  const locale = await getRequestLocale();
  const [products, site, testimonials] = await Promise.all([
    getProducts(),
    getSiteSettings(),
    getTestimonials(),
  ]);

  const cmsPage = site.pages?.[service.cmsKey] || {};
  const shopPage = {
    ...cmsPage,
    heroImage: cmsPage.heroImage || undefined,
  };
  const filtered = filterProductsForBoutiqueService(products, service);
  const boutiqueSite = {
    whatsapp: site.whatsapp,
    yearsExperience: site.yearsExperience,
    foundingYear: site.foundingYear,
    outfitsDelivered: site.outfitsDelivered,
    expressDeliveryHours: site.expressDeliveryHours,
    address: site.address,
  };

  return (
    <PageShell>
      <JsonLdScript
        data={breadcrumbJsonLd(
          [
            { name: breadcrumbLabel("home", locale), path: "/" },
            { name: breadcrumbLabel("boutique", locale), path: "/shop" },
            {
              name: locale === "hi" ? service.navLabelHi : service.navLabel,
              path: service.href,
            },
          ],
          locale
        )}
      />
      <BoutiqueServiceLandingClient
        slug={service.slug}
        site={boutiqueSite}
        shopPage={shopPage}
        products={filtered}
        testimonials={testimonials}
      />
    </PageShell>
  );
}
