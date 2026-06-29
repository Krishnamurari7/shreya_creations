"use client";

import { INTERACTIVE_CARD, REVEAL } from "@/lib/ui";
import { cn } from "@/lib/utils";
import Link from "next/link";
import CardImage from "@/components/CardImage";
import { Glass3DCard, Float3D } from "@/components/Glass3DCard";
import { useLanguage } from "@/components/LanguageProvider";
import { staggerDelay } from "@/lib/motion";

export default function LookbookGrid({ posts = [] }) {
  const { lang } = useLanguage();

  if (!posts.length) {
    return (
      <Glass3DCard className={cn(REVEAL, "rounded-2xl", "sm:rounded-[2rem]", "border-ink/15", "p-12", "sm:p-20", "text-center", "col-span-full")}>
        <span className="text-5xl">✨</span>
        <p className="text-ink mt-4 font-normal text-base max-w-md mx-auto">
          {lang === "hi"
            ? "अभी कोई लुकबुक पोस्ट नहीं। एडमिन से जोड़ें।"
            : "No lookbook posts yet. Add them in Admin → Lookbook."}
        </p>
        <Link href="/admin/lookbook" className="inline-block mt-6 text-orange hover:text-orange-dark text-sm font-medium tracking-wide">
          {lang === "hi" ? "एडमिन → लुकबुक" : "Admin → Lookbook"} →
        </Link>
      </Glass3DCard>
    );
  }

  const [featured, ...rest] = posts;

  return (
    <div className="space-y-6 sm:space-y-8">
      {featured && (
        <Glass3DCard layered className={cn(INTERACTIVE_CARD, REVEAL, "rounded-2xl", "sm:rounded-[2rem]", "overflow-hidden", "border-orange/20", "group")}>
          <div className="grid md:grid-cols-2 gap-0">
            {featured.image && (
              <div className="lookbook-featured-media relative h-full min-h-[280px] md:min-h-[320px]">
                <CardImage src={featured.image} alt={featured.title} ratio="fill" position="top" className="h-full min-h-[280px] md:min-h-[320px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/30 pointer-events-none" />
              </div>
            )}
            <Float3D translateZ="50" className="p-6 sm:p-10 flex flex-col justify-center">
              <span className="inline-flex self-start items-center gap-1.5 bg-orange/10 border border-orange/20 text-orange px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase mb-4">
                {lang === "hi" ? "फ़ीचर्ड" : "Featured"}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight">{featured.title}</h2>
              {featured.excerpt && (
                <p className="mt-4 text-sm sm:text-base text-ink font-normal leading-relaxed">{featured.excerpt}</p>
              )}
            </Float3D>
          </div>
        </Glass3DCard>
      )}

      {rest.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {rest.map((p, i) => (
            <Glass3DCard
              key={p.id}
              layered
              className={cn(INTERACTIVE_CARD, REVEAL, "rounded-2xl", "sm:rounded-3xl", "overflow-hidden", "group")}
              style={staggerDelay(i, 90)}
            >
              {p.image && (
                <div className="relative">
                  <CardImage src={p.image} alt={p.title} ratio="3/4" position="top" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 pointer-events-none" />
                </div>
              )}
              <Float3D translateZ="40" className="p-5 sm:p-6 -mt-16 relative z-10">
                <h3 className="font-display text-xl sm:text-2xl text-ink leading-snug">{p.title}</h3>
                {p.excerpt && (
                  <p className="text-sm text-ink mt-2 font-normal line-clamp-2">{p.excerpt}</p>
                )}
              </Float3D>
            </Glass3DCard>
          ))}
        </div>
      )}
    </div>
  );
}
