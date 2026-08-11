import PageShell from "@/components/PageShell";
import BoutiqueClient from "@/components/BoutiqueClient";
import PageCTA from "@/components/PageCTA";
import JsonLdScript from "@/components/JsonLdScript";
import { getProducts, getSiteSettings, getTestimonials } from "@/lib/data";
import { pageCtaProps } from "@/lib/cms";
import { getRequestLocale } from "@/lib/locale";
import { buildMetadata, breadcrumbJsonLd, breadcrumbLabel, DEFAULT_OG_IMAGE } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Designer Boutique in Patna | Blouses, Lehengas & 24hr Custom Stitching",
  description:
    "Shreya Creation Boutique — designer blouses, bridal lehengas, saree customisation & handwork in Patna. Custom-fit stitching, often ready in 24 hours. Order on WhatsApp.",
  path: "/shop",
  image: DEFAULT_OG_IMAGE,
  imageAlt: "Shreya Creation designer boutique and custom stitching in Patna",
});

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
