import PageShell from "@/components/PageShell";
import LocalizedPageHeader from "@/components/LocalizedPageHeader";
import NriClientsHighlights from "@/components/NriClientsHighlights";
import PageCTA from "@/components/PageCTA";
import JsonLdScript from "@/components/JsonLdScript";
import { getSiteSettings } from "@/lib/data";
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

  return (
    <PageShell>
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "NRI Clients", path: "/nri-clients" },
        ])}
      />
      <LocalizedPageHeader
        eyebrow="NRI services"
        eyebrowHi="NRI सेवाएँ"
        title="Bridal & boutique support for NRI clients"
        titleHi="NRI क्लाइंट्स के लिए ब्राइडल और बुटीक सपोर्ट"
        subtitle="Order from anywhere — custom stitching in Patna with WhatsApp guidance and shipping support for families in India and overseas."
        subtitleHi="कहीं से भी ऑर्डर करें — WhatsApp गाइडेंस के साथ पटना में कस्टम सिलाई, और भारत व विदेश में परिवार के लिए शिपिंग सपोर्ट।"
      />
      <NriClientsHighlights />
      <PageCTA
        whatsapp={site.whatsapp}
        eyebrow="NRI enquiry"
        eyebrowHi="NRI पूछताछ"
        title="Planning an outfit from abroad?"
        titleHi="विदेश से आउटफ़िट प्लान कर रहे हैं?"
        subtitle="Message us on WhatsApp with your occasion date, city, and reference photos — we’ll guide measurements, timeline, and shipping."
        subtitleHi="WhatsApp पर अवसर की डेट, शहर और रेफ़रेंस फ़ोटो भेजें — माप, टाइमलाइन और शिपिंग हम गाइड करेंगे।"
        primaryLabel="WhatsApp NRI desk"
        primaryLabelHi="WhatsApp NRI डेस्क"
        secondaryHref="/contact"
        secondaryLabel="Contact studio"
        secondaryLabelHi="स्टूडियो से संपर्क"
        waMessage={nriClientMessage("en")}
        perks={["Abroad orders", "Bridal dates", "Family pickup", "Courier"]}
        perksHi={["विदेश ऑर्डर", "ब्राइडल डेट", "परिवार पिकअप", "कूरियर"]}
      />
    </PageShell>
  );
}
