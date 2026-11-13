import { PAGE_CONTAINER } from "@/lib/ui";
import { cn } from "@/lib/utils";
import PageShell from "@/components/PageShell";
import LocalizedPageHeader from "@/components/LocalizedPageHeader";
import BlogGrid from "@/components/BlogGrid";
import PageCTA from "@/components/PageCTA";
import PageSeoIntro from "@/components/PageSeoIntro";
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

export const revalidate = 3600;

const BLOG_DEFAULTS = PAGE_DEFAULTS.lookbook;

function isLegacyLookbookCopy(value = "") {
  return /lookbook|लुकबुक|love a look|कोई लुक पसंद|style question|स्टाइल सवाल|Ask on WhatsApp|WhatsApp पर पूछें/i.test(
    String(value)
  );
}

export async function generateMetadata() {
  const site = await getSiteSettings();
  const page = site.pages?.lookbook || {};
  return buildMetadata({
    title: blogListingMetaTitle(page),
    description: blogListingMetaDescription(page),
    path: "/blog",
    image: page.ogImage || DEFAULT_OG_IMAGE,
    imageAlt: "Boutique and fashion designing blog from Shreya Creation Patna",
  });
}

export default async function BlogPage() {
  const locale = await getRequestLocale();
  const [posts, site] = await Promise.all([getLookbookPosts(), getSiteSettings()]);
  const cms = site.pages?.lookbook || {};
  const cta = pageCtaProps(cms);

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

      <div
        className={cn(
          PAGE_CONTAINER,
          "mx-auto",
          "max-w-6xl",
          "pt-2",
          "sm:pt-4",
          "pb-8",
          "sm:pb-12",
          "relative",
          "z-20"
        )}
      >
        <BlogGrid
          posts={posts}
          featuredSlug={cms.featurePostSlug || BLOG_DEFAULTS.feature_post_slug}
          featuredEmoji={cms.featurePostEmoji || BLOG_DEFAULTS.feature_post_emoji}
          featuredOverrides={{
            title: cms.featurePostTitle || BLOG_DEFAULTS.feature_post_title,
            titleHi: cms.featurePostTitleHi || BLOG_DEFAULTS.feature_post_title_hi,
            h1: cms.featurePostH1 || BLOG_DEFAULTS.feature_post_h1,
            h1Hi: cms.featurePostH1Hi || BLOG_DEFAULTS.feature_post_h1_hi,
            description: cms.featurePostDescription || BLOG_DEFAULTS.feature_post_description,
            descriptionHi: cms.featurePostDescriptionHi || BLOG_DEFAULTS.feature_post_description_hi,
          }}
          postsBlock={{
            title: cms.postsBlockTitle || BLOG_DEFAULTS.posts_block_title,
            titleHi: cms.postsBlockTitleHi || BLOG_DEFAULTS.posts_block_title_hi,
            h1: cms.postsBlockH1 || BLOG_DEFAULTS.posts_block_h1,
            h1Hi: cms.postsBlockH1Hi || BLOG_DEFAULTS.posts_block_h1_hi,
            description: cms.postsBlockDescription || BLOG_DEFAULTS.posts_block_description,
            descriptionHi: cms.postsBlockDescriptionHi || BLOG_DEFAULTS.posts_block_description_hi,
          }}
        />
      </div>

      <PageCTA
        whatsapp={site.whatsapp}
        overrides={site.pages?.ctaBoxes?.entries}
        {...cta}
        title={isLegacyLookbookCopy(cta.title) ? BLOG_DEFAULTS.cta_title : cta.title}
        titleHi={isLegacyLookbookCopy(cta.titleHi) ? BLOG_DEFAULTS.cta_title_hi : cta.titleHi}
        subtitle={cta.subtitle || BLOG_DEFAULTS.cta_subtitle}
        subtitleHi={cta.subtitleHi || BLOG_DEFAULTS.cta_subtitle_hi}
        primaryHref={cta.primaryHref === undefined ? BLOG_DEFAULTS.cta_primary_href : cta.primaryHref}
        primaryLabel={cta.primaryLabel || BLOG_DEFAULTS.cta_primary_label}
        primaryLabelHi={cta.primaryLabelHi || BLOG_DEFAULTS.cta_primary_label_hi}
        secondaryHref={cta.secondaryHref ?? BLOG_DEFAULTS.cta_secondary_href}
        secondaryLabel={cta.secondaryLabel || BLOG_DEFAULTS.cta_secondary_label}
        secondaryLabelHi={cta.secondaryLabelHi || BLOG_DEFAULTS.cta_secondary_label_hi}
        waMessage={cta.waMessage || BLOG_DEFAULTS.cta_wa_message}
      />
    </PageShell>
  );
}
