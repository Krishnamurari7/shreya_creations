"use client";

import { FILTER_PILLS, HIGHLIGHT_SHIMMER, HOME_BAND_BRAND, PAGE_CONTAINER, PAGE_SECTION, PAGE_SECTION_BORDERED, REVEAL, REVEAL_ZOOM } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import Link from "next/link";
import CourseCard from "@/components/CourseCard";
import { pickPage } from "@/lib/cms";
import { useLanguage } from "@/components/LanguageProvider";

const HOME_COURSE_LIMIT = 10;

export default function HomeCoursesPreview({ courses = [], home = {} }) {
  const { lang } = useLanguage();

  const categories = useMemo(() => {
    const set = new Set(courses.map((c) => c.category).filter(Boolean));
    return ["All", ...set];
  }, [courses]);

  const [active, setActive] = useState("All");

  const filtered = useMemo(() => {
    const list = active === "All" ? courses : courses.filter((c) => c.category === active);
    return list.slice(0, HOME_COURSE_LIMIT);
  }, [courses, active]);

  if (!courses.length) return null;

  const eyebrow =
    pickPage(home, lang, "coursesEyebrow", "coursesEyebrowHi") ||
    (lang === "hi" ? "हमारे कोर्स" : "Our Courses");
  const title = pickPage(home, lang, "academyHeading", "academyHeadingHi") ||
    (lang === "hi" ? "हमारे" : "Our");
  const titleHighlight = pickPage(home, lang, "academyHeadingHighlight", "academyHeadingHighlightHi") ||
    (lang === "hi" ? "कोर्स" : "Courses");
  const viewAllLabel =
    lang === "hi"
      ? `सभी ${courses.length} कोर्स देखें`
      : `View All ${courses.length} Courses`;

  return (
    <section className={cn(HOME_BAND_BRAND, PAGE_SECTION, PAGE_SECTION_BORDERED, "home-courses-preview", "relative", "z-20")}>
      <div className={cn(PAGE_CONTAINER, "max-w-7xl")}>
        <div className={cn(REVEAL, "home-courses-preview__header", "in")}>
          <div className="home-courses-preview__header-copy">
            <span className="home-courses-preview__eyebrow">
              <span aria-hidden>⚡</span>
              {eyebrow}
            </span>
            <h2 className="home-courses-preview__title">
              {title}{" "}
              <span className={HIGHLIGHT_SHIMMER}>{titleHighlight}</span>
            </h2>
          </div>
          <Link href="/courses" className="home-courses-preview__view-all">
            {viewAllLabel}
            <span aria-hidden>→</span>
          </Link>
        </div>

        {categories.length > 1 && (
          <div className={cn(REVEAL, "home-courses-preview__filters", "in")}>
            <div className={FILTER_PILLS}>
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

        <div className="home-courses-preview__grid">
          {filtered.map((course, i) => (
            <div key={course.id} className={cn(REVEAL, REVEAL_ZOOM, "in")} style={{ transitionDelay: `${i * 80}ms` }}>
              <CourseCard
                course={course}
                variant="featured"
                featuredIndex={i}
                lang={lang}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
