"use client";

import { useEffect } from "react";

/**
 * Registers a WebMCP tool for course information when the browser supports it.
 * Declarative form tools cover contact/demo flows; this adds a read-only lookup tool.
 */
export default function WebMcpRegister({ courses = [] }) {
  useEffect(() => {
    const modelContext = navigator.modelContext;
    if (!modelContext?.registerTool) return undefined;

    const courseSummaries = courses
      .filter((c) => c?.slug && c.published !== false)
      .slice(0, 12)
      .map((c) => ({
        slug: c.slug,
        title: c.title,
        duration: c.duration || null,
        path: `/courses/${c.slug}`,
      }));

    const unregister = modelContext.registerTool({
      name: "list-fashion-courses",
      description:
        "List public fashion and boutique training courses at Shreya Creation in Patna, Bihar.",
      inputSchema: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
      async execute() {
        return {
          courses: courseSummaries,
          contact: "https://shreyacreation.com/contact",
          whatsapp: "https://wa.me/919031105666",
        };
      },
    });

    return () => {
      if (typeof unregister === "function") unregister();
      else modelContext.unregisterTool?.("list-fashion-courses");
    };
  }, [courses]);

  return null;
}
