"use client";

import ResourceManager from "@/components/admin/ResourceManager";

const FIELDS = [
  { name: "title", label: "Title", type: "text" },
  { name: "slug", label: "Slug", type: "text" },
  { name: "excerpt", label: "Excerpt", type: "textarea" },
  { name: "image", label: "Cover image", type: "image" },
  { name: "published", label: "Published", type: "checkbox" },
];

export default function LookbookAdmin() {
  return <ResourceManager table="lookbook_posts" title="Lookbook" fields={FIELDS} listColumns={["title"]} />;
}
