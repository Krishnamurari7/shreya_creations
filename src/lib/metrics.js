/** Parse display values like "5,000+", "24 hrs" for count-up animation. */
export function parseMetricValue(raw) {
  const value = String(raw ?? "").trim();
  const match = value.match(/^([^\d]*?)([\d,]+(?:\.\d+)?)(.*)$/);
  if (!match) return { display: value, animate: false };

  const prefix = match[1];
  const num = parseFloat(match[2].replace(/,/g, ""));
  const suffix = match[3];
  if (!Number.isFinite(num)) return { display: value, animate: false };

  return {
    display: value,
    animate: true,
    prefix,
    num,
    suffix,
    useGrouping: match[2].includes(","),
  };
}

export function formatMetric(n, parsed) {
  const rounded = Math.round(n);
  const numStr = parsed.useGrouping ? rounded.toLocaleString("en-IN") : String(rounded);
  return `${parsed.prefix}${numStr}${parsed.suffix}`;
}
