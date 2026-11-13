import { PAGE_CONTAINER } from "@/lib/ui";
import { cn } from "@/lib/utils";
import PageShell from "@/components/PageShell";
import LocalizedPageHeader from "@/components/LocalizedPageHeader";
import LocalizedSectionHeader from "@/components/LocalizedSectionHeader";
import PortfolioGallery from "@/components/PortfolioGallery";
import FeatureStrip from "@/components/FeatureStrip";
import PageCTA from "@/components/PageCTA";
import PageSeoIntro from "@/components/PageSeoIntro";
import JsonLdScript from "@/components/JsonLdScript";
import { TrustWall } from "@/components/Sections";
import { getPortfolio, getSiteSettings, getTrustStats } from "@/lib/data";
import { pageCtaProps } from "@/lib/cms";
import { getRequestLocale } from "@/lib/locale";
import { buildMetadata, breadcrumbJsonLd, breadcrumbLabel, DEFAULT_OG_IMAGE } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "Bridal & Designer Work Portfolio | Shreya Creation Patna",
  description:
    "See bridal lehengas, gowns & designer blouses crafted at our Patna atelier. Custom-made to your measurements — many styles ready in 24 hours.",
  path: "/portfolio",
  image: DEFAULT_OG_IMAGE,
  imageAlt: "Bridal and designer work portfolio from Shreya Creation Patna",
});

export default async function PortfolioPage() {
  const locale = await getRequestLocale();
  const [items, site, trust] = await Promise.all([
    getPortfolio(),
    getSiteSettings(),
    getTrustStats(),
  ]);
  const portfolio = site.pages?.portfolio || {};

  return (
    <PageShell>
      <JsonLdScript
        data={breadcrumbJsonLd(
          [
            { name: breadcrumbLabel("home", locale), path: "/" },
            { name: breadcrumbLabel("portfolio", locale), path: "/portfolio" },
          ],
          locale
        )}
      />
      <LocalizedPageHeader
        eyebrow={portfolio.headerEyebrow || "Our work"}
        eyebrowHi={portfolio.headerEyebrowHi || "हमारा काम"}
        title={portfolio.headerTitle || "Our Bridal & Designer Work"}
        titleHi={portfolio.headerTitleHi || "हमारा ब्राइडल और डिज़ाइनर काम"}
        subtitle={
          portfolio.headerSubtitle ||
          "A curated lookbook of lehengas, gowns, blouses and bridal pieces crafted at our Patna atelier."
        }
        subtitleHi={portfolio.headerSubtitleHi}
      />

      <PageSeoIntro
        links={[
          { href: "/shop", label: "order custom stitching in Patna", labelHi: "पटना में कस्टम सिलाई ऑर्डर" },
          { href: "/contact", label: "book a bridal consultation", labelHi: "ब्राइडल परामर्श बुक करें" },
        ]}
        childrenHi="हमारा पटना ब्राइडल बुटीक देखें — वेडिंग लहंगा, रिसेप्शन गाउन और डिज़ाइनर ब्राइडल वियर आपके माप पर। इस गैलरी के कई लुक बोरिंग रोड पर 24 घंटे एक्सप्रेस डिलीवरी में दोहराए जा सकते हैं।"
      >
        Explore our bridal boutique in Patna — wedding lehengas, reception gowns, and designer
        bridal wear stitched to your measurements. Many looks from this gallery can be recreated with
        24-hour express delivery on Boring Road.
      </PageSeoIntro>

      <section className="relative z-20">
        <PortfolioGallery items={items} fullPage />
      </section>

      <section
        className={cn(
          PAGE_CONTAINER,
          "max-w-6xl",
          "py-12",
          "sm:py-16",
          "lg:py-20",
          "relative",
          "z-20",
          "trust-stats-section"
        )}
      >
        <LocalizedSectionHeader
          eyebrow={portfolio.trustEyebrow || "By the numbers"}
          eyebrowHi={portfolio.trustEyebrowHi}
          title={portfolio.trustTitle || "Trusted craftsmanship"}
          titleHi={portfolio.trustTitleHi}
        />
        <TrustWall items={trust} localize />
      </section>

      <section className={cn(PAGE_CONTAINER, "max-w-6xl", "pb-12", "sm:pb-16", "relative", "z-20")}>
        <LocalizedSectionHeader
          eyebrow={portfolio.craftEyebrow || "Specialities"}
          eyebrowHi={portfolio.craftEyebrowHi}
          title={portfolio.craftTitle || "What we create"}
          titleHi={portfolio.craftTitleHi}
          subtitle={
            portfolio.craftSubtitle ||
            "Every piece in our portfolio is made to order — share your inspiration on WhatsApp and we'll bring it to life."
          }
          subtitleHi={portfolio.craftSubtitleHi}
        />
        <FeatureStrip items={portfolio.craftHighlights || []} />
      </section>

      <PageCTA whatsapp={site.whatsapp} {...pageCtaProps(portfolio)} overrides={site.pages?.ctaBoxes?.entries} />
    </PageShell>
  );
}
