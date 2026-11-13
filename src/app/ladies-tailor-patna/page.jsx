import PageShell from "@/components/PageShell";
import SeoLandingClient from "@/components/SeoLandingClient";
import PageCTA from "@/components/PageCTA";
import JsonLdScript from "@/components/JsonLdScript";
import { getSiteSettings } from "@/lib/data";
import { pageCtaProps } from "@/lib/cms";
import { PAGE_DEFAULTS } from "@/lib/cms/defaults";
import { getRequestLocale } from "@/lib/locale";
import { buildMetadata, breadcrumbJsonLd, breadcrumbLabel, DEFAULT_OG_IMAGE } from "@/lib/seo";
import { LADIES_TAILOR_PATNA } from "@/lib/seo-landing-content";

const { meta, path } = LADIES_TAILOR_PATNA;
const CMS_DEFAULTS = PAGE_DEFAULTS.ladiesTailor;

export async function generateMetadata() {
  const site = await getSiteSettings();
  const page = site.pages?.ladiesTailor || {};
  return buildMetadata({
    title: page.metaTitle || page.meta_title || CMS_DEFAULTS.meta_title || meta.title,
    description:
      page.metaDescription || page.meta_description || CMS_DEFAULTS.meta_description || meta.description,
    path,
    image: DEFAULT_OG_IMAGE,
    imageAlt: meta.imageAlt,
  });
}

export default async function LadiesTailorPatnaPage() {
  const locale = await getRequestLocale();
  const site = await getSiteSettings();
  const cmsPage = site.pages?.ladiesTailor || {};
  const cta = pageCtaProps(cmsPage);

  return (
    <PageShell>
      <JsonLdScript
        data={breadcrumbJsonLd(
          [
            { name: breadcrumbLabel("home", locale), path: "/" },
            { name: breadcrumbLabel("ladiesTailorPatna", locale), path },
          ],
          locale
        )}
      />
      <SeoLandingClient content={LADIES_TAILOR_PATNA} site={site} cmsPage={cmsPage} />
      <PageCTA
        whatsapp={site.whatsapp}
        overrides={site.pages?.ctaBoxes?.entries}
        {...cta}
        waMessage={cta.waMessage || LADIES_TAILOR_PATNA.waMessage}
      />
    </PageShell>
  );
}
