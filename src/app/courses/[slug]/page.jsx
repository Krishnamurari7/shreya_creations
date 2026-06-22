import { notFound } from "next/navigation";
import { getCourseBySlug, getFaqs, getSiteSettings } from "@/lib/data";
import CourseDetailClient from "@/components/CourseDetailClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const course = await getCourseBySlug(params.slug);
  return { title: course ? `${course.title} — Shreya creation` : "Courses — Shreya creation" };
}

export default async function CourseDetail({ params }) {
  const [course, site, faqs] = await Promise.all([
    getCourseBySlug(params.slug),
    getSiteSettings(),
    getFaqs(),
  ]);
  if (!course) return notFound();

  const courseFaqs = faqs.filter(
    (f) =>
      !f.category ||
      f.category === "course" ||
      f.category === course.category?.toLowerCase()
  );

  return (
    <CourseDetailClient
      course={course}
      site={site}
      faqs={courseFaqs.length ? courseFaqs : faqs.slice(0, 6)}
    />
  );
}
