"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CourseActions } from "@/components/WhatsAppActions";
import { Glass3DCard } from "@/components/Glass3DCard";
import SyllabusGrid from "@/components/SyllabusGrid";
import SectionHeading from "@/components/SectionHeading";
import AmbientGlows from "@/components/AmbientGlows";
import { fadeUp } from "@/lib/motion";

export default function CourseDetailClient({ course, site, syllabus }) {
  const reduceMotion = useReducedMotion();

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
            Back to Courses
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <motion.div
            className="lg:col-span-6 w-full order-1"
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
                  No preview available
                </div>
              )}
            </motion.div>
          </motion.div>

          <motion.div
            className="lg:col-span-6 space-y-6 order-2"
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
            custom={0.2}
            variants={fadeUp}
          >
            <div>
              <span className="inline-flex bg-orange/10 border border-orange/20 text-orange px-4 py-1.5 rounded-full text-[10px] font-semibold tracking-widest uppercase mb-4 shadow-sm">
                {course.category}
              </span>
              <h1 className="font-display text-3xl sm:text-5xl md:text-6xl text-ink leading-tight font-normal text-balance">
                {course.title}
              </h1>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3 py-2 border-y border-ink/15">
              <span className="bg-ink/5 border border-ink/15 px-3 sm:px-4 py-2 rounded-full text-xs font-light text-ink flex items-center gap-1.5">
                ⏳ Duration: <strong className="font-semibold text-orange">{course.duration}</strong>
              </span>
              <span className="bg-ink/5 border border-ink/15 px-3 sm:px-4 py-2 rounded-full text-xs font-light text-ink flex items-center gap-1.5">
                🗣 Language: <strong className="font-semibold text-orange">{course.language}</strong>
              </span>
              {course.price && (
                <span className="bg-orange/5 border border-orange/20 px-3 sm:px-4 py-2 rounded-full text-xs font-light text-ink flex items-center gap-1.5">
                  💰 Fee:{" "}
                  <strong className="highlight-shimmer font-semibold">
                    ₹{Number(course.price).toLocaleString("en-IN")}
                  </strong>
                </span>
              )}
            </div>

            <p className="text-ink font-normal leading-relaxed text-base text-pretty">{course.description}</p>

            <div className="pt-4 space-y-4">
              <CourseActions course={course} number={site.whatsapp} />
              <Glass3DCard className="rounded-2xl p-4 border-purple/15 bg-purple/5 flex items-start gap-3 transition-transform duration-300 hover:-translate-y-0.5">
                <span className="text-base">🎓</span>
                <p className="text-xs text-ink font-normal leading-relaxed">
                  <strong className="text-purple-dark font-medium uppercase tracking-wider text-[9px] block mb-0.5">
                    Academy Direct Admission Flow
                  </strong>
                  Enrolling is finished entirely over WhatsApp chat. We review batch timings, prepare your studio
                  workspace, deliver study materials, and process your receipt directly.
                </p>
              </Glass3DCard>
            </div>
          </motion.div>
        </div>

        {syllabus.length > 0 && (
          <div className="mt-12 sm:mt-20">
            <SectionHeading
              eyebrow="Course Roadmap"
              title="What you'll learn"
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
