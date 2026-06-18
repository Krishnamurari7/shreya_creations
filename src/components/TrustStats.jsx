"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { pickTrust } from "@/lib/i18n";
import { formatMetric, parseMetricValue } from "@/lib/metrics";

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
      {resolved.map((t, i) => (
        <article
          key={`${t.label}-${i}`}
          className="trust-stat reveal"
          style={{ transitionDelay: `${i * 90}ms` }}
        >
          <div className="trust-stat__inner">
            <MetricValue value={t.value} accent={i % 2 === 0 ? "gold" : "orange"} />
            <p className="trust-stat__label">{t.label}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
