"use client";

import { BTN_GOLD, GLASS } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { ADMIN_INPUT, ADMIN_LABEL, ADMIN_MUTED } from "@/lib/admin/formClasses";

function JsonField({ label, hint, value, onChange }) {
  return (
    <div>
      <label className={ADMIN_LABEL}>{label}</label>
      <textarea
        rows={8}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${ADMIN_INPUT} font-mono text-xs sm:text-sm min-h-[8rem]`}
      />
      {hint && <p className={`${ADMIN_MUTED} mt-1`}>{hint}</p>}
    </div>
  );
}

function AnnouncementListField({ items, onChange }) {
  const update = (index, value) => {
    const next = [...items];
    next[index] = value;
    onChange(next);
  };

  const add = () => onChange([...items, ""]);
  const remove = (index) => onChange(items.filter((_, i) => i !== index));

  return (
    <div>
      <label className={ADMIN_LABEL}>Top announcement bar</label>
      <p className={`${ADMIN_MUTED} mb-3`}>
        Scrolling messages at the top of every page. One line per message.
      </p>
      <div className="space-y-2">
        {items.map((line, index) => (
          <div key={index} className="flex gap-2 items-center">
            <input
              value={line}
              onChange={(e) => update(index, e.target.value)}
              placeholder="e.g. Fashion Boutique Institute"
              className={`${ADMIN_INPUT} flex-1`}
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="shrink-0 text-xs text-marigold hover:underline px-2"
              aria-label="Remove message"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={add} className="mt-3 text-sm text-gold hover:underline">
        + Add message
      </button>
    </div>
  );
}

export default function ContentAdmin() {
  const configured = isSupabaseConfigured();
  const [form, setForm] = useState({
    about_body: "",
    about_body_hi: "",
    hero_marquee: [],
    process_steps: "[]",
    map_embed_url: "",
    default_language: "en",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      if (!configured) {
        setLoading(false);
        return;
      }
      const supabase = createClient();
      const { data } = await supabase.from("settings").select("*").eq("id", 1).single();
      if (data) {
        setForm({
          about_body: data.about_body || "",
          about_body_hi: data.about_body_hi || "",
          hero_marquee: (data.hero_marquee || []).map((item) =>
            typeof item === "string" ? item : item?.text || ""
          ),
          process_steps: JSON.stringify(data.process_steps || [], null, 2),
          map_embed_url: data.map_embed_url || "",
          default_language: data.default_language || "en",
        });
      }
      setLoading(false);
    })();
  }, [configured]);

  const save = async () => {
    setSaving(true);
    setMsg("");
    const supabase = createClient();
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      setMsg("Session expired. Log in again at /admin/login.");
      setSaving(false);
      return;
    }
    try {
      const payload = {
        id: 1,
        about_body: form.about_body,
        about_body_hi: form.about_body_hi,
        hero_marquee: form.hero_marquee.map((line) => line.trim()).filter(Boolean),
        process_steps: JSON.parse(form.process_steps),
        map_embed_url: form.map_embed_url,
        default_language: form.default_language,
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase.from("settings").upsert(payload);
      setMsg(error ? error.message : "Saved! Announcement bar, About page, and homepage process updated.");
    } catch (e) {
      setMsg(e.message || "Invalid JSON in process steps.");
    }
    setSaving(false);
  };

  if (!configured) {
    return (
      <div>
        <AdminPageHeader title="Site content" />
        <div className={cn(GLASS, "rounded-2xl", "p-5", "text-marigold", "border", "border-marigold/30", "text-sm")}>Connect Supabase to edit content.</div>
      </div>
    );
  }

  if (loading) return <p className="admin-muted">Loading…</p>;

  return (
    <div>
      <AdminPageHeader
        title="Site content"
        subtitle="Announcement bar, About page body copy, homepage process steps, and contact map."
      />
      <div className={cn(GLASS, "admin-form-card", "admin-form-card--wide", "space-y-5")}>
        <div>
          <label className={ADMIN_LABEL}>Default language</label>
          <select
            value={form.default_language}
            onChange={(e) => setForm((f) => ({ ...f, default_language: e.target.value }))}
            className={ADMIN_INPUT}
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
          </select>
        </div>
        <div className="admin-field">
          <label className={ADMIN_LABEL}>About body (English)</label>
          <textarea rows={4} value={form.about_body} onChange={(e) => setForm((f) => ({ ...f, about_body: e.target.value }))} className={ADMIN_INPUT} />
          <p className={`${ADMIN_MUTED} mt-1`}>Shown on the About page below the main story.</p>
        </div>
        <div className="admin-field">
          <label className={ADMIN_LABEL}>About body (Hindi)</label>
          <textarea rows={4} value={form.about_body_hi} onChange={(e) => setForm((f) => ({ ...f, about_body_hi: e.target.value }))} className={ADMIN_INPUT} />
        </div>
        <AnnouncementListField
          items={form.hero_marquee}
          onChange={(hero_marquee) => setForm((f) => ({ ...f, hero_marquee }))}
        />
        <JsonField
          label="Process steps (JSON array)"
          hint='[{"step":"Consult","text":"..."}] — shown in Homepage → Design Process'
          value={form.process_steps}
          onChange={(v) => setForm((f) => ({ ...f, process_steps: v }))}
        />
        <p className="admin-muted">
          About page hero, pillars & team: edit in{" "}
          <a href="/admin/pages" className="text-gold hover:underline">Page editor</a> → About.
        </p>
        <div>
          <label className={ADMIN_LABEL}>Google Maps embed URL</label>
          <input value={form.map_embed_url} onChange={(e) => setForm((f) => ({ ...f, map_embed_url: e.target.value }))} className={ADMIN_INPUT} />
          <p className={`${ADMIN_MUTED} mt-1`}>Used on the Contact page map.</p>
        </div>
        <div className="admin-form-actions">
          <button type="button" onClick={save} disabled={saving} className={cn(BTN_GOLD, "rounded-full", "px-7", "py-3", "disabled:opacity-60")}>
            {saving ? "Saving…" : "Save content"}
          </button>
          {msg && <p className="text-sm text-gold break-words">{msg}</p>}
        </div>
      </div>
    </div>
  );
}
