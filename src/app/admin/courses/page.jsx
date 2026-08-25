"use client";

import Link from "next/link";
import ResourceManager from "@/components/admin/ResourceManager";
import { coursePublicStatus, courseToFormState, mergeAdminCourses } from "@/lib/courses";
import { COURSE_CATEGORIES } from "@/lib/seed";
import { BTN_SECONDARY } from "@/lib/ui";

const FIELDS = [
  { name: "title", label: "Title (English)", type: "text" },
  { name: "title_hi", label: "Title (Hindi)", type: "text" },
  { name: "slug", label: "Slug", type: "text", hint: "Leave blank to auto-generate from the English title. Used in /courses/your-slug." },
  { name: "category", label: "Category", type: "select", options: COURSE_CATEGORIES.filter((c) => c !== "All") },
  { name: "price", label: "Price (₹)", type: "number" },
  { name: "compare_price", label: "Compare price (₹)", type: "number", hint: "Optional strikethrough price on the course card." },
  { name: "duration", label: "Duration", type: "text", hint: "e.g. 3 months, 2 weeks, 10 days" },
  { name: "language", label: "Language", type: "text", hint: "e.g. Hindi, Hindi & English" },
  { name: "is_addon", label: "Add-on course", type: "checkbox", hint: "Short specialised module after a main blouse course." },
  { name: "badge", label: "Badge", type: "select", options: ["bestseller", "addon"], hint: "Optional card badge. Leave as “Select…” for none." },
  {
    name: "published",
    label: "Published on site",
    type: "checkbox",
    hint: "Off = Draft (hidden). On = visible on /courses and homepage.",
  },
  {
    name: "coming_soon",
    label: "Coming soon",
    type: "checkbox",
    hint: "On = Coming Soon badge, Enroll off. Off = Enroll Now (when Published).",
  },
  { name: "description", label: "Short description (English)", type: "textarea" },
  { name: "description_hi", label: "Short description (Hindi)", type: "textarea" },
  { name: "about", label: "Full about (English)", type: "textarea", hint: "Shown on the course detail page." },
  { name: "about_hi", label: "Full about (Hindi)", type: "textarea" },
  { name: "includes", label: "What's included (English)", type: "list", hint: "One item per line." },
  { name: "includes_hi", label: "What's included (Hindi)", type: "list", hint: "One item per line." },
  { name: "syllabus", label: "Syllabus", type: "list", hint: "One module or week per line." },
  {
    name: "course_pdf",
    label: "Course brochure PDF",
    type: "pdf",
    hint: "Optional brochure. Upload to Supabase Storage — shown as “View Full Details” on the course page.",
  },
  { name: "image", label: "Thumbnail", type: "image" },
  { name: "preview_video", label: "Preview video embed URL", type: "text", hint: "e.g. https://www.youtube.com/embed/VIDEO_ID" },
  { name: "meta_title", label: "SEO meta title", type: "text", hint: "Optional. Fallback: “{title} in Patna | Shreya Creation”. Keep ~60 characters." },
  { name: "meta_description", label: "SEO meta description", type: "textarea", hint: "Optional. Fallback: short description / about. Keep ~155 characters." },
  { name: "og_image", label: "OG / social share image", type: "image", hint: "Optional. Falls back to the course thumbnail." },
  { name: "image_alt", label: "Image alt text", type: "text", hint: "Optional. Fallback: “{title} Patna”." },
  { name: "focus_keyword", label: "Focus keyword (optional)", type: "text", hint: "e.g. boutique course in Patna" },
];

const SECTIONS = [
  {
    id: "basics",
    label: "Basics",
    fields: [
      "title",
      "title_hi",
      "slug",
      "category",
      "price",
      "compare_price",
      "duration",
      "language",
      "is_addon",
      "badge",
      "published",
      "coming_soon",
    ],
  },
  {
    id: "content",
    label: "Content",
    fields: ["description", "description_hi", "about", "about_hi", "includes", "includes_hi", "syllabus"],
  },
  {
    id: "media",
    label: "PDF & Media",
    fields: ["course_pdf", "image", "preview_video"],
  },
  {
    id: "seo",
    label: "SEO",
    fields: ["meta_title", "meta_description", "og_image", "image_alt", "focus_keyword"],
  },
];

function CourseStatusBanner({ course }) {
  const status = coursePublicStatus(course);
  const tone =
    status.id === "enrollable" ? "live" : status.id === "coming_soon" ? "soon" : "muted";

  return (
    <div className={`admin-course-status admin-course-status--${tone}`} role="status">
      <span className={`admin-course-badge admin-course-badge--${tone === "muted" ? "muted" : tone}`}>
        {status.label}
      </span>
      <p className="admin-muted m-0">{status.hint}</p>
    </div>
  );
}

function CourseListBadges({ course }) {
  const status = coursePublicStatus(course);
  const isAddon = course.is_addon || course.badge === "addon";
  const hasPdf = Boolean((course.course_pdf || course.coursePdf || "").trim());
  const tone = status.id === "enrollable" ? "live" : status.id === "coming_soon" ? "soon" : "muted";

  return (
    <div className="admin-course-badges">
      <span className={`admin-course-badge admin-course-badge--${tone}`}>
        {status.label}
      </span>
      {hasPdf ? (
        <span className="admin-course-badge admin-course-badge--muted">PDF</span>
      ) : (
        <span className="admin-course-badge admin-course-badge--soon">No PDF</span>
      )}
      {isAddon && <span className="admin-course-badge admin-course-badge--addon">Add-on</span>}
      {course.badge === "bestseller" && (
        <span className="admin-course-badge admin-course-badge--bestseller">Bestseller</span>
      )}
      {course.duration && <span className="admin-course-badge admin-course-badge--muted">{course.duration}</span>}
      {course._dbId && (
        <Link href={`/admin/courses/${course._dbId}/batches`} className={BTN_SECONDARY + " text-xs py-1 px-2"}>
          Batches
        </Link>
      )}
    </div>
  );
}

export default function CoursesAdmin() {
  return (
    <ResourceManager
      table="courses"
      title="Courses"
      subtitle="Edit courses and control Draft / Coming Soon / Enroll. Published = on site; Coming Soon on = badge only; Coming Soon off = Enroll Now."
      fields={FIELDS}
      sections={SECTIONS}
      mergeRows={mergeAdminCourses}
      toFormState={courseToFormState}
      renderFormExtra={(editing) => <CourseStatusBanner course={editing} />}
      persistId="_dbId"
      rowKey="slug"
      canDelete={(course) => Boolean(course._dbId)}
      orderBy="category"
      orderAsc={true}
      orderBySecondary={{ col: "title", asc: true }}
      listColumns={["title", "category", "price"]}
      renderListExtra={(course) => <CourseListBadges course={course} />}
      modalWide
      itemLabel="course"
    />
  );
}
