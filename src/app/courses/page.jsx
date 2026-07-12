import PageShell from "@/components/PageShell";
import LocalizedPageHeader from "@/components/LocalizedPageHeader";
import CoursesPageClient from "@/components/CoursesPageClient";
import PageCTA from "@/components/PageCTA";
import { getCourses, getSiteSettings } from "@/lib/data";
import { pageCtaProps } from "@/lib/cms";

export const metadata = { title: "Our Courses — Shreya creation" };

export default async function CoursesPage() {
  const [courses, site] = await Promise.all([getCourses(), getSiteSettings()]);
  const coursesPage = site.pages?.courses || {};

  return (
    <PageShell>
      <LocalizedPageHeader
        compact
        eyebrow={coursesPage.headerEyebrow || "Our Courses"}
        eyebrowHi={coursesPage.headerEyebrowHi}
        title={coursesPage.headerTitle || "Professional fashion"}
        titleHi={coursesPage.headerTitleHi}
        highlight={coursesPage.headerHighlight || "training"}
        highlightHi={coursesPage.headerHighlightHi}
        subtitle={coursesPage.headerSubtitle || "10 courses — boutique, blouse, suit, kids wear, fashion design & lehenga. Enroll on WhatsApp."}
        subtitleHi={coursesPage.headerSubtitleHi}
      />
      <CoursesPageClient courses={courses} whatsapp={site.whatsapp} />
      <PageCTA whatsapp={site.whatsapp} {...pageCtaProps(coursesPage)} />
    </PageShell>
  );
}
