import PageShell from "@/components/PageShell";
import LocalizedPageHeader from "@/components/LocalizedPageHeader";
import FeatureStrip from "@/components/FeatureStrip";
import ShopBrowser from "@/components/ShopBrowser";
import PageCTA from "@/components/PageCTA";
import { getProducts, getSiteSettings } from "@/lib/data";
import { pageCtaProps } from "@/lib/cms";

export const metadata = { title: "Shop — Shreya Creations" };

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
      />
      <FeatureStrip items={shop.features || []} />
      <ShopBrowser products={products} />
      <PageCTA whatsapp={site.whatsapp} {...pageCtaProps(shop)} />
    </PageShell>
  );
}
