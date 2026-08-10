"use client";

import ResourceManager from "@/components/admin/ResourceManager";
import { lookbookToFormState, mergeAdminLookbook } from "@/lib/lookbook";

const FIELDS = [
  { name: "title", label: "Title (English)", type: "text" },
  { name: "title_hi", label: "Title (Hindi)", type: "text" },
  {
    name: "slug",
    label: "Slug",
    type: "text",
    hint: "Leave blank to auto-generate. Used in /blog/your-slug for the SEO detail page.",
  },
  { name: "excerpt", label: "Short excerpt (English)", type: "textarea", hint: "Shown on the blog listing cards." },
  { name: "excerpt_hi", label: "Short excerpt (Hindi)", type: "textarea" },
  {
    name: "body",
    label: "Full article (English)",
    type: "textarea",
    hint: "Main post content on /blog/slug. Separate paragraphs with a blank line.",
  },
  { name: "body_hi", label: "Full article (Hindi)", type: "textarea" },
  { name: "image", label: "Cover image", type: "image" },
  { name: "published", label: "Published on site", type: "checkbox" },
  {
    name: "meta_title",
    label: "SEO meta title",
    type: "text",
    hint: "Optional. Fallback: “{title} | Shreya Creation Patna Blog”. Keep ~60 characters.",
  },
  {
    name: "meta_description",
    label: "SEO meta description",
    type: "textarea",
    hint: "Optional. Fallback: excerpt / article start. Keep ~155 characters.",
  },
  {
    name: "og_image",
    label: "OG / social share image",
    type: "image",
    hint: "Optional. Falls back to the cover image.",
  },
  {
    name: "image_alt",
    label: "Image alt text",
    type: "text",
    hint: "Optional. Fallback: “{title} Patna”.",
  },
  {
    name: "focus_keyword",
    label: "Focus keyword (optional)",
    type: "text",
    hint: "e.g. bridal blouse necklines Patna",
  },
];

const SECTIONS = [
  {
    id: "basics",
    label: "Basics",
    fields: ["title", "title_hi", "slug", "image", "published"],
  },
  {
    id: "content",
    label: "Content",
    fields: ["excerpt", "excerpt_hi", "body", "body_hi"],
  },
  {
    id: "seo",
    label: "SEO",
    fields: ["meta_title", "meta_description", "og_image", "image_alt", "focus_keyword"],
  },
];

export default function LookbookAdmin() {
  return (
    <ResourceManager
      table="lookbook_posts"
      title="Blog"
      subtitle="Manage blog posts stored in Supabase. Each published post gets its own page at /blog/slug. Listing-page SEO is under Pages → Blog."
      fields={FIELDS}
      sections={SECTIONS}
      mergeRows={mergeAdminLookbook}
      toFormState={lookbookToFormState}
      persistId="_dbId"
      rowKey="slug"
      canDelete={(post) => Boolean(post._dbId)}
      orderBy="created_at"
      listColumns={["title", "slug"]}
      modalWide
      itemLabel="post"
    />
  );
}
