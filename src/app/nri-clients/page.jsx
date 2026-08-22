import PageShell from "@/components/PageShell";
import NriClientsClient from "@/components/NriClientsClient";
import PageCTA from "@/components/PageCTA";
import JsonLdScript from "@/components/JsonLdScript";
import { getSiteSettings } from "@/lib/data";
import { pageCtaProps } from "@/lib/cms";
import { getRequestLocale } from "@/lib/locale";
import { buildMetadata, breadcrumbJsonLd, breadcrumbLabel, faqJsonLd, DEFAULT_OG_IMAGE } from "@/lib/seo";
import { NRI_FAQS } from "@/lib/nri-content";
import { nriClientMessage } from "@/lib/whatsapp";

export const metadata = buildMetadata({
  title: "NRI Boutique & Fashion Classes | Custom Stitching Patna",
  description:
    "NRI clients can get custom Indian wear, bridal blouse, lehenga and ready-to-wear saree services from Patna, plus 1-to-1 online and offline fashion classes.",
  path: "/nri-clients",
  image: DEFAULT_OG_IMAGE,
  imageAlt: "NRI boutique, custom stitching and fashion classes from Shreya Creation Patna",
});

export default async function NriClientsPage() {
  const locale = await getRequestLocale();
  const site = await getSiteSettings();
  const nri = site.pages?.nri || {};
  const cta = pageCtaProps(nri);

  return (
    <PageShell>
      <JsonLdScript data={faqJsonLd(NRI_FAQS, locale)} />
      <JsonLdScript
        data={breadcrumbJsonLd(
          [
            { name: breadcrumbLabel("home", locale), path: "/" },
            { name: breadcrumbLabel("nriClients", locale), path: "/nri-clients" },
          ],
          locale
        )}
      />
      <NriClientsClient site={site} nriPage={nri} />
      <PageCTA
        whatsapp={site.whatsapp}
        {...cta}
        waMessage={cta.waMessage || nriClientMessage("en")}
      />
    </PageShell>
  );
}
