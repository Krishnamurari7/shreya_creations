"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatMoney } from "@/lib/student-store/format";
export default function CheckoutClient() {
  const router = useRouter();
  const [cart, setCart] = useState(null), [quote, setQuote] = useState(null), [error, setError] = useState(""), [busy, setBusy] = useState(false);
  const [key] = useState(() => crypto.randomUUID());
  const [form, setForm] = useState({ customer_name: "", mobile: "", email: "", delivery_method: "", line1: "", line2: "", city: "", state: "", pin_code: "", notes: "" });
  const set = (name, value) => setForm(f => ({ ...f, [name]: value }));
  useEffect(() => { fetch("/api/student-store/cart").then(async r => { const x = await r.json(); if (!r.ok) throw new Error(x.error); setCart(x); }).catch(e => setError(e.message)); }, []);
  useEffect(() => {
    if (!form.delivery_method || form.delivery_method === "home_delivery" && !/^[0-9]{6}$/.test(form.pin_code)) { setQuote(null); return; }
    const controller = new AbortController();
    fetch(`/api/student-store/quote?method=${form.delivery_method}&pin=${form.pin_code}`, { signal: controller.signal }).then(async r => { const x = await r.json(); if (!r.ok) throw new Error(x.error); setQuote(x); setError(""); }).catch(e => { if (e.name !== "AbortError") { setQuote(null); setError(e.message); } });
    return () => controller.abort();
  }, [form.delivery_method, form.pin_code]);
  async function submit(e) {
    e.preventDefault(); if (!quote) return; setBusy(true); setError("");
    const payload = { idempotency_key: key, customer_name: form.customer_name, mobile: form.mobile, email: form.email,
      delivery_method: form.delivery_method, payment_method: form.delivery_method === "pickup" ? "pay_at_pickup" : "cash_on_delivery",
      address: form.delivery_method === "home_delivery" ? { line1: form.line1, line2: form.line2, city: form.city, state: form.state, pin_code: form.pin_code } : null, notes: form.notes };
    try { const r = await fetch("/api/student-store/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); const x = await r.json(); if (!r.ok) throw new Error(x.error); router.push(`/student-store/my-orders/${x.order_id}?placed=1`); }
    catch (e) { setError(e.message); setBusy(false); }
  }
  if (!cart) return <p role="status">{error || "Loading checkout…"}</p>;
  if (!cart.items.length) return <p>Your cart is empty.</p>;
  const pickup = cart.settings.pickup_enabled && cart.settings.pay_at_pickup_enabled;
  const delivery = cart.settings.home_delivery_enabled && cart.settings.cash_on_delivery_enabled;
  return <div className="grid lg:grid-cols-[1fr_380px] gap-8"><form onSubmit={submit} className="rounded-2xl border border-[#654534] p-6 space-y-4"><h2 className="font-serif text-2xl">Contact details</h2>
    <label className="store-label">Full name<input required minLength={2} maxLength={120} className="store-input" value={form.customer_name} onChange={e => set("customer_name",e.target.value)} /></label>
    <label className="store-label">Mobile number<input required pattern="([+]91[ -]?)?[6-9][0-9]{9}" className="store-input" value={form.mobile} onChange={e => set("mobile",e.target.value)} /></label>
    <label className="store-label">Email (optional)<input type="email" className="store-input" value={form.email} onChange={e => set("email",e.target.value)} /></label>
    <fieldset><legend className="font-serif text-2xl pt-4 pb-3">Delivery method</legend><div className="flex flex-wrap gap-3">{pickup && <label className="store-option"><input type="radio" name="delivery" checked={form.delivery_method === "pickup"} onChange={() => set("delivery_method","pickup")} /> Institute pickup · pay at pickup</label>}{delivery && <label className="store-option"><input type="radio" name="delivery" checked={form.delivery_method === "home_delivery"} onChange={() => set("delivery_method","home_delivery")} /> Home delivery · cash on delivery</label>}</div>{!pickup && !delivery && <p className="text-[#ffb198]">Checkout is currently unavailable. The institute must configure a delivery and payment method.</p>}</fieldset>
    {form.delivery_method === "pickup" && quote?.pickup && <div className="rounded-xl bg-[#35241b] p-4 text-sm"><p className="font-semibold">Collection point</p><p>{quote.pickup.address}</p><p>{quote.pickup.hours}</p>{quote.pickup.instructions && <p>{quote.pickup.instructions}</p>}</div>}
    {form.delivery_method === "home_delivery" && <div className="grid sm:grid-cols-2 gap-3"><label className="store-label sm:col-span-2">Address line 1<input required minLength={5} className="store-input" value={form.line1} onChange={e => set("line1",e.target.value)} /></label><label className="store-label sm:col-span-2">Address line 2<input className="store-input" value={form.line2} onChange={e => set("line2",e.target.value)} /></label><label className="store-label">City<input required className="store-input" value={form.city} onChange={e => set("city",e.target.value)} /></label><label className="store-label">State<input required className="store-input" value={form.state} onChange={e => set("state",e.target.value)} /></label><label className="store-label">PIN code<input required pattern="[0-9]{6}" className="store-input" value={form.pin_code} onChange={e => set("pin_code",e.target.value)} /></label></div>}
    <label className="store-label">Order notes (optional)<textarea maxLength={2000} className="store-input min-h-24" value={form.notes} onChange={e => set("notes",e.target.value)} /></label>
    <button disabled={busy || !quote || !pickup && !delivery} className="rounded-full bg-[#c9632e] px-7 py-3 font-bold disabled:opacity-40">{busy ? "Placing order…" : "Place order"}</button>{error && <p role="alert" className="text-[#ffb198]">{error}</p>}
  </form><aside className="h-fit rounded-2xl border border-[#654534] p-6"><h2 className="font-serif text-2xl mb-5">Order summary</h2>{cart.items.map(i => <div key={i.id} className="flex justify-between gap-3 text-sm py-2"><span>{i.name} × {i.quantity}</span><span>{formatMoney(i.line_total_paise)}</span></div>)}<hr className="border-[#654534] my-4"/><div className="space-y-2 text-sm"><div className="flex justify-between"><span>Items total</span><span>{formatMoney(cart.subtotal_paise)}</span></div><div className="flex justify-between"><span>Discount</span><span>− {formatMoney(cart.discount_paise)}</span></div><div className="flex justify-between"><span>Delivery</span><span>{quote ? formatMoney(quote.delivery_paise) : "Select method"}</span></div><div className="flex justify-between"><span>Applicable tax</span><span>{quote ? formatMoney(quote.tax_paise) : "Calculated at checkout"}</span></div><div className="flex justify-between font-bold text-xl pt-4"><span>Final payable</span><span>{quote ? formatMoney(quote.total_paise) : "—"}</span></div></div>{quote?.estimate && <p className="text-xs text-[#d8baa5] mt-4">Delivery estimate: {quote.estimate}</p>}<p className="text-xs text-[#d8baa5] mt-4">Payment remains pending until the institute verifies collection. Your order is committed only after server confirmation.</p></aside></div>;
}
