"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatMoney, statusLabel } from "@/lib/student-store/format";
export default function OrdersClient() {
  const [data, setData] = useState(null), [error, setError] = useState("");
  useEffect(() => { fetch("/api/student-store/orders").then(async r => { const x = await r.json(); if (!r.ok) throw new Error(x.error); setData(x.orders); }).catch(e => setError(e.message)); }, []);
  if (error) return <p role="alert" className="text-[#ffb198]">{error} <Link href="/student-store/login" className="underline">Sign in</Link></p>;
  if (!data) return <p>Loading orders…</p>;
  if (!data.length) return <p className="rounded-2xl border border-[#654534] p-7">No orders yet. <Link href="/student-store/products" className="text-[#ffad74] underline">Browse the catalog</Link>.</p>;
  return <div className="space-y-4">{data.map(o => <Link key={o.id} href={`/student-store/my-orders/${o.id}`} className="block rounded-2xl border border-[#654534] p-5 hover:border-[#c3784c]"><div className="flex flex-wrap gap-4 justify-between"><div><p className="text-xs text-[#d9bca4]">{new Date(o.placed_at).toLocaleString("en-IN")}</p><h2 className="font-serif text-xl mt-2">Order {o.id.slice(0, 8).toUpperCase()}</h2><p className="text-sm text-[#d9bca4]">{statusLabel(o.fulfillment_status)} · {statusLabel(o.payment_state)} payment</p></div><strong className="text-[#ffb47a]">{formatMoney(o.total_paise)}</strong></div></Link>)}</div>;
}
