import PageShell from "@/components/PageShell";
import AboutClient from "@/components/AboutClient";
import PageCTA from "@/components/PageCTA";
import { getSiteSettings, getTrustStats } from "@/lib/data";
import { pageCtaProps } from "@/lib/cms";

export const metadata = {
  title: "About Us",
  description:
    "Shreya creation — Patna's fashion boutique institute since 2007. Learn stitching, fashion design & boutique management at East Boring Canal Road.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Shreya creation | Fashion Boutique Institute Patna",
    description:
      "17+ years training women in stitching & boutique skills in Patna. Skill that creates income.",
  },
};

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
