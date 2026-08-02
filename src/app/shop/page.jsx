import PageShell from "@/components/PageShell";
import BoutiqueClient from "@/components/BoutiqueClient";
import PageCTA from "@/components/PageCTA";
import { getProducts, getSiteSettings, getTestimonials } from "@/lib/data";
import { pageCtaProps } from "@/lib/cms";
import { buildMetadata, DEFAULT_OG_IMAGE } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Designer Boutique in Patna | Blouses, Lehengas & 24hr Custom Stitching",
  description:
    "Shreya Creation Boutique — designer blouses, bridal lehengas, saree customisation & handwork in Patna. Custom-fit stitching, often ready in 24 hours. Order on WhatsApp.",
  path: "/shop",
  image: DEFAULT_OG_IMAGE,
  imageAlt: "Shreya Creation designer boutique and custom stitching in Patna",
});

export default async function ShopPage() {
  const [products, site, testimonials] = await Promise.all([
    getProducts(),
    getSiteSettings(),
    getTestimonials(),
  ]);
  const shop = site.pages?.shop || {};

  return (
    <PageShell>
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
