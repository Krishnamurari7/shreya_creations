import PageShell from "@/components/PageShell";
import LocalizedPageHeader from "@/components/LocalizedPageHeader";
import FaqList from "@/components/FaqList";
import PageCTA from "@/components/PageCTA";
import { getFaqs, getSiteSettings } from "@/lib/data";
import { pageCtaProps } from "@/lib/cms";

export const metadata = { title: "FAQ — Shreya creation" };

export default async function FaqPage() {
  const [faqs, site] = await Promise.all([getFaqs(), getSiteSettings()]);
  const faqPage = site.pages?.faq || {};

  return (
    <PageShell>
      <LocalizedPageHeader
        eyebrow={faqPage.headerEyebrow || "Help & FAQ"}
        eyebrowHi={faqPage.headerEyebrowHi}
        title={faqPage.headerTitle || "Frequently Asked"}
        titleHi={faqPage.headerTitleHi}
        highlight={faqPage.headerHighlight || "Questions"}
        highlightHi={faqPage.headerHighlightHi}
        subtitle={faqPage.headerSubtitle || "Custom sizing, WhatsApp ordering, academy courses, and studio location."}
        subtitleHi={faqPage.headerSubtitleHi}
      />
      <FaqList faqs={faqs} />
      <PageCTA whatsapp={site.whatsapp} {...pageCtaProps(faqPage)} />
    </PageShell>
  );
}
