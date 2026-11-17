"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function QuickAdd({ item, kind, href }) {
  const [busy, setBusy] = useState(false), [message, setMessage] = useState("");
  const router = useRouter();
  const variant = kind === "product" && item.variants.length === 1 ? item.variants[0] : null;
  if (kind === "product" && item.variants.length !== 1) return <Link href={href} className="text-sm text-[#ffbd8c] underline">Choose variant</Link>;
  const available = kind === "kit" ? item.available : variant?.available || 0;
  if (available < 1) return <span className="text-sm text-[#c5a894]">Unavailable</span>;
  async function add() {
    setBusy(true); setMessage("");
    try {
      const current = await fetch("/api/student-store/cart");
      if (current.status === 401) { router.push(`/student-store/login?next=${encodeURIComponent(href)}`); return; }
      const cart = await current.json(); if (!current.ok) throw new Error(cart.error || "Cart is unavailable");
      const existing = cart.items.find(x => kind === "kit" ? x.kit_id === item.id : x.variant_id === variant.id);
      const quantity = Math.min(100, (existing?.quantity || 0) + 1);
      if (quantity > available) throw new Error("Insufficient stock");
      const response = await fetch("/api/student-store/cart", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ variant_id: variant?.id || null, kit_id: kind === "kit" ? item.id : null, quantity }) });
      const result = await response.json(); if (!response.ok) throw new Error(result.error || "Could not add item");
      window.dispatchEvent(new Event("student-store:cart")); setMessage("Added");
    } catch (error) { setMessage(error.message); } finally { setBusy(false); }
  }
  return <div className="mt-3"><button type="button" onClick={add} disabled={busy} className="rounded-full bg-[#c9632e] px-4 py-2 text-xs font-bold text-white disabled:opacity-50">{busy ? "Adding…" : "Add to cart"}</button>{message && <p role="status" className="mt-1 text-xs text-[#ffc093]">{message}</p>}</div>;
}
