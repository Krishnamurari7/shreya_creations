import PageShell from "@/components/PageShell";
import LocalizedPageHeader from "@/components/LocalizedPageHeader";
import ContactPageSections from "@/components/ContactPageSections";
import PageCTA from "@/components/PageCTA";
import PageSeoIntro from "@/components/PageSeoIntro";
import JsonLdScript from "@/components/JsonLdScript";
import { getSiteSettings } from "@/lib/data";
import { waLink, contactMessage } from "@/lib/whatsapp";
import { pageCtaProps } from "@/lib/cms";
import { getRequestLocale } from "@/lib/locale";
import { buildMetadata, breadcrumbJsonLd, breadcrumbLabel, DEFAULT_OG_IMAGE } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata() {
  const site = await getSiteSettings();
  const hours = site.studioHours || "Mon–Sat, 11 AM–8 PM";
  const closed = site.closedDays ? `, closed ${site.closedDays}` : "";
  return buildMetadata({
    title: "Contact Shreya Creation | Boutique & Stitching Studio, Patna",
    description: `Visit Shreya Creation at East Boring Canal Road, Patna. Call/WhatsApp for courses, custom stitching & bridal orders. Open ${hours}${closed}.`,
    path: "/contact",
    image: DEFAULT_OG_IMAGE,
    imageAlt: `Boutique near me — ${site.addressLine || site.address || "East Boring Canal Road, Patna"}`,
  });
}

const DEFAULT_SUBTITLE =
  "We're just a message away — order a custom garment, enroll in a class, or ask anything.";

export default async function ContactPage() {
  const locale = await getRequestLocale();
  const site = await getSiteSettings();
  const contact = site.pages?.contact || {};
  const wa = waLink(site.whatsapp, contact.ctaWaMessage || contactMessage());

  return (
    <PageShell>
      <JsonLdScript
        data={breadcrumbJsonLd(
          [
            { name: breadcrumbLabel("home", locale), path: "/" },
            { name: breadcrumbLabel("contact", locale), path: "/contact" },
          ],
          locale
        )}
      />
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
          { href: "/courses", label: "boutique courses in Patna", labelHi: "पटना में बुटीक कोर्स" },
          { href: "/shop", label: "24-hour custom stitching", labelHi: "24 घंटे कस्टम सिलाई" },
          { href: "/about", label: "fashion institute on Boring Road", labelHi: "बोरिंग रोड पर फैशन इंस्टिट्यूट" },
        ]}
        childrenHi="पटना में बुटीक या बोरिंग रोड पर लेडीज़ टेलर ढूँढ रहे हैं? Shreya Creation, ईस्ट बोरिंग कैनाल रोड पर — फैशन डिज़ाइनिंग कोर्स, ब्राइडल ऑर्डर और कस्टम सिलाई। कई परिधान 24 घंटे में। स्टूडियो समय पर कॉल या WhatsApp करें।"
      >
        Looking for a boutique near me or a ladies tailor on Boring Road? Visit Shreya Creation at
        East Boring Canal Road, Patna for फैशन डिज़ाइनिंग कोर्स पटना, bridal orders, and custom
        stitching — many outfits ready in 24 hours. Call or WhatsApp during studio hours.
      </PageSeoIntro>

      <ContactPageSections site={site} wa={wa} />

      <PageCTA whatsapp={site.whatsapp} {...pageCtaProps(contact)} overrides={site.pages?.ctaBoxes?.entries} />
    </PageShell>
  );
}
