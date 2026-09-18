"use client";

import { INTERACTIVE_CARD, REVEAL } from "@/lib/ui";
import { cn } from "@/lib/utils";
import Link from "next/link";
import CardImage from "@/components/CardImage";
import { Glass3DCard, Float3D } from "@/components/Glass3DCard";
import { useLanguage } from "@/components/LanguageProvider";
import { pickLocalized } from "@/lib/i18n";
import { staggerDelay } from "@/lib/motion";
import { estimateReadingMinutes } from "@/lib/blog-markdown";

function formatPostDate(value, lang) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function postHref(post) {
  return post?.slug ? `/blog/${post.slug}` : "/blog";
}

function postImageAlt(post, title) {
  return post?.image_alt || post?.imageAlt || (title ? `${title} Patna` : "Shreya Creation Patna");
}

function splitFeaturedPosts(posts, featuredSlug) {
  if (!posts.length) return { featured: null, rest: [] };
  if (featuredSlug) {
    const idx = posts.findIndex((post) => post.slug === featuredSlug);
    if (idx >= 0) {
      return {
        featured: posts[idx],
        rest: posts.filter((_, i) => i !== idx),
      };
    }
  }
  const [featured, ...rest] = posts;
  return { featured, rest };
}

export default function BlogGrid({
  posts = [],
  featuredSlug,
  featuredEmoji = "🇮🇳",
  featuredOverrides = {},
  postsBlock = {},
}) {
  const { lang } = useLanguage();

  if (!posts.length) {
    return (
      <Glass3DCard
        className={cn(
          REVEAL,
          "rounded-2xl",
          "sm:rounded-[2rem]",
          "border-ink/15",
          "p-12",
          "sm:p-20",
          "text-center",
          "col-span-full"
        )}
      >
        <p className="text-ink font-normal text-base max-w-md mx-auto">
          {lang === "hi" ? "अभी कोई ब्लॉग पोस्ट उपलब्ध नहीं है।" : "No blog posts available yet."}
        </p>
        <Link
          href="/contact"
          className="inline-block mt-6 text-orange hover:text-orange-dark text-sm font-medium tracking-wide"
        >
          {lang === "hi" ? "संपर्क करें" : "Contact us"} →
        </Link>
      </Glass3DCard>
    );
  }

  const { featured, rest } = splitFeaturedPosts(posts, featuredSlug);
  const featuredBadge = lang === "hi" ? "विशेष लेख" : "Featured Article";
  // Prefer the real post title/excerpt so the listing card matches /blog/[slug].
  // CMS overrides are fallback only (e.g. when the pinned slug is missing).
  const featuredHeadline =
    pickLocalized(featured, lang, "title", "title_hi") ||
    featured?.title ||
    pickLocalized(featuredOverrides, lang, "title", "titleHi") ||
    pickLocalized(featuredOverrides, lang, "h1", "h1Hi");
  const featuredExcerpt =
    pickLocalized(featured, lang, "excerpt", "excerpt_hi") ||
    featured?.excerpt ||
    pickLocalized(featuredOverrides, lang, "description", "descriptionHi");
  const featuredBody =
    pickLocalized(featured, lang, "body", "body_hi") ||
    featured?.body ||
    featuredExcerpt;
  const featuredReadingMinutes = estimateReadingMinutes(featuredBody || "");

  const blockEyebrow =
    pickLocalized(postsBlock, lang, "title", "titleHi") ||
    (lang === "hi" ? "श्रेया क्रिएशन की नवीनतम जानकारी" : "Latest from Shreya Creation");
  const blockHeading =
    pickLocalized(postsBlock, lang, "h1", "h1Hi") ||
    (lang === "hi" ? "लेटेस्ट बुटीक और फैशन अपडेट्स" : "Latest Boutique & Fashion Updates");
  const blockDescription =
    pickLocalized(postsBlock, lang, "description", "descriptionHi") ||
    (lang === "hi"
      ? "बुटीक फैशन, सिलाई, डिजाइनर ब्लाउज़, ब्राइडल वियर और फैशन डिजाइनिंग से जुड़े हमारे नवीनतम लेख पढ़ें।"
      : "Read our latest articles on boutique fashion, tailoring, stitching, designer blouses, bridal wear and fashion designing.");

  const categoryLabel = lang === "hi" ? "बुटीक गाइड" : "Boutique guide";
  const readLabel = lang === "hi" ? "मिनट" : "min read";

  return (
    <div className="blog-grid space-y-8 sm:space-y-10">
      {featured && (
        <article className={cn(REVEAL)}>
          <Link href={postHref(featured)} className="block group">
            <Glass3DCard
              layered
              className={cn(
                INTERACTIVE_CARD,
                "rounded-2xl",
                "sm:rounded-[2rem]",
                "overflow-hidden",
                "border-orange/20"
              )}
            >
              <div className="grid md:grid-cols-2 gap-0">
                {featured.image && (
                  <div className="blog-featured-media relative h-full min-h-[260px] md:min-h-[340px] overflow-hidden">
                    <CardImage
                      src={featured.image}
                      alt={postImageAlt(featured, featuredHeadline)}
                      ratio="fill"
                      fit="contain"
                      position="center"
                      className="h-full min-h-[260px] md:min-h-[340px] bg-cream/80"
                      imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/25 pointer-events-none" />
                  </div>
                )}
                <Float3D translateZ="50" className="p-6 sm:p-10 flex flex-col justify-center">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 bg-orange/10 border border-orange/20 text-orange px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase">
                      {featuredEmoji && <span aria-hidden>{featuredEmoji}</span>}
                      {featuredBadge}
                    </span>
                    {formatPostDate(featured.created_at, lang) && (
                      <time
                        dateTime={featured.created_at}
                        className="text-[11px] tracking-wide uppercase text-ink/55 font-medium"
                      >
                        {formatPostDate(featured.created_at, lang)}
                      </time>
                    )}
                    <span className="text-[11px] tracking-wide uppercase text-ink/45 font-medium">
                      · {featuredReadingMinutes} {readLabel}
                    </span>
                  </div>
                  <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight break-words text-balance group-hover:text-orange transition-colors">
                    {featuredHeadline}
                  </h2>
                  {featuredExcerpt && (
                    <p className="mt-4 text-sm sm:text-base text-ink/80 font-normal leading-relaxed">
                      {featuredExcerpt}
                    </p>
                  )}
                  <span className="mt-6 inline-flex items-center gap-2 self-start rounded-full bg-orange/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-orange transition-all group-hover:bg-orange group-hover:text-white">
                    {lang === "hi" ? "पूरा पढ़ें" : "Read article"}
                    <span aria-hidden>→</span>
                  </span>
                </Float3D>
              </div>
            </Glass3DCard>
          </Link>
        </article>
      )}

      {rest.length > 0 && (
        <div className="space-y-5 sm:space-y-6">
          <div className="px-1 space-y-2.5">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-orange/70">
              {blockEyebrow}
            </p>
            <h2 className="font-display text-2xl sm:text-3xl text-ink leading-tight text-balance">
              {blockHeading}
            </h2>
            {blockDescription && (
              <p className="text-sm sm:text-base text-ink/70 font-normal leading-relaxed max-w-3xl">
                {blockDescription}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
            {rest.map((p, i) => {
              const title = pickLocalized(p, lang, "title", "title_hi") || p.title;
              const excerpt = pickLocalized(p, lang, "excerpt", "excerpt_hi") || p.excerpt;
              const body = pickLocalized(p, lang, "body", "body_hi") || p.body || excerpt;
              const dateLabel = formatPostDate(p.created_at, lang);
              const readingMinutes = estimateReadingMinutes(body || "");

              return (
                <article key={p.id} style={staggerDelay(i, 80)}>
                  <Link href={postHref(p)} className="block group h-full">
                    <Glass3DCard
                      layered
                      className={cn(
                        REVEAL,
                        INTERACTIVE_CARD,
                        "rounded-2xl",
                        "sm:rounded-3xl",
                        "overflow-hidden",
                        "h-full",
                        "border-ink/10",
                        "hover:border-orange/25"
                      )}
                    >
                      {p.image && (
                        <div className="blog-card-media relative overflow-hidden">
                          <CardImage
                            src={p.image}
                            alt={postImageAlt(p, title)}
                            ratio="16/10"
                            fit="contain"
                            position="center"
                            className="bg-cream/80"
                            imgClassName="transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                          />
                          <div
                            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-80"
                            aria-hidden
                          />
                          <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full border border-white/30 bg-black/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                            {categoryLabel}
                          </span>
                        </div>
                      )}
                      <Float3D translateZ="40" className="p-5 sm:p-6 flex flex-col flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-3 text-[11px] font-medium uppercase tracking-wide text-ink/50">
                          {dateLabel && (
                            <time dateTime={p.created_at}>{dateLabel}</time>
                          )}
                          {dateLabel && (
                            <span aria-hidden className="text-ink/25">
                              ·
                            </span>
                          )}
                          <span>{readingMinutes} {readLabel}</span>
                        </div>
                        <h3 className="font-display text-xl sm:text-[1.35rem] text-ink leading-snug break-words group-hover:text-orange transition-colors line-clamp-2">
                          {title}
                        </h3>
                        {excerpt && (
                          <p className="text-sm text-ink/70 mt-2.5 font-normal leading-relaxed line-clamp-3 flex-1">
                            {excerpt}
                          </p>
                        )}
                        <span className="mt-5 inline-flex items-center gap-2 self-start rounded-full bg-orange/[0.08] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-orange transition-all group-hover:bg-orange group-hover:text-white">
                          {lang === "hi" ? "पूरा पढ़ें" : "Read article"}
                          <span aria-hidden>→</span>
                        </span>
                      </Float3D>
                    </Glass3DCard>
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
