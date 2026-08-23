import PageShell from "@/components/PageShell";
import LocalizedPageHeader from "@/components/LocalizedPageHeader";
import CoursesPageClient from "@/components/CoursesPageClient";
import PageCTA from "@/components/PageCTA";
import JsonLdScript from "@/components/JsonLdScript";
import { getCourses, getSiteSettings } from "@/lib/data";
import { pageCtaProps } from "@/lib/cms";
import { getRequestLocale } from "@/lib/locale";
import { buildMetadata, breadcrumbJsonLd, breadcrumbLabel, DEFAULT_OG_IMAGE } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "Boutique & Fashion Designing Courses in Patna | Shreya Creation",
  description:
    "Job-oriented boutique, blouse-making & fashion design courses in Patna (Boring Road). 100% practical training, certificate & placement support. Book a free demo.",
  path: "/courses",
  image: DEFAULT_OG_IMAGE,
  imageAlt: "Boutique and fashion designing courses in Patna",
});

export default async function CoursesPage() {
  const locale = await getRequestLocale();
  const [courses, site] = await Promise.all([getCourses(), getSiteSettings()]);
  const coursesPage = site.pages?.courses || {};

  return (
    <PageShell>
      <JsonLdScript
        data={breadcrumbJsonLd(
          [
            { name: breadcrumbLabel("home", locale), path: "/" },
            { name: breadcrumbLabel("courses", locale), path: "/courses" },
          ],
          locale
        )}
      />
      <LocalizedPageHeader
        compact
        eyebrow={coursesPage.headerEyebrow || "Our Courses"}
        eyebrowHi={coursesPage.headerEyebrowHi || "हमारे कोर्स"}
        title={coursesPage.headerTitle || "Fashion Designing & Boutique Courses in Patna"}
        titleHi={coursesPage.headerTitleHi || "पटना में फैशन डिज़ाइनिंग और बुटीक कोर्स"}
      />
      <CoursesPageClient courses={courses} whatsapp={site.whatsapp} />
      <PageCTA whatsapp={site.whatsapp} {...pageCtaProps(coursesPage)} />
    </PageShell>
  );
}
