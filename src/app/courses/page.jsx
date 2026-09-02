import PageShell from "@/components/PageShell";
import LocalizedPageHeader from "@/components/LocalizedPageHeader";
import CoursesPageClient from "@/components/CoursesPageClient";
import { CoursesIntroStrip, InstituteSeoBlocks } from "@/components/InstituteSeoSections";
import PageCTA from "@/components/PageCTA";
import JsonLdScript from "@/components/JsonLdScript";
import { getCourses, getSiteSettings } from "@/lib/data";
import { pageCtaProps } from "@/lib/cms";
import { PAGE_DEFAULTS } from "@/lib/cms/defaults";
import { getRequestLocale } from "@/lib/locale";
import { buildMetadata, breadcrumbJsonLd, breadcrumbLabel, DEFAULT_OG_IMAGE } from "@/lib/seo";

export const revalidate = 3600;

const COURSES_DEFAULTS = PAGE_DEFAULTS.courses;

const COURSES_META_FALLBACK = {
  title: COURSES_DEFAULTS.meta_title,
  description: COURSES_DEFAULTS.meta_description,
};

export async function generateMetadata() {
  const site = await getSiteSettings();
  const courses = site.pages?.courses || {};
  const title = courses.metaTitle || courses.meta_title || COURSES_META_FALLBACK.title;
  const description =
    courses.metaDescription || courses.meta_description || COURSES_META_FALLBACK.description;

  return buildMetadata({
    title,
    description,
    path: "/courses",
    image: DEFAULT_OG_IMAGE,
    imageAlt: "Best fashion institute and designing courses in Patna",
  });
}

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
        eyebrow={coursesPage.headerEyebrow || COURSES_DEFAULTS.header_eyebrow}
        eyebrowHi={coursesPage.headerEyebrowHi || COURSES_DEFAULTS.header_eyebrow_hi}
        title={coursesPage.headerTitle || COURSES_DEFAULTS.header_title}
        titleHi={coursesPage.headerTitleHi || COURSES_DEFAULTS.header_title_hi}
        subtitle={coursesPage.headerSubtitle || COURSES_DEFAULTS.header_subtitle}
        subtitleHi={coursesPage.headerSubtitleHi || COURSES_DEFAULTS.header_subtitle_hi}
      />
      <CoursesIntroStrip coursesPage={coursesPage} />
      <CoursesPageClient courses={courses} whatsapp={site.whatsapp} />
      <InstituteSeoBlocks coursesPage={coursesPage} />
      <PageCTA whatsapp={site.whatsapp} {...pageCtaProps(coursesPage)} />
    </PageShell>
  );
}
