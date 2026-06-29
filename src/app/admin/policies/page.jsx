"use client";

import { BTN_GHOST, BTN_GOLD, GLASS } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminModal from "@/components/admin/AdminModal";
import { ADMIN_INPUT, ADMIN_LABEL } from "@/lib/admin/formClasses";

const SLUGS = ["privacy", "shipping", "returns"];

export default function PoliciesAdmin() {
  const configured = isSupabaseConfigured();
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const load = async () => {
    if (!configured) return setLoading(false);
    const supabase = createClient();
    const { data } = await supabase.from("policy_pages").select("*");
    setRows(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [configured]);

  const save = async () => {
    const supabase = createClient();
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      setMsg("Session expired. Log in again at /admin/login.");
      return;
    }
    const { error } = await supabase.from("policy_pages").upsert(editing);
    setMsg(
      error
        ? error.message.includes("permission denied")
          ? "Permission denied. Log out and sign in again."
          : error.message
        : "Saved."
    );
    if (!error) {
      setEditing(null);
      load();
    }
  };

  if (!configured) {
    return (
      <div>
        <AdminPageHeader title="Policy pages" />
        <div className={cn(GLASS, "rounded-2xl", "p-5", "text-marigold", "border", "border-marigold/30", "text-sm")}>Connect Supabase first.</div>
      </div>
    );
  }

  if (loading) return <p className="admin-muted">Loading…</p>;

  return (
    <div>
      <AdminPageHeader title="Policy pages" subtitle="Privacy, shipping, and returns pages on the public site." />

      <ul className="space-y-3 mb-6">
        {rows.map((r) => (
          <li key={r.slug} className={cn(GLASS, "admin-policy-row")}>
            <span className="text-sm sm:text-base break-words">{r.title}</span>
            <button type="button" onClick={() => setEditing(r)} className="admin-btn-ghost shrink-0">
              Edit
            </button>
          </li>
        ))}
        {SLUGS.filter((s) => !rows.find((r) => r.slug === s)).map((slug) => (
          <li key={slug} className={cn(GLASS, "admin-policy-row", "border", "border-dashed", "border-gold/20")}>
            <span className="capitalize text-sm admin-muted">{slug} — not created</span>
            <button
              type="button"
              onClick={() => setEditing({ slug, title: slug, body: "", title_hi: "", body_hi: "" })}
              className="admin-btn-ghost shrink-0"
            >
              Create
            </button>
          </li>
        ))}
      </ul>

      <AdminModal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing ? `Edit: ${editing.slug}` : "Policy"}
        footer={
          <div className="admin-form-actions">
            <button type="button" onClick={save} className={cn(BTN_GOLD, "rounded-full", "px-6", "py-2.5", "text-sm")}>
              Save
            </button>
            <button type="button" onClick={() => setEditing(null)} className={cn(BTN_GHOST, "rounded-full", "px-6", "py-2.5", "text-sm")}>
              Cancel
            </button>
          </div>
        }
      >
        {editing &&
          ["title", "title_hi", "body", "body_hi"].map((key) => (
            <div key={key} className="admin-field mb-4">
              <label className={ADMIN_LABEL}>{key}</label>
              {key.startsWith("body") ? (
                <textarea
                  rows={6}
                  value={editing[key] || ""}
                  onChange={(e) => setEditing({ ...editing, [key]: e.target.value })}
                  className={ADMIN_INPUT}
                />
              ) : (
                <input
                  value={editing[key] || ""}
                  onChange={(e) => setEditing({ ...editing, [key]: e.target.value })}
                  className={ADMIN_INPUT}
                />
              )}
            </div>
          ))}
      </AdminModal>

      {msg && <p className="text-sm text-gold break-words">{msg}</p>}
    </div>
  );
}
