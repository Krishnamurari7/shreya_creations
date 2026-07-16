import PageShell from "@/components/PageShell";
import LocalizedPageHeader from "@/components/LocalizedPageHeader";
import ContactPageSections from "@/components/ContactPageSections";
import PageCTA from "@/components/PageCTA";
import PageSeoIntro from "@/components/PageSeoIntro";
import { getSiteSettings } from "@/lib/data";
import { waLink, contactMessage } from "@/lib/whatsapp";
import { pageCtaProps } from "@/lib/cms";
import { buildMetadata, DEFAULT_OG_IMAGE } from "@/lib/seo";

export async function generateMetadata() {
  const site = await getSiteSettings();
  return buildMetadata({
    title: "Contact Shreya Creation | Boutique & Stitching Studio, Patna",
    description:
      "Visit Shreya Creation at East Boring Canal Road, Patna. Call/WhatsApp for courses, custom stitching & bridal orders. Open Mon–Sun.",
    path: "/contact",
    image: DEFAULT_OG_IMAGE,
    imageAlt: `Boutique near me — ${site.addressLine || site.address || "East Boring Canal Road, Patna"}`,
  });
}

const DEFAULT_SUBTITLE =
  "We're just a message away — order a custom garment, enroll in a class, or ask anything.";

export default async function ContactPage() {
  const site = await getSiteSettings();
  const contact = site.pages?.contact || {};
  const wa = waLink(site.whatsapp, contact.ctaWaMessage || contactMessage());

  return (
    <PageShell>
      <LocalizedPageHeader
        compact
        eyebrow={contact.headerEyebrow || "Say hello"}
        eyebrowHi={contact.headerEyebrowHi || "नमस्ते"}
        title={contact.headerTitle || "Visit Our Boutique & Stitching Studio in Patna"}
        titleHi={contact.headerTitleHi || "पटना में हमारा बुटीक और सिलाई स्टूडियो देखें"}
        subtitle={contact.headerSubtitle || DEFAULT_SUBTITLE}
        subtitleHi={
          contact.headerSubtitleHi ||
          "एक मैसेज दूर — कस्टम परिधान, कोर्स एनरोल या कोई भी सवाल। ईस्ट बोरिंग कैनाल रोड।"
        }
      />

      <PageSeoIntro
        links={[
          { href: "/courses", label: "boutique courses in Patna" },
          { href: "/shop", label: "24-hour custom stitching" },
          { href: "/about", label: "fashion institute on Boring Road" },
        ]}
      >
        Looking for a boutique near me or a ladies tailor on Boring Road? Visit Shreya Creation at
        East Boring Canal Road, Patna for फैशन डिज़ाइनिंग कोर्स पटना, bridal orders, and custom
        stitching — many outfits ready in 24 hours. Call or WhatsApp during studio hours.
      </PageSeoIntro>

      <ContactPageSections site={site} wa={wa} />

      <PageCTA whatsapp={site.whatsapp} {...pageCtaProps(contact)} />
    </PageShell>
  );
}
