"use client";

import { useState, useMemo } from "react";
import CourseCard from "@/components/CourseCard";
import { Glass3DCard } from "@/components/Glass3DCard";
import { staggerDelay } from "@/lib/motion";

export default function CourseBrowser({ courses }) {
  const categories = useMemo(() => {
    const set = new Set(courses.map((c) => c.category).filter(Boolean));
    return ["All", ...set];
  }, [courses]);

  const [active, setActive] = useState("All");
  const filtered = active === "All" ? courses : courses.filter((c) => c.category === active);

  return (
    <div className="page-container pb-10 sm:pb-12 relative z-20 -mt-1">
      {/* Category Pills Card Wrapper */}
      <Glass3DCard className="rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 border-ink/15 mb-8 sm:mb-12 flex justify-center shadow-xl reveal">
        <div className="filter-pills justify-center md:justify-center md:flex-wrap">
          {categories.map((c) => {
            const isSelected = active === c;
            return (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-semibold tracking-widest uppercase transition-all duration-300 ${
                  isSelected
                    ? "btn-gold tab-active-glow"
                    : "filter-pill rounded-full px-5 py-2.5 text-xs uppercase tracking-wider font-medium"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </Glass3DCard>

      {/* Grid of Courses */}
      {filtered.length === 0 ? (
        <Glass3DCard className="rounded-2xl sm:rounded-[2rem] border-ink/15 p-12 sm:p-20 text-center">
          <span className="text-4xl">🎓</span>
          <p className="text-ink mt-4 font-normal text-base">No fashion courses are currently open in this category.</p>
        </Glass3DCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 items-stretch">
          {filtered.map((c, i) => (
            <div key={c.id} className="reveal w-full h-full" style={staggerDelay(i, 70)}>
              <CourseCard course={c} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
