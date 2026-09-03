import { buildSitewideGraph } from "@/lib/json-ld";
import { DEFAULT_LOCALE } from "@/lib/locale";

/**
 * Sitewide LocalBusiness + Organization + EducationalOrganization + WebSite JSON-LD.
 * Values come from site settings / site-config.
 */
export default async function JsonLd({ site }) {
  const schema = buildSitewideGraph(site, DEFAULT_LOCALE);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
    />
  );
}
