"use client";

import ResourceManager from "@/components/admin/ResourceManager";

const FIELDS = [
  { name: "name", label: "Client name", type: "text" },
  { name: "text", label: "Testimonial", type: "textarea" },
  { name: "rating", label: "Rating (1–5)", type: "number" },
  {
    name: "source",
    label: "Source — only set “google” for a real review on our Google Business profile",
    type: "select",
    options: ["manual", "google"],
  },
  { name: "review_url", label: "Link to the Google review (required for “google”)", type: "text" },
  {
    name: "category",
    label: "Shown under — “boutique” for stitching clients, “institute” for course students",
    type: "select",
    options: ["boutique", "institute"],
  },
];

export default function TestimonialsAdmin() {
  return (
    <ResourceManager
      table="testimonials"
      title="Testimonials"
      fields={FIELDS}
      listColumns={["name", "category", "source"]}
    />
  );
}
