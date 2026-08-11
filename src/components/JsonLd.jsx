import { buildSitewideGraph } from "@/lib/json-ld";
import { getRequestLocale } from "@/lib/locale";

/**
 * Sitewide ClothingStore + EducationalOrganization + WebSite JSON-LD.
 * Values come from site settings / site-config.
 */
export default async function JsonLd({ site }) {
  const locale = await getRequestLocale();
  const schema = buildSitewideGraph(site, locale);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
    />
  );
}
