import PageShell from "@/components/PageShell";
import LocalizedPageHeader from "@/components/LocalizedPageHeader";
import ContactPageSections from "@/components/ContactPageSections";
import PageCTA from "@/components/PageCTA";
import { getSiteSettings } from "@/lib/data";
import { waLink, greetingMessage } from "@/lib/whatsapp";
import { pageCtaProps } from "@/lib/cms";

export const metadata = { title: "Contact — Shreya creation" };

const DEFAULT_SUBTITLE =
  "We're just a message away — order a custom garment, enroll in a class, or ask anything.";

export default async function ContactPage() {
  const site = await getSiteSettings();
  const contact = site.pages?.contact || {};
  const wa = waLink(site.whatsapp, greetingMessage());

  return (
    <PageShell>
      <LocalizedPageHeader
        eyebrow={contact.headerEyebrow || "Say hello"}
        eyebrowHi={contact.headerEyebrowHi}
        title={contact.headerTitle || "Contact"}
        titleHi={contact.headerTitleHi}
        highlight={contact.headerHighlight || "Us"}
        highlightHi={contact.headerHighlightHi || "करें"}
        subtitle={contact.headerSubtitle || DEFAULT_SUBTITLE}
        subtitleHi={contact.headerSubtitleHi}
      />

      <ContactPageSections site={site} wa={wa} />

      <PageCTA whatsapp={site.whatsapp} {...pageCtaProps(contact)} />
    </PageShell>
  );
}
