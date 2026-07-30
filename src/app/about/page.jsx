import PageShell from "@/components/PageShell";
import AboutClient from "@/components/AboutClient";
import PageCTA from "@/components/PageCTA";
import { getSiteSettings } from "@/lib/data";
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
  const site = await getSiteSettings();
  const about = site.pages?.about || {};

  return (
    <PageShell>
      <AboutClient site={site} aboutPage={about} />
      <PageCTA
        whatsapp={site.whatsapp}
        {...pageCtaProps(about)}
        eyebrow="Visit Us"
        eyebrowHi="हमसे मिलें"
        perks={["Studio tour", "Boutique consult", "Course guidance", "Free demo"]}
        perksHi={["स्टूडियो टूर", "बुटीक सलाह", "कोर्स गाइडेंस", "मुफ़्त डेमो"]}
      />
    </PageShell>
  );
}
