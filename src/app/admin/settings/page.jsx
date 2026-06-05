"use client";

import { useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

const FIELDS = [
  { name: "brand", label: "Brand name" },
  { name: "boutique", label: "Boutique tagline", hint: "e.g. The Fashion Boutique" },
  { name: "tagline", label: "Tagline (English)" },
  { name: "taglineHi", label: "Tagline (Hindi)", col: "tagline_hi" },
  { name: "intro", label: "Intro / about line (English)", type: "textarea" },
  { name: "introHi", label: "Intro (Hindi)", col: "intro_hi", type: "textarea" },
  { name: "whatsapp", label: "WhatsApp number", hint: "International format, no +, e.g. 919876543210" },
  { name: "phone", label: "Phone" },
  { name: "email", label: "Email" },
  { name: "address", label: "Address", type: "textarea" },
  { name: "city", label: "City" },
  { name: "founded", label: "Founded label", hint: "e.g. Since 2005" },
  { name: "instagram", label: "Instagram URL", path: ["socials", "instagram"] },
  { name: "youtube", label: "YouTube URL", path: ["socials", "youtube"] },
  { name: "facebook", label: "Facebook URL", path: ["socials", "facebook"] },
];

import { ADMIN_INPUT, ADMIN_LABEL } from "@/lib/admin/formClasses";

export default function SettingsAdmin() {
  const configured = isSupabaseConfigured();
  const [form, setForm] = useState({ socials: {} });
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
      if (data) setForm({ socials: {}, ...data });
      setLoading(false);
    })();
  }, [configured]);

  const setField = (f, value) => {
    if (f.path) {
      setForm((prev) => ({ ...prev, [f.path[0]]: { ...(prev[f.path[0]] || {}), [f.path[1]]: value } }));
    } else {
      setForm((prev) => ({ ...prev, [f.col || f.name]: value }));
    }
  };
  const getField = (f) => {
    if (f.path) return form[f.path[0]]?.[f.path[1]] || "";
    return form[f.col || f.name] || "";
  };

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
    const { error } = await supabase.from("settings").upsert({ ...form, id: 1 });
    setSaving(false);
    setMsg(
      error
        ? error.message.includes("permission denied")
          ? "Permission denied. Log out and sign in again."
          : error.message
        : "Saved! Changes are live on the site."
    );
  };

  if (!configured) {
    return (
      <div>
        <AdminPageHeader title="Settings" />
        <div className="glass rounded-2xl p-5 sm:p-6 text-marigold border border-marigold/30 text-sm">
          Connect Supabase to edit settings.
        </div>
      </div>
    );
  }

  if (loading) return <p className="admin-muted">Loading…</p>;

  return (
    <div>
      <AdminPageHeader title="Settings" subtitle="WhatsApp number, contact details, and social links." />
      <div className="glass admin-form-card space-y-4">
        {FIELDS.map((f) => (
          <div key={f.name} className="admin-field">
            <label className={ADMIN_LABEL}>{f.label}</label>
            {f.type === "textarea" ? (
              <textarea rows={3} value={getField(f)} onChange={(e) => setField(f, e.target.value)} className={ADMIN_INPUT} />
            ) : (
              <input value={getField(f)} onChange={(e) => setField(f, e.target.value)} className={ADMIN_INPUT} />
            )}
            {f.hint && <p className="admin-muted mt-1">{f.hint}</p>}
          </div>
        ))}
        <div className="admin-form-actions">
          <button type="button" onClick={save} disabled={saving} className="btn-gold rounded-full px-7 py-3 disabled:opacity-60">
            {saving ? "Saving…" : "Save settings"}
          </button>
          {msg && <span className="text-sm text-gold break-words">{msg}</span>}
        </div>
      </div>
    </div>
  );
}
