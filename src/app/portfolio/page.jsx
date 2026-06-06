import PageShell from "@/components/PageShell";
import LocalizedPageHeader from "@/components/LocalizedPageHeader";
import LocalizedSectionHeader from "@/components/LocalizedSectionHeader";
import PortfolioGallery from "@/components/PortfolioGallery";
import FeatureStrip from "@/components/FeatureStrip";
import PageCTA from "@/components/PageCTA";
import { TrustWall } from "@/components/Sections";
import { getPortfolio, getSiteSettings, getTrustStats } from "@/lib/data";
import { pageCtaProps } from "@/lib/cms";

export const metadata = { title: "Portfolio — Shreya creation" };

export default async function PortfolioPage() {
  const [items, site, trust] = await Promise.all([getPortfolio(), getSiteSettings(), getTrustStats()]);
  const portfolio = site.pages?.portfolio || {};

  return (
    <PageShell>
      <LocalizedPageHeader
        eyebrow={portfolio.headerEyebrow || "Our work"}
        eyebrowHi={portfolio.headerEyebrowHi}
        title={portfolio.headerTitle || "Portfolio"}
        titleHi={portfolio.headerTitleHi}
        subtitle={portfolio.headerSubtitle || "A curated lookbook of lehengas, gowns, blouses and bridal pieces crafted at our Patna atelier."}
        subtitleHi={portfolio.headerSubtitleHi}
      />

      <section className="relative z-20">
        <PortfolioGallery items={items} fullPage />
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-5 py-12 sm:py-16 relative z-20">
        <LocalizedSectionHeader
          eyebrow={portfolio.trustEyebrow || "By the numbers"}
          eyebrowHi={portfolio.trustEyebrowHi}
          title={portfolio.trustTitle || "Trusted craftsmanship"}
          titleHi={portfolio.trustTitleHi}
        />
        <TrustWall items={trust} localize />
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-5 pb-12 sm:pb-16 relative z-20">
        <LocalizedSectionHeader
          eyebrow={portfolio.craftEyebrow || "Specialities"}
          eyebrowHi={portfolio.craftEyebrowHi}
          title={portfolio.craftTitle || "What we create"}
          titleHi={portfolio.craftTitleHi}
          subtitle={portfolio.craftSubtitle || "Every piece in our portfolio is made to order — share your inspiration on WhatsApp and we'll bring it to life."}
          subtitleHi={portfolio.craftSubtitleHi}
        />
        <FeatureStrip items={portfolio.craftHighlights || []} />
      </section>

      <PageCTA whatsapp={site.whatsapp} {...pageCtaProps(portfolio)} />
    </PageShell>
  );
}
