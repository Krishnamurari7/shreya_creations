"use client";

import { BTN_GOLD, GLASS } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { ADMIN_INPUT, ADMIN_LABEL } from "@/lib/admin/formClasses";

const BRAND_FIELDS = [
  { name: "brand", label: "Brand name" },
  { name: "boutique", label: "Brand message (English)", hint: "e.g. From Skill to Business" },
  { name: "boutiqueHi", label: "Brand message (Hindi)", col: "boutique_hi", hint: "e.g. कौशल से कारोबार तक" },
  { name: "tagline", label: "Service USP (English)", hint: "e.g. Stitched outfits in 24 hours" },
  { name: "taglineHi", label: "Service USP (Hindi)", col: "tagline_hi" },
  { name: "intro", label: "Intro / about line (English)", type: "textarea" },
  { name: "introHi", label: "Intro (Hindi)", col: "intro_hi", type: "textarea" },
];

const FACT_FIELDS = [
  // TODO(owner): set the ONE real students_taught — was 1000+ / 2000+ / 30K+
  { name: "founding_year", label: "Founding year", hint: "Default 2012 — yearsExperience = currentYear − this" },
  { name: "students_taught", label: "Students taught", hint: "TODO(owner): confirm the ONE real number" },
  { name: "outfits_delivered", label: "Outfits delivered", hint: "TODO(owner): confirm" },
  { name: "express_delivery_hours", label: "Express delivery (hours)", hint: "Usually 24" },
];

const CONTACT_FIELDS = [
  { name: "whatsapp", label: "WhatsApp number", hint: "International format, no +, e.g. 919876543210" },
  { name: "whatsapp_number", label: "WhatsApp (alias)", hint: "Optional; falls back to WhatsApp number above" },
  { name: "phone_primary", label: "Primary phone" },
  { name: "phone_secondary", label: "Secondary phone" },
  { name: "phone", label: "Phone display (combined)", hint: "Shown as-is if set; else primary / secondary" },
  // TODO(owner): prefer @shreyacreation.com if that inbox exists
  { name: "email", label: "Email" },
  { name: "address", label: "Full address", type: "textarea", col: "address" },
  { name: "address_line", label: "Address line (optional override)", type: "textarea" },
  { name: "city", label: "City", hint: "Patna" },
  { name: "pincode", label: "Pincode" },
  // TODO(owner): confirm real hours & closed day
  { name: "studio_hours", label: "Studio hours", hint: "e.g. Mon–Sat, 10 AM–8 PM" },
  { name: "closed_days", label: "Closed days", hint: "e.g. Sunday" },
  { name: "founded", label: "Founded label (display)", hint: "e.g. 14+ Years — optional override; leave blank to auto-calc from founding year" },
];

const SOCIAL_FIELDS = [
  { name: "instagram", label: "Instagram URL", path: ["socials", "instagram"] },
  { name: "youtube", label: "YouTube URL", path: ["socials", "youtube"] },
  { name: "facebook", label: "Facebook URL", path: ["socials", "facebook"] },
];

function emptyForm() {
  return {
    brand: "",
    boutique: "",
    boutique_hi: "",
    tagline: "",
    tagline_hi: "",
    intro: "",
    intro_hi: "",
    whatsapp: "",
    whatsapp_number: "",
    phone: "",
    phone_primary: "",
    phone_secondary: "",
    email: "",
    address: "",
    address_line: "",
    city: "",
    pincode: "",
    founded: "",
    founding_year: "",
    students_taught: "",
    outfits_delivered: "",
    express_delivery_hours: "",
    studio_hours: "",
    closed_days: "",
    socials: {},
  };
}

function loadForm(data) {
  return {
    ...emptyForm(),
    brand: data.brand || "",
    boutique: data.boutique || "",
    boutique_hi: data.boutique_hi || "",
    tagline: data.tagline || "",
    tagline_hi: data.tagline_hi || "",
    intro: data.intro || "",
    intro_hi: data.intro_hi || "",
    whatsapp: data.whatsapp || "",
    whatsapp_number: data.whatsapp_number || "",
    phone: data.phone || "",
    phone_primary: data.phone_primary || "",
    phone_secondary: data.phone_secondary || "",
    email: data.email || "",
    address: data.address || "",
    address_line: data.address_line || "",
    city: data.city || "",
    pincode: data.pincode || "",
    founded: data.founded || "",
    founding_year: data.founding_year ?? "",
    students_taught: data.students_taught ?? "",
    outfits_delivered: data.outfits_delivered ?? "",
    express_delivery_hours: data.express_delivery_hours ?? "",
    studio_hours: data.studio_hours || "",
    closed_days: data.closed_days || "",
    socials: data.socials || {},
  };
}

function FieldList({ fields, form, setField, getField }) {
  return fields.map((f) => (
    <div key={f.name} className="admin-field">
      <label className={ADMIN_LABEL}>{f.label}</label>
      {f.type === "textarea" ? (
        <textarea rows={3} value={getField(f)} onChange={(e) => setField(f, e.target.value)} className={ADMIN_INPUT} />
      ) : (
        <input value={getField(f)} onChange={(e) => setField(f, e.target.value)} className={ADMIN_INPUT} />
      )}
      {f.hint && <p className="admin-muted mt-1">{f.hint}</p>}
    </div>
  ));
}

export default function SettingsAdmin() {
  const configured = isSupabaseConfigured();
  const [form, setForm] = useState(emptyForm());
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
      if (data) setForm(loadForm(data));
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
    return form[f.col || f.name] ?? "";
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
    const payload = {
      id: 1,
      brand: form.brand,
      boutique: form.boutique,
      boutique_hi: form.boutique_hi,
      tagline: form.tagline,
      tagline_hi: form.tagline_hi,
      intro: form.intro,
      intro_hi: form.intro_hi,
      whatsapp: form.whatsapp,
      whatsapp_number: form.whatsapp_number || form.whatsapp,
      phone: form.phone,
      phone_primary: form.phone_primary,
      phone_secondary: form.phone_secondary,
      email: form.email,
      address: form.address,
      address_line: form.address_line || form.address,
      city: form.city,
      pincode: form.pincode,
      founded: form.founded,
      founding_year: form.founding_year === "" ? null : Number(form.founding_year),
      students_taught: form.students_taught === "" ? null : Number(form.students_taught),
      outfits_delivered: form.outfits_delivered === "" ? null : Number(form.outfits_delivered),
      express_delivery_hours:
        form.express_delivery_hours === "" ? null : Number(form.express_delivery_hours),
      studio_hours: form.studio_hours,
      closed_days: form.closed_days,
      socials: form.socials,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from("settings").upsert(payload);
    setSaving(false);
    setMsg(
      error
        ? error.message.includes("permission denied")
          ? "Permission denied. Log out and sign in again. If columns are missing, run supabase/migrations/content_fixes.sql."
          : error.message
        : "Saved! Changes are live on the site."
    );
  };

  if (!configured) {
    return (
      <div>
        <AdminPageHeader title="Settings" />
        <div className={cn(GLASS, "rounded-2xl", "p-5", "sm:p-6", "text-marigold", "border", "border-marigold/30", "text-sm")}>
          Connect Supabase to edit settings.
        </div>
      </div>
    );
  }

  if (loading) return <p className="admin-muted">Loading…</p>;

  return (
    <div>
      <AdminPageHeader
        title="Site Settings"
        subtitle="Brand, contact, hours, socials, and site facts — single source of truth for the public site. Course count is computed from published courses."
      />
      <div className={cn(GLASS, "admin-form-card", "space-y-6")}>
        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-gold uppercase tracking-wider">Brand</h3>
          <FieldList fields={BRAND_FIELDS} form={form} setField={setField} getField={getField} />
        </section>
        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-gold uppercase tracking-wider">Site facts & hours</h3>
          <FieldList fields={FACT_FIELDS} form={form} setField={setField} getField={getField} />
          <FieldList fields={CONTACT_FIELDS} form={form} setField={setField} getField={getField} />
        </section>
        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-gold uppercase tracking-wider">Socials</h3>
          <FieldList fields={SOCIAL_FIELDS} form={form} setField={setField} getField={getField} />
        </section>
        <div className="admin-form-actions">
          <button type="button" onClick={save} disabled={saving} className={cn(BTN_GOLD, "rounded-full", "px-7", "py-3", "disabled:opacity-60")}>
            {saving ? "Saving…" : "Save settings"}
          </button>
          {msg && <span className="text-sm text-gold break-words">{msg}</span>}
        </div>
      </div>
    </div>
  );
}
