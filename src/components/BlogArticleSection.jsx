"use client";

import BlogArticleBody from "@/components/BlogArticleBody";
import { PAGE_CONTAINER } from "@/lib/ui";
import { cn } from "@/lib/utils";

export default function BlogArticleSection({ image, imageAlt, body, bodyHi }) {
  return (
    <div className={cn(PAGE_CONTAINER, image ? "max-w-6xl" : "max-w-3xl", "pb-6", "relative", "z-20")}>
      <BlogArticleBody body={body} bodyHi={bodyHi} image={image} imageAlt={imageAlt} />
    </div>
  );
}
