import PageShell from "@/components/PageShell";
import NriClientsClient from "@/components/NriClientsClient";
import PageCTA from "@/components/PageCTA";
import JsonLdScript from "@/components/JsonLdScript";
import { getSiteSettings } from "@/lib/data";
import { pageCtaProps } from "@/lib/cms";
import { getRequestLocale } from "@/lib/locale";
import { breadcrumbJsonLd, breadcrumbLabel, faqJsonLd } from "@/lib/seo";
import { buildNriPageMetadata, nriCourseJsonLd } from "@/lib/nri-seo";
import { NRI_FAQS } from "@/lib/nri-content";
import { nriClientMessage } from "@/lib/whatsapp";

export async function generateMetadata() {
  const site = await getSiteSettings();
  return buildNriPageMetadata(site.pages?.nri || {}, "en");
}

function pageFaqs(nri) {
  const raw = Array.isArray(nri?.faqs) ? nri.faqs : [];
  const faqs = raw
    .map((faq) => ({
      q: faq.q || "",
      qHi: faq.qHi || faq.q_hi || "",
      a: faq.a || "",
      aHi: faq.aHi || faq.a_hi || "",
    }))
    .filter((faq) => faq.q && faq.a);
  return faqs.length ? faqs : NRI_FAQS;
}

export default async function NriClientsPage() {
  const locale = await getRequestLocale();
  const site = await getSiteSettings();
  const nri = site.pages?.nri || {};
  const cta = pageCtaProps(nri);
  const faqs = pageFaqs(nri);

  return (
    <PageShell>
      <JsonLdScript data={nriCourseJsonLd(nri, site, locale)} />
      <JsonLdScript data={faqJsonLd(faqs, locale)} />
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
        waMessageHi={cta.waMessageHi || nriClientMessage("hi")}
      />
    </PageShell>
  );
}
