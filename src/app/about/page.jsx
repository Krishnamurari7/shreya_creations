import PageShell from "@/components/PageShell";
import AboutClient from "@/components/AboutClient";
import PageCTA from "@/components/PageCTA";
import JsonLdScript from "@/components/JsonLdScript";
import { getSiteSettings } from "@/lib/data";
import { pageCtaProps } from "@/lib/cms";
import { getRequestLocale } from "@/lib/locale";
import { buildMetadata, breadcrumbJsonLd, breadcrumbLabel, DEFAULT_OG_IMAGE } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About Shreya Creation | Fashion Boutique Institute in Patna",
  description:
    "Patna's trusted fashion boutique & training institute. From skill to business — bespoke stitching, bridal couture & job-oriented fashion courses.",
  path: "/about",
  image: DEFAULT_OG_IMAGE,
  imageAlt: "About Shreya Creation fashion boutique institute in Patna",
});

export default async function AboutPage() {
  const locale = await getRequestLocale();
  const site = await getSiteSettings();
  const about = site.pages?.about || {};

  return (
    <PageShell>
      <JsonLdScript
        data={breadcrumbJsonLd(
          [
            { name: breadcrumbLabel("home", locale), path: "/" },
            { name: breadcrumbLabel("about", locale), path: "/about" },
          ],
          locale
        )}
      />
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
