"use client";

import ResourceManager from "@/components/admin/ResourceManager";
import { COURSE_CATEGORIES } from "@/lib/seed";

const FIELDS = [
  { name: "title", label: "Title (English)", type: "text" },
  { name: "title_hi", label: "Title (Hindi)", type: "text" },
  { name: "slug", label: "Slug (auto from title if blank)", type: "text" },
  { name: "category", label: "Category", type: "select", options: COURSE_CATEGORIES.filter((c) => c !== "All") },
  { name: "price", label: "Price (₹)", type: "number" },
  { name: "compare_price", label: "Compare price (₹, optional)", type: "number", hint: "Shows strikethrough price on course detail page." },
  { name: "duration", label: "Duration", type: "text", hint: "e.g. 3 months" },
  { name: "language", label: "Language", type: "text", hint: "e.g. Hindi & English" },
  { name: "description", label: "Short description (English)", type: "textarea" },
  { name: "description_hi", label: "Short description (Hindi)", type: "textarea" },
  { name: "about", label: "Full about (English)", type: "textarea", hint: "Long description on course detail page." },
  { name: "about_hi", label: "Full about (Hindi)", type: "textarea" },
  { name: "includes", label: "What's included", type: "list", hint: "One item per line (English)." },
  { name: "includes_hi", label: "What's included (Hindi)", type: "list", hint: "One item per line (Hindi)." },
  { name: "syllabus", label: "Syllabus", type: "list", hint: "One topic per line." },
  { name: "course_pdf", label: "Course PDF path", type: "text", hint: "e.g. /courses/pdfs/my-course.pdf — required for enrollment." },
  { name: "image", label: "Thumbnail", type: "image" },
  { name: "preview_video", label: "Preview video embed URL (optional)", type: "text", hint: "e.g. https://www.youtube.com/embed/VIDEO_ID" },
  { name: "published", label: "Published", type: "checkbox" },
];

export default function CoursesAdmin() {
  return (
    <ResourceManager
      table="courses"
      title="Courses"
      fields={FIELDS}
      listColumns={["title", "category"]}
    />
  );
}
