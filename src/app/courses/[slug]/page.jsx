import { notFound } from "next/navigation";
import { getCourseBySlug, getSiteSettings } from "@/lib/data";
import CourseDetailClient from "@/components/CourseDetailClient";

export async function generateMetadata({ params }) {
  const course = await getCourseBySlug(params.slug);
  return { title: course ? `${course.title} — Shreya creation` : "Courses — Shreya creation" };
}

export default async function CourseDetail({ params }) {
  const [course, site] = await Promise.all([getCourseBySlug(params.slug), getSiteSettings()]);
  if (!course) return notFound();

  const syllabus = Array.isArray(course.syllabus)
    ? course.syllabus
    : typeof course.syllabus === "string"
    ? course.syllabus.split("\n").filter(Boolean)
    : [];

  return <CourseDetailClient course={course} site={site} syllabus={syllabus} />;
}
