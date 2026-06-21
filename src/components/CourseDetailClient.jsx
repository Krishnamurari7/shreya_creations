"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CourseActions } from "@/components/WhatsAppActions";
import { Glass3DCard } from "@/components/Glass3DCard";
import SyllabusGrid from "@/components/SyllabusGrid";
import SectionHeading from "@/components/SectionHeading";
import AmbientGlows from "@/components/AmbientGlows";
import { useLanguage } from "@/components/LanguageProvider";
import { fadeUp } from "@/lib/motion";

export default function CourseDetailClient({ course, site, syllabus }) {
  const reduceMotion = useReducedMotion();
  const { lang } = useLanguage();

  const backLabel = lang === "hi" ? "सभी कोर्स पर वापस" : "Back to Courses";
  const durationLabel = lang === "hi" ? "अवधि" : "Duration";
  const languageLabel = lang === "hi" ? "भाषा" : "Language";
  const feeLabel = lang === "hi" ? "फीस" : "Fee";
  const noPreview = lang === "hi" ? "कोई प्रीव्यू उपलब्ध नहीं" : "No preview available";
  const roadmapEyebrow = lang === "hi" ? "कोर्स रोडमैप" : "Course Roadmap";
  const roadmapTitle = lang === "hi" ? "आप क्या सीखेंगे" : "What you'll learn";
  const admissionTitle =
    lang === "hi" ? "7-चरण एडमिशन प्रक्रिया" : "7-Step Admission Process";
  const admissionBody =
    lang === "hi"
      ? "WhatsApp पर एनरोल करें — काउंसलिंग, फॉर्म, दस्तावेज़ सत्यापन, फीस (कैश/UPI/बैंक), एडमिशन कन्फर्मेशन, ओरिएंटेशन और बैच असाइनमेंट। सुबह (9–12), दोपहर (12–3), या शाम (3–6) के बैच उपलब्ध।"
      : "Enroll via WhatsApp — counseling, form submission, document verification, fee payment (cash/UPI/bank transfer), admission confirmation, orientation, and batch assignment. Morning (9–12), Afternoon (12–3), or Evening (3–6) batches available.";

  return (
    <div className="relative z-10 w-full overflow-x-hidden">
      <div className="grid-overlay" />
      <AmbientGlows variant="subtle" className="z-0" />

      <div className="pt-[calc(var(--header-offset)+1rem)] sm:pt-[calc(var(--header-offset)+2rem)] pb-10 sm:pb-12 page-container max-w-6xl relative z-20">
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          custom={0}
          variants={fadeUp}
        >
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-orange hover:text-orange-dark text-sm font-semibold tracking-wider uppercase group transition-colors mb-8"
          >
            <span className="group-hover:-translate-x-1.5 transition-transform duration-300">←</span>
            {backLabel}
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start min-w-0 w-full">
          <motion.div
            className="lg:col-span-6 w-full min-w-0 order-1"
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
            custom={0.1}
            variants={fadeUp}
          >
            <motion.div
              className="aspect-video rounded-2xl sm:rounded-[2.5rem] overflow-hidden glass border border-orange/20 p-2 sm:p-2.5 shadow-2xl relative group"
              animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none z-10 rounded-[2rem] sm:rounded-[2.5rem]" />
              {course.preview_video ? (
                <iframe
                  src={course.preview_video}
                  title={course.title}
                  className="h-full w-full rounded-[1.5rem] sm:rounded-[2rem] border-0 relative z-20"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : course.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={course.image}
                  alt={course.title}
                  className="h-full w-full object-cover rounded-[1.5rem] sm:rounded-[2rem]"
                />
              ) : (
                <div className="h-full w-full rounded-[1.5rem] sm:rounded-[2rem] bg-cream/40 flex items-center justify-center text-ink">
                  {noPreview}
                </div>
              )}
            </motion.div>
          </motion.div>

          <motion.div
            className="lg:col-span-6 space-y-6 order-2 min-w-0"
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
            custom={0.2}
            variants={fadeUp}
          >
            <div>
              <span className="inline-flex bg-orange/10 border border-orange/20 text-orange px-4 py-1.5 rounded-full text-[10px] font-semibold tracking-widest uppercase mb-4 shadow-sm">
                {course.category}
              </span>
              <h1 className="page-hero-title text-balance">
                {course.title}
              </h1>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3 py-2 border-y border-ink/15">
              <span className="bg-ink/5 border border-ink/15 px-3 sm:px-4 py-2 rounded-full text-xs font-light text-ink flex items-center gap-1.5">
                ⏳ {durationLabel}: <strong className="font-semibold text-orange">{course.duration}</strong>
              </span>
              <span className="bg-ink/5 border border-ink/15 px-3 sm:px-4 py-2 rounded-full text-xs font-light text-ink flex items-center gap-1.5">
                🗣 {languageLabel}: <strong className="font-semibold text-orange">{course.language}</strong>
              </span>
              {course.price && (
                <span className="bg-orange/5 border border-orange/20 px-3 sm:px-4 py-2 rounded-full text-xs font-light text-ink flex items-center gap-1.5">
                  💰 {feeLabel}:{" "}
                  <strong className="highlight-shimmer font-semibold">
                    ₹{Number(course.price).toLocaleString("en-IN")}
                  </strong>
                </span>
              )}
            </div>

            <p className="text-ink font-normal leading-relaxed text-base text-pretty">{course.description}</p>

            <div className="pt-4 space-y-4">
              <CourseActions course={course} number={site.whatsapp} />
              <Glass3DCard className="rounded-2xl p-4 border-orange/15 bg-orange/5 flex items-start gap-3 transition-transform duration-300 hover:-translate-y-0.5">
                <span className="text-base">🎓</span>
                <p className="text-xs text-ink font-normal leading-relaxed">
                  <strong className="text-orange-dark font-medium uppercase tracking-wider text-[9px] block mb-0.5">
                    {admissionTitle}
                  </strong>
                  {admissionBody}
                </p>
              </Glass3DCard>
            </div>
          </motion.div>
        </div>

        {syllabus.length > 0 && (
          <div className="mt-12 sm:mt-20">
            <SectionHeading
              eyebrow={roadmapEyebrow}
              title={roadmapTitle}
              align="left"
              className="md:text-left [&_.section-ornament]:md:justify-start"
            />
            <SyllabusGrid items={syllabus} />
          </div>
        )}
      </div>
    </div>
  );
}
