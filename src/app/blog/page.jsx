import { PAGE_CONTAINER } from "@/lib/ui";
import { cn } from "@/lib/utils";
import PageShell from "@/components/PageShell";
import LocalizedPageHeader from "@/components/LocalizedPageHeader";
import BlogGrid from "@/components/BlogGrid";
import PageCTA from "@/components/PageCTA";
import PageSeoIntro from "@/components/PageSeoIntro";
import FeatureStrip from "@/components/FeatureStrip";
import JsonLdScript from "@/components/JsonLdScript";
import { getLookbookPosts, getSiteSettings } from "@/lib/data";
import { pageCtaProps } from "@/lib/cms";
import { PAGE_DEFAULTS } from "@/lib/cms/defaults";
import { getRequestLocale } from "@/lib/locale";
import {
  blogListingMetaDescription,
  blogListingMetaTitle,
  breadcrumbJsonLd,
  breadcrumbLabel,
  DEFAULT_OG_IMAGE,
  buildMetadata,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

const BLOG_DEFAULTS = PAGE_DEFAULTS.lookbook;

function isLegacyLookbookCopy(value = "") {
  return /lookbook|लुकबुक|love a look|कोई लुक पसंद/i.test(String(value));
}

export async function generateMetadata() {
  const site = await getSiteSettings();
  const page = site.pages?.lookbook || {};
  return buildMetadata({
    title: blogListingMetaTitle(page),
    description: blogListingMetaDescription(page),
    path: "/blog",
    image: page.ogImage || DEFAULT_OG_IMAGE,
    imageAlt: "Blog style tips and atelier guides from Shreya Creation Patna",
  });
}

export default async function BlogPage() {
  const locale = await getRequestLocale();
  const [posts, site] = await Promise.all([getLookbookPosts(), getSiteSettings()]);
  const cms = site.pages?.lookbook || {};
  const cta = pageCtaProps(cms);
  const features = Array.isArray(cms.features) ? cms.features : [];

  return (
    <PageShell>
      <JsonLdScript
        data={breadcrumbJsonLd(
          [
            { name: breadcrumbLabel("home", locale), path: "/" },
            { name: breadcrumbLabel("blog", locale), path: "/blog" },
          ],
          locale
        )}
      />

      <LocalizedPageHeader
        compact
        eyebrow={cms.headerEyebrow || BLOG_DEFAULTS.header_eyebrow}
        eyebrowHi={cms.headerEyebrowHi || BLOG_DEFAULTS.header_eyebrow_hi}
        title={cms.headerTitle || BLOG_DEFAULTS.header_title}
        titleHi={cms.headerTitleHi || BLOG_DEFAULTS.header_title_hi}
        highlight={cms.headerHighlight || BLOG_DEFAULTS.header_highlight}
        highlightHi={cms.headerHighlightHi || BLOG_DEFAULTS.header_highlight_hi}
        subtitle={cms.headerSubtitle || BLOG_DEFAULTS.header_subtitle}
        subtitleHi={cms.headerSubtitleHi || BLOG_DEFAULTS.header_subtitle_hi}
      />

      <PageSeoIntro
        links={[
          { href: "/shop", label: "custom stitching in Patna", labelHi: "पटना में कस्टम सिलाई" },
          { href: "/courses", label: "boutique courses", labelHi: "बुटीक कोर्स" },
          { href: "/nri-clients", label: "NRI ordering help", labelHi: "NRI ऑर्डर सहायता" },
        ]}
        childrenHi={cms.seoIntroHi || BLOG_DEFAULTS.seo_intro_hi}
      >
        {cms.seoIntro || BLOG_DEFAULTS.seo_intro}
      </PageSeoIntro>

      {features?.length > 0 && <FeatureStrip items={features} />}

      <div
        className={cn(
          PAGE_CONTAINER,
          "mx-auto",
          "max-w-6xl",
          "pt-4",
          "sm:pt-6",
          "pb-6",
          "sm:pb-8",
          "relative",
          "z-20"
        )}
      >
        <BlogGrid posts={posts} />
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
