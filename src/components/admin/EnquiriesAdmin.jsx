"use client";

import { GLASS, BTN_PRIMARY, BTN_SECONDARY } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

const TYPES = ["contact", "demo", "brochure", "order"];

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

export default function EnquiriesAdmin() {
  const configured = isSupabaseConfigured();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [toast, setToast] = useState("");

  const load = useCallback(async () => {
    if (!configured) return setLoading(false);
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("contact_inquiries")
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
      const type = r.inquiry_type || r.source || "";
      if (filterType && !type.includes(filterType)) return false;
      if (filterFrom) {
        const d = new Date(r.created_at);
        const from = new Date(filterFrom);
        if (d < from) return false;
      }
      return true;
    });
  }, [rows, filterType, filterFrom]);

  const unread = rows.filter((r) => !r.is_read).length;

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const toggleRead = async (row) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("contact_inquiries")
      .update({ is_read: !row.is_read, updated_at: new Date().toISOString() })
      .eq("id", row.id);
    if (error) showToast(error.message);
    else {
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, is_read: !row.is_read } : r)));
      showToast(!row.is_read ? "Marked read" : "Marked unread");
    }
  };

  const saveNotes = async (row, notes) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("contact_inquiries")
      .update({ notes, updated_at: new Date().toISOString() })
      .eq("id", row.id);
    if (error) showToast(error.message);
    else {
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, notes } : r)));
      showToast("Notes saved");
    }
  };

  const exportCsv = () => {
    const header = ["created_at", "name", "phone", "email", "type", "source", "message", "is_read"];
    const lines = filtered.map((r) =>
      header
        .map((k) => {
          const v = r[k] ?? r.inquiry_type ?? "";
          return `"${String(v).replace(/"/g, '""')}"`;
        })
        .join(",")
    );
    const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  if (!configured) {
    return (
      <div>
        <AdminPageHeader title="Enquiries" />
        <div className={cn(GLASS, "rounded-2xl", "p-5", "text-marigold", "border", "border-marigold/30", "text-sm")}>
          Connect Supabase to view submissions.
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Enquiries"
        subtitle={`${unread} unread · ${rows.length} total`}
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
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="admin-input max-w-[10rem]"
        >
          <option value="">All types</option>
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
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
        <button type="button" onClick={() => { setFilterType(""); setFilterFrom(""); }} className={BTN_SECONDARY}>
          Clear filters
        </button>
      </div>

      {loading ? (
        <p className="admin-muted">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="admin-muted">No enquiries yet.</p>
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
                    <span className="uppercase tracking-wider">{r.inquiry_type || r.source || "contact"}</span>
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

              <div className="text-sm mt-2 space-y-1">
                {r.phone && <p>📱 {r.phone}</p>}
                {r.email && <p>✉ {r.email}</p>}
                {r.preferred_date && <p>📅 {r.preferred_date}</p>}
              </div>

              {r.message && (
                <p className="text-sm whitespace-pre-wrap break-words leading-relaxed mt-2">{r.message}</p>
              )}

              <label className="block mt-3 text-xs uppercase tracking-wider text-gold/80">
                Notes
                <textarea
                  className="admin-input mt-1 w-full"
                  rows={2}
                  defaultValue={r.notes || ""}
                  onBlur={(e) => {
                    if ((r.notes || "") !== e.target.value) saveNotes(r, e.target.value);
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
