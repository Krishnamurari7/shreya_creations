"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { createClient } from "@/lib/supabase/client";

const STATUSES = ["New", "Reviewing", "Interview", "Selected", "Rejected"];
const input = "admin-input w-full";
const card = "rounded-2xl border border-ink/15 bg-surface p-4 sm:p-5";
const formatDate = (date) => date ? new Date(date).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—";

function Detail({ label, value }) {
  return <div><dt className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</dt><dd className="mt-1 break-words text-sm text-ink">{value || "—"}</dd></div>;
}

export default function CareerApplicationsAdmin() {
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [note, setNote] = useState("");

  const load = useCallback(async () => {
    const db = createClient();
    if (!db) { setFeedback("Supabase is not configured."); setLoading(false); return; }
    const { data, error } = await db.from("career_applications").select("*").order("created_at", { ascending: false }).limit(300);
    if (error) setFeedback(error.message);
    else setItems(data || []);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);
  const selected = items.find((item) => item.id === selectedId);
  const filtered = useMemo(() => items.filter((item) => {
    const q = search.toLowerCase().trim();
    return (!statusFilter || item.status === statusFilter) && (!q ||
      [item.full_name, item.email, item.phone, item.city, item.preferred_role, item.opportunity].some((value) => value?.toLowerCase().includes(q)));
  }), [items, search, statusFilter]);

  async function update(changes) {
    if (!selected) return;
    setBusy(true); setFeedback("");
    const db = createClient();
    const { error } = await db.from("career_applications").update(changes).eq("id", selected.id);
    if (error) setFeedback(error.message);
    else { setFeedback("Application updated."); await load(); }
    setBusy(false);
  }
  async function downloadResume() {
    if (!selected) return;
    setBusy(true); setFeedback("");
    const db = createClient();
    const { data, error } = await db.storage.from("career-resumes").createSignedUrl(selected.resume_path, 60, { download: selected.resume_filename });
    if (error || !data?.signedUrl) setFeedback(error?.message || "Could not open resume.");
    else {
      const link = document.createElement("a");
      link.href = data.signedUrl;
      link.download = selected.resume_filename;
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
    setBusy(false);
  }
  async function deleteApplication() {
    if (!selected || !window.confirm(`Permanently delete ${selected.full_name}'s application and resume?`)) return;
    setBusy(true); setFeedback("");
    try {
      const response = await fetch(`/api/admin/career-applications/${selected.id}`, { method: "DELETE" });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Could not delete application.");
      setSelectedId(null); setNote(""); setFeedback("Application and resume deleted."); await load();
    } catch (error) { setFeedback(error.message || "Could not delete application."); }
    finally { setBusy(false); }
  }

  return <div>
    <AdminPageHeader title="Career Applications" subtitle="Internship and job applications sent directly to Shreya Creation." />
    <div className="mb-6 grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem]">
      <input className={input} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, phone, city or role" aria-label="Search applications" />
      <select className={input} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by status"><option value="">All statuses</option>{STATUSES.map((status) => <option key={status}>{status}</option>)}</select>
    </div>
    {feedback && <p role="status" className="mb-5 rounded-xl border border-orange/20 bg-orange/5 p-3 text-sm">{feedback}</p>}
    {loading ? <p className="admin-muted">Loading applications…</p> : <div className="grid gap-6 xl:grid-cols-[minmax(0,.44fr)_minmax(0,.56fr)]">
      <div className="space-y-3" aria-label="Applications">
        {filtered.length === 0 && <p className="admin-muted">No matching applications.</p>}
        {filtered.map((item) => <button key={item.id} type="button" onClick={() => { setSelectedId(item.id); setNote(item.admin_notes || ""); }} className={`${card} w-full text-left transition hover:border-orange/50 ${selectedId === item.id ? "border-orange" : ""}`}>
          <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-display text-xl">{item.full_name}</h2><span className="rounded-full border border-orange/30 px-3 py-1 text-xs font-semibold text-orange">{item.status}</span></div>
          <p className="mt-1 text-sm text-muted">{item.opportunity} · {item.preferred_role}</p>
          <p className="mt-2 text-xs text-muted">{item.city} · {formatDate(item.created_at)}</p>
        </button>)}
        {items.length >= 300 && <p className="text-xs text-muted">Showing the latest 300 applications.</p>}
      </div>
      {selected && <section className={`${card} h-fit space-y-6 xl:sticky xl:top-24`} aria-label={`Application from ${selected.full_name}`}>
        <div><p className="text-xs font-semibold uppercase tracking-wide text-orange">{selected.opportunity} application</p><h2 className="mt-1 font-display text-2xl">{selected.full_name}</h2><p className="mt-1 text-sm text-muted">Received {formatDate(selected.created_at)}</p></div>
        <dl className="grid gap-4 border-y border-ink/10 py-5 sm:grid-cols-2">
          <Detail label="Email" value={<a href={`mailto:${selected.email}`} className="text-orange underline">{selected.email}</a>} />
          <Detail label="Phone" value={<a href={`tel:${selected.phone}`} className="text-orange underline">{selected.phone}</a>} />
          <Detail label="City" value={selected.city} /><Detail label="Area of interest" value={selected.preferred_role} />
          <Detail label="Experience / skills" value={selected.experience} />
          <Detail label="Portfolio" value={selected.portfolio_url && <a href={selected.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-orange underline">Open portfolio</a>} />
          <div className="sm:col-span-2"><Detail label="Applicant note" value={selected.message} /></div>
          <Detail label="Consent recorded" value={formatDate(selected.consent_to_process_at)} />
        </dl>
        <button type="button" disabled={busy} onClick={downloadResume} className="rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-dark disabled:opacity-50">Download resume · {selected.resume_filename}</button>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold">Status<select className={`${input} mt-2`} value={selected.status} disabled={busy} onChange={(e) => update({ status: e.target.value })}>{STATUSES.map((status) => <option key={status}>{status}</option>)}</select></label>
          <div className="text-sm text-muted sm:self-end">Updated {formatDate(selected.updated_at)}</div>
        </div>
        <div><label htmlFor="career-admin-note" className="text-sm font-semibold">Private admin notes</label><textarea id="career-admin-note" className={`${input} mt-2`} rows={4} maxLength={2000} value={note} onChange={(e) => setNote(e.target.value)} /><button type="button" disabled={busy || note === (selected.admin_notes || "")} onClick={() => update({ admin_notes: note.trim() || null })} className="mt-3 rounded-full border border-orange px-5 py-2 text-sm font-semibold text-orange hover:bg-orange/10 disabled:opacity-50">Save note</button></div>
        <div className="border-t border-ink/10 pt-5"><button type="button" disabled={busy} onClick={deleteApplication} className="rounded-full border border-red-300 px-5 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50">Delete application and resume</button></div>
      </section>}
    </div>}
  </div>;
}
