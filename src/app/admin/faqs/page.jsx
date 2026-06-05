"use client";

import ResourceManager from "@/components/admin/ResourceManager";

const FIELDS = [
  { name: "question", label: "Question (English)", type: "text" },
  { name: "question_hi", label: "Question (Hindi)", type: "text" },
  { name: "answer", label: "Answer (English)", type: "textarea" },
  { name: "answer_hi", label: "Answer (Hindi)", type: "textarea" },
  { name: "sort_order", label: "Sort order", type: "number" },
  { name: "published", label: "Published", type: "checkbox" },
];

export default function FaqsAdmin() {
  return (
    <ResourceManager
      table="faqs"
      title="FAQs"
      fields={FIELDS}
      orderBy="sort_order"
      orderAsc
      listColumns={["question"]}
    />
  );
}
