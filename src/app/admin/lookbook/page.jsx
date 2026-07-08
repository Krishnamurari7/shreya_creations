"use client";

import ResourceManager from "@/components/admin/ResourceManager";

const FIELDS = [
  { name: "title", label: "Title", type: "text" },
  { name: "slug", label: "Slug", type: "text", hint: "Leave blank to auto-generate from the title." },
  { name: "excerpt", label: "Excerpt", type: "textarea" },
  { name: "image", label: "Image", type: "image" },
  { name: "published", label: "Published", type: "checkbox" },
];

export default function LookbookAdmin() {
  return (
    <ResourceManager
      table="lookbook_posts"
      title="Lookbook"
      fields={FIELDS}
      orderBy="created_at"
      listColumns={["title", "slug"]}
    />
  );
}
