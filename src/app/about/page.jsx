import PageShell from "@/components/PageShell";
import LocalizedPageHeader from "@/components/LocalizedPageHeader";
import AboutClient from "@/components/AboutClient";
import PageCTA from "@/components/PageCTA";
import { getSiteSettings, getTrustStats } from "@/lib/data";
import { pickBrandMessage, pickServiceUsp } from "@/lib/i18n";
import { pageCtaProps } from "@/lib/cms";

export const metadata = { title: "About — Shreya creation" };

export default async function AboutPage() {
  const [site, trust] = await Promise.all([getSiteSettings(), getTrustStats()]);
  const about = site.pages?.about || {};
  const brandMessage = pickBrandMessage(site);
  const serviceUsp = pickServiceUsp(site);

  return (
    <PageShell>
      <LocalizedPageHeader
        eyebrow={about.headerEyebrow || brandMessage}
        eyebrowHi={about.headerEyebrowHi || brandMessage}
        title={about.headerTitle || "About Shreya creation"}
        titleHi={about.headerTitleHi}
        subtitle={about.headerSubtitle || serviceUsp}
        subtitleHi={about.headerSubtitleHi || serviceUsp}
      />
      <AboutClient site={site} trust={trust} aboutPage={about} pillars={site.aboutPillars} />
      <PageCTA whatsapp={site.whatsapp} {...pageCtaProps(about)} />
    </PageShell>
  );
}
