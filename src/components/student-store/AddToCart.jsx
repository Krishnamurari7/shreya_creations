"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatMoney } from "@/lib/student-store/format";
export default function AddToCart({ kind, item }) {
  const [variant, setVariant] = useState(item.variants?.[0]?.id || "");
  const [quantity, setQuantity] = useState(1), [busy, setBusy] = useState(false), [message, setMessage] = useState("");
  const router = useRouter();
  const chosen = item.variants?.find(v => v.id === variant);
  const available = kind === "kit" ? item.available : chosen?.available || 0;
  async function add(buyNow = false) {
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/student-store/cart", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ variant_id: kind === "product" ? variant : null, kit_id: kind === "kit" ? item.id : null, quantity }) });
      const data = await response.json();
      if (response.status === 401) { router.push(`/student-store/login?next=${encodeURIComponent(location.pathname)}`); return; }
      if (!response.ok) throw new Error(data.error || "Could not add to cart");
      setMessage("Added to cart"); window.dispatchEvent(new Event("student-store:cart")); if (buyNow) router.push("/student-store/checkout");
    } catch (e) { setMessage(e.message); } finally { setBusy(false); }
  }
  return <div className="mt-7 space-y-4">
    {kind === "product" && chosen && <p className="text-lg font-semibold text-[#ffd0a7]">Selected: {formatMoney(chosen.price_paise)} · {chosen.available} available</p>}
    {kind === "product" && <label className="block text-sm">Choose a variant<select value={variant} onChange={e => setVariant(e.target.value)} className="mt-2 block w-full rounded-lg bg-[#211815] border border-[#76513f] p-3 text-white">{item.variants.map(v => <option key={v.id} value={v.id}>{v.sku} · {Object.values(v.attributes || {}).join(" / ") || "Standard"} · {formatMoney(v.price_paise)} · {v.available} available</option>)}</select></label>}
    <label className="block text-sm">Quantity<input type="number" min="1" max={Math.min(100, available || 1)} value={quantity} onChange={e => setQuantity(Math.max(1, Number(e.target.value) || 1))} className="mt-2 block w-28 rounded-lg bg-[#211815] border border-[#76513f] p-3 text-white" /></label>
    <div className="flex flex-wrap gap-3"><button onClick={() => add(false)} disabled={busy || available < quantity || !variant && kind === "product"} className="rounded-full bg-[#cd642b] px-6 py-3 font-semibold text-white disabled:opacity-40">Add to cart</button><button onClick={() => add(true)} disabled={busy || available < quantity || !variant && kind === "product"} className="rounded-full border border-[#eaa06a] px-6 py-3 font-semibold text-[#ffbc88] disabled:opacity-40">Buy now</button></div>
    {message && <p role="status" className="text-sm text-[#ffc496]">{message}</p>}
  </div>;
}
