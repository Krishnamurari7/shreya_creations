import PageShell from "@/components/PageShell";
import RegisterPageClient from "@/components/RegisterPageClient";
import JsonLdScript from "@/components/JsonLdScript";
import { getCourses, getSiteSettings } from "@/lib/data";
import { getRequestLocale } from "@/lib/locale";
import { buildMetadata, breadcrumbJsonLd, DEFAULT_OG_IMAGE } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata() {
  return buildMetadata({
    title: "Student Admission Form | Fashion Institute Patna — Shreya Creation",
    description:
      "Apply online for fashion designing, boutique, blouse making and stitching courses at Shreya Creation, Patna. Fill the admission form — we confirm on WhatsApp.",
    path: "/register",
    image: DEFAULT_OG_IMAGE,
    imageAlt: "Student admission form — Shreya Creation fashion institute Patna",
  });
}

export default async function RegisterPage({ searchParams }) {
  const locale = await getRequestLocale();
  const [courses, site] = await Promise.all([getCourses(), getSiteSettings()]);
  const courseSlug = (await searchParams)?.course || "";

  return (
    <PageShell>
      <JsonLdScript
        data={breadcrumbJsonLd(
          [
            { name: locale === "hi" ? "होम" : "Home", path: "/" },
            { name: locale === "hi" ? "कोर्स" : "Courses", path: "/courses" },
            { name: locale === "hi" ? "एडमिशन फॉर्म" : "Admission Form", path: "/register" },
          ],
          locale
        )}
      />
      <RegisterPageClient site={site} courses={courses} defaultCourseSlug={courseSlug} />
    </PageShell>
  );
}
