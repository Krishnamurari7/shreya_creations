"use client";

import ResourceManager from "@/components/admin/ResourceManager";
import { COURSE_CATEGORIES } from "@/lib/seed";

const FIELDS = [
  { name: "title", label: "Title", type: "text" },
  { name: "slug", label: "Slug (auto from title if blank)", type: "text" },
  { name: "category", label: "Category", type: "select", options: COURSE_CATEGORIES.filter((c) => c !== "All") },
  { name: "price", label: "Price (₹)", type: "number" },
  { name: "duration", label: "Duration", type: "text", hint: "e.g. 3 months" },
  { name: "language", label: "Language", type: "text", hint: "e.g. Hindi & English" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "syllabus", label: "Syllabus", type: "list", hint: "One topic per line." },
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
