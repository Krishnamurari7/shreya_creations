"use client";

import { INTERACTIVE_CARD, REVEAL } from "@/lib/ui";
import { cn } from "@/lib/utils";
import Link from "next/link";
import CardImage from "@/components/CardImage";
import { Glass3DCard, Float3D } from "@/components/Glass3DCard";
import { useLanguage } from "@/components/LanguageProvider";
import { pickLocalized } from "@/lib/i18n";
import { staggerDelay } from "@/lib/motion";

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

export default function BlogGrid({ posts = [] }) {
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

  const [featured, ...rest] = posts;

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
                  <div className="blog-featured-media relative h-full min-h-[260px] md:min-h-[340px]">
                    <CardImage
                      src={featured.image}
                      alt={postImageAlt(
                        featured,
                        pickLocalized(featured, lang, "title", "title_hi") || featured.title
                      )}
                      ratio="fill"
                      position="top"
                      className="h-full min-h-[260px] md:min-h-[340px]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/25 pointer-events-none" />
                  </div>
                )}
                <Float3D translateZ="50" className="p-6 sm:p-10 flex flex-col justify-center">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 bg-orange/10 border border-orange/20 text-orange px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase">
                      {lang === "hi" ? "नवीनतम" : "Latest"}
                    </span>
                    {formatPostDate(featured.created_at, lang) && (
                      <time
                        dateTime={featured.created_at}
                        className="text-[11px] tracking-wide uppercase text-ink/55 font-medium"
                      >
                        {formatPostDate(featured.created_at, lang)}
                      </time>
                    )}
                  </div>
                  <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight break-words text-balance group-hover:text-orange transition-colors">
                    {pickLocalized(featured, lang, "title", "title_hi") || featured.title}
                  </h2>
                  {(pickLocalized(featured, lang, "excerpt", "excerpt_hi") || featured.excerpt) && (
                    <p className="mt-4 text-sm sm:text-base text-ink/80 font-normal leading-relaxed">
                      {pickLocalized(featured, lang, "excerpt", "excerpt_hi") || featured.excerpt}
                    </p>
                  )}
                  <span className="mt-6 inline-flex items-center gap-2 self-start text-sm font-medium text-orange group-hover:text-orange-dark transition-colors">
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
        <div className="space-y-4 sm:space-y-5">
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-ink/45 px-1">
            {lang === "hi" ? "और लेख" : "More articles"}
          </p>
          <div className="grid grid-cols-1 gap-4 sm:gap-5">
            {rest.map((p, i) => {
              const title = pickLocalized(p, lang, "title", "title_hi") || p.title;
              const excerpt = pickLocalized(p, lang, "excerpt", "excerpt_hi") || p.excerpt;
              const dateLabel = formatPostDate(p.created_at, lang);

              return (
                <article key={p.id} style={staggerDelay(i, 80)}>
                  <Link href={postHref(p)} className="block group">
                    <Glass3DCard
                      layered
                      className={cn(
                        REVEAL,
                        INTERACTIVE_CARD,
                        "rounded-2xl",
                        "sm:rounded-3xl",
                        "overflow-hidden"
                      )}
                    >
                      <div className="grid sm:grid-cols-[180px_1fr] lg:grid-cols-[220px_1fr] gap-0">
                        {p.image && (
                          <div className="relative min-h-[180px] sm:min-h-full sm:h-full">
                            <CardImage
                              src={p.image}
                              alt={postImageAlt(p, title)}
                              ratio="fill"
                              position="top"
                              className="h-full min-h-[180px]"
                            />
                          </div>
                        )}
                        <Float3D translateZ="40" className="p-5 sm:p-6 lg:p-7 flex flex-col justify-center">
                          {dateLabel && (
                            <time
                              dateTime={p.created_at}
                              className="text-[11px] tracking-wide uppercase text-ink/50 font-medium mb-2"
                            >
                              {dateLabel}
                            </time>
                          )}
                          <h3 className="font-display text-xl sm:text-2xl text-ink leading-snug break-words group-hover:text-orange transition-colors">
                            {title}
                          </h3>
                          {excerpt && (
                            <p className="text-sm text-ink/75 mt-2 font-normal leading-relaxed line-clamp-3">
                              {excerpt}
                            </p>
                          )}
                          <span className="mt-4 inline-flex items-center gap-2 self-start text-sm font-medium text-orange group-hover:text-orange-dark transition-colors">
                            {lang === "hi" ? "पूरा पढ़ें" : "Read article"}
                            <span aria-hidden>→</span>
                          </span>
                        </Float3D>
                      </div>
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
