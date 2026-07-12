"use client";

import Link from "next/link";
import CardImage from "@/components/CardImage";
import { CardGlow, glassCardStyles } from "@/components/Glass3DCard";
import { comingSoonLabel, isCourseAvailable, isAddonCourse, addonCourseLabel } from "@/lib/courses";
import { cn } from "@/lib/utils";

function courseTitle(course, lang) {
  if (lang === "hi") return course.title_hi ?? course.titleHi ?? course.title;
  return course.title;
}

function courseDescription(course, lang) {
  if (lang === "hi") {
    return course.description_hi ?? course.descriptionHi ?? course.description ?? "";
  }
  return course.description ?? "";
}

function courseIncludes(course, lang) {
  if (lang === "hi") {
    const hi = course.includes_hi ?? course.includesHi;
    if (Array.isArray(hi) && hi.length) return hi;
  }
  return Array.isArray(course.includes) ? course.includes : [];
}

function courseBadgeMeta(course, featuredIndex) {
  if (isAddonCourse(course) || course.badge === "addon") {
    return { label: "ADD-ON", tone: "addon" };
  }
  if (course.badge === "bestseller" || featuredIndex === 0) {
    return { label: "BESTSELLER", tone: "bestseller" };
  }
  if (/advanced|advance/i.test(course.title || "")) {
    return { label: "ADVANCED", tone: "advanced" };
  }
  if (course.badge === "premium" || (course.price && Number(course.price) >= 25000)) {
    return { label: "PREMIUM", tone: "premium" };
  }
  if (featuredIndex === 1 || course.badge === "popular") {
    return { label: "POPULAR", tone: "popular" };
  }
  return null;
}

function courseLevel(course, lang) {
  const hi = lang === "hi";
  if (/advanced|advance/i.test(course.title || "")) return hi ? "एडवांस्ड" : "Advanced";
  if (isAddonCourse(course) || /\b\d+\s*(day|days|week|weeks)\b/i.test(course.duration || "")) {
    return hi ? "शॉर्ट" : "Short";
  }
  if (/basic|beginner|mastery/i.test(course.title || "")) return hi ? "बिगिनर" : "Beginner";
  return hi ? "इंटरमीडिएट" : "Intermediate";
}

function courseFrequency(course, lang) {
  const hi = lang === "hi";
  const blob = `${course.description || ""} ${course.description_hi || ""} ${(course.includes || []).join(" ")} ${(course.includes_hi || []).join(" ")}`;
  const en = blob.match(/(\d+)\s*days?\s*(?:per|\/)\s*week/i);
  if (en) return hi ? `${en[1]} दिन/सप्ताह` : `${en[1]} Days/Week`;
  const hiMatch = blob.match(/सप्ताह में\s*(\d+)\s*दिन/);
  if (hiMatch) return hi ? `${hiMatch[1]} दिन/सप्ताह` : `${hiMatch[1]} Days/Week`;
  return hi ? "3 दिन/सप्ताह" : "3 Days/Week";
}

function courseHighlights(course, lang) {
  const includes = courseIncludes(course, lang);
  return includes
    .filter((line) => {
      const t = String(line || "").toLowerCase();
      return !/^\d+\s*(month|months|महीने)/.test(t) && !/days?\/week|दिन\/सप्ताह|hours?\/day/.test(t);
    })
    .slice(0, 4);
}

function MetaIcon({ type }) {
  const props = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.75",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: "featured-course-card__meta-icon",
    "aria-hidden": true,
  };

  switch (type) {
    case "duration":
      return (
        <svg {...props}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M8 3v4M16 3v4M3 10h18" />
        </svg>
      );
    case "frequency":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "level":
      return (
        <svg {...props}>
          <path d="M4 19h16M7 16V9M12 16V5M17 16v-4" />
        </svg>
      );
    default:
      return null;
  }
}

export default function CourseCard({ course, variant = "default", featuredIndex = 0, lang = "en" }) {
  const available = isCourseAvailable(course);
  const detailHref = `/courses/${course.slug}`;
  const hi = lang === "hi";

  if (variant === "featured") {
    const comparePrice = course.compare_price ?? course.original_price;
    const price = course.price ? Number(course.price) : null;
    const showCompare = comparePrice && price && Number(comparePrice) > price;
    const discountPct =
      showCompare ? Math.round((1 - price / Number(comparePrice)) * 100) : null;
    const badge = courseBadgeMeta(course, featuredIndex);
    const title = courseTitle(course, lang);
    const description = courseDescription(course, lang);
    const highlights = courseHighlights(course, lang);
    const duration = course.duration || (hi ? "3 महीने" : "3 Months");
    const frequency = courseFrequency(course, lang);
    const level = courseLevel(course, lang);
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
            {badge && (
              <span className={cn("featured-course-card__badge", `featured-course-card__badge--${badge.tone}`)}>
                {badge.tone === "addon" ? addonCourseLabel(lang) : badge.label}
              </span>
            )}
            {discountPct != null && discountPct > 0 && (
              <span className="featured-course-card__badge featured-course-card__badge--sale">
                {discountPct}% OFF
              </span>
            )}
            <span className="featured-course-card__duration">{duration}</span>
          </Link>
        ) : (
          <div className={mediaClass}>
            <CardImage src={course.image} alt={title} ratio="16/9" position="top" />
            {badge && (
              <span className={cn("featured-course-card__badge", `featured-course-card__badge--${badge.tone}`)}>
                {badge.tone === "addon" ? addonCourseLabel(lang) : badge.label}
              </span>
            )}
            <span className="featured-course-card__duration">{duration}</span>
          </div>
        )}

        <div className="featured-course-card__body flex flex-col flex-1">
          {available ? (
            <Link href={detailHref}>
              <h3 className="featured-course-card__title">{title}</h3>
            </Link>
          ) : (
            <h3 className="featured-course-card__title">{title}</h3>
          )}

          {description && (
            <p className="featured-course-card__desc">{description}</p>
          )}

          <ul className="featured-course-card__meta">
            <li>
              <MetaIcon type="duration" />
              <span>{duration}</span>
            </li>
            <li>
              <MetaIcon type="frequency" />
              <span>{frequency}</span>
            </li>
            <li>
              <MetaIcon type="level" />
              <span>{level}</span>
            </li>
          </ul>

          {highlights.length > 0 && (
            <ul className="featured-course-card__highlights">
              {highlights.map((item) => (
                <li key={item}>
                  <span className="featured-course-card__check" aria-hidden>✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="featured-course-card__footer mt-auto min-w-0">
            {price != null ? (
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
            ) : (
              <span className="featured-course-card__price featured-course-card__price--ask">
                {hi ? "विवरण में फीस" : "Fee on details"}
              </span>
            )}

            {available ? (
              <Link href={detailHref} className="featured-course-card__details">
                {hi ? "विवरण देखें" : "View Details"}
                <span aria-hidden>→</span>
              </Link>
            ) : (
              <span className="featured-course-card__coming-soon" aria-disabled="true">
                {comingSoonLabel(lang)}
              </span>
            )}
          </div>
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
          <span className="absolute bottom-4 right-4 z-10 grid place-items-center h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-orange text-white text-xs shadow-md border border-white/20">
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
