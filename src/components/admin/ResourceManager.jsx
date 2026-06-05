"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { buildPayload, validatePayload, slugify } from "@/lib/admin/buildPayload";
import ImageUploader from "@/components/admin/ImageUploader";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminModal from "@/components/admin/AdminModal";
import { ADMIN_INPUT, ADMIN_LABEL } from "@/lib/admin/formClasses";

function friendlyError(message) {
  if (!message) return "Something went wrong. Please try again.";
  if (message.includes("permission denied")) {
    return "Permission denied. Log out, sign in again at /admin/login, then retry.";
  }
  if (message.includes("row-level security")) {
    return "Not allowed. Make sure you are logged in as admin.";
  }
  if (message.includes("duplicate key") || message.includes("unique")) {
    return "This slug already exists. Use a different title or slug.";
  }
  return message;
}

export default function ResourceManager({ table, title, fields, orderBy = "created_at", orderAsc = false, listColumns }) {
  const configured = isSupabaseConfigured();
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modalError, setModalError] = useState("");

  const blank = useCallback(() => {
    const o = {};
    fields.forEach((f) => {
      if (f.type === "checkbox") {
        o[f.name] = f.name === "published" ? true : false;
      } else if (f.type === "images" || f.type === "list") {
        o[f.name] = [];
      } else {
        o[f.name] = "";
      }
    });
    return o;
  }, [fields]);

  const load = useCallback(async () => {
    if (!configured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    const supabase = createClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      setError("You are not logged in. Go to /admin/login and sign in first.");
      setLoading(false);
      return;
    }

    const { data, error: err } = await supabase.from(table).select("*").order(orderBy, { ascending: orderAsc });
    if (err) setError(friendlyError(err.message));
    else setRows(data || []);
    setLoading(false);
  }, [table, orderBy, orderAsc, configured]);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    setModalError("");
    setError("");

    const validation = validatePayload(editing, fields);
    if (validation) {
      setModalError(validation);
      return;
    }

    setSaving(true);
    const supabase = createClient();
    if (!supabase) {
      setModalError("Supabase is not configured.");
      setSaving(false);
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      setModalError("Session expired. Please log in again.");
      setSaving(false);
      return;
    }

    const isUpdate = Boolean(editing.id);
    const payload = buildPayload(editing, fields, { isUpdate });

    if (fields.some((f) => f.name === "slug") && !payload.slug && payload.title) {
      payload.slug = slugify(payload.title);
    }

    let res;
    if (isUpdate) {
      res = await supabase.from(table).update(payload).eq("id", payload.id).select().single();
    } else {
      res = await supabase.from(table).insert(payload).select().single();
    }

    setSaving(false);

    if (res.error) {
      setModalError(friendlyError(res.error.message));
      return;
    }

    setEditing(null);
    setModalError("");
    await load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this item?")) return;
    const supabase = createClient();
    const { error: err } = await supabase.from(table).delete().eq("id", id);
    if (err) setError(friendlyError(err.message));
    else load();
  };

  if (!configured) {
    return (
      <div>
        <AdminPageHeader title={title} />
        <div className="glass rounded-2xl p-5 sm:p-6 text-marigold border border-marigold/30 text-sm leading-relaxed">
          Connect Supabase (see README) to add, edit and delete {title.toLowerCase()}.
        </div>
      </div>
    );
  }

  const cols = listColumns || ["title"];

  const formFields = (
    <div className="space-y-4">
      {modalError && (
        <div className="rounded-xl border border-rose/40 bg-rose/10 px-4 py-3 text-sm text-rose break-words">
          {modalError}
        </div>
      )}
      {fields.map((f) => (
        <div key={f.name} className="admin-field">
          {f.type === "checkbox" ? (
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={!!editing?.[f.name]}
                onChange={(e) => setEditing({ ...editing, [f.name]: e.target.checked })}
                className="h-4 w-4 accent-[#c9a24b]"
              />
              {f.label}
            </label>
          ) : f.type === "image" || f.type === "images" ? (
            <ImageUploader
              label={f.label}
              multiple={f.type === "images"}
              value={editing?.[f.name]}
              onChange={(v) => setEditing({ ...editing, [f.name]: v })}
            />
          ) : (
            <>
              <label className={ADMIN_LABEL}>
                {f.label}
                {f.name === "title" && <span className="text-rose ml-1">*</span>}
              </label>
              {f.type === "textarea" || f.type === "list" ? (
                <textarea
                  rows={f.type === "list" ? 5 : 3}
                  value={Array.isArray(editing?.[f.name]) ? editing[f.name].join("\n") : editing?.[f.name] || ""}
                  onChange={(e) => setEditing({ ...editing, [f.name]: e.target.value })}
                  placeholder={f.type === "list" ? "One item per line" : ""}
                  className={ADMIN_INPUT}
                />
              ) : f.type === "select" ? (
                <select
                  value={editing?.[f.name] || ""}
                  onChange={(e) => setEditing({ ...editing, [f.name]: e.target.value })}
                  className={ADMIN_INPUT}
                >
                  <option value="">Select…</option>
                  {(f.options || []).map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={f.type === "number" ? "number" : "text"}
                  inputMode={f.type === "number" ? "numeric" : "text"}
                  required={f.name === "title"}
                  value={editing?.[f.name] ?? ""}
                  onChange={(e) => setEditing({ ...editing, [f.name]: e.target.value })}
                  className={ADMIN_INPUT}
                />
              )}
              {f.hint && <p className="admin-muted mt-1">{f.hint}</p>}
            </>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <AdminPageHeader
        title={title}
        action={
          <button
            type="button"
            onClick={() => {
              setModalError("");
              setEditing(blank());
            }}
            className="btn-gold rounded-full px-5 py-2.5 text-sm"
          >
            + Add new
          </button>
        }
      />

      {error && (
        <div className="rounded-xl border border-rose/40 bg-rose/10 px-4 py-3 text-sm text-rose mb-4 break-words">
          {error}
        </div>
      )}

      {loading ? (
        <p className="admin-muted">Loading…</p>
      ) : rows.length === 0 && !error ? (
        <p className="admin-muted">Nothing here yet. Tap “Add new” to create your first item.</p>
      ) : rows.length > 0 ? (
        <div className="glass admin-list">
          {rows.map((r) => {
            const thumb = r.images?.[0] || r.image || r.photo || r.thumbnail;
            return (
              <div key={r.id} className="admin-list-item">
                {thumb && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumb} alt="" className="admin-list-item__media" />
                )}
                <div className="admin-list-item__body">
                  {cols.map((c, idx) => (
                    <p key={c} className={idx === 0 ? "admin-list-item__title" : "admin-list-item__meta"}>
                      {String(r[c] ?? "")}
                      {c === "title" && r.published === false && (
                        <span className="ml-2 text-[10px] uppercase text-marigold">Draft</span>
                      )}
                    </p>
                  ))}
                </div>
                <div className="admin-list-item__actions">
                  <button
                    type="button"
                    onClick={() => {
                      setModalError("");
                      setEditing({ ...r });
                    }}
                    className="admin-btn-ghost flex-1 sm:flex-none"
                  >
                    Edit
                  </button>
                  <button type="button" onClick={() => remove(r.id)} className="admin-btn-danger flex-1 sm:flex-none">
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      <AdminModal
        open={!!editing}
        onClose={() => {
          setEditing(null);
          setModalError("");
        }}
        title={editing?.id ? "Edit item" : "New item"}
        footer={
          <div className="admin-form-actions">
            <button type="button" onClick={save} disabled={saving} className="btn-gold rounded-full px-7 py-3 disabled:opacity-60">
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setModalError("");
              }}
              className="btn-ghost rounded-full px-7 py-3"
            >
              Cancel
            </button>
          </div>
        }
      >
        {editing && formFields}
      </AdminModal>
    </div>
  );
}
