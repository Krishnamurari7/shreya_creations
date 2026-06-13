import PageShell from "@/components/PageShell";
import LocalizedPageHeader from "@/components/LocalizedPageHeader";
import FeatureStrip from "@/components/FeatureStrip";
import CoursesPageClient from "@/components/CoursesPageClient";
import PageCTA from "@/components/PageCTA";
import { getCourses, getSiteSettings } from "@/lib/data";
import { pageCtaProps } from "@/lib/cms";

export const metadata = { title: "Courses — Shreya creation" };

export default async function CoursesPage() {
  const [courses, site] = await Promise.all([getCourses(), getSiteSettings()]);
  const coursesPage = site.pages?.courses || {};

  return (
    <PageShell>
      <LocalizedPageHeader
        eyebrow={coursesPage.headerEyebrow || "Learn the craft"}
        eyebrowHi={coursesPage.headerEyebrowHi}
        title={coursesPage.headerTitle || "Fashion & stitching"}
        titleHi={coursesPage.headerTitleHi}
        highlight={coursesPage.headerHighlight || "courses"}
        highlightHi={coursesPage.headerHighlightHi}
        subtitle={coursesPage.headerSubtitle || "Hands-on, mentor-led courses in Hindi & English. Enroll directly on WhatsApp."}
        subtitleHi={coursesPage.headerSubtitleHi}
      />
      <FeatureStrip items={coursesPage.features || []} />
      <CoursesPageClient courses={courses} />
      <PageCTA whatsapp={site.whatsapp} {...pageCtaProps(coursesPage)} />
    </PageShell>
  );
}
