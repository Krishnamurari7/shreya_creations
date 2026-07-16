import PageShell from "@/components/PageShell";
import AboutClient from "@/components/AboutClient";
import PageCTA from "@/components/PageCTA";
import { getSiteSettings, getTrustStats } from "@/lib/data";
import { pageCtaProps } from "@/lib/cms";
import { buildMetadata, DEFAULT_OG_IMAGE } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About Shreya Creation | Fashion Boutique Institute in Patna",
  description:
    "Patna's trusted fashion boutique & training institute. From skill to business — bespoke stitching, bridal couture & job-oriented fashion courses.",
  path: "/about",
  image: DEFAULT_OG_IMAGE,
  imageAlt: "About Shreya Creation fashion boutique institute in Patna",
});

export default async function AboutPage() {
  const [site, trust] = await Promise.all([getSiteSettings(), getTrustStats()]);
  const about = site.pages?.about || {};

  return (
    <PageShell>
      <AboutClient site={site} trust={trust} aboutPage={about} pillars={site.aboutPillars} />
      <PageCTA
        whatsapp={site.whatsapp}
        {...pageCtaProps(about)}
        eyebrow="Academy Visit"
        eyebrowHi="अकादमी विज़िट"
        perks={["Studio tour", "Course guidance", "Batch timings", "Free demo"]}
        perksHi={["स्टूडियो टूर", "कोर्स गाइडेंस", "बैच समय", "मुफ़्त डेमो"]}
      />
    </PageShell>
  );
}
