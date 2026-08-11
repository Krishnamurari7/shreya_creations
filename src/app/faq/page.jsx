import PageShell from "@/components/PageShell";
import LocalizedPageHeader from "@/components/LocalizedPageHeader";
import FaqList from "@/components/FaqList";
import PageCTA from "@/components/PageCTA";
import JsonLdScript from "@/components/JsonLdScript";
import { getFaqs, getSiteSettings } from "@/lib/data";
import { pageCtaProps } from "@/lib/cms";
import { getRequestLocale } from "@/lib/locale";
import { buildMetadata, breadcrumbJsonLd, breadcrumbLabel, faqJsonLd, DEFAULT_OG_IMAGE } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "FAQ | Boutique Courses & Custom Stitching Patna",
  description:
    "Answers about Shreya Creation courses, fees, free demo class, 24-hour stitching delivery and boutique training in Patna (Boring Road).",
  path: "/faq",
  image: DEFAULT_OG_IMAGE,
  imageAlt: "FAQ about boutique courses and stitching in Patna",
});

export default async function FaqPage() {
  const locale = await getRequestLocale();
  const [faqs, site] = await Promise.all([getFaqs(), getSiteSettings()]);
  const faqPage = site.pages?.faq || {};

  return (
    <PageShell>
      <JsonLdScript data={faqJsonLd(faqs, locale)} />
      <JsonLdScript
        data={breadcrumbJsonLd(
          [
            { name: breadcrumbLabel("home", locale), path: "/" },
            { name: breadcrumbLabel("faq", locale), path: "/faq" },
          ],
          locale
        )}
      />
      <LocalizedPageHeader
        eyebrow={faqPage.headerEyebrow || "Help & FAQ"}
        eyebrowHi={faqPage.headerEyebrowHi}
        title={faqPage.headerTitle || "Boutique Courses & Stitching FAQ"}
        titleHi={faqPage.headerTitleHi || "बुटीक कोर्स और सिलाई FAQ"}
        highlight={faqPage.headerHighlight || ""}
        highlightHi={faqPage.headerHighlightHi || ""}
        subtitle={
          faqPage.headerSubtitle ||
          "Fees, demo class, certificate fashion courses, custom sizing, WhatsApp ordering, and our East Boring Canal Road studio."
        }
        subtitleHi={faqPage.headerSubtitleHi}
      />
      <FaqList faqs={faqs} />
      <PageCTA whatsapp={site.whatsapp} {...pageCtaProps(faqPage)} />
    </PageShell>
  );
}
