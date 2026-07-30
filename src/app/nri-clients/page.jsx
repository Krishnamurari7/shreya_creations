import PageShell from "@/components/PageShell";
import LocalizedPageHeader from "@/components/LocalizedPageHeader";
import NriClientsHighlights from "@/components/NriClientsHighlights";
import FeatureStrip from "@/components/FeatureStrip";
import PageCTA from "@/components/PageCTA";
import PageSeoIntro from "@/components/PageSeoIntro";
import JsonLdScript from "@/components/JsonLdScript";
import { getSiteSettings } from "@/lib/data";
import { pageCtaProps } from "@/lib/cms";
import { buildMetadata, breadcrumbJsonLd, DEFAULT_OG_IMAGE } from "@/lib/seo";
import { nriClientMessage } from "@/lib/whatsapp";

export const metadata = buildMetadata({
  title: "NRI Clients | Custom Bridal & Boutique Shipping | Shreya Creation",
  description:
    "NRI bridal wear, custom stitching and worldwide shipping support from Shreya Creation Patna — measurements via WhatsApp, fittings guidance, and secure courier.",
  path: "/nri-clients",
  image: DEFAULT_OG_IMAGE,
  imageAlt: "NRI bridal and boutique services from Shreya Creation Patna",
});

export default async function NriClientsPage() {
  const site = await getSiteSettings();
  const nri = site.pages?.nri || {};
  const cta = pageCtaProps(nri);

  return (
    <PageShell>
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "NRI Clients", path: "/nri-clients" },
        ])}
      />
      <LocalizedPageHeader
        eyebrow={nri.headerEyebrow || "NRI services"}
        eyebrowHi={nri.headerEyebrowHi || "NRI सेवाएँ"}
        title={nri.headerTitle || "Bridal & Boutique Support for NRI Clients"}
        titleHi={nri.headerTitleHi || "NRI क्लाइंट्स के लिए ब्राइडल और बुटीक सपोर्ट"}
        subtitle={
          nri.headerSubtitle ||
          "Order from anywhere — custom stitching in Patna with WhatsApp guidance and shipping support for families in India and overseas."
        }
        subtitleHi={nri.headerSubtitleHi}
      />

      <PageSeoIntro
        links={[
          { href: "/shop", label: "custom stitching in Patna" },
          { href: "/portfolio", label: "bridal portfolio" },
          { href: "/lookbook", label: "style lookbook" },
          { href: "/contact", label: "contact the studio" },
        ]}
      >
        Living abroad and need bridal or festive wear from Patna? Shreya Creation supports NRI
        clients with WhatsApp measurements, boutique stitching on Boring Road, and courier or family
        pickup — so outfits arrive on time for weddings and celebrations.
      </PageSeoIntro>

      <FeatureStrip items={nri.features || []} />

      <NriClientsHighlights
        highlights={nri.highlights}
        processEyebrow={nri.processEyebrow}
        processEyebrowHi={nri.processEyebrowHi}
        processTitle={nri.processTitle}
        processTitleHi={nri.processTitleHi}
        processSubtitle={nri.processSubtitle}
        processSubtitleHi={nri.processSubtitleHi}
        processSteps={nri.processSteps}
      />

      <PageCTA
        whatsapp={site.whatsapp}
        {...cta}
        eyebrow="NRI enquiry"
        eyebrowHi="NRI पूछताछ"
        waMessage={cta.waMessage || nriClientMessage("en")}
        perks={["Abroad orders", "Bridal dates", "Family pickup", "Courier"]}
        perksHi={["विदेश ऑर्डर", "ब्राइडल डेट", "परिवार पिकअप", "कूरियर"]}
      />
    </PageShell>
  );
}
