import PageShell from "@/components/PageShell";
import BoutiqueClient from "@/components/BoutiqueClient";
import PageCTA from "@/components/PageCTA";
import JsonLdScript from "@/components/JsonLdScript";
import { getProducts, getSiteSettings, getTestimonials } from "@/lib/data";
import { pageCtaProps } from "@/lib/cms";
import { getRequestLocale } from "@/lib/locale";
import { PAGE_DEFAULTS } from "@/lib/cms/defaults";
import { buildMetadata, breadcrumbJsonLd, breadcrumbLabel } from "@/lib/seo";

export const revalidate = 3600;

const SHOP_DEFAULTS = PAGE_DEFAULTS.shop;

const SHOP_META_FALLBACK = {
  title: SHOP_DEFAULTS.meta_title,
  description: SHOP_DEFAULTS.meta_description,
};

export async function generateMetadata() {
  const site = await getSiteSettings();
  const shop = site.pages?.shop || {};
  const title = shop.metaTitle || shop.meta_title || SHOP_META_FALLBACK.title;
  const description =
    shop.metaDescription || shop.meta_description || SHOP_META_FALLBACK.description;

  return buildMetadata({
    title,
    description,
    path: "/shop",
    image:
      shop.ogImage ||
      shop.og_image ||
      "https://mvnllmfidxslxfqexkxs.supabase.co/storage/v1/object/public/media/1782239288560-v7jdgv.png",
    imageAlt: "best designer boutique in Patna",
  });
}

export default async function ShopPage({ searchParams }) {
  const params = await searchParams;
  const initialCategory = typeof params?.category === "string" ? params.category.trim() : "";
  const locale = await getRequestLocale();
  const [products, site, testimonials] = await Promise.all([
    getProducts(),
    getSiteSettings(),
    getTestimonials(),
  ]);
  const shop = site.pages?.shop || {};
  const home = site.pages?.home || {};
  const boutiqueSite = {
    whatsapp: site.whatsapp,
    yearsExperience: site.yearsExperience,
    foundingYear: site.foundingYear,
    outfitsDelivered: site.outfitsDelivered,
    expressDeliveryHours: site.expressDeliveryHours,
  };
  const shopPage = {
    ...shop,
    heroImage: shop.heroImage || home.heroImage,
  };

  return (
    <PageShell>
      <JsonLdScript
        data={breadcrumbJsonLd(
          [
            { name: breadcrumbLabel("home", locale), path: "/" },
            { name: breadcrumbLabel("shop", locale), path: "/shop" },
          ],
          locale
        )}
      />
      <BoutiqueClient
        site={boutiqueSite}
        shopPage={shopPage}
        products={products}
        testimonials={testimonials}
        initialCategory={initialCategory}
      />
      <PageCTA whatsapp={site.whatsapp} {...pageCtaProps(shop)} overrides={site.pages?.ctaBoxes?.entries} />
    </PageShell>
  );
}
