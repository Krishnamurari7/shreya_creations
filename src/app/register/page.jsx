import PageShell from "@/components/PageShell";
import LocalizedPageHeader from "@/components/LocalizedPageHeader";
import RegisterPageClient from "@/components/RegisterPageClient";
import PageCTA from "@/components/PageCTA";
import JsonLdScript from "@/components/JsonLdScript";
import { getCourses, getSiteSettings } from "@/lib/data";
import { pageCtaProps } from "@/lib/cms";
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

  const registerCopy = site.pages?.register || {};

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
      <LocalizedPageHeader
        compact
        eyebrow={registerCopy.headerEyebrow || "Student admission"}
        eyebrowHi={registerCopy.headerEyebrowHi || "छात्र एडमिशन"}
        title={registerCopy.headerTitle || "Online Admission Form — Fashion Institute Patna"}
        titleHi={registerCopy.headerTitleHi || "ऑनलाइन एडमिशन फॉर्म — पटना फैशन इंस्टिट्यूट"}
        subtitle={
          registerCopy.headerSubtitle ||
          "Fill your details online. We save everything securely and confirm counselling, fees & documents on WhatsApp."
        }
        subtitleHi={
          registerCopy.headerSubtitleHi ||
          "अपनी जानकारी ऑनलाइन भरें। सब कुछ सुरक्षित सेव होगा — काउंसलिंग, फीस और दस्तावेज WhatsApp पर कन्फर्म होंगे।"
        }
      />
      <RegisterPageClient site={site} courses={courses} defaultCourseSlug={courseSlug} />
      <PageCTA whatsapp={site.whatsapp} {...pageCtaProps(registerCopy)} />
    </PageShell>
  );
}
