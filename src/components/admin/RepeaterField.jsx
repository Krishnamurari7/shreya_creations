"use client";

import { GLASS } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { ADMIN_INPUT, ADMIN_LABEL } from "@/lib/admin/formClasses";

export default function RepeaterField({ label, items, onChange, fields, addLabel = "Add item" }) {
  const update = (index, key, value) => {
    const next = items.map((row, i) => (i === index ? { ...row, [key]: value } : row));
    onChange(next);
  };

  const add = () => {
    const blank = {};
    fields.forEach((f) => {
      blank[f.key] = f.default ?? "";
    });
    onChange([...items, blank]);
  };

  const remove = (index) => onChange(items.filter((_, i) => i !== index));

  return (
    <div>
      <label className={ADMIN_LABEL}>{label}</label>
      <div className="space-y-4">
        {items.map((row, index) => (
          <div key={index} className={cn(GLASS, "rounded-xl", "p-4", "space-y-3", "border", "border-gold/15")}>
            <div className="flex justify-between items-center gap-2">
              <span className="text-xs admin-muted">#{index + 1}</span>
              <button type="button" onClick={() => remove(index)} className="text-xs text-marigold hover:underline">
                Remove
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {fields.map((f) => (
                <div key={f.key} className={f.wide ? "sm:col-span-2" : ""}>
                  <label className="admin-label text-[10px]">{f.label}</label>
                  {f.type === "textarea" ? (
                    <textarea
                      rows={f.rows || 2}
                      value={row[f.key] ?? ""}
                      onChange={(e) => update(index, f.key, e.target.value)}
                      className={ADMIN_INPUT}
                    />
                  ) : (
                    <input value={row[f.key] ?? ""} onChange={(e) => update(index, f.key, e.target.value)} className={ADMIN_INPUT} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={add} className="mt-3 text-sm text-gold hover:underline">
        + {addLabel}
      </button>
    </div>
  );
}
