import { notFound } from "next/navigation";
import { getCourseBySlug, getFaqs, getSiteSettings } from "@/lib/data";
import { isCourseAvailable } from "@/lib/courses";
import CourseDetailClient from "@/components/CourseDetailClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const course = await getCourseBySlug(params.slug);
  if (!course) {
    return { title: "Course", alternates: { canonical: "/courses" } };
  }
  const description =
    course.description ||
    `Learn ${course.title} at Shreya creation Patna — practical boutique & fashion training with certificate support.`;
  return {
    title: course.title,
    description,
    alternates: { canonical: `/courses/${course.slug}` },
    openGraph: {
      title: `${course.title} | Shreya creation Patna`,
      description,
      type: "website",
    },
  };
}

export default async function CourseDetail({ params }) {
  const [course, site, faqs] = await Promise.all([
    getCourseBySlug(params.slug),
    getSiteSettings(),
    getFaqs(),
  ]);
  if (!course || !isCourseAvailable(course)) return notFound();

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
