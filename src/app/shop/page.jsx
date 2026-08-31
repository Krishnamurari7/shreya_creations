import PageShell from "@/components/PageShell";
import BoutiqueClient from "@/components/BoutiqueClient";
import PageCTA from "@/components/PageCTA";
import JsonLdScript from "@/components/JsonLdScript";
import { getProducts, getSiteSettings, getTestimonials } from "@/lib/data";
import { pageCtaProps } from "@/lib/cms";
import { getRequestLocale } from "@/lib/locale";
import { PAGE_DEFAULTS } from "@/lib/cms/defaults";
import { buildMetadata, breadcrumbJsonLd, breadcrumbLabel, DEFAULT_OG_IMAGE } from "@/lib/seo";

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
    image: DEFAULT_OG_IMAGE,
    imageAlt: "Best designer boutique in Patna — Shreya Creation",
  });
}

export default async function ShopPage() {
  const locale = await getRequestLocale();
  const [products, site, testimonials] = await Promise.all([
    getProducts(),
    getSiteSettings(),
    getTestimonials(),
  ]);
  const shop = site.pages?.shop || {};

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
        site={site}
        shopPage={shop}
        products={products}
        testimonials={testimonials}
      />
      <PageCTA whatsapp={site.whatsapp} {...pageCtaProps(shop)} />
    </PageShell>
  );
}
