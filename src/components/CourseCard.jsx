"use client";

import Link from "next/link";
import CardImage from "@/components/CardImage";
import { CardGlow, glassCardStyles } from "@/components/Glass3DCard";
import { cn } from "@/lib/utils";

export default function CourseCard({ course }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className={cn(glassCardStyles, "group/card rounded-2xl sm:rounded-3xl p-4 sm:p-5 w-full max-w-full block h-full")}
    >
      <CardGlow />

      <div className="relative">
        <CardImage src={course.image} alt={course.title} ratio="16/9" position="top" className="rounded-2xl" />
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
        {course.title}
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
