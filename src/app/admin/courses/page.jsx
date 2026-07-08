"use client";

import ResourceManager from "@/components/admin/ResourceManager";
import { courseToFormState, isCourseAvailable, mergeAdminCourses } from "@/lib/courses";
import { COURSE_CATEGORIES } from "@/lib/seed";

const COURSE_PDF_OPTIONS = [
  "/courses/pdfs/Basic Boutique Mastery Course 15000.pdf",
  "/courses/pdfs/Basic suit and  Blouse Course.pdf",
  "/courses/pdfs/Collar Design Blouse Course.pdf",
  "/courses/pdfs/Madhubala Blouse Course.pdf",
  "/courses/pdfs/Rajwadi Blouse Course.pdf",
  "/courses/pdfs/Backless Blouse Course.pdf",
  "/courses/pdfs/sleevless Blouse  Course.pdf",
];

const FIELDS = [
  { name: "title", label: "Title (English)", type: "text" },
  { name: "title_hi", label: "Title (Hindi)", type: "text" },
  { name: "slug", label: "Slug", type: "text", hint: "Leave blank to auto-generate from the English title." },
  { name: "category", label: "Category", type: "select", options: COURSE_CATEGORIES.filter((c) => c !== "All") },
  { name: "price", label: "Price (₹)", type: "number" },
  { name: "compare_price", label: "Compare price (₹)", type: "number", hint: "Optional strikethrough price on the course card." },
  { name: "duration", label: "Duration", type: "text", hint: "e.g. 3 months, 2 weeks, 10 days" },
  { name: "language", label: "Language", type: "text", hint: "e.g. Hindi, Hindi & English" },
  { name: "is_addon", label: "Add-on course", type: "checkbox", hint: "Short specialised module after a main blouse course." },
  { name: "badge", label: "Badge", type: "select", options: ["bestseller", "addon"], hint: "Optional card badge. Leave as “Select…” for none." },
  { name: "published", label: "Published on site", type: "checkbox" },
  { name: "description", label: "Short description (English)", type: "textarea" },
  { name: "description_hi", label: "Short description (Hindi)", type: "textarea" },
  { name: "about", label: "Full about (English)", type: "textarea", hint: "Shown on the course detail page." },
  { name: "about_hi", label: "Full about (Hindi)", type: "textarea" },
  { name: "includes", label: "What's included (English)", type: "list", hint: "One item per line." },
  { name: "includes_hi", label: "What's included (Hindi)", type: "list", hint: "One item per line." },
  { name: "syllabus", label: "Syllabus", type: "list", hint: "One module or week per line." },
  { name: "course_pdf", label: "Course brochure PDF", type: "select", options: COURSE_PDF_OPTIONS, hint: "Required for Enroll Now — without PDF the course shows as Coming Soon." },
  { name: "image", label: "Thumbnail", type: "image" },
  { name: "preview_video", label: "Preview video embed URL", type: "text", hint: "e.g. https://www.youtube.com/embed/VIDEO_ID" },
];

const SECTIONS = [
  {
    id: "basics",
    label: "Basics",
    fields: ["title", "title_hi", "slug", "category", "price", "compare_price", "duration", "language", "is_addon", "badge", "published"],
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
];

function CourseListBadges({ course }) {
  const available = isCourseAvailable(course);
  const isAddon = course.is_addon || course.badge === "addon";

  return (
    <div className="admin-course-badges">
      {available ? (
        <span className="admin-course-badge admin-course-badge--live">Enrollable</span>
      ) : (
        <span className="admin-course-badge admin-course-badge--soon">Coming soon</span>
      )}
      {isAddon && <span className="admin-course-badge admin-course-badge--addon">Add-on</span>}
      {course.badge === "bestseller" && (
        <span className="admin-course-badge admin-course-badge--bestseller">Bestseller</span>
      )}
      {course.duration && <span className="admin-course-badge admin-course-badge--muted">{course.duration}</span>}
    </div>
  );
}

export default function CoursesAdmin() {
  return (
    <ResourceManager
      table="courses"
      title="Courses"
      subtitle="All 15 seed courses appear here. Edit any course and save to store your changes in Supabase — use the same slug (e.g. blouse-suit-making-course) to override demo content. A course shows Enroll Now only when it has a PDF brochure and full about text."
      fields={FIELDS}
      sections={SECTIONS}
      mergeRows={mergeAdminCourses}
      toFormState={courseToFormState}
      persistId="_dbId"
      rowKey="slug"
      canDelete={(course) => Boolean(course._dbId)}
      orderBy="category"
      orderAsc={true}
      orderBySecondary={{ col: "title", asc: true }}
      listColumns={["title", "category", "price"]}
      renderListExtra={(course) => <CourseListBadges course={course} />}
      modalWide
    />
  );
}
