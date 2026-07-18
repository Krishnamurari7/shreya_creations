import { notFound } from "next/navigation";
import { getCourseBySlug, getFaqs, getSiteSettings } from "@/lib/data";
import { isCourseAvailable } from "@/lib/courses";
import CourseDetailClient from "@/components/CourseDetailClient";
import JsonLdScript from "@/components/JsonLdScript";
import {
  buildMetadata,
  breadcrumbJsonLd,
  courseJsonLd,
  courseMetaDescription,
  courseMetaTitle,
  faqJsonLd,
  itemImage,
  itemImageAlt,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) {
    return buildMetadata({
      title: "Course | Shreya Creation",
      description: "Browse fashion boutique courses at Shreya Creation Patna.",
      path: "/courses",
    });
  }
  const path = `/courses/${course.slug}`;
  const title = courseMetaTitle(course);
  const description = courseMetaDescription(course);
  const image = itemImage(course);
  return buildMetadata({
    title,
    description,
    path,
    image,
    imageAlt: itemImageAlt(course),
  });
}

export default async function CourseDetail({ params }) {
  const { slug } = await params;
  const [course, site, faqs] = await Promise.all([
    getCourseBySlug(slug),
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
  const faqSlice = courseFaqs.length ? courseFaqs : faqs.slice(0, 6);

  return (
    <>
      <JsonLdScript data={courseJsonLd(course, site)} />
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Courses", path: "/courses" },
          { name: course.title, path: `/courses/${course.slug}` },
        ])}
      />
      <JsonLdScript data={faqJsonLd(faqSlice)} />
      <CourseDetailClient course={course} site={site} faqs={faqSlice} />
    </>
  );
}
