"use client";

import { REVEAL } from "@/lib/ui";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { pickTrust } from "@/lib/i18n";
import { formatMetric, parseMetricValue } from "@/lib/metrics";

const TRUST_ICON_FALLBACKS = ["outfits", "students", "experience", "express"];

function inferTrustIcon(label = "", index = 0) {
  const l = label.toLowerCase();
  if (/outfit|deliver|stitch|सिलाई|डिलीवरी|आउटफिट/.test(l)) return "outfits";
  if (/student|taught|train|छात्र|प्रशिक्ष/.test(l)) return "students";
  if (/year|experience|वर्ष|अनुभव/.test(l)) return "experience";
  if (/hour|express|fast|घंटे|तुरंत/.test(l)) return "express";
  if (/course|कोर्स|job/.test(l)) return "courses";
  return TRUST_ICON_FALLBACKS[index % TRUST_ICON_FALLBACKS.length];
}

function TrustIcon({ type }) {
  const props = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  switch (type) {
    case "outfits":
      return (
        <svg {...props}>
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <path d="M6 7h12l-1.5 13H7.5L6 7z" />
          <path d="M12 7v13" />
        </svg>
      );
    case "students":
      return (
        <svg {...props}>
          <path d="M12 3 2 8l10 5 10-5-10-5z" />
          <path d="M6 10.5V16l6 3 6-3v-5.5" />
          <path d="M22 8v8" />
        </svg>
      );
    case "experience":
      return (
        <svg {...props}>
          <circle cx="12" cy="8" r="5" />
          <path d="M7 21h10" />
          <path d="M12 13v8" />
          <path d="M9 17h6" />
        </svg>
      );
    case "express":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "courses":
      return (
        <svg {...props}>
          <path d="M4 6.5 12 3l8 3.5-8 3.5-8-3.5z" />
          <path d="M6 10v5.5c0 1 2.5 2.5 6 2.5s6-1.5 6-2.5V10" />
          <path d="M20 8.5V14" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7-6.3-4.6L5.7 21l2.3-7-6-4.6h7.6L12 2z" />
        </svg>
      );
  }
}

function MetricValue({ value, accent }) {
  const ref = useRef(null);
  const parsed = useMemo(() => parseMetricValue(value), [value]);
  const [started, setStarted] = useState(false);
  const [display, setDisplay] = useState(parsed.animate ? formatMetric(0, parsed) : parsed.display);

  useEffect(() => {
    if (!parsed.animate) {
      setDisplay(parsed.display);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(parsed.display);
      return;
    }
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [parsed]);

  useEffect(() => {
    if (!started || !parsed.animate) return;

    const duration = 1500;
    let frame;
    let start;

    const tick = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(formatMetric(parsed.num * eased, parsed));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, parsed]);

  return (
    <div
      ref={ref}
      className={`trust-stat__value trust-stat__value--${accent}`}
      aria-label={parsed.display}
    >
      {display}
    </div>
  );
}

export default function TrustStats({ items, localize = true }) {
  const { lang } = useLanguage();
  const resolved = localize ? items.map((t) => pickTrust(t, lang)) : items;

  return (
    <div className="trust-stats">
      {resolved.map((t, i) => {
        const accent = i % 2 === 0 ? "gold" : "orange";
        const icon = inferTrustIcon(t.label, i);

        return (
          <article
            key={`${t.label}-${i}`}
            className={`trust-stat trust-stat--${accent} ${REVEAL}`}
            style={{ transitionDelay: `${i * 90}ms` }}
          >
            <div className="trust-stat__inner">
              <div className="trust-stat__glow" aria-hidden />
              <div className={`trust-stat__icon-wrap trust-stat__icon-wrap--${accent}`}>
                <TrustIcon type={icon} />
              </div>
              <MetricValue value={t.value} accent={accent} />
              <span className="trust-stat__divider" aria-hidden />
              {t.label ? <p className="trust-stat__label">{t.label}</p> : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
