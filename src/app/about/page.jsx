import PageShell from "@/components/PageShell";
import LocalizedPageHeader from "@/components/LocalizedPageHeader";
import AboutClient from "@/components/AboutClient";
import PageCTA from "@/components/PageCTA";
import { getSiteSettings, getTrustStats } from "@/lib/data";
import { pageCtaProps } from "@/lib/cms";

export const metadata = { title: "About — Shreya Creations" };

export default async function AboutPage() {
  const [site, trust] = await Promise.all([getSiteSettings(), getTrustStats()]);
  const about = site.pages?.about || {};

  return (
    <PageShell>
      <LocalizedPageHeader
        eyebrow={about.headerEyebrow || site.boutique || "Our story"}
        eyebrowHi={about.headerEyebrowHi}
        title={about.headerTitle || "About Shreya Creations"}
        titleHi={about.headerTitleHi}
        subtitle={about.headerSubtitle || site.tagline}
        subtitleHi={about.headerSubtitleHi}
      />
      <AboutClient site={site} trust={trust} aboutPage={about} pillars={site.aboutPillars} />
      <PageCTA whatsapp={site.whatsapp} {...pageCtaProps(about)} />
    </PageShell>
  );
}
