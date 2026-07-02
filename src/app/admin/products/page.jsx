"use client";

import ResourceManager from "@/components/admin/ResourceManager";

const FIELDS = [
  { name: "title", label: "Title", type: "text" },
  { name: "slug", label: "Slug (auto from title if blank)", type: "text", hint: "Used in the URL, e.g. royal-bridal-lehenga" },
  { name: "category", label: "Category", type: "select", options: ["Lehenga", "Gown", "Blouse", "Suit", "Saree", "Jewellery", "Accessories"] },
  { name: "price", label: "Price (₹)", type: "number" },
  { name: "fabric", label: "Fabric", type: "text" },
  { name: "sizes", label: "Sizing", type: "text" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "images", label: "Images", type: "images" },
  { name: "whatsapp_text", label: "Custom WhatsApp message (optional)", type: "textarea", hint: "Overrides the default order message for this item." },
  { name: "stitchable", label: "Stitchable to size", type: "checkbox" },
  { name: "published", label: "Published (visible on site)", type: "checkbox" },
];

export default function ProductsAdmin() {
  return (
    <ResourceManager
      table="products"
      title="Shop (Boutique)"
      fields={FIELDS}
      listColumns={["title", "category"]}
    />
  );
}
