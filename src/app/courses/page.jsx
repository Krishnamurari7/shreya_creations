import PageShell from "@/components/PageShell";
import LocalizedPageHeader from "@/components/LocalizedPageHeader";
import FeatureStrip from "@/components/FeatureStrip";
import CourseBrowser from "@/components/CourseBrowser";
import PageCTA from "@/components/PageCTA";
import { getCourses, getSiteSettings } from "@/lib/data";
import { pageCtaProps } from "@/lib/cms";

export const metadata = { title: "Courses — Shreya Creations" };

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
      <CourseBrowser courses={courses} />
      <PageCTA whatsapp={site.whatsapp} {...pageCtaProps(coursesPage)} />
    </PageShell>
  );
}
