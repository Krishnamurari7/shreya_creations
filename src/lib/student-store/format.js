export function formatMoney(paise = 0) {
  return `₹${(Number(paise) / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
export function statusLabel(status) { return String(status || "").replaceAll("_", " ").replace(/\b\w/g, c => c.toUpperCase()); }
