import { PAGE_CONTAINER } from "@/lib/ui";
import { cn } from "@/lib/utils";
import PageShell from "@/components/PageShell";
import LocalizedPageHeader from "@/components/LocalizedPageHeader";
import LookbookGrid from "@/components/LookbookGrid";
import PageCTA from "@/components/PageCTA";
import JsonLdScript from "@/components/JsonLdScript";
import { getLookbookPosts, getSiteSettings } from "@/lib/data";
import { pageCtaProps } from "@/lib/cms";
import { buildMetadata, breadcrumbJsonLd, DEFAULT_OG_IMAGE } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Lookbook & Style Inspiration | Shreya Creation Patna",
  description:
    "Latest blouse, bridal and designer looks from Shreya Creation Patna — curated couture inspiration from our Boring Road atelier.",
  path: "/lookbook",
  image: DEFAULT_OG_IMAGE,
  imageAlt: "Lookbook and style inspiration from Shreya Creation Patna",
});

export default async function LookbookPage() {
  const [posts, site] = await Promise.all([getLookbookPosts(), getSiteSettings()]);
  const lookbook = site.pages?.lookbook || {};

  return (
    <PageShell>
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Lookbook", path: "/lookbook" },
        ])}
      />
      <LocalizedPageHeader
        eyebrow={lookbook.headerEyebrow || "Blog & lookbook"}
        eyebrowHi={lookbook.headerEyebrowHi}
        title={lookbook.headerTitle || "Style Inspiration from Our Patna Atelier"}
        titleHi={lookbook.headerTitleHi || "पटना एटेलियर से स्टाइल प्रेरणा"}
        subtitle={
          lookbook.headerSubtitle ||
          "Curated looks from the atelier — trends, styling tips and behind-the-scenes from our studio."
        }
        subtitleHi={lookbook.headerSubtitleHi}
      />
      <div className={cn(PAGE_CONTAINER, "mx-auto", "max-w-6xl", "pb-6", "sm:pb-8", "relative", "z-20")}>
        <LookbookGrid posts={posts} />
      </div>
      <PageCTA whatsapp={site.whatsapp} {...pageCtaProps(lookbook)} />
    </PageShell>
  );
}
