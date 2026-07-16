"use client";

import ResourceManager from "@/components/admin/ResourceManager";

const FIELDS = [
  { name: "title", label: "Title", type: "text" },
  { name: "slug", label: "Slug (auto from title if blank)", type: "text", hint: "Used in the URL, e.g. embroidered-designer-blouse" },
  { name: "category", label: "Category", type: "select", options: ["Lehenga", "Gown", "Blouse", "Suit", "Saree", "Jewellery", "Accessories"] },
  { name: "price", label: "Price (₹)", type: "number" },
  { name: "fabric", label: "Fabric", type: "text" },
  { name: "colours", label: "Colour options", type: "text", hint: "e.g. Maroon / Gold, or customisable" },
  { name: "sizes", label: "Size guidance", type: "text" },
  { name: "care", label: "Care instructions", type: "textarea" },
  { name: "estimated_delivery", label: "Estimated delivery", type: "text", hint: "e.g. 5–10 days, or 24–72 hours express" },
  { name: "description", label: "Short description", type: "textarea" },
  { name: "description_long", label: "Long description", type: "textarea", hint: "Shown on the product page when set" },
  { name: "images", label: "Images (gallery)", type: "images" },
  { name: "whatsapp_text", label: "Custom WhatsApp message (optional)", type: "textarea", hint: "Overrides the default order message for this item." },
  { name: "stitchable", label: "Stitchable to size", type: "checkbox" },
  { name: "published", label: "Published (visible on site)", type: "checkbox" },
  { name: "meta_title", label: "SEO meta title", type: "text", hint: "Optional. Fallback: “{title} — Custom Stitched in Patna | Shreya Creation”." },
  { name: "meta_description", label: "SEO meta description", type: "textarea", hint: "Optional. Fallback: product description. Keep ~155 characters." },
  { name: "og_image", label: "OG / social share image", type: "image", hint: "Optional. Falls back to the first gallery image." },
  { name: "image_alt", label: "Image alt text", type: "text", hint: "Optional. Fallback: “{title} Patna”." },
  { name: "focus_keyword", label: "Focus keyword (optional)", type: "text", hint: "e.g. designer blouse Patna" },
];

const SECTIONS = [
  {
    id: "basics",
    label: "Basics",
    fields: ["title", "slug", "category", "price", "fabric", "colours", "sizes", "care", "estimated_delivery", "stitchable", "published"],
  },
  {
    id: "content",
    label: "Content",
    fields: ["description", "description_long", "whatsapp_text", "images"],
  },
  {
    id: "seo",
    label: "SEO",
    fields: ["meta_title", "meta_description", "og_image", "image_alt", "focus_keyword"],
  },
];

export default function ProductsAdmin() {
  return (
    <ResourceManager
      table="products"
      title="Shop (Boutique)"
      subtitle="Manage designer wear listings. Use the SEO tab for per-product meta titles, descriptions, OG images and alt text."
      fields={FIELDS}
      sections={SECTIONS}
      listColumns={["title", "category"]}
      modalWide
    />
  );
}
