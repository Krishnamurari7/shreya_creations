"use client";

import ResourceManager from "@/components/admin/ResourceManager";

const FIELDS = [
  { name: "title", label: "Title / caption", type: "text" },
  { name: "slug", label: "Slug", type: "text", hint: "Used in /portfolio/your-slug. Leave blank to auto-generate from the title." },
  { name: "category", label: "Category", type: "text", hint: "e.g. Bridal, Gowns, Blouses" },
  { name: "caption", label: "Caption / short story", type: "textarea", hint: "Shown on the portfolio detail page when set." },
  { name: "image", label: "Image", type: "image" },
  { name: "sort_order", label: "Sort order", type: "number", hint: "Lower numbers appear first." },
  {
    name: "featured",
    label: "Featured on homepage",
    type: "checkbox",
    hint: "The homepage Portfolio Highlights band shows the first 6 featured pieces (by sort order). This page always shows every piece.",
  },
  { name: "meta_title", label: "SEO meta title", type: "text", hint: "Optional. Fallback: “{title} | Shreya Creation Patna”." },
  { name: "meta_description", label: "SEO meta description", type: "textarea", hint: "Optional. Fallback: caption / generated summary." },
  { name: "og_image", label: "OG / social share image", type: "image", hint: "Optional. Falls back to the main image." },
  { name: "image_alt", label: "Image alt text", type: "text", hint: "Optional. Fallback: “{title} Patna”." },
  { name: "focus_keyword", label: "Focus keyword (optional)", type: "text", hint: "e.g. bridal lehenga Patna" },
];

const SECTIONS = [
  {
    id: "basics",
    label: "Basics",
    fields: ["title", "slug", "category", "caption", "image", "sort_order", "featured"],
  },
  {
    id: "seo",
    label: "SEO",
    fields: ["meta_title", "meta_description", "og_image", "image_alt", "focus_keyword"],
  },
];

export default function PortfolioAdmin() {
  return (
    <ResourceManager
      table="portfolio"
      title="Portfolio"
      subtitle="Bridal and designer gallery. Add a slug for each piece so it gets its own SEO page at /portfolio/slug."
      fields={FIELDS}
      sections={SECTIONS}
      orderBy="sort_order"
      orderAsc
      listColumns={["title", "category", "slug"]}
      renderListExtra={(row) =>
        row.featured ? (
          <span className="mt-1 inline-block rounded-full border border-marigold/40 px-2 py-0.5 text-[10px] uppercase tracking-wider text-marigold">
            Featured
          </span>
        ) : null
      }
      modalWide
    />
  );
}
