import { notFound } from "next/navigation";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import PageCTA from "@/components/PageCTA";
import BlogArticleSection from "@/components/BlogArticleSection";
import BlogPostHero from "@/components/BlogPostHero";
import JsonLdScript from "@/components/JsonLdScript";
import { getLookbookPostBySlug, getSiteSettings } from "@/lib/data";
import { PAGE_DEFAULTS } from "@/lib/cms/defaults";
import { getRequestLocale } from "@/lib/locale";
import { estimateReadingMinutes, extractBlogFaqs } from "@/lib/blog-markdown";
import { PAGE_CONTAINER } from "@/lib/ui";
import { cn } from "@/lib/utils";
import {
  blogPostingJsonLd,
  breadcrumbJsonLd,
  breadcrumbLabel,
  buildMetadata,
  faqJsonLd,
  itemImage,
  itemImageAlt,
  lookbookMetaDescription,
  lookbookMetaTitle,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

const BLOG_CTA = PAGE_DEFAULTS.lookbook;

function formatPostDate(value, locale) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(locale === "hi" ? "hi-IN" : "en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function localizedPost(post, locale) {
  const isHi = locale === "hi";
  return {
    title: isHi && (post.title_hi || post.titleHi) ? post.title_hi || post.titleHi : post.title,
    excerpt:
      isHi && (post.excerpt_hi || post.excerptHi) ? post.excerpt_hi || post.excerptHi : post.excerpt,
    body: isHi && (post.body_hi || post.bodyHi) ? post.body_hi || post.bodyHi : post.body || "",
    bodyHi: post.body_hi || post.bodyHi || "",
  };
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const post = await getLookbookPostBySlug(slug);
  if (!post) {
    return buildMetadata({
      title: "Blog | Shreya Creation Patna",
      description: "Boutique fashion, tailoring and fashion designing guides from Shreya Creation Patna.",
      path: "/blog",
      locale,
    });
  }
  const path = `/blog/${post.slug}`;
  return buildMetadata({
    title: lookbookMetaTitle(post, locale),
    description: lookbookMetaDescription(post, locale),
    path,
    locale,
    image: itemImage(post),
    imageAlt: itemImageAlt(post),
    type: "article",
  });
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const [post, site] = await Promise.all([getLookbookPostBySlug(slug), getSiteSettings()]);
  if (!post) return notFound();

  const copy = localizedPost(post, locale);
  const alt = itemImageAlt(post);
  const image = post.og_image || post.ogImage || post.image;
  const published = post.created_at || post.createdAt;
  const dateLabel = formatPostDate(published, locale);
  const readingMinutes = estimateReadingMinutes(copy.body || copy.excerpt || "");
  const faqs = extractBlogFaqs(copy.body);
  const faqsHi = extractBlogFaqs(copy.bodyHi);
  const faqItems = (locale === "hi" && faqsHi.length ? faqsHi : faqs).map(({ question, answer }) => ({
    q: question,
    a: answer,
  }));

  const relatedLinks =
    locale === "hi"
      ? [
          { href: "/shop", label: "पटना में कस्टम सिलाई" },
          { href: "/contact", label: "बुटीक विज़िट करें" },
          { href: "/courses", label: "फैशन डिजाइनिंग कोर्स" },
          { href: "/portfolio", label: "ब्राइडल वर्क देखें" },
        ]
      : [
          { href: "/shop", label: "custom stitching in Patna" },
          { href: "/contact", label: "visit our boutique" },
          { href: "/courses", label: "fashion designing courses" },
          { href: "/portfolio", label: "view bridal work" },
        ];

  return (
    <PageShell>
      <JsonLdScript data={blogPostingJsonLd(post, locale)} />
      {faqItems.length > 0 && <JsonLdScript data={faqJsonLd(faqItems, locale)} />}
      <JsonLdScript
        data={breadcrumbJsonLd(
          [
            { name: breadcrumbLabel("home", locale), path: "/" },
            { name: breadcrumbLabel("blog", locale), path: "/blog" },
            { name: copy.title, path: `/blog/${post.slug}` },
          ],
          locale
        )}
      />

      <BlogPostHero
        locale={locale}
        title={copy.title}
        excerpt={copy.excerpt}
        dateLabel={dateLabel}
        published={published}
        readingMinutes={readingMinutes}
      />

      <BlogArticleSection
        image={image}
        imageAlt={alt}
        body={post.body}
        bodyHi={post.body_hi || post.bodyHi}
      />

      <div className={cn(PAGE_CONTAINER, "max-w-6xl", "pt-6", "pb-4", "relative", "z-20")}>
        <div className="blog-related-links rounded-2xl sm:rounded-[1.75rem] border border-orange/15 bg-gradient-to-br from-orange/[0.06] via-white/60 to-orange/[0.03] p-5 sm:p-7 shadow-[0_8px_32px_-8px_rgba(var(--orange-rgb),0.12)] backdrop-blur-sm dark:from-orange/[0.08] dark:via-white/[0.03] dark:to-transparent">
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-orange/70 mb-4">
            {locale === "hi" ? "और जानें" : "Explore more"}
          </p>
          <div className="flex flex-wrap gap-2.5">
            {relatedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1.5 rounded-full border border-orange/20 bg-white/70 px-4 py-2 text-sm font-medium text-ink/80 transition-all hover:border-orange/40 hover:bg-orange/[0.08] hover:text-orange dark:border-orange/25 dark:bg-white/[0.06] dark:hover:bg-orange/10"
              >
                {link.label}
                <span aria-hidden className="text-orange/60">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <PageCTA
        whatsapp={site.whatsapp}
        title={BLOG_CTA.cta_title}
        titleHi={BLOG_CTA.cta_title_hi}
        subtitle={BLOG_CTA.cta_subtitle}
        subtitleHi={BLOG_CTA.cta_subtitle_hi}
        primaryHref={BLOG_CTA.cta_primary_href || undefined}
        primaryLabel={BLOG_CTA.cta_primary_label}
        primaryLabelHi={BLOG_CTA.cta_primary_label_hi}
        secondaryHref={BLOG_CTA.cta_secondary_href}
        secondaryLabel={BLOG_CTA.cta_secondary_label}
        secondaryLabelHi={BLOG_CTA.cta_secondary_label_hi}
        waMessage={BLOG_CTA.cta_wa_message}
      />
    </PageShell>
  );
}
