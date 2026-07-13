import PageShell from "@/components/PageShell";
import LocalizedPageHeader from "@/components/LocalizedPageHeader";
import ShopBrowser from "@/components/ShopBrowser";
import PageCTA from "@/components/PageCTA";
import { getProducts, getSiteSettings } from "@/lib/data";
import { pageCtaProps } from "@/lib/cms";

export const metadata = {
  title: "Shop Designer Wear & Custom Stitching",
  description:
    "Order designer blouses, suits, lehengas & gowns from Shreya creation Patna. Custom fit stitching — many styles delivered in 24 hours.",
  alternates: { canonical: "/shop" },
  openGraph: {
    title: "Boutique Shop Patna | 24hr Custom Stitching",
    description: "Designer wear & custom stitching on WhatsApp — Shreya creation, Boring Road.",
  },
};

export default async function ShopPage() {
  const [products, site] = await Promise.all([getProducts(), getSiteSettings()]);
  const shop = site.pages?.shop || {};

  return (
    <PageShell>
      <LocalizedPageHeader
        eyebrow={shop.headerEyebrow || "The Shop"}
        eyebrowHi={shop.headerEyebrowHi}
        title={shop.headerTitle || "Made-to-order"}
        titleHi={shop.headerTitleHi}
        highlight={shop.headerHighlight || "couture"}
        highlightHi={shop.headerHighlightHi}
        subtitle={shop.headerSubtitle || "Browse the collection, then order or get it stitched to your size on WhatsApp."}
        subtitleHi={shop.headerSubtitleHi}
        showOrnament={false}
      />
      <ShopBrowser products={products} whatsapp={site.whatsapp} />
      <PageCTA whatsapp={site.whatsapp} {...pageCtaProps(shop)} />
    </PageShell>
  );
}
