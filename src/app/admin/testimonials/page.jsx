"use client";

import ResourceManager from "@/components/admin/ResourceManager";

const FIELDS = [
  { name: "name", label: "Client name", type: "text" },
  { name: "text", label: "Testimonial", type: "textarea" },
  { name: "rating", label: "Rating (1–5)", type: "number" },
  { name: "photo", label: "Photo", type: "image" },
];

export default function TestimonialsAdmin() {
  return (
    <ResourceManager
      table="testimonials"
      title="Testimonials"
      fields={FIELDS}
      listColumns={["name"]}
    />
  );
}
