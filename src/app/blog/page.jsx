import { PAGE_CONTAINER } from "@/lib/ui";
import { cn } from "@/lib/utils";
import PageShell from "@/components/PageShell";
import BlogGrid from "@/components/BlogGrid";
import PageCTA from "@/components/PageCTA";
import JsonLdScript from "@/components/JsonLdScript";
import { getLookbookPosts, getSiteSettings } from "@/lib/data";
import { pageCtaProps } from "@/lib/cms";
import { PAGE_DEFAULTS } from "@/lib/cms/defaults";
import { buildMetadata, breadcrumbJsonLd, DEFAULT_OG_IMAGE } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Blog | Style Tips & Atelier Guides from Shreya Creation Patna",
  description:
    "Bridal blouse ideas, 24-hour stitching tips, NRI ordering guides and atelier stories from Shreya Creation on Boring Road, Patna.",
  path: "/blog",
  image: DEFAULT_OG_IMAGE,
  imageAlt: "Blog style tips and atelier guides from Shreya Creation Patna",
});

const BLOG_DEFAULTS = PAGE_DEFAULTS.lookbook;

function isLegacyLookbookCopy(value = "") {
  return /lookbook|लुकबुक|love a look|कोई लुक पसंद/i.test(String(value));
}

export default async function BlogPage() {
  const [posts, site] = await Promise.all([getLookbookPosts(), getSiteSettings()]);
  const cms = site.pages?.lookbook || {};
  const cta = pageCtaProps(cms);

  return (
    <PageShell>
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />

      <div
        className={cn(
          PAGE_CONTAINER,
          "mx-auto",
          "max-w-6xl",
          "pt-[calc(var(--header-offset)+1.25rem)]",
          "sm:pt-[calc(var(--header-offset)+2rem)]",
          "pb-6",
          "sm:pb-8",
          "relative",
          "z-20"
        )}
      >
        <BlogGrid posts={posts} whatsapp={site.whatsapp} />
      </div>

      <PageCTA
        whatsapp={site.whatsapp}
        {...cta}
        title={isLegacyLookbookCopy(cta.title) ? BLOG_DEFAULTS.cta_title : cta.title}
        titleHi={isLegacyLookbookCopy(cta.titleHi) ? BLOG_DEFAULTS.cta_title_hi : cta.titleHi}
        subtitle={cta.subtitle || BLOG_DEFAULTS.cta_subtitle}
        subtitleHi={cta.subtitleHi || BLOG_DEFAULTS.cta_subtitle_hi}
        primaryLabel={cta.primaryLabel || BLOG_DEFAULTS.cta_primary_label}
        primaryLabelHi={cta.primaryLabelHi || BLOG_DEFAULTS.cta_primary_label_hi}
        eyebrow="Ask our atelier"
        eyebrowHi="हमारे एटेलियर से पूछें"
        perks={["Style advice", "Your size", "WhatsApp help", "Studio finish"]}
        perksHi={["स्टाइल सलाह", "आपके माप", "WhatsApp मदद", "स्टूडियो फिनिश"]}
      />
    </PageShell>
  );
}
