import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import LocalizedPageHeader from "@/components/LocalizedPageHeader";
import { getPolicyPage } from "@/lib/data";
import PolicyBody from "@/components/PolicyBody";

const SLUGS = ["privacy", "shipping", "returns"];

export async function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const page = await getPolicyPage(params.slug);
  return { title: page ? `${page.title} — Shreya Creations` : "Policy" };
}

export default async function PolicyPage({ params }) {
  const page = await getPolicyPage(params.slug);
  if (!page) notFound();

  return (
    <PageShell>
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
