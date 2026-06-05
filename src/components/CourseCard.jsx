"use client";

import Link from "next/link";
import { CardGlow, glassCardStyles } from "@/components/Glass3DCard";
import { cn } from "@/lib/utils";

export default function CourseCard({ course }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className={cn(glassCardStyles, "rounded-2xl sm:rounded-3xl p-4 sm:p-5 w-full max-w-full block")}
    >
      <CardGlow />

      <div className="relative aspect-video overflow-hidden rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.55)]">
        {course.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.image}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover/card:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-90" />

        <span className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.2em] bg-black/75 text-white px-3.5 py-1.5 rounded-full border border-white/20 backdrop-blur-md">
          {course.category}
        </span>

        {course.preview_video && (
          <span className="absolute bottom-4 right-4 grid place-items-center h-8.5 w-8.5 rounded-full bg-orange text-white text-xs shadow-md border border-white/20">
            ▶
          </span>
        )}
      </div>

      <h3 className="mt-4 sm:mt-5 font-display text-xl sm:text-2xl text-ink leading-snug group-hover/card:text-orange transition-colors duration-300">
        {course.title}
      </h3>
      <p className="mt-2 text-sm text-ink line-clamp-2 font-normal">
        {course.description}
      </p>

      <div className="mt-5 flex items-center justify-between border-t border-ink/15 pt-4">
        <span className="text-xs uppercase tracking-wider text-ink">
          {course.duration} · {course.language}
        </span>
        {course.price && (
          <span className="font-medium text-lg text-ink group-hover/card:text-gold-gradient transition-colors">
            ₹{Number(course.price).toLocaleString("en-IN")}
          </span>
        )}
      </div>
    </Link>
  );
}
