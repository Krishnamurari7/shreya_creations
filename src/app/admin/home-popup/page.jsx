"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ImageUploader from "@/components/admin/ImageUploader";
import HomeOfferPopup from "@/components/HomeOfferPopup";
import { ADMIN_INPUT, ADMIN_LABEL } from "@/lib/admin/formClasses";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { DEFAULT_HOME_POPUP, validHomePopupLink } from "@/lib/home-popup";
import { BTN_PRIMARY, GLASS } from "@/lib/ui";
import { cn } from "@/lib/utils";

export default function HomePopupAdmin() {
  const configured = isSupabaseConfigured();
  const [form, setForm] = useState(DEFAULT_HOME_POPUP);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!configured) { setLoading(false); return; }
    let active = true;
    (async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("settings").select("pages").eq("id", 1).single();
      if (!active) return;
      if (error) setMessage(error.message);
      else setForm({ ...DEFAULT_HOME_POPUP, ...(data.pages?.homePopup || {}) });
      setLoading(false);
    })();
    return () => { active = false; };
  }, [configured]);

  const change = (key, value) => { setForm((current) => ({ ...current, [key]: value })); setMessage(""); };

  const save = async () => {
    setSaving(true);
    setMessage("");
    try {
      if (form.enabled && !form.title.trim()) throw new Error("Enter a popup title before enabling it.");
      if (form.enabled && !validHomePopupLink(form.href)) throw new Error("Enter a destination beginning with / or https:// before enabling the popup.");
      if (form.href.trim() && !validHomePopupLink(form.href)) throw new Error("Destination must be a site path or HTTPS URL.");
      if (form.image.trim() && !validHomePopupLink(form.image)) throw new Error("Banner image must be a site path or HTTPS URL.");

      const supabase = createClient();
      const { data: auth } = await supabase.auth.getSession();
      if (!auth.session) throw new Error("Session expired. Log in again at /admin/login.");
      const { data, error: readError } = await supabase.from("settings").select("pages").eq("id", 1).single();
      if (readError) throw readError;
      const nextForm = {
        ...form,
        title: form.title.trim(),
        href: form.href.trim(),
        image: form.image.trim(),
        campaignId: String(Date.now()),
      };
      const { error: writeError } = await supabase.from("settings").upsert({
        id: 1,
        pages: { ...(data.pages || {}), homePopup: nextForm },
        updated_at: new Date().toISOString(),
      });
      if (writeError) throw writeError;
      setForm(nextForm);
      try {
        const response = await fetch("/api/admin/revalidate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paths: ["/", "/hi"], tags: ["site-content"] }),
        });
        if (!response.ok) throw new Error("Cache refresh failed");
        setMessage("Saved. The homepage popup has been updated.");
      } catch {
        setMessage("Saved, but the site cache could not refresh. The change may take a little longer to appear.");
      }
    } catch (error) {
      setMessage(error.message || "Could not save the popup.");
    } finally {
      setSaving(false);
    }
  };

  if (!configured) return <><AdminPageHeader title="Home Popup" /><p className="admin-muted">Connect Supabase to edit the homepage popup.</p></>;
  if (loading) return <p className="admin-muted">Loading homepage popup…</p>;

  const field = (key, label, placeholder = "", multiline = false) => (
    <div key={key}>
      <label className={ADMIN_LABEL} htmlFor={`popup-${key}`}>{label}</label>
      {multiline ? (
        <textarea id={`popup-${key}`} rows={3} value={form[key] || ""} onChange={(event) => change(key, event.target.value)} placeholder={placeholder} className={ADMIN_INPUT} />
      ) : (
        <input id={`popup-${key}`} type="text" value={form[key] || ""} onChange={(event) => change(key, event.target.value)} placeholder={placeholder} className={ADMIN_INPUT} />
      )}
    </div>
  );

  return (
    <div>
      <AdminPageHeader title="Home Popup" subtitle="Edit the offer or course popup that appears when someone opens the homepage." action={<Link href="/" target="_blank" className="text-gold hover:underline">View homepage ↗</Link>} />
      <div className={cn(GLASS, "admin-form-card", "admin-form-card--wide", "space-y-6")}>
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gold/20 p-4">
          <div>
            <h2 className="text-lg font-semibold">Show popup on homepage</h2>
            <p className="admin-muted text-sm">Turn this off to hide it without deleting the banner or text.</p>
          </div>
          <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold">
            <input type="checkbox" checked={Boolean(form.enabled)} onChange={(event) => change("enabled", event.target.checked)} className="h-5 w-5 accent-orange" />
            {form.enabled ? "Enabled" : "Disabled"}
          </label>
        </div>

        <div>
          <label className={ADMIN_LABEL} htmlFor="popup-kind">Popup type</label>
          <select id="popup-kind" value={form.kind} onChange={(event) => {
            const kind = event.target.value;
            setForm((current) => ({
              ...current,
              kind,
              eyebrow: current.eyebrow === "Special offer" || current.eyebrow === "New course" ? (kind === "course" ? "New course" : "Special offer") : current.eyebrow,
              eyebrowHi: current.eyebrowHi === "विशेष ऑफर" || current.eyebrowHi === "नया कोर्स" ? (kind === "course" ? "नया कोर्स" : "विशेष ऑफर") : current.eyebrowHi,
            }));
            setMessage("");
          }} className={ADMIN_INPUT}>
            <option value="offer">New offer</option>
            <option value="course">New course</option>
          </select>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {field("eyebrow", "Small label (English)", "Special offer")}
          {field("eyebrowHi", "Small label (Hindi)", "विशेष ऑफर")}
          {field("title", "Headline (English)", "New fashion design course")}
          {field("titleHi", "Headline (Hindi)", "नया फैशन डिजाइन कोर्स")}
          {field("description", "Details (English)", "Add offer details, dates, or course highlights", true)}
          {field("descriptionHi", "Details (Hindi)", "ऑफर या कोर्स की जानकारी", true)}
        </div>

        <div className="space-y-4 border-t border-gold/20 pt-5">
          <h2 className="text-lg font-semibold">Banner image</h2>
          <ImageUploader value={form.image} onChange={(url) => change("image", url)} multiple={false} label="Upload banner" />
          {field("image", "Or paste an image URL", "https://...")}
          <div className="grid gap-4 md:grid-cols-2">
            {field("imageAlt", "Image description (English)", "Offer or course banner")}
            {field("imageAltHi", "Image description (Hindi)", "बैनर की जानकारी")}
          </div>
          <p className="admin-muted text-sm">The banner and button both open the destination below.</p>
        </div>

        <div className="space-y-4 border-t border-gold/20 pt-5">
          <h2 className="text-lg font-semibold">Click destination</h2>
          {field("href", "Page link or HTTPS URL", "/courses/course-name")}
          <p className="admin-muted text-sm">Use a course or offer page path such as /courses/course-name, or a full https:// link.</p>
          <div className="grid gap-4 md:grid-cols-2">
            {field("buttonLabel", "Button text (English)", "View details")}
            {field("buttonLabelHi", "Button text (Hindi)", "पूरी जानकारी देखें")}
          </div>
        </div>

        <div className="admin-form-actions border-t border-gold/20 pt-5">
          <button type="button" onClick={save} disabled={saving} className={BTN_PRIMARY}>{saving ? "Saving…" : "Save popup"}</button>
          <button type="button" onClick={() => setPreviewOpen(true)} className="rounded-full border border-gold/50 px-5 py-3 text-sm font-semibold text-gold hover:bg-gold/10">Preview popup</button>
          {message && <p className="text-sm text-gold break-words" role="status">{message}</p>}
        </div>
      </div>
      <HomeOfferPopup settings={form} previewOpen={previewOpen} onPreviewClose={() => setPreviewOpen(false)} autoShow={false} />
    </div>
  );
}
