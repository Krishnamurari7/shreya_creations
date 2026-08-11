import PageShell from "@/components/PageShell";
import LocalizedPageHeader from "@/components/LocalizedPageHeader";
import CoursesPageClient from "@/components/CoursesPageClient";
import PageCTA from "@/components/PageCTA";
import PageSeoIntro from "@/components/PageSeoIntro";
import JsonLdScript from "@/components/JsonLdScript";
import { getCourses, getSiteSettings } from "@/lib/data";
import { pageCtaProps } from "@/lib/cms";
import { getRequestLocale } from "@/lib/locale";
import { buildMetadata, breadcrumbJsonLd, breadcrumbLabel, DEFAULT_OG_IMAGE } from "@/lib/seo";

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
        subtitle={
          coursesPage.headerSubtitle ||
          `${site.coursesCount || courses.length} courses — boutique, blouse making, suit, kids wear, fashion design & lehenga. Enroll on WhatsApp.`
        }
        subtitleHi={coursesPage.headerSubtitleHi}
      />
      <PageSeoIntro
        links={[
          { href: "/contact", label: "book a free demo in Patna", labelHi: "पटना में मुफ़्त डेमो बुक करें" },
          { href: "/shop", label: "custom stitching service", labelHi: "कस्टम सिलाई सेवा" },
          { href: "/about", label: "about our institute", labelHi: "हमारे इंस्टिट्यूट के बारे में" },
        ]}
        childrenHi="Shreya Creation, बोरिंग रोड पर बुटीक कोर्स पटना — प्रैक्टिकल ब्लाउज मेकिंग, सिलाई क्लास और फैशन डिज़ाइनिंग कोर्स, सर्टिफिकेट सपोर्ट के साथ। नौकरी चाहिए या अपना बुटीक — हमारे कोर्स 100% हाथों-हाथ हैं।"
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
