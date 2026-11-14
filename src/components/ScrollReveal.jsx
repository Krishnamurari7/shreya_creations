"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const observed = new WeakSet();
    const selector = ".reveal:not(.in), [data-stagger]:not(.in)";
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target;
          element.classList.add("in");
          if (element.hasAttribute("data-stagger")) {
            element.querySelectorAll(".reveal").forEach((child) => {
              child.classList.add("in");
              io.unobserve(child);
            });
          }
          io.unobserve(element);
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -8% 0px" }
    );

    const register = (root) => {
      const candidates = [];
      if (root.matches?.(selector)) candidates.push(root);
      root.querySelectorAll?.(selector).forEach((element) => candidates.push(element));
      for (const element of candidates) {
        if (observed.has(element)) continue;
        observed.add(element);
        io.observe(element);
      }
    };

    register(document);

    const pending = new Set();
    let frame = 0;
    const mo = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) pending.add(node);
        }
      }
      if (!pending.size || frame) return;
      frame = requestAnimationFrame(() => {
        for (const node of pending) register(node);
        pending.clear();
        frame = 0;
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      mo.disconnect();
      io.disconnect();
    };
  }, [pathname]);

  return null;
}
