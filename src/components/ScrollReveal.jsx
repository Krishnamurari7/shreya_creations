"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollReveal() {
  const pathname = usePathname();
  useEffect(() => {
    const observed = new WeakSet();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            if (e.target.hasAttribute("data-stagger")) {
              e.target.querySelectorAll(".reveal").forEach((child) => child.classList.add("in"));
            }
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    const observeNew = () => {
      document.querySelectorAll(".reveal:not(.in)").forEach((el) => {
        if (!observed.has(el)) {
          observed.add(el);
          io.observe(el);
        }
      });

      document.querySelectorAll("[data-stagger]").forEach((group) => {
        if (!observed.has(group)) {
          observed.add(group);
          io.observe(group);
          group.querySelectorAll(".reveal").forEach((child) => {
            if (!observed.has(child)) {
              observed.add(child);
            }
          });
        }
      });
    };

    observeNew();

    let frame;
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(observeNew);
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
