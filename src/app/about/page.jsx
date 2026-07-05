import PageShell from "@/components/PageShell";
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
      <AboutClient site={site} trust={trust} aboutPage={about} pillars={site.aboutPillars} />
      <PageCTA whatsapp={site.whatsapp} {...pageCtaProps(about)} />
    </PageShell>
  );
}
