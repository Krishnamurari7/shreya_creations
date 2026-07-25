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
      { threshold: 0.05, rootMargin: "0px 0px -8% 0px" }
    );

    const revealIfVisible = (el) => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top < vh * 0.95 && rect.bottom > 0) {
        el.classList.add("in");
        if (el.hasAttribute("data-stagger")) {
          el.querySelectorAll(".reveal").forEach((child) => child.classList.add("in"));
        }
        return true;
      }
      return false;
    };

    const observeNew = () => {
      document.querySelectorAll(".reveal:not(.in)").forEach((el) => {
        if (revealIfVisible(el)) return;
        if (!observed.has(el)) {
          observed.add(el);
          io.observe(el);
        }
      });

      document.querySelectorAll("[data-stagger]").forEach((group) => {
        if (group.classList.contains("in") || revealIfVisible(group)) {
          group.querySelectorAll(".reveal").forEach((child) => child.classList.add("in"));
          return;
        }
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
    // Catch late layout / font swaps that leave above-the-fold text at opacity 0
    const bootTimers = [120, 400, 1000].map((ms) => window.setTimeout(observeNew, ms));

    let frame;
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(observeNew);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      bootTimers.forEach((id) => window.clearTimeout(id));
      cancelAnimationFrame(frame);
      mo.disconnect();
      io.disconnect();
    };
  }, [pathname]);
  return null;
}
