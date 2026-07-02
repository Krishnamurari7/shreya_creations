"use client";

import { BTN_PRIMARY } from "@/lib/ui";
import Link from "next/link";
import CardImage from "@/components/CardImage";
import { CardGlow, glassCardStyles } from "@/components/Glass3DCard";
import { comingSoonLabel, isCourseAvailable } from "@/lib/courses";
import { cn } from "@/lib/utils";

function courseTitle(course, lang) {
  if (lang === "hi") return course.title_hi ?? course.titleHi ?? course.title;
  return course.title;
}

function reviewCountFromSlug(slug = "") {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return 80 + (hash % 420);
}

function StarRating({ count, className = "" }) {
  return (
    <div className={cn("featured-course-card__rating", className)}>
      <span className="featured-course-card__stars" aria-hidden>
        {"★".repeat(5)}
      </span>
      <span className="featured-course-card__reviews">({count})</span>
    </div>
  );
}

export default function CourseCard({ course, variant = "default", featuredIndex = 0, lang = "en" }) {
  const available = isCourseAvailable(course);
  const detailHref = `/courses/${course.slug}`;

  if (variant === "featured") {
    const comparePrice = course.compare_price ?? course.original_price;
    const price = course.price ? Number(course.price) : null;
    const showCompare = comparePrice && price && Number(comparePrice) > price;
    const discountPct =
      showCompare ? Math.round((1 - price / Number(comparePrice)) * 100) : null;
    const reviews = reviewCountFromSlug(course.slug);
    const showBestseller = featuredIndex === 0 || course.badge === "bestseller";

    const title = courseTitle(course, lang);
    const mediaClass = cn(
      "featured-course-card__media block",
      !available && "featured-course-card__media--static"
    );

    return (
      <article
        className={cn(
          "featured-course-card group/card flex flex-col h-full",
          !available && "featured-course-card--coming-soon"
        )}
      >
        {available ? (
          <Link href={detailHref} className={mediaClass}>
            <CardImage src={course.image} alt={title} ratio="16/9" position="top" />
            {discountPct != null && discountPct > 0 && (
              <span className="featured-course-card__badge featured-course-card__badge--sale">
                {discountPct}% OFF
              </span>
            )}
            {showBestseller && (
              <span className="featured-course-card__badge featured-course-card__badge--bestseller">
                Bestseller
              </span>
            )}
          </Link>
        ) : (
          <div className={mediaClass}>
            <CardImage src={course.image} alt={title} ratio="16/9" position="top" />
            {discountPct != null && discountPct > 0 && (
              <span className="featured-course-card__badge featured-course-card__badge--sale">
                {discountPct}% OFF
              </span>
            )}
            {showBestseller && (
              <span className="featured-course-card__badge featured-course-card__badge--bestseller">
                Bestseller
              </span>
            )}
          </div>
        )}

        <div className="featured-course-card__body flex flex-col flex-1">
          {course.category && (
            <span className="featured-course-card__category">{course.category}</span>
          )}

          {available ? (
            <Link href={detailHref}>
              <h3 className="featured-course-card__title">{title}</h3>
            </Link>
          ) : (
            <h3 className="featured-course-card__title">{title}</h3>
          )}

          <StarRating count={reviews} />

          {price != null && (
            <div className="featured-course-card__pricing">
              <span className="featured-course-card__price">
                ₹{price.toLocaleString("en-IN")}
              </span>
              {showCompare && (
                <span className="featured-course-card__compare">
                  ₹{Number(comparePrice).toLocaleString("en-IN")}
                </span>
              )}
            </div>
          )}

          {available ? (
            <Link
              href={detailHref}
              className={cn(BTN_PRIMARY, "featured-course-card__enroll", "mt-auto")}
            >
              {course.cta_label || (lang === "hi" ? "अभी एनरोल करें" : "Enroll Now")}
              <span aria-hidden>→</span>
            </Link>
          ) : (
            <span
              className="featured-course-card__coming-soon mt-auto"
              aria-disabled="true"
            >
              {comingSoonLabel(lang)}
            </span>
          )}
        </div>
      </article>
    );
  }

  if (!available) {
    return (
      <div
        className={cn(
          glassCardStyles,
          "featured-course-card--coming-soon",
          "group/card rounded-2xl sm:rounded-3xl p-4 sm:p-5 w-full max-w-full block h-full"
        )}
      >
        <CardGlow />

        <div className="relative">
          <CardImage src={course.image} alt={courseTitle(course, lang)} ratio="16/9" position="top" className="rounded-2xl" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-90 rounded-2xl pointer-events-none" />

          <span className="absolute top-4 left-4 z-10 text-[10px] uppercase tracking-[0.2em] bg-black/75 text-white px-3.5 py-1.5 rounded-full border border-white/20 backdrop-blur-md">
            {course.category}
          </span>
        </div>

        <h3 className="mt-4 sm:mt-5 font-display text-xl sm:text-2xl text-ink leading-snug line-clamp-2">
          {courseTitle(course, lang)}
        </h3>
        <p className="mt-2 text-sm text-ink line-clamp-2 font-normal">
          {course.description}
        </p>

        <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-ink/15 pt-3 sm:pt-4">
          <span className="text-[10px] sm:text-xs uppercase tracking-wider text-ink">
            {course.duration} · {course.language}
          </span>
          {course.price && (
            <span className="font-medium text-base sm:text-lg text-orange">
              ₹{Number(course.price).toLocaleString("en-IN")}
            </span>
          )}
        </div>

        <span className="featured-course-card__coming-soon mt-4 sm:mt-5" aria-disabled="true">
          {comingSoonLabel(lang)}
        </span>
      </div>
    );
  }

  return (
    <Link
      href={detailHref}
      className={cn(glassCardStyles, "group/card rounded-2xl sm:rounded-3xl p-4 sm:p-5 w-full max-w-full block h-full")}
    >
      <CardGlow />

      <div className="relative">
        <CardImage src={course.image} alt={courseTitle(course, lang)} ratio="16/9" position="top" className="rounded-2xl" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-90 rounded-2xl pointer-events-none" />

        <span className="absolute top-4 left-4 z-10 text-[10px] uppercase tracking-[0.2em] bg-black/75 text-white px-3.5 py-1.5 rounded-full border border-white/20 backdrop-blur-md">
          {course.category}
        </span>

        {course.preview_video && (
          <span className="absolute bottom-4 right-4 z-10 grid place-items-center h-8.5 w-8.5 rounded-full bg-orange text-white text-xs shadow-md border border-white/20">
            ▶
          </span>
        )}
      </div>

      <h3 className="mt-4 sm:mt-5 font-display text-xl sm:text-2xl text-ink leading-snug group-hover/card:text-orange transition-colors duration-300 line-clamp-2">
        {courseTitle(course, lang)}
      </h3>
      <p className="mt-2 text-sm text-ink line-clamp-2 font-normal">
        {course.description}
      </p>

      <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-ink/15 pt-3 sm:pt-4">
        <span className="text-[10px] sm:text-xs uppercase tracking-wider text-ink">
          {course.duration} · {course.language}
        </span>
        {course.price && (
          <span className="font-medium text-base sm:text-lg text-orange">
            ₹{Number(course.price).toLocaleString("en-IN")}
          </span>
        )}
      </div>
    </Link>
  );
}
