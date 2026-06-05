"use client";

import ResourceManager from "@/components/admin/ResourceManager";

const FIELDS = [
  { name: "label", label: "Label (English)", type: "text" },
  { name: "label_hi", label: "Label (Hindi)", type: "text" },
  { name: "value", label: "Value", type: "text" },
  { name: "sort_order", label: "Sort order", type: "number" },
  { name: "published", label: "Published", type: "checkbox" },
];

export default function TrustAdmin() {
  return (
    <ResourceManager
      table="trust_stats"
      title="Trust wall"
      fields={FIELDS}
      orderBy="sort_order"
      orderAsc
      listColumns={["label", "value"]}
    />
  );
}
