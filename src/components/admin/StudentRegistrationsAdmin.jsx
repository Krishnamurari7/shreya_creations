"use client";

import { GLASS, BTN_PRIMARY, BTN_SECONDARY } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { downloadAdmissionFormPdf, normalizeEnrollment } from "@/lib/admission-form-pdf";

const STATUSES = ["pending", "reviewed", "admitted", "rejected"];

const BATCH_LABELS = {
  morning: "Morning 9–12",
  afternoon: "Afternoon 12–3",
  evening: "Evening 3–6",
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

function money(n) {
  if (n == null || n === "") return null;
  const num = Number(n);
  if (!Number.isFinite(num)) return String(n);
  return `₹${num.toLocaleString("en-IN")}`;
}

function formatDate(d) {
  if (!d) return null;
  const s = String(d);
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
    const [y, m, day] = s.slice(0, 10).split("-");
    return `${day}/${m}/${y}`;
  }
  return s;
}

function Detail({ label, value }) {
  if (value == null || value === "") return null;
  return (
    <p>
      <span className="text-gold/70">{label}: </span>
      {value}
    </p>
  );
}

export default function StudentRegistrationsAdmin() {
  const configured = isSupabaseConfigured();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [toast, setToast] = useState("");
  const [pdfBusyId, setPdfBusyId] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const load = useCallback(async () => {
    if (!configured) return setLoading(false);
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("student_registrations")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setRows(data || []);
    else setToast(error.message);
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

  const downloadPdf = async (row) => {
    try {
      setPdfBusyId(row.id);
      await downloadAdmissionFormPdf(normalizeEnrollment(row));
      showToast("PDF downloaded");
    } catch (err) {
      showToast(err?.message || "Could not create PDF");
    } finally {
      setPdfBusyId("");
    }
  };

  const exportCsv = () => {
    const header = [
      "created_at",
      "form_date",
      "name",
      "phone",
      "whatsapp_phone",
      "email",
      "guardian_name",
      "date_of_birth",
      "gender",
      "address",
      "city",
      "district",
      "state",
      "pin_code",
      "course_name",
      "duration_months",
      "preferred_batch",
      "course_mode",
      "education",
      "experience",
      "sewing_machine",
      "previous_training",
      "documents_submitted",
      "fee_course",
      "fee_discount",
      "fee_total",
      "status",
      "admission_number",
      "is_read",
    ];
    const lines = filtered.map((raw) => {
      const r = normalizeEnrollment(raw);
      return header.map((k) => `"${String(r[k] ?? "").replace(/"/g, '""')}"`).join(",");
    });
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
          {filtered.map((raw) => {
            const r = normalizeEnrollment(raw);
            return (
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
                      {r.admission_number && <span>Adm: {r.admission_number}</span>}
                      {r.locale && <span>{r.locale}</span>}
                      {!r.is_read && <span className="text-orange">Unread</span>}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => downloadPdf(raw)}
                      disabled={pdfBusyId === r.id}
                      className={BTN_PRIMARY}
                    >
                      {pdfBusyId === r.id ? "Preparing…" : "Download PDF"}
                    </button>
                    {telLink(r.phone) && (
                      <a href={telLink(r.phone)} className={BTN_SECONDARY}>
                        Call
                      </a>
                    )}
                    {waLink(r.whatsapp_phone || r.phone) && (
                      <a
                        href={waLink(r.whatsapp_phone || r.phone)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={BTN_SECONDARY}
                      >
                        WhatsApp
                      </a>
                    )}
                    <button type="button" onClick={() => toggleRead(raw)} className={BTN_SECONDARY}>
                      {r.is_read ? "Mark unread" : "Mark read"}
                    </button>
                  </div>
                </div>

                <div className="text-sm mt-3 grid sm:grid-cols-2 gap-x-4 gap-y-1">
                  {r.passport_photo_url ? (
                    <div className="sm:col-span-2 flex items-start gap-3 mb-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={r.passport_photo_url}
                        alt=""
                        className="w-14 h-16 object-cover rounded border border-orange/30 bg-cream"
                      />
                      <span className="admin-muted text-xs self-center">Passport photo attached</span>
                    </div>
                  ) : null}
                  <Detail label="Phone" value={r.phone} />
                  <Detail label="WhatsApp" value={r.whatsapp_phone} />
                  <Detail label="Email" value={r.email} />
                  <Detail label="Guardian" value={r.guardian_name} />
                  <Detail label="DOB" value={formatDate(r.date_of_birth)} />
                  <Detail label="Gender" value={r.gender} />
                  <Detail
                    label="Address"
                    value={
                      [
                        r.address,
                        r.city,
                        r.district,
                        r.state,
                        r.pin_code ? `PIN ${r.pin_code}` : null,
                      ]
                        .filter(Boolean)
                        .join(", ") || null
                    }
                  />
                  <Detail label="Admission date" value={formatDate(r.form_date)} />
                  <Detail
                    label="Duration"
                    value={
                      r.duration_months
                        ? /\d/.test(String(r.duration_months)) && !/month/i.test(String(r.duration_months))
                          ? `${r.duration_months} months`
                          : r.duration_months
                        : null
                    }
                  />
                  <Detail label="Batch" value={BATCH_LABELS[r.preferred_batch] || r.preferred_batch} />
                  <Detail label="Mode" value={r.course_mode} />
                  <Detail label="Education" value={r.education} />
                  <Detail label="Experience" value={r.experience} />
                  <Detail label="Sewing machine" value={r.sewing_machine} />
                  <Detail label="Previous training" value={r.previous_training} />
                  <Detail label="Documents" value={r.documents_submitted} />
                  <Detail label="Course fee" value={money(r.fee_course)} />
                  <Detail label="Discount" value={money(r.fee_discount)} />
                  <Detail label="Final payable" value={money(r.fee_total)} />
                </div>

                {r.message && r.message !== "Declaration accepted: yes" && (
                  <p className="text-sm whitespace-pre-wrap break-words leading-relaxed mt-2 opacity-90">
                    {r.message}
                  </p>
                )}

                <div className="grid sm:grid-cols-2 gap-3 mt-3">
                  <label className="text-xs uppercase tracking-wider text-gold/80">
                    Status
                    <select
                      className="admin-input mt-1 w-full"
                      value={r.status || "pending"}
                      onChange={(e) => saveField(raw, { status: e.target.value })}
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
                          saveField(raw, { admission_number: e.target.value || null });
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
                      if ((r.notes || "") !== e.target.value) saveField(raw, { notes: e.target.value });
                    }}
                    placeholder="Internal notes…"
                  />
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
