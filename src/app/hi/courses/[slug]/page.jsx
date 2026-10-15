export { default } from "../../../courses/[slug]/page";
import { getCourseBySlug } from "@/lib/data";
import {
  buildMetadata,
  courseMetaDescription,
  courseMetaTitle,
  itemImage,
  itemImageAlt,
} from "@/lib/seo";
import { withLandingSeo } from "@/lib/course-landings.mjs";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const course = withLandingSeo(await getCourseBySlug(slug));
  if (!course) {
    return buildMetadata({
      title: "कोर्स | Shreya Creation",
      description: "Shreya Creation पटना में फैशन बुटीक कोर्स देखें।",
      path: "/courses",
      locale: "hi",
    });
  }
  const path = `/courses/${course.slug}`;
  return buildMetadata({
    title: courseMetaTitle(course, "hi"),
    description: courseMetaDescription(course, "hi"),
    path,
    image: itemImage(course),
    imageAlt: itemImageAlt(course),
    locale: "hi",
  });
}
