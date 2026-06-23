import PageShell from "@/components/PageShell";
import LocalizedPageHeader from "@/components/LocalizedPageHeader";
import AboutClient from "@/components/AboutClient";
import PageCTA from "@/components/PageCTA";
import { getSiteSettings, getTrustStats } from "@/lib/data";
import { pageCtaProps } from "@/lib/cms";

export const metadata = { title: "About — Shreya Creation" };

export default async function AboutPage() {
  const [site, trust] = await Promise.all([getSiteSettings(), getTrustStats()]);
  const about = site.pages?.about || {};

  return (
    <PageShell>
      <LocalizedPageHeader
        compact
        eyebrow={about.headerEyebrow || "Our Story"}
        eyebrowHi={about.headerEyebrowHi || "हमारी कहानी"}
        title={about.headerTitle || "About Shreya Creation"}
        titleHi={about.headerTitleHi || "श्रेया क्रिएशन के बारे में"}
        highlight={about.heroTitleHighlight || "17+ Years"}
        highlightHi={about.heroTitleHighlightHi || "17+ वर्ष"}
        subtitle={
          about.headerSubtitle ||
          "Patna's trusted fashion training institute & designer boutique"
        }
        subtitleHi={
          about.headerSubtitleHi ||
          "पटना का भरोसेमंद फैशन ट्रेनिंग और डिज़ाइनर बुटीक"
        }
      />
      <AboutClient site={site} trust={trust} aboutPage={about} pillars={site.aboutPillars} />
      <PageCTA whatsapp={site.whatsapp} {...pageCtaProps(about)} />
    </PageShell>
  );
}
