"use client";

import ResourceManager from "@/components/admin/ResourceManager";

const FIELDS = [
  { name: "title", label: "Title / caption", type: "text" },
  { name: "category", label: "Category", type: "text", hint: "e.g. Bridal, Gowns, Blouses" },
  { name: "image", label: "Image", type: "image" },
  { name: "sort_order", label: "Sort order", type: "number", hint: "Lower numbers appear first." },
];

export default function PortfolioAdmin() {
  return (
    <ResourceManager
      table="portfolio"
      title="Portfolio"
      fields={FIELDS}
      orderBy="sort_order"
      orderAsc
      listColumns={["title", "category"]}
    />
  );
}
