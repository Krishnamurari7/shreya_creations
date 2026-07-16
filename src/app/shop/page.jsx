import PageShell from "@/components/PageShell";
import LocalizedPageHeader from "@/components/LocalizedPageHeader";
import ShopBrowser from "@/components/ShopBrowser";
import PageCTA from "@/components/PageCTA";
import PageSeoIntro from "@/components/PageSeoIntro";
import { getProducts, getSiteSettings } from "@/lib/data";
import { pageCtaProps } from "@/lib/cms";
import { buildMetadata, DEFAULT_OG_IMAGE } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Designer Blouses, Lehengas & Suits in Patna | 24hr Custom Stitching",
  description:
    "Shop designer blouses, anarkali suits, bridal lehengas & gowns — custom-fit and stitched in 24 hours in Patna. Order easily on WhatsApp.",
  path: "/shop",
  image: DEFAULT_OG_IMAGE,
  imageAlt: "Designer blouses, lehengas and 24-hour custom stitching in Patna",
});

export default async function ShopPage() {
  const [products, site] = await Promise.all([getProducts(), getSiteSettings()]);
  const shop = site.pages?.shop || {};

  return (
    <PageShell>
      <LocalizedPageHeader
        eyebrow={shop.headerEyebrow || "The Shop"}
        eyebrowHi={shop.headerEyebrowHi || "दुकान"}
        title={shop.headerTitle || "Designer Wear & 24-Hour Custom Stitching in Patna"}
        titleHi={shop.headerTitleHi || "पटना में डिज़ाइनर वियर और 24 घंटे कस्टम सिलाई"}
        subtitle={
          shop.headerSubtitle ||
          "Browse designer blouses, bridal lehengas & suits — then order custom-fit stitching on WhatsApp."
        }
        subtitleHi={shop.headerSubtitleHi}
        showOrnament={false}
      />
      <PageSeoIntro
        links={[
          { href: "/portfolio", label: "bridal & designer portfolio" },
          { href: "/courses", label: "boutique courses in Patna" },
          { href: "/contact", label: "visit our Patna studio" },
        ]}
      >
        Looking for a designer blouse in Patna, bridal lehenga stitching, or a designer gown? Shreya
        Creation offers custom stitching in Patna with many styles ready in 24 hours — 24 घंटे में
        सिले कपड़े, measured and finished at our Boring Road atelier.
      </PageSeoIntro>
      <ShopBrowser products={products} whatsapp={site.whatsapp} />
      <PageCTA whatsapp={site.whatsapp} {...pageCtaProps(shop)} />
    </PageShell>
  );
}
