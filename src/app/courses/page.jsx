import PageShell from "@/components/PageShell";
import LocalizedPageHeader from "@/components/LocalizedPageHeader";
import CoursesPageClient from "@/components/CoursesPageClient";
import PageCTA from "@/components/PageCTA";
import PageSeoIntro from "@/components/PageSeoIntro";
import { getCourses, getSiteSettings } from "@/lib/data";
import { pageCtaProps } from "@/lib/cms";
import { buildMetadata, DEFAULT_OG_IMAGE } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Boutique & Fashion Designing Courses in Patna | Shreya Creation",
  description:
    "Job-oriented boutique, blouse-making & fashion design courses in Patna (Boring Road). 100% practical training, certificate & placement support. Book a free demo.",
  path: "/courses",
  image: DEFAULT_OG_IMAGE,
  imageAlt: "Boutique and fashion designing courses in Patna",
});

export default async function CoursesPage() {
  const [courses, site] = await Promise.all([getCourses(), getSiteSettings()]);
  const coursesPage = site.pages?.courses || {};

  return (
    <PageShell>
      <LocalizedPageHeader
        compact
        eyebrow={coursesPage.headerEyebrow || "Our Courses"}
        eyebrowHi={coursesPage.headerEyebrowHi || "हमारे कोर्स"}
        title={coursesPage.headerTitle || "Fashion Designing & Boutique Courses in Patna"}
        titleHi={coursesPage.headerTitleHi || "पटना में फैशन डिज़ाइनिंग और बुटीक कोर्स"}
        subtitle={
          coursesPage.headerSubtitle ||
          `${site.coursesCount || courses.length} courses — boutique, blouse making, suit, kids wear, fashion design & lehenga. Enroll on WhatsApp.`
        }
        subtitleHi={coursesPage.headerSubtitleHi}
      />
      <PageSeoIntro
        links={[
          { href: "/contact", label: "book a free demo in Patna" },
          { href: "/shop", label: "custom stitching service" },
          { href: "/about", label: "about our institute" },
        ]}
      >
        Join a boutique course in Patna at Shreya Creation on Boring Road — practical blouse making,
        tailoring classes, and फैशन डिज़ाइनिंग कोर्स पटना with certificate support. Whether you want
        a job or your own boutique, our बुटीक कोर्स पटना programmes are 100% hands-on.
      </PageSeoIntro>
      <CoursesPageClient courses={courses} whatsapp={site.whatsapp} />
      <PageCTA
        whatsapp={site.whatsapp}
        {...pageCtaProps(coursesPage)}
        eyebrow="Course Consultation"
        eyebrowHi="कोर्स परामर्श"
        perks={["Batch timings", "Fees", "Syllabus", "Free demo"]}
        perksHi={["बैच समय", "फीस", "सिलेबस", "मुफ़्त डेमो"]}
      />
    </PageShell>
  );
}
