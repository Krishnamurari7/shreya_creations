"use client";
import { useState } from "react";
export default function StoreGallery({ photos, fallbackAlt }) {
  const [selected, setSelected] = useState(0);
  const images = photos.length ? photos : [{ src: "/student-store-tools.webp", alt: fallbackAlt }];
  return <div><div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#271b15]"><img src={images[selected]?.src || "/student-store-tools.webp"} alt={images[selected]?.alt || fallbackAlt} className="h-full w-full object-cover" /></div>{images.length > 1 && <div className="grid grid-cols-5 gap-2 mt-3" aria-label="Product images">{images.map((p,i) => <button key={`${p.src}-${i}`} type="button" onClick={() => setSelected(i)} aria-label={`Show image ${i+1}: ${p.alt}`} aria-pressed={selected === i} className={`rounded-lg overflow-hidden border-2 ${selected === i ? "border-[#f0a36c]" : "border-transparent"}`}><img src={p.src} alt="" className="aspect-square w-full object-cover" /></button>)}</div>}</div>;
}
