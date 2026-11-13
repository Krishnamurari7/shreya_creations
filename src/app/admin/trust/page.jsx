"use client";

import ResourceManager from "@/components/admin/ResourceManager";
import Link from "next/link";

const FIELDS = [
  { name: "label", label: "Label (English)", type: "text" },
  { name: "label_hi", label: "Label (Hindi)", type: "text" },
  { name: "value", label: "Value (English)", type: "text" },
  { name: "value_hi", label: "Value (Hindi)", type: "text" },
  { name: "sort_order", label: "Sort order", type: "number" },
  { name: "published", label: "Published", type: "checkbox" },
];

export default function TrustAdmin() {
  return (
    <div>
      <p className="admin-muted mb-4">
        To edit the “Visit Our Studio” sections, open <Link href="/admin/cta-boxes" className="text-gold hover:underline">CTA Boxes</Link>.
      </p>
      <ResourceManager
        table="trust_stats"
        title="Trust stats"
        fields={FIELDS}
        orderBy="sort_order"
        orderAsc
        listColumns={["label", "value"]}
      />
    </div>
  );
}
