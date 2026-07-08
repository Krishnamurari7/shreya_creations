"use client";

import { FIELD_SURFACE, FILTER_PILLS, PAGE_CONTAINER, PAGE_SECTION, PAGE_SECTION_TIGHT_TOP, REVEAL, REVEAL_ZOOM } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import CourseCard from "@/components/CourseCard";
import { Glass3DCard } from "@/components/Glass3DCard";
import { useLanguage } from "@/components/LanguageProvider";
import { isCourseAvailable } from "@/lib/courses";
import { staggerDelay } from "@/lib/motion";

export default function CourseBrowser({ courses = [] }) {
  const { lang } = useLanguage();

  const availableCourses = useMemo(
    () => courses.filter((c) => isCourseAvailable(c)),
    [courses]
  );

  const categories = useMemo(() => {
    const set = new Set(availableCourses.map((c) => c.category).filter(Boolean));
    return ["All", ...set];
  }, [availableCourses]);

  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return availableCourses.filter((c) => {
      const okCat = active === "All" || c.category === active;
      const okQ =
        !q ||
        c.title?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q);
      return okCat && okQ;
    });
  }, [availableCourses, active, query]);

  const searchPlaceholder =
    lang === "hi" ? "कोर्स खोजें…" : "Search courses…";
  const emptyMessage =
    lang === "hi"
      ? "इस श्रेणी में अभी कोई कोर्स उपलब्ध नहीं है।"
      : "No fashion courses are currently open in this category.";
  const resultsLabel =
    lang === "hi"
      ? `${filtered.length} कोर्स मिले`
      : `${filtered.length} course${filtered.length === 1 ? "" : "s"} found`;

  return (
    <section className={cn(PAGE_SECTION, PAGE_SECTION_TIGHT_TOP, "courses-browser", "pb-10", "sm:pb-14", "relative", "z-20")}>
      <div className={cn(PAGE_CONTAINER, "max-w-7xl")}>
        <Glass3DCard className={cn(REVEAL, "courses-browser__toolbar", "rounded-2xl", "sm:rounded-[2rem]", "p-4", "sm:p-6", "border-ink/15", "mb-6", "sm:mb-8", "shadow-xl")}>
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 lg:items-center lg:justify-between">
            {categories.length > 1 && (
              <div className="home-courses-preview__filters mb-0 min-w-0">
                <div className={cn(FILTER_PILLS, "justify-start", "lg:flex-wrap")}>
                  {categories.map((cat) => {
                    const isSelected = active === cat;
                    const label =
                      cat === "All"
                        ? lang === "hi"
                          ? "सभी कोर्स"
                          : "All Courses"
                        : cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setActive(cat)}
                        className={
                          isSelected
                            ? "home-courses-preview__pill home-courses-preview__pill--active"
                            : "home-courses-preview__pill"
                        }
                        aria-pressed={isSelected}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="relative w-full lg:max-w-xs shrink-0">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className={cn(FIELD_SURFACE, "w-full", "rounded-full", "pl-11", "pr-5", "py-3", "text-sm", "font-light")}
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-orange">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
          </div>
        </Glass3DCard>

        <p className={cn(REVEAL, "courses-browser__count", "text-sm", "text-ink/70", "mb-5", "sm:mb-6", "px-1")}>
          {resultsLabel}
        </p>

        {filtered.length === 0 ? (
          <Glass3DCard className={cn(REVEAL, "rounded-2xl", "sm:rounded-[2rem]", "border-ink/15", "p-12", "sm:p-20", "text-center")}>
            <span className="text-4xl">🎓</span>
            <p className="text-ink mt-4 font-normal text-base">{emptyMessage}</p>
          </Glass3DCard>
        ) : (
          <div className="home-courses-preview__grid">
            {filtered.map((course, i) => (
              <div
                key={course.id}
                className={cn(REVEAL, REVEAL_ZOOM, "in", "w-full", "h-full")}
                style={staggerDelay(i, 70)}
              >
                <CourseCard
                  course={course}
                  variant="featured"
                  featuredIndex={i}
                  lang={lang}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
