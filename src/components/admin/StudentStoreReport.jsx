"use client";
import { useEffect, useState } from "react";
import { formatMoney } from "@/lib/student-store/format";
export default function StudentStoreReport() {
  const [from, setFrom] = useState(""), [to, setTo] = useState(""), [report, setReport] = useState(null), [error, setError] = useState("");
  async function load() {
    setError(""); const params = new URLSearchParams(); if (from) params.set("from",from); if (to) params.set("to",to);
    const r = await fetch(`/api/admin/student-store/reports?${params}`); const x = await r.json();
    if (!r.ok) { setError(x.error); return; } setReport(x.summary);
  }
  useEffect(() => { load(); }, []);
  return <div><form onSubmit={e => { e.preventDefault(); load(); }} className="flex flex-wrap items-end gap-3 mb-6"><label className="text-sm">From (India time)<input type="date" value={from} onChange={e => setFrom(e.target.value)} className="store-admin-input" /></label><label className="text-sm">Through (India time)<input type="date" value={to} onChange={e => setTo(e.target.value)} className="store-admin-input" /></label><button className="rounded-full bg-orange px-5 py-3 text-white">Apply dates</button></form>{error && <p role="alert">{error}</p>}{!report && !error && <p>Loading report…</p>}{report && <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{[["Orders",report.order_count],["Verified paid orders",report.paid_order_count],["Paid revenue",formatMoney(report.paid_revenue_paise)],["Pending collection",formatMoney(report.pending_paise)],["Cancelled orders",report.cancelled_count],["Out-of-stock variants",report.out_of_stock_variants]].map(([label,value]) => <div key={label} className="rounded-xl border border-orange/20 p-5"><p className="text-sm">{label}</p><strong className="text-2xl">{value}</strong></div>)}</div>}</div>;
}
