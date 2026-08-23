import { notFound } from "next/navigation";
import { getCourseBySlug, getFaqs, getSiteSettings } from "@/lib/data";
import { isCourseAvailable } from "@/lib/courses";
import CourseDetailClient from "@/components/CourseDetailClient";
import PageCTA from "@/components/PageCTA";
import JsonLdScript from "@/components/JsonLdScript";
import { getRequestLocale } from "@/lib/locale";
import {
  buildMetadata,
  breadcrumbJsonLd,
  breadcrumbLabel,
  courseJsonLd,
  courseMetaDescription,
  courseMetaTitle,
  faqJsonLd,
  itemImage,
  itemImageAlt,
} from "@/lib/seo";

export const revalidate = 3600;

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
  const locale = await getRequestLocale();
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
  const faqSlice = (courseFaqs.length ? courseFaqs : faqs).slice(0, 6);
  const courseTitle =
    locale === "hi" && (course.title_hi || course.titleHi)
      ? course.title_hi || course.titleHi
      : course.title;

  return (
    <>
      <JsonLdScript data={courseJsonLd(course, site, locale)} />
      <JsonLdScript
        data={breadcrumbJsonLd(
          [
            { name: breadcrumbLabel("home", locale), path: "/" },
            { name: breadcrumbLabel("courses", locale), path: "/courses" },
            { name: courseTitle, path: `/courses/${course.slug}` },
          ],
          locale
        )}
      />
      <JsonLdScript data={faqJsonLd(faqSlice, locale)} />
      <CourseDetailClient course={course} site={site} faqs={faqSlice} />
      <PageCTA whatsapp={site.whatsapp} />
    </>
  );
}
