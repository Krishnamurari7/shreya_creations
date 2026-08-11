import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import LocalizedPageHeader from "@/components/LocalizedPageHeader";
import { getPolicyPage } from "@/lib/data";
import PolicyBody from "@/components/PolicyBody";
import JsonLdScript from "@/components/JsonLdScript";
import { getRequestLocale } from "@/lib/locale";
import { buildMetadata, breadcrumbJsonLd, breadcrumbLabel, DEFAULT_OG_IMAGE, seoDescription } from "@/lib/seo";

const SLUGS = ["privacy", "shipping", "returns", "terms", "course-cancellation"];

export async function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = await getPolicyPage(slug);
  const path = `/policies/${slug}`;
  const title = page ? `${page.title} | Shreya Creation` : "Policy | Shreya Creation";
  const description = seoDescription(
    page?.body,
    "Shreya Creation policies for boutique courses and custom stitching in Patna."
  );
  return buildMetadata({
    title,
    description,
    path,
    image: DEFAULT_OG_IMAGE,
    imageAlt: page?.title || "Shreya Creation policy",
  });
}

export default async function PolicyPage({ params }) {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const page = await getPolicyPage(slug);
  if (!page) notFound();

  const pageTitle =
    locale === "hi" && page.titleHi ? page.titleHi : page.title;

  return (
    <PageShell>
      <JsonLdScript
        data={breadcrumbJsonLd(
          [
            { name: breadcrumbLabel("home", locale), path: "/" },
            { name: breadcrumbLabel("policies", locale), path: "/policies/privacy" },
            { name: pageTitle, path: `/policies/${slug}` },
          ],
          locale
        )}
      />
      <LocalizedPageHeader
        eyebrow="Policies"
        eyebrowHi="नीतियाँ"
        title={page.title}
        titleHi={page.titleHi}
      />
      <PolicyBody page={page} />
    </PageShell>
  );
}
