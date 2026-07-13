import PageShell from "@/components/PageShell";
import LocalizedPageHeader from "@/components/LocalizedPageHeader";
import ContactPageSections from "@/components/ContactPageSections";
import PageCTA from "@/components/PageCTA";
import { getSiteSettings } from "@/lib/data";
import { waLink, contactMessage } from "@/lib/whatsapp";
import { pageCtaProps } from "@/lib/cms";

export const metadata = {
  title: "Contact & Visit Studio",
  description:
    "Visit Shreya creation at Sisodiya Place, East Boring Canal Road, Patna. Call +91 90311 05666 or WhatsApp for courses & custom stitching.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Shreya creation Patna",
    description: "Boutique institute & stitching studio — Boring Road, Patna. Mon–Sun 10AM–8PM.",
  },
};

const DEFAULT_SUBTITLE =
  "We're just a message away — order a custom garment, enroll in a class, or ask anything.";

function stripTrailingHighlight(title, highlight) {
  if (!title?.trim() || !highlight?.trim()) return title;
  const escaped = highlight.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return title.replace(new RegExp(`\\s*${escaped}\\s*$`, "i"), "").trim() || title;
}

export default async function ContactPage() {
  const site = await getSiteSettings();
  const contact = site.pages?.contact || {};
  const wa = waLink(site.whatsapp, contact.ctaWaMessage || contactMessage());

  const highlight = contact.headerHighlight || "Us";
  const highlightHi = contact.headerHighlightHi || "करें";
  const title = stripTrailingHighlight(contact.headerTitle || "Contact", highlight);
  const titleHi = stripTrailingHighlight(contact.headerTitleHi || "संपर्क", highlightHi);

  return (
    <PageShell>
      <LocalizedPageHeader
        compact
        eyebrow={contact.headerEyebrow || "Say hello"}
        eyebrowHi={contact.headerEyebrowHi || "नमस्ते"}
        title={title}
        titleHi={titleHi}
        highlight={highlight}
        highlightHi={highlightHi}
        subtitle={contact.headerSubtitle || DEFAULT_SUBTITLE}
        subtitleHi={contact.headerSubtitleHi || "एक मैसेज दूर — कस्टम परिधान, कोर्स एनरोल या कोई भी सवाल।"}
      />

      <ContactPageSections site={site} wa={wa} />

      <PageCTA whatsapp={site.whatsapp} {...pageCtaProps(contact)} />
    </PageShell>
  );
}
