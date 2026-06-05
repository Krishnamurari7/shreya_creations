"use client";

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

export default function ContentAdmin() {
  const configured = isSupabaseConfigured();
  const [form, setForm] = useState({
    about_body: "",
    about_body_hi: "",
    hero_marquee: "[]",
    services: "[]",
    process_steps: "[]",
    instagram_embed: "",
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
          hero_marquee: JSON.stringify(data.hero_marquee || [], null, 2),
          services: JSON.stringify(data.services || [], null, 2),
          process_steps: JSON.stringify(data.process_steps || [], null, 2),
          instagram_embed: data.instagram_embed || "",
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
        hero_marquee: JSON.parse(form.hero_marquee),
        services: JSON.parse(form.services),
        process_steps: JSON.parse(form.process_steps),
        instagram_embed: form.instagram_embed,
        map_embed_url: form.map_embed_url,
        default_language: form.default_language,
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase.from("settings").upsert(payload);
      setMsg(error ? error.message : "Saved! Home, About and Contact pages updated.");
    } catch (e) {
      setMsg(e.message || "Invalid JSON in one of the fields.");
    }
    setSaving(false);
  };

  if (!configured) {
    return (
      <div>
        <AdminPageHeader title="Site content" />
        <div className="glass rounded-2xl p-5 sm:p-6 text-marigold border border-marigold/30 text-sm">Connect Supabase to edit content.</div>
      </div>
    );
  }

  if (loading) return <p className="admin-muted">Loading…</p>;

  return (
    <div>
      <AdminPageHeader
        title="Site content"
        subtitle="Hero marquee, services, process steps, and about copy."
      />
      <div className="glass admin-form-card admin-form-card--wide space-y-5">
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
        </div>
        <div className="admin-field">
          <label className={ADMIN_LABEL}>About body (Hindi)</label>
          <textarea rows={4} value={form.about_body_hi} onChange={(e) => setForm((f) => ({ ...f, about_body_hi: e.target.value }))} className={ADMIN_INPUT} />
        </div>
        <JsonField label="Hero marquee (JSON array of strings)" value={form.hero_marquee} onChange={(v) => setForm((f) => ({ ...f, hero_marquee: v }))} />
        <JsonField label="Services (JSON array)" hint='[{"title":"...","text":"...","accent":"orange"}]' value={form.services} onChange={(v) => setForm((f) => ({ ...f, services: v }))} />
        <JsonField label="Process steps (JSON array)" hint='[{"step":"Consult","text":"..."}]' value={form.process_steps} onChange={(v) => setForm((f) => ({ ...f, process_steps: v }))} />
        <p className="admin-muted">
          About page copy, pillars & images: edit in{" "}
          <a href="/admin/pages" className="text-gold hover:underline">Page editor</a>.
        </p>
        <div>
          <label className={ADMIN_LABEL}>Google Maps embed URL</label>
          <input value={form.map_embed_url} onChange={(e) => setForm((f) => ({ ...f, map_embed_url: e.target.value }))} className={ADMIN_INPUT} />
        </div>
        <div className="admin-field">
          <label className={ADMIN_LABEL}>Instagram embed HTML (optional)</label>
          <textarea rows={3} value={form.instagram_embed} onChange={(e) => setForm((f) => ({ ...f, instagram_embed: e.target.value }))} className={ADMIN_INPUT} />
        </div>
        <div className="admin-form-actions">
          <button type="button" onClick={save} disabled={saving} className="btn-gold rounded-full px-7 py-3 disabled:opacity-60">
            {saving ? "Saving…" : "Save content"}
          </button>
          {msg && <p className="text-sm text-gold break-words">{msg}</p>}
        </div>
      </div>
    </div>
  );
}
