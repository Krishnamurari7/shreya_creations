"use client";

import { GLASS, BTN_PRIMARY, BTN_SECONDARY } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

const STATUSES = ["pending", "reviewed", "admitted", "rejected"];

const BATCH_LABELS = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  any: "Flexible",
};

function waLink(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (digits.length < 10) return null;
  return `https://wa.me/91${digits.slice(-10)}`;
}

function telLink(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (digits.length < 10) return null;
  return `tel:+91${digits.slice(-10)}`;
}

export default function StudentRegistrationsAdmin() {
  const configured = isSupabaseConfigured();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [toast, setToast] = useState("");

  const load = useCallback(async () => {
    if (!configured) return setLoading(false);
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("student_registrations")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setRows(data || []);
    setLoading(false);
  }, [configured]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (filterStatus && r.status !== filterStatus) return false;
      if (filterFrom) {
        const d = new Date(r.created_at);
        const from = new Date(filterFrom);
        if (d < from) return false;
      }
      return true;
    });
  }, [rows, filterStatus, filterFrom]);

  const unread = rows.filter((r) => !r.is_read).length;

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const toggleRead = async (row) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("student_registrations")
      .update({ is_read: !row.is_read, updated_at: new Date().toISOString() })
      .eq("id", row.id);
    if (error) showToast(error.message);
    else {
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, is_read: !row.is_read } : r)));
      showToast(!row.is_read ? "Marked read" : "Marked unread");
    }
  };

  const saveField = async (row, fields) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("student_registrations")
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq("id", row.id);
    if (error) showToast(error.message);
    else {
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, ...fields } : r)));
      showToast("Saved");
    }
  };

  const exportCsv = () => {
    const header = [
      "created_at",
      "name",
      "phone",
      "email",
      "course_name",
      "preferred_batch",
      "city",
      "education",
      "status",
      "admission_number",
      "is_read",
    ];
    const lines = filtered.map((r) =>
      header
        .map((k) => `"${String(r[k] ?? "").replace(/"/g, '""')}"`)
        .join(",")
    );
    const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `student-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  if (!configured) {
    return (
      <div>
        <AdminPageHeader title="Student registrations" />
        <div className={cn(GLASS, "rounded-2xl", "p-5", "text-marigold", "border", "border-marigold/30", "text-sm")}>
          Connect Supabase and run the student_registrations migration to view submissions.
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Student registrations"
        subtitle={`${unread} unread · ${rows.length} total admission forms`}
        action={
          <button type="button" onClick={exportCsv} className={BTN_SECONDARY}>
            Export CSV
          </button>
        }
      />

      {toast && (
        <div className="mb-4 rounded-xl border border-orange/30 bg-orange/10 px-4 py-2 text-sm text-orange-light">
          {toast}
        </div>
      )}

      <div className={cn(GLASS, "rounded-2xl", "p-4", "mb-4", "flex", "flex-wrap", "gap-3")}>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="admin-input max-w-[10rem]"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={filterFrom}
          onChange={(e) => setFilterFrom(e.target.value)}
          className="admin-input max-w-[11rem]"
          aria-label="From date"
        />
        <button
          type="button"
          onClick={() => {
            setFilterStatus("");
            setFilterFrom("");
          }}
          className={BTN_SECONDARY}
        >
          Clear filters
        </button>
      </div>

      {loading ? (
        <p className="admin-muted">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="admin-muted">No student registrations yet.</p>
      ) : (
        <ul className="space-y-3 sm:space-y-4">
          {filtered.map((r) => (
            <li
              key={r.id}
              className={cn(GLASS, "rounded-2xl", "p-4", "sm:p-5", !r.is_read && "border-orange/40")}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="admin-inquiry-meta">
                    <span className="font-medium">{r.name}</span>
                    <span>{new Date(r.created_at).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs admin-muted mt-1">
                    <span className="uppercase tracking-wider">{r.status || "pending"}</span>
                    <span>{r.course_name}</span>
                    {r.locale && <span>{r.locale}</span>}
                    {!r.is_read && <span className="text-orange">Unread</span>}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {telLink(r.phone) && (
                    <a href={telLink(r.phone)} className={BTN_SECONDARY}>
                      Call
                    </a>
                  )}
                  {waLink(r.phone) && (
                    <a href={waLink(r.phone)} target="_blank" rel="noopener noreferrer" className={BTN_PRIMARY}>
                      WhatsApp
                    </a>
                  )}
                  <button type="button" onClick={() => toggleRead(r)} className={BTN_SECONDARY}>
                    {r.is_read ? "Mark unread" : "Mark read"}
                  </button>
                </div>
              </div>

              <div className="text-sm mt-2 grid sm:grid-cols-2 gap-x-4 gap-y-1">
                {r.phone && <p>📱 {r.phone}</p>}
                {r.email && <p>✉ {r.email}</p>}
                {r.address && <p className="sm:col-span-2">📍 {r.address}{r.city ? `, ${r.city}` : ""}</p>}
                {r.date_of_birth && <p>🎂 {r.date_of_birth}</p>}
                {r.gender && <p>Gender: {r.gender}</p>}
                {r.preferred_batch && <p>Batch: {BATCH_LABELS[r.preferred_batch] || r.preferred_batch}</p>}
                {r.education && <p>Education: {r.education}</p>}
                {r.guardian_name && <p>Guardian: {r.guardian_name}</p>}
                {r.aadhaar_last4 && <p>Aadhaar: •••• {r.aadhaar_last4}</p>}
                {r.referral_source && <p>Referral: {r.referral_source}</p>}
              </div>

              {r.message && (
                <p className="text-sm whitespace-pre-wrap break-words leading-relaxed mt-2">{r.message}</p>
              )}

              <div className="grid sm:grid-cols-2 gap-3 mt-3">
                <label className="text-xs uppercase tracking-wider text-gold/80">
                  Status
                  <select
                    className="admin-input mt-1 w-full"
                    value={r.status || "pending"}
                    onChange={(e) => saveField(r, { status: e.target.value })}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-xs uppercase tracking-wider text-gold/80">
                  Admission number
                  <input
                    className="admin-input mt-1 w-full"
                    defaultValue={r.admission_number || ""}
                    onBlur={(e) => {
                      if ((r.admission_number || "") !== e.target.value) {
                        saveField(r, { admission_number: e.target.value || null });
                      }
                    }}
                    placeholder="e.g. SC-2026-042"
                  />
                </label>
              </div>

              <label className="block mt-3 text-xs uppercase tracking-wider text-gold/80">
                Notes
                <textarea
                  className="admin-input mt-1 w-full"
                  rows={2}
                  defaultValue={r.notes || ""}
                  onBlur={(e) => {
                    if ((r.notes || "") !== e.target.value) saveField(r, { notes: e.target.value });
                  }}
                  placeholder="Internal notes…"
                />
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
