"use client";

import { useState } from "react";
import RepeaterField from "@/components/admin/RepeaterField";
import { BilingualField, BilingualTextarea, SectionHeading } from "@/components/admin/PageEditorForm";
import { ADMIN_INPUT, ADMIN_LABEL } from "@/lib/admin/formClasses";
import { normalizeCtaPath } from "@/lib/cms/cta-boxes";

const PERK_FIELDS = [
  { key: "text", label: "Perk (English)" },
  { key: "text_hi", label: "Perk (Hindi)" },
];

export default function CtaBoxesEditor({ entries = [], onChange, options = [], initialValues = () => ({}), showAdd = true }) {
  const [newPath, setNewPath] = useState("");
  const [error, setError] = useState("");

  const update = (index, key, value) => {
    onChange(entries.map((entry, i) => (i === index ? { ...entry, [key]: value } : entry)));
  };

  const add = () => {
    const raw = newPath.trim();
    if (!raw.startsWith("/") || /[?#]/.test(raw) || (raw.includes("*") && !raw.endsWith("/*"))) {
      setError("Enter a page path like /about, /shop/item-slug, or /shop/*.");
      return;
    }
    const path = normalizeCtaPath(raw);
    const supported = options.some((option) => option.path === path) || /^\/(shop|courses|portfolio|blog)\/[^/*]+$/.test(path);
    if (!supported) {
      setError("Choose a listed page, or an individual shop, course, portfolio, or blog detail URL.");
      return;
    }
    if (entries.some((entry) => normalizeCtaPath(entry.path) === path)) {
      setError("This page already has a CTA box entry. Edit it below.");
      return;
    }
    const copy = initialValues(path);
    onChange([...entries, { ...copy, path, enabled: true, primary_action: "inherit", secondary_action: "inherit", perks: copy.perks || [] }]);
    setNewPath("");
    setError("");
  };

  return (
    <>
      <SectionHeading>CTA boxes by page</SectionHeading>
      <p className="admin-muted">
        Edit the entire box shown at the bottom of this page. Hindi URLs use the same entry.
        These fields take priority over the older CTA fields in the individual page tabs.
      </p>
      {showAdd && <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-56 flex-1">
          <label className={ADMIN_LABEL} htmlFor="new-cta-path">Page path</label>
          <input
            id="new-cta-path"
            list="cta-page-options"
            value={newPath}
            onChange={(event) => setNewPath(event.target.value)}
            onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); add(); } }}
            placeholder="/about or /shop/*"
            className={ADMIN_INPUT}
          />
          <datalist id="cta-page-options">
            {options.map(({ path, label }) => <option key={path} value={path} label={label} />)}
          </datalist>
        </div>
        <button type="button" onClick={add} className="text-sm text-gold hover:underline pb-2">
          + Add CTA box
        </button>
      </div>}
      {error && <p className="text-sm text-marigold" role="alert">{error}</p>}

      {entries.length === 0 && <p className="admin-muted">No page overrides yet. Existing boxes still use their current page copy.</p>}
      {entries.map((entry, index) => {
        const change = (key, value) => update(index, key, value);
        return (
          <div key={`${entry.path}-${index}`} className="rounded-xl border border-gold/20 p-4 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <strong className="text-sm">{entry.path}</strong>
                {!entry.path.endsWith("/*") && (
                  <a href={entry.path} target="_blank" rel="noopener noreferrer" className="ml-3 text-xs text-gold hover:underline">View page</a>
                )}
              </div>
              <button
                type="button"
                onClick={() => onChange(entries.filter((_, i) => i !== index))}
                className="text-xs text-marigold hover:underline"
              >
                Reset to page default
              </button>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={entry.enabled !== false} onChange={(event) => change("enabled", event.target.checked)} />
              Show CTA box on this page
            </label>
            <BilingualField label="Top badge" enKey="eyebrow" hiKey="eyebrow_hi" values={entry} onChange={change} />
            <BilingualField label="Heading" enKey="title" hiKey="title_hi" values={entry} onChange={change} />
            <BilingualField label="Highlighted heading text" enKey="title_highlight" hiKey="title_highlight_hi" values={entry} onChange={change} />
            <BilingualTextarea label="Description" enKey="subtitle" hiKey="subtitle_hi" values={entry} onChange={change} />
            <RepeaterField label="Perk chips" items={entry.perks || []} onChange={(value) => change("perks", value)} addLabel="Add perk" fields={PERK_FIELDS} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={entry.hide_perks === true} onChange={(event) => change("hide_perks", event.target.checked)} />
              Hide perk chips
            </label>
            <BilingualField label="Reply note" enKey="reply" hiKey="reply_hi" values={entry} onChange={change} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={entry.hide_reply === true} onChange={(event) => change("hide_reply", event.target.checked)} />
              Hide reply note
            </label>
            <BilingualField label="Primary button" enKey="primary_label" hiKey="primary_label_hi" values={entry} onChange={change} />
            <div>
              <label className={ADMIN_LABEL}>Primary button action</label>
              <select value={entry.primary_action || "inherit"} onChange={(event) => change("primary_action", event.target.value)} className={ADMIN_INPUT}>
                <option value="inherit">Keep current action</option>
                <option value="whatsapp">Open WhatsApp</option>
                <option value="link">Open a page or URL</option>
              </select>
              {entry.primary_action === "link" && (
                <input value={entry.primary_href || ""} onChange={(event) => change("primary_href", event.target.value)} placeholder="/contact or https://..." aria-label="Primary button link" className={`${ADMIN_INPUT} mt-2`} />
              )}
            </div>
            <BilingualTextarea label="WhatsApp message" enKey="wa_message" hiKey="wa_message_hi" values={entry} onChange={change} />
            <BilingualField label="Secondary button" enKey="secondary_label" hiKey="secondary_label_hi" values={entry} onChange={change} />
            <div>
              <label className={ADMIN_LABEL}>Secondary button action</label>
              <select value={entry.secondary_action || "inherit"} onChange={(event) => change("secondary_action", event.target.value)} className={ADMIN_INPUT}>
                <option value="inherit">Keep current action</option>
                <option value="link">Open a page or URL</option>
                <option value="hide">Hide secondary button</option>
              </select>
              {entry.secondary_action === "link" && (
                <input value={entry.secondary_href || ""} onChange={(event) => change("secondary_href", event.target.value)} placeholder="/contact or https://..." aria-label="Secondary button link" className={`${ADMIN_INPUT} mt-2`} />
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}
