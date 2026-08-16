"use client";

import { INTERACTIVE_CARD, PAGE_CONTAINER, REVEAL } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { Glass3DCard, Float3D } from "@/components/Glass3DCard";
import AmbientGlows from "@/components/AmbientGlows";
import BlogFeaturedImage from "@/components/BlogFeaturedImage";
import { useLanguage } from "@/components/LanguageProvider";
import { parseBlogMarkdown } from "@/lib/blog-markdown";

function InlineText({ parts = [] }) {
  return parts.map((part, i) =>
    part.type === "strong" ? (
      <strong key={i} className="font-semibold text-ink">
        {part.text}
      </strong>
    ) : (
      <span key={i}>{part.text}</span>
    )
  );
}

function Block({ block, index }) {
  if (block.type === "h2") {
    return (
      <h2
        id={`section-${index}`}
        className="blog-article__h2 font-display text-2xl sm:text-[1.75rem] text-ink leading-tight text-balance scroll-mt-28 pl-4 border-l-[3px] border-orange/60"
      >
        <InlineText parts={block.inline} />
      </h2>
    );
  }

  if (block.type === "h3") {
    const isFaq = /^Q\d+/i.test(block.text);
    return (
      <h3
        className={cn(
          "font-display text-lg sm:text-xl text-ink leading-snug text-balance",
          isFaq ? "blog-article__faq-q mt-8" : "blog-article__h3 mt-8"
        )}
      >
        {isFaq ? block.text.replace(/^Q\d+\.\s*/i, "") : <InlineText parts={block.inline} />}
      </h3>
    );
  }

  if (block.type === "ul") {
    return (
      <ul className="blog-article__list space-y-3 pl-0">
        {block.items.map((item, i) => (
          <li
            key={i}
            className="flex gap-3.5 rounded-xl border border-ink/[0.06] bg-orange/[0.03] px-4 py-3 text-ink/90 leading-relaxed dark:border-white/[0.06] dark:bg-white/[0.03]"
          >
            <span
              className="mt-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange/15 text-[10px] font-bold text-orange"
              aria-hidden
            >
              ✓
            </span>
            <span>
              <InlineText parts={item.inline} />
            </span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p className="blog-article__p text-ink/85 leading-[1.85] text-pretty text-[0.9375rem] sm:text-[1.0625rem]">
      <InlineText parts={block.inline} />
    </p>
  );
}

export default function BlogArticleBody({ body, bodyHi, image, imageAlt }) {
  const { lang } = useLanguage();
  const source = lang === "hi" && bodyHi ? bodyHi : body;
  const blocks = parseBlogMarkdown(source || body || "");
  const hasFloatImage = Boolean(image);

  return (
    <div className={cn("relative min-w-0", !hasFloatImage && cn(PAGE_CONTAINER, "max-w-3xl", "pb-6", "z-20"))}>
      <AmbientGlows variant="subtle" />
      <Glass3DCard
        layered
        className={cn(
          REVEAL,
          INTERACTIVE_CARD,
          "blog-article",
          "rounded-2xl",
          "sm:rounded-[2rem]",
          "p-6",
          "sm:p-9",
          "md:p-11",
          "border-orange/10",
          "relative",
          hasFloatImage ? "overflow-visible" : "overflow-hidden",
          "shadow-[0_20px_60px_-16px_rgba(26,16,40,0.12)]"
        )}
      >
        <div className="absolute -top-24 -right-20 h-64 w-64 rounded-full bg-orange/[0.07] blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-golden/[0.06] blur-3xl pointer-events-none" />
        <Float3D translateZ="40">
          <div className={cn(hasFloatImage && "blog-article-with-float")}>
            {hasFloatImage && (
              <figure className="blog-article-float-media not-prose mb-6 lg:float-right lg:ml-8 lg:mb-5 w-full lg:w-[min(360px,38%)] shrink-0">
                <BlogFeaturedImage src={image} alt={imageAlt} variant="sidebar" />
              </figure>
            )}
            <div className="blog-article-prose space-y-5 sm:space-y-7 min-w-0">
              {blocks.map((block, index) => (
                <Block key={`${block.type}-${index}`} block={block} index={index} />
              ))}
            </div>
          </div>
        </Float3D>
      </Glass3DCard>
    </div>
  );
}
