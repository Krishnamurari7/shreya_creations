import { notFound } from "next/navigation";
import Link from "next/link";
import { getCourseBySlug, getSiteSettings } from "@/lib/data";
import { CourseActions } from "@/components/WhatsAppActions";
import { Glass3DCard } from "@/components/Glass3DCard";
import SyllabusGrid from "@/components/SyllabusGrid";

export async function generateMetadata({ params }) {
  const course = await getCourseBySlug(params.slug);
  return { title: course ? `${course.title} — Shreya Creations` : "Courses — Shreya Creations" };
}

export default async function CourseDetail({ params }) {
  const [course, site] = await Promise.all([getCourseBySlug(params.slug), getSiteSettings()]);
  if (!course) return notFound();

  const syllabus = Array.isArray(course.syllabus)
    ? course.syllabus
    : typeof course.syllabus === "string"
    ? course.syllabus.split("\n").filter(Boolean)
    : [];

  return (
    <div className="relative z-10 w-full overflow-x-hidden">
      <div className="grid-overlay" />

      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-orange/5 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-80 h-80 rounded-full bg-purple/5 blur-3xl -z-10 pointer-events-none" />

      <div className="pt-[calc(var(--header-offset)+1rem)] sm:pt-[calc(var(--header-offset)+2rem)] pb-10 sm:pb-12 mx-auto max-w-6xl px-4 sm:px-5 relative z-20">
        {/* Back Link */}
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-orange hover:text-orange-dark text-sm font-semibold tracking-wider uppercase group transition-colors mb-8"
        >
          <span className="group-hover:-translate-x-1.5 transition-transform duration-300">←</span>
          Back to Courses
        </Link>

        {/* Top Info Grid */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Media Player Column */}
          <div className="lg:col-span-6 w-full">
            <div className="aspect-video rounded-[2.5rem] overflow-hidden glass border border-orange/20 p-2.5 shadow-2xl relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none z-10 rounded-[2.5rem]" />
              
              {course.preview_video ? (
                <iframe
                  src={course.preview_video}
                  title={course.title}
                  className="h-full w-full rounded-[2rem] border-0 relative z-20"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : course.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={course.image}
                  alt={course.title}
                  className="h-full w-full object-cover rounded-[2rem]"
                />
              ) : (
                <div className="h-full w-full rounded-[2rem] bg-cream/40 flex items-center justify-center text-ink">
                  No preview available
                </div>
              )}
            </div>
          </div>

          {/* Info Details Column */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="inline-flex bg-orange/10 border border-orange/20 text-orange px-4 py-1.5 rounded-full text-[10px] font-semibold tracking-widest uppercase mb-4 shadow-sm">
                {course.category}
              </span>
              <h1 className="font-display text-3xl sm:text-5xl md:text-6xl text-ink leading-tight font-normal">
                {course.title}
              </h1>
            </div>

            {/* Quick Metrics pills */}
            <div className="flex flex-wrap gap-3 py-2 border-y border-ink/15">
              <span className="bg-ink/5 border border-ink/15 px-4 py-2 rounded-full text-xs font-light text-ink flex items-center gap-1.5">
                ⏳ Duration: <strong className="font-semibold text-orange">{course.duration}</strong>
              </span>
              <span className="bg-ink/5 border border-ink/15 px-4 py-2 rounded-full text-xs font-light text-ink flex items-center gap-1.5">
                🗣 Language: <strong className="font-semibold text-orange">{course.language}</strong>
              </span>
              {course.price && (
                <span className="bg-orange/5 border border-orange/20 px-4 py-2 rounded-full text-xs font-light text-ink flex items-center gap-1.5">
                  💰 Fee: <strong className="text-gold-gradient font-semibold">₹{Number(course.price).toLocaleString("en-IN")}</strong>
                </span>
              )}
            </div>

            <p className="text-ink font-normal leading-relaxed text-base">
              {course.description}
            </p>

            <div className="pt-4 space-y-4">
              <CourseActions course={course} number={site.whatsapp} />
              
              <Glass3DCard className="rounded-2xl p-4 border-purple/15 bg-purple/5 flex items-start gap-3">
                <span className="text-base">🎓</span>
                <p className="text-xs text-ink font-normal leading-relaxed">
                  <strong className="text-purple-dark font-medium uppercase tracking-wider text-[9px] block mb-0.5">Academy Direct Admission Flow</strong>
                  Enrolling is finished entirely over WhatsApp chat. We review batch timings, prepare your studio workspace, deliver study materials, and process your receipt directly.
                </p>
              </Glass3DCard>
            </div>
          </div>
        </div>

        {/* Syllabus / Curriculum Roadmap Section */}
        {syllabus.length > 0 && (
          <div className="mt-12 sm:mt-20">
            <div className="text-center md:text-left mb-10">
              <span className="text-orange uppercase tracking-[0.25em] text-xs font-semibold">Course Roadmap</span>
              <h2 className="font-display text-3xl sm:text-4xl text-ink mt-2">What you’ll learn</h2>
            </div>
            
            <SyllabusGrid items={syllabus} />
          </div>
        )}
      </div>
    </div>
  );
}
