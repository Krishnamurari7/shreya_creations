"use client";

import { BTN_PRIMARY, BTN_SECONDARY, GLASS } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { useEffect, useState, useCallback } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { buildPayload, validatePayload, slugify } from "@/lib/admin/buildPayload";
import { revalidateSiteContent } from "@/lib/admin/revalidate";
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

function getMissingColumnFromError(message = "") {
  const match = message.match(/Could not find the '([^']+)' column of '([^']+)'/i);
  if (!match) return null;
  return { column: match[1], table: match[2] };
}

export default function ResourceManager({
  table,
  title,
  subtitle,
  fields,
  sections,
  orderBy = "created_at",
  orderAsc = false,
  orderBySecondary,
  listColumns,
  renderListExtra,
  modalWide = false,
  mergeRows,
  toFormState,
  persistId = "id",
  rowKey = "id",
  canDelete,
  itemLabel = "item",
}) {
  const configured = isSupabaseConfigured();
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modalError, setModalError] = useState("");
  const [activeSection, setActiveSection] = useState(sections?.[0]?.id ?? null);

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

    let q = supabase.from(table).select("*").order(orderBy, { ascending: orderAsc });
    if (orderBySecondary?.col) {
      q = q.order(orderBySecondary.col, { ascending: orderBySecondary.asc ?? true });
    }
    const { data, error: err } = await q;
    if (err) setError(friendlyError(err.message));
    else setRows(mergeRows ? mergeRows(data || []) : data || []);
    setLoading(false);
  }, [table, orderBy, orderAsc, orderBySecondary, configured, mergeRows]);

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

    const recordId = editing[persistId];
    const isUpdate = Boolean(recordId);
    const payload = buildPayload(editing, fields, { isUpdate });
    delete payload.id;
    delete payload[persistId];
    delete payload._dbId;
    delete payload._source;

    if (fields.some((f) => f.name === "slug") && !payload.slug && payload.title) {
      payload.slug = slugify(payload.title);
    }

    if (
      fields.some((f) => f.name === "updated_at") ||
      ["courses", "products", "portfolio", "lookbook_posts"].includes(table)
    ) {
      payload.updated_at = new Date().toISOString();
    }

    const runSave = async (currentPayload) => {
      if (isUpdate) {
        return supabase.from(table).update(currentPayload).eq("id", recordId).select().single();
      }
      const insertPayload = { ...currentPayload };
      delete insertPayload.id;
      return supabase.from(table).insert(insertPayload).select().single();
    };

    const retryPayload = { ...payload };
    const skippedColumns = [];
    let res = await runSave(retryPayload);

    while (res?.error) {
      const missingColumn = getMissingColumnFromError(res.error.message);
      const canRetry =
        missingColumn &&
        missingColumn.table === table &&
        Object.prototype.hasOwnProperty.call(retryPayload, missingColumn.column) &&
        !skippedColumns.includes(missingColumn.column);

      if (!canRetry) break;

      skippedColumns.push(missingColumn.column);
      delete retryPayload[missingColumn.column];
      res = await runSave(retryPayload);

      // Guardrail: prevents endless retries on malformed responses.
      if (skippedColumns.length >= 20) break;
    }

    if (!res?.error && skippedColumns.length > 0) {
      setError(
        `Saved, but your database is missing columns in "${table}": ${skippedColumns.join(", ")}. Run the latest migration to persist those fields too.`,
      );
    }

    setSaving(false);

    if (res.error) {
      setModalError(friendlyError(res.error.message));
      return;
    }

    setEditing(null);
    setModalError("");
    await load();
    const pathMap = {
      courses: ["/courses", "/"],
      products: ["/shop"],
      portfolio: ["/portfolio", "/"],
      lookbook_posts: ["/blog"],
      testimonials: ["/"],
    };
    await revalidateSiteContent(pathMap[table] || []);
  };

  const remove = async (row) => {
    const recordId = typeof row === "object" ? row[persistId] : row;
    if (!recordId) {
      setError(`This ${itemLabel} is demo-only in the database. Edit and save it first to create a record you can delete.`);
      return;
    }
    if (!confirm("Delete this item?")) return;
    const supabase = createClient();
    const { error: err } = await supabase.from(table).delete().eq("id", recordId);
    if (err) setError(friendlyError(err.message));
    else {
      await load();
      await revalidateSiteContent([]);
    }
  };

  if (!configured) {
    return (
      <div>
        <AdminPageHeader title={title} subtitle={subtitle} />
        <div className={cn(GLASS, "rounded-2xl", "p-5", "sm:p-6", "text-marigold", "border", "border-marigold/30", "text-sm", "leading-relaxed")}>
          Connect Supabase (see README) to add, edit and delete {title.toLowerCase()}.
        </div>
      </div>
    );
  }

  const cols = listColumns || ["title"];

  const visibleFields = sections?.length
    ? fields.filter((f) => {
        const section = sections.find((s) => s.id === activeSection);
        return section?.fields?.includes(f.name);
      })
    : fields;

  const formFields = (
    <div className="space-y-4">
      {sections?.length > 1 && (
        <div className="admin-tabs" role="tablist" aria-label="Form sections">
          {sections.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={activeSection === s.id}
              className={`admin-tab ${activeSection === s.id ? "is-active" : ""}`}
              onClick={() => setActiveSection(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
      {modalError && (
        <div className="rounded-xl border border-rose/40 bg-rose/10 px-4 py-3 text-sm text-rose break-words">
          {modalError}
        </div>
      )}
      {visibleFields.map((f) => (
        <div key={f.name} className="admin-field">
          {f.type === "checkbox" ? (
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={!!editing?.[f.name]}
                onChange={(e) => setEditing({ ...editing, [f.name]: e.target.checked })}
                className="h-4 w-4 accent-[#E65A05]"
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
        subtitle={subtitle}
        action={
          <button
            type="button"
            onClick={() => {
              setModalError("");
              setActiveSection(sections?.[0]?.id ?? null);
              setEditing(blank());
            }}
            className={BTN_PRIMARY}
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
        <div className={cn(GLASS, "admin-list")}>
          {rows.map((r) => {
            const thumb = r.images?.[0] || r.image || r.photo || r.thumbnail;
            const listKey = r[rowKey] ?? r.id ?? r.slug;
            const deletable = canDelete ? canDelete(r) : Boolean(r[persistId]);
            return (
              <div key={listKey} className="admin-list-item">
                {thumb && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumb} alt="" className="admin-list-item__media" />
                )}
                <div className="admin-list-item__body">
                  {cols.map((c, idx) => (
                    <p key={c} className={idx === 0 ? "admin-list-item__title" : "admin-list-item__meta"}>
                      {c === "price" && r[c] != null
                        ? `₹${Number(r[c]).toLocaleString("en-IN")}`
                        : String(r[c] ?? "")}
                      {c === "title" && r.published === false && (
                        <span className="ml-2 text-[10px] uppercase text-marigold">Draft</span>
                      )}
                      {c === "title" && r._source === "seed" && (
                        <span className="ml-2 text-[10px] uppercase text-lavender/80">Seed</span>
                      )}
                    </p>
                  ))}
                  {renderListExtra?.(r)}
                </div>
                <div className="admin-list-item__actions">
                  <button
                    type="button"
                    onClick={() => {
                      setModalError("");
                      setActiveSection(sections?.[0]?.id ?? null);
                      setEditing(toFormState ? toFormState(r) : { ...r });
                    }}
                    className="admin-btn-ghost flex-1 sm:flex-none"
                  >
                    Edit
                  </button>
                  {deletable ? (
                    <button type="button" onClick={() => remove(r)} className="admin-btn-danger flex-1 sm:flex-none">
                      Delete
                    </button>
                  ) : null}
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
        title={
          editing?.[persistId]
            ? `Edit ${itemLabel}`
            : editing?.slug
              ? `Save ${itemLabel}`
              : `New ${itemLabel}`
        }
        panelClassName={modalWide ? "admin-modal__panel--wide" : ""}
        footer={
          <div className="admin-form-actions">
            <button type="button" onClick={save} disabled={saving} className={BTN_PRIMARY}>
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setModalError("");
              }}
              className={BTN_SECONDARY}
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
