"use client";

import { INTERACTIVE_CARD, PAGE_CONTAINER, REVEAL } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { Glass3DCard, Float3D } from "@/components/Glass3DCard";
import AmbientGlows from "@/components/AmbientGlows";
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
        className="blog-article__h2 font-display text-2xl sm:text-3xl text-ink leading-tight text-balance scroll-mt-28"
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
      <ul className="blog-article__list space-y-2.5 pl-1">
        {block.items.map((item, i) => (
          <li key={i} className="flex gap-3 text-ink/90 leading-relaxed">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" aria-hidden />
            <span>
              <InlineText parts={item.inline} />
            </span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p className="blog-article__p text-ink/90 leading-[1.8] text-pretty text-sm sm:text-base">
      <InlineText parts={block.inline} />
    </p>
  );
}

export default function BlogArticleBody({ body, bodyHi }) {
  const { lang } = useLanguage();
  const source = lang === "hi" && bodyHi ? bodyHi : body;
  const blocks = parseBlogMarkdown(source || body || "");

  return (
    <div className={cn(PAGE_CONTAINER, "max-w-3xl", "pb-4", "relative", "z-20")}>
      <AmbientGlows variant="subtle" />
      <Glass3DCard
        layered
        className={cn(
          REVEAL,
          INTERACTIVE_CARD,
          "blog-article",
          "rounded-2xl",
          "sm:rounded-[2rem]",
          "p-5",
          "sm:p-8",
          "md:p-10",
          "border-ink/15",
          "relative",
          "overflow-hidden"
        )}
      >
        <div className="absolute -top-20 -right-16 h-56 w-56 rounded-full bg-orange/5 blur-3xl pointer-events-none" />
        <Float3D translateZ="40">
          <div className="blog-article-prose space-y-5 sm:space-y-6">
            {blocks.map((block, index) => (
              <Block key={`${block.type}-${index}`} block={block} index={index} />
            ))}
          </div>
        </Float3D>
      </Glass3DCard>
    </div>
  );
}
