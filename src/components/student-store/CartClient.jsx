"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatMoney } from "@/lib/student-store/format";
export default function CartClient() {
  const [cart, setCart] = useState(null), [error, setError] = useState(""), [busy, setBusy] = useState(false);
  async function load() { const r = await fetch("/api/student-store/cart"); const x = await r.json(); if (!r.ok) throw new Error(x.error); setCart(x); }
  useEffect(() => { load().catch(e => setError(e.message)); }, []);
  async function change(item, quantity) {
    setBusy(true); setError("");
    try { const r = await fetch("/api/student-store/cart", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ variant_id: item.variant_id, kit_id: item.kit_id, quantity }) }); const x = await r.json(); if (!r.ok) throw new Error(x.error); setCart(x); window.dispatchEvent(new Event("student-store:cart")); }
    catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  if (!cart) return <div>{error ? <p role="alert">{error} <Link className="text-[#ffae77] underline" href="/student-store/login">Sign in</Link></p> : <p>Loading your cart…</p>}</div>;
  return <><div className="space-y-4">{cart.items.map(item => <div key={item.id} className="flex flex-wrap sm:flex-nowrap gap-5 items-center rounded-2xl border border-[#634637] p-4"><img src={item.image?.src || "/student-store-tools.webp"} alt={item.image?.alt || "Sewing tools illustration"} className="w-24 h-24 rounded-xl object-cover" /><div className="grow"><Link href={`/student-store/${item.kind === "kit" ? "kits" : "product"}/${item.slug}`} className="font-serif text-xl">{item.name}</Link><p className="text-sm text-[#d5baa5]">{formatMoney(item.unit_price_paise)} each{item.variant && ` · ${Object.values(item.variant).join(" / ")}`}</p>{item.unavailable && <p className="text-[#ffac94] text-sm">Unavailable or insufficient stock; remove or reduce this item.</p>}</div><div className="flex items-center gap-3"><button disabled={busy} onClick={() => change(item, item.quantity-1)} className="store-outline" aria-label={`Reduce ${item.name}`}>−</button><span>{item.quantity}</span><button disabled={busy || item.quantity >= item.available} onClick={() => change(item, item.quantity+1)} className="store-outline" aria-label={`Increase ${item.name}`}>+</button><button disabled={busy} onClick={() => change(item, 0)} className="text-[#ffad8a] text-sm underline">Remove</button></div><strong>{formatMoney(item.line_total_paise)}</strong></div>)}</div>
    {!cart.items.length && <p className="rounded-2xl border border-[#634637] p-8">Your cart is empty. <Link href="/student-store/products" className="text-[#ffb47d] underline">Browse products</Link></p>}
    {cart.items.length > 0 && <div className="mt-8 ml-auto max-w-md rounded-2xl border border-[#634637] p-6"><div className="flex justify-between"><span>Items total</span><strong>{formatMoney(cart.subtotal_paise)}</strong></div><div className="flex justify-between mt-2"><span>Eligible discount</span><strong>− {formatMoney(cart.discount_paise)}</strong></div><div className="flex justify-between mt-2"><span>Item tax</span><strong>{formatMoney(cart.tax_paise)}</strong></div><p className="text-xs text-[#cbb19e] mt-4">Delivery charge and any delivery tax are calculated after you choose a method and PIN code.</p><Link href="/student-store/checkout" aria-disabled={cart.items.some(i => i.unavailable)} className={`block text-center mt-5 rounded-full bg-[#c9632e] px-6 py-3 font-bold ${cart.items.some(i => i.unavailable) ? "pointer-events-none opacity-40" : ""}`}>Continue to checkout</Link></div>}{error && <p role="alert" className="text-[#ffac94]">{error}</p>}
  </>;
}
