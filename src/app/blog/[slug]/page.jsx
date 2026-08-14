import { notFound } from "next/navigation";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import CardImage from "@/components/CardImage";
import PageCTA from "@/components/PageCTA";
import BlogArticleBody from "@/components/BlogArticleBody";
import JsonLdScript from "@/components/JsonLdScript";
import { getLookbookPostBySlug, getSiteSettings } from "@/lib/data";
import { PAGE_DEFAULTS } from "@/lib/cms/defaults";
import { getRequestLocale } from "@/lib/locale";
import { estimateReadingMinutes, extractBlogFaqs } from "@/lib/blog-markdown";
import { PAGE_CONTAINER, PAGE_HERO_TITLE, SECTION_LEAD } from "@/lib/ui";
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

      <header
        className={cn(
          PAGE_CONTAINER,
          "max-w-3xl",
          "pt-[calc(var(--header-offset)+1rem)]",
          "pb-6",
          "relative",
          "z-20"
        )}
      >
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-orange hover:text-orange-dark text-sm font-semibold tracking-wider uppercase mb-6"
        >
          ← {locale === "hi" ? "ब्लॉग पर वापस" : "Back to Blog"}
        </Link>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 bg-orange/10 border border-orange/20 text-orange px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase">
            {locale === "hi" ? "बुटीक गाइड" : "Boutique guide"}
          </span>
        </div>

        <h1 className={cn(PAGE_HERO_TITLE, "text-balance", "mb-4")}>{copy.title}</h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] tracking-wide uppercase text-ink/55 font-medium mb-4">
          {dateLabel && published && <time dateTime={published}>{dateLabel}</time>}
          <span aria-hidden>·</span>
          <span>
            {readingMinutes} {locale === "hi" ? "मिनट पढ़ें" : "min read"}
          </span>
        </div>

        {copy.excerpt && <p className={cn(SECTION_LEAD, "max-w-2xl")}>{copy.excerpt}</p>}
      </header>

      {image && (
        <div className={cn(PAGE_CONTAINER, "max-w-4xl", "pb-8", "relative", "z-20")}>
          <div className="rounded-2xl sm:rounded-[2rem] overflow-hidden border border-ink/15 shadow-xl">
            <CardImage src={image} alt={alt} ratio="16/9" position="center" loading="eager" />
          </div>
        </div>
      )}

      <BlogArticleBody body={post.body} bodyHi={post.body_hi || post.bodyHi} />

      <div className={cn(PAGE_CONTAINER, "max-w-3xl", "pt-8", "pb-4", "relative", "z-20")}>
        <div className="rounded-2xl border border-ink/10 bg-orange/[0.04] p-5 sm:p-6">
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-ink/45 mb-3">
            {locale === "hi" ? "और जानें" : "Explore more"}
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-2 text-sm">
            {relatedLinks.map((link, index) => (
              <span key={link.href} className="inline-flex items-center gap-3">
                {index > 0 && (
                  <span className="text-ink/25" aria-hidden>
                    ·
                  </span>
                )}
                <Link href={link.href} className="text-orange font-medium underline-offset-2 hover:underline">
                  {link.label}
                </Link>
              </span>
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
        primaryHref={BLOG_CTA.cta_primary_href}
        primaryLabel={BLOG_CTA.cta_primary_label}
        primaryLabelHi={BLOG_CTA.cta_primary_label_hi}
        secondaryHref={BLOG_CTA.cta_secondary_href}
        secondaryLabel={BLOG_CTA.cta_secondary_label}
        secondaryLabelHi={BLOG_CTA.cta_secondary_label_hi}
        waMessage={BLOG_CTA.cta_wa_message}
        eyebrow="Fashion & style"
        eyebrowHi="फैशन और स्टाइल"
        perks={["Boutique wear", "Custom stitching", "Fashion courses", "Patna studio"]}
        perksHi={["बुटीक वियर", "कस्टम सिलाई", "फैशन कोर्स", "पटना स्टूडियो"]}
      />
    </PageShell>
  );
}
