import { notFound } from "next/navigation";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import CardImage from "@/components/CardImage";
import PageCTA from "@/components/PageCTA";
import JsonLdScript from "@/components/JsonLdScript";
import { getLookbookPostBySlug, getSiteSettings } from "@/lib/data";
import { getRequestLocale } from "@/lib/locale";
import { PAGE_CONTAINER, PAGE_HERO_TITLE, SECTION_LEAD } from "@/lib/ui";
import { cn } from "@/lib/utils";
import {
  blogPostingJsonLd,
  breadcrumbJsonLd,
  breadcrumbLabel,
  buildMetadata,
  itemImage,
  itemImageAlt,
  lookbookMetaDescription,
  lookbookMetaTitle,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

function splitParagraphs(text = "") {
  return String(text)
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getLookbookPostBySlug(slug);
  if (!post) {
    return buildMetadata({
      title: "Blog | Shreya Creation Patna",
      description: "Style tips and atelier guides from Shreya Creation Patna.",
      path: "/blog",
    });
  }
  const path = `/blog/${post.slug}`;
  return buildMetadata({
    title: lookbookMetaTitle(post),
    description: lookbookMetaDescription(post),
    path,
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

  const title = locale === "hi" && (post.title_hi || post.titleHi) ? post.title_hi || post.titleHi : post.title;
  const excerpt = post.excerpt;
  const body = post.body || "";
  const paragraphs = splitParagraphs(body);
  const alt = itemImageAlt(post);
  const image = post.og_image || post.image;
  const published = post.created_at;

  return (
    <PageShell>
      <JsonLdScript data={blogPostingJsonLd(post, locale)} />
      <JsonLdScript
        data={breadcrumbJsonLd(
          [
            { name: breadcrumbLabel("home", locale), path: "/" },
            { name: breadcrumbLabel("blog", locale), path: "/blog" },
            { name: title, path: `/blog/${post.slug}` },
          ],
          locale
        )}
      />

      <article
        className={cn(
          PAGE_CONTAINER,
          "max-w-3xl",
          "pt-[calc(var(--header-offset)+1rem)]",
          "pb-12",
          "relative",
          "z-20"
        )}
      >
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-orange hover:text-orange-dark text-sm font-semibold tracking-wider uppercase mb-6"
        >
          ← Back to Blog
        </Link>

        {published && (
          <time
            dateTime={published}
            className="block text-[11px] tracking-wide uppercase text-ink/55 font-medium mb-3"
          >
            {new Date(published).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
        )}

        <h1 className={cn(PAGE_HERO_TITLE, "text-balance", "mb-4")}>{title}</h1>

        {excerpt && paragraphs.length > 0 && (
          <p className={cn(SECTION_LEAD, "mb-8", "max-w-2xl")}>{excerpt}</p>
        )}

        {image && (
          <div className="rounded-3xl overflow-hidden border border-ink/15 shadow-xl mb-8">
            <CardImage src={image} alt={alt} ratio="16/10" position="top" loading="eager" />
          </div>
        )}

        <div className="space-y-5 text-ink/90 leading-relaxed text-pretty">
          {paragraphs.length > 0
            ? paragraphs.map((para, i) => (
                <p key={i} className="whitespace-pre-line">
                  {para}
                </p>
              ))
            : excerpt
              ? splitParagraphs(excerpt).map((para, i) => (
                  <p key={i} className="whitespace-pre-line">
                    {para}
                  </p>
                ))
              : null}
        </div>

        <div className="mt-10 flex flex-wrap gap-3 text-sm">
          <Link href="/shop" className="text-orange font-medium underline-offset-2 hover:underline">
            custom stitching in Patna
          </Link>
          <span aria-hidden>·</span>
          <Link href="/contact" className="text-orange font-medium underline-offset-2 hover:underline">
            visit our boutique
          </Link>
          <span aria-hidden>·</span>
          <Link href="/courses" className="text-orange font-medium underline-offset-2 hover:underline">
            boutique courses
          </Link>
        </div>
      </article>

      <PageCTA
        whatsapp={site.whatsapp}
        title="Have a question about this tip?"
        titleHi="इस टिप पर कोई सवाल है?"
        subtitle="Ask us on WhatsApp — fabric, fit and timeline advice from the atelier."
        subtitleHi="WhatsApp पर पूछें — एटेलियर से कपड़ा, फिट और टाइमलाइन की सलाह।"
        waMessage={`Hi Shreya Creation! 👋 I read "${title}" on your blog. Please share more about this tip.`}
      />
    </PageShell>
  );
}
