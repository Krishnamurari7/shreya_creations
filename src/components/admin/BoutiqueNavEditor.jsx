"use client";

import { ADMIN_INPUT, ADMIN_LABEL } from "@/lib/admin/formClasses";

const ICONS = ["boutique", "stitch", "blouse", "lehenga", "suit", "gown", "bridal", "spark"];

export function boutiqueNavForEditor(items) {
  if (!Array.isArray(items)) return [];
  return items.map((item) => ({
    href: item.href || "",
    nav_label: item.nav_label ?? item.navLabel ?? "",
    nav_label_hi: item.nav_label_hi ?? item.navLabelHi ?? "",
    nav_desc: item.nav_desc ?? item.navDesc ?? "",
    nav_desc_hi: item.nav_desc_hi ?? item.navDescHi ?? "",
    icon: item.icon || "boutique",
  }));
}

export default function BoutiqueNavEditor({ items = [], onChange }) {
  const update = (index, key, value) => {
    onChange(items.map((item, i) => i === index ? { ...item, [key]: value } : item));
  };

  const move = (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= items.length) return;
    const next = [...items];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    onChange(next);
  };

  const add = () => onChange([...items, {
    href: "/shop?category=",
    nav_label: "",
    nav_label_hi: "",
    nav_desc: "",
    nav_desc_hi: "",
    icon: "boutique",
  }]);

  return (
    <div className="space-y-3">
      <p className="admin-muted">
        This same list appears in the boutique menu on every page, on desktop and mobile.
        Use an existing page path or /shop?category=CategoryName to show products in a new category. Spaces in category names are supported.
      </p>
      {items.map((item, index) => (
        <div key={index} className="rounded-xl border border-gold/20 bg-white/5 p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <strong className="text-sm">{item.nav_label || `Category ${index + 1}`}</strong>
            <div className="flex items-center gap-3 text-sm">
              <button type="button" disabled={index === 0} onClick={() => move(index, -1)} className="text-gold disabled:opacity-30">Move up</button>
              <button type="button" disabled={index === items.length - 1} onClick={() => move(index, 1)} className="text-gold disabled:opacity-30">Move down</button>
              <button type="button" onClick={() => onChange(items.filter((_, i) => i !== index))} className="text-rose">Remove</button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["nav_label", "Name (English)"],
              ["nav_label_hi", "Name (Hindi)"],
              ["nav_desc", "Description (English)"],
              ["nav_desc_hi", "Description (Hindi)"],
            ].map(([key, label]) => (
              <label key={key} className={ADMIN_LABEL}>
                {label}
                <input value={item[key] || ""} onChange={(event) => update(index, key, event.target.value)} className={ADMIN_INPUT} />
              </label>
            ))}
            <label className={ADMIN_LABEL}>
              Destination path
              <input value={item.href || ""} onChange={(event) => update(index, "href", event.target.value)} className={ADMIN_INPUT} placeholder="/shop?category=Suit" />
            </label>
            <label className={ADMIN_LABEL}>
              Icon
              <select value={item.icon || "boutique"} onChange={(event) => update(index, "icon", event.target.value)} className={ADMIN_INPUT}>
                {ICONS.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
              </select>
            </label>
          </div>
        </div>
      ))}
      <button type="button" onClick={add} className="text-sm text-gold hover:underline">+ Add category</button>
    </div>
  );
}
