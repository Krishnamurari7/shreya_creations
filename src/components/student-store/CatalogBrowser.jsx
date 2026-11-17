"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import StoreCard from "./StoreCard";
export default function CatalogBrowser() {
  const router = useRouter(), searchParams = useSearchParams();
  const [data, setData] = useState(null), [error, setError] = useState("");
  const [filters, setFilters] = useState({ q: searchParams.get("q") || "", category: searchParams.get("category") || "", course: searchParams.get("course") || "", stock: searchParams.get("stock") || "", sort: searchParams.get("sort") || "newest", min: searchParams.get("min") || "", max: searchParams.get("max") || "", page: searchParams.get("page") || "1" });
  useEffect(() => { const controller = new AbortController(); setData(null); setError(""); fetch(`/api/student-store/catalog?${searchParams}`, { signal: controller.signal }).then(async r => { const x = await r.json(); if (!r.ok) throw new Error(x.error); setData(x); }).catch(e => { if (e.name !== "AbortError") setError(e.message); }); return () => controller.abort(); }, [searchParams]);
  function update(name, value) { setFilters(f => ({ ...f, [name]: value, page: "1" })); }
  function submit(e) { e.preventDefault(); const params = new URLSearchParams(); Object.entries(filters).forEach(([k,v]) => { if (v && !(k === "page" && v === "1")) params.set(k,v); }); router.push(`/student-store/products?${params}`); }
  function pageTo(page) { const p = new URLSearchParams(searchParams.toString()); p.set("page", String(page)); router.push(`/student-store/products?${p}`); }
  return <><form onSubmit={submit} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 rounded-2xl border border-[#5b3e2f] bg-[#211713] p-5 mb-8">
    <label className="text-sm">Search<input value={filters.q} onChange={e => update("q", e.target.value)} placeholder="Product or kit name" className="store-input" /></label>
    <label className="text-sm">Category<select value={filters.category} onChange={e => update("category", e.target.value)} className="store-input"><option value="">All categories</option>{(data?.categories || []).map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}</select></label>
    <label className="text-sm">Course<select value={filters.course} onChange={e => update("course", e.target.value)} className="store-input"><option value="">All courses</option>{(data?.courses || []).map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select></label>
    <label className="text-sm">Sort<select value={filters.sort} onChange={e => update("sort", e.target.value)} className="store-input"><option value="newest">Newest</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option></select></label>
    <label className="text-sm">Minimum price (₹)<input type="number" min="0" value={filters.min ? Number(filters.min)/100 : ""} onChange={e => update("min", e.target.value ? String(Math.round(Number(e.target.value)*100)) : "")} className="store-input" /></label>
    <label className="text-sm">Maximum price (₹)<input type="number" min="0" value={filters.max ? Number(filters.max)/100 : ""} onChange={e => update("max", e.target.value ? String(Math.round(Number(e.target.value)*100)) : "")} className="store-input" /></label>
    <label className="flex items-center gap-2 pt-5 text-sm"><input type="checkbox" checked={filters.stock === "1"} onChange={e => update("stock", e.target.checked ? "1" : "")} /> In stock only</label>
    <button className="rounded-xl bg-[#c9632e] px-5 py-3 text-white font-semibold self-end">Apply filters</button>
  </form>
  {!data && !error && <p role="status">Loading catalog…</p>}{error && <p role="alert" className="text-[#ffac94]">{error}</p>}
  {data && <><p className="text-sm text-[#d1b8a5] mb-5">{data.products.length} product{data.products.length === 1 ? "" : "s"} on this page</p><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">{data.products.map(p => <StoreCard key={p.id} item={p} />)}</div>{!data.products.length && <p className="rounded-2xl border border-[#634637] p-7 text-[#dec6b5]">No products match these filters. Try another category or search.</p>}
  <div className="flex gap-3 mt-8"><button className="store-outline" disabled={Number(filters.page) <= 1} onClick={() => pageTo(Math.max(1, Number(filters.page)-1))}>Previous</button><span className="p-3">Page {filters.page} · {data.total_count} total products</span><button className="store-outline" disabled={Number(filters.page) * 12 >= data.total_count} onClick={() => pageTo(Number(filters.page)+1)}>Next</button></div>
  {data.kits.length > 0 && <section className="mt-16"><h2 className="font-serif text-3xl mb-6">Student kits</h2><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">{data.kits.map(k => <StoreCard key={k.id} item={k} kind="kit" />)}</div></section>}</>}
  </>;
}
