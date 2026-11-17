"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MATCH_STAGES, REQUEST_STATUSES } from "@/lib/hiring";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

const button = "rounded-xl border border-orange px-4 py-2 text-sm font-semibold text-orange hover:bg-orange/10 disabled:opacity-50";
const primary = "rounded-xl bg-orange px-4 py-2 text-sm font-semibold text-white hover:bg-orange-dark disabled:opacity-50";
const input = "admin-input w-full";
const card = "rounded-2xl border border-ink/15 bg-surface p-4 sm:p-5";
const initialCandidate = { reference_code: "", display_name: "", contact_phone: "", city: "", role_skills: "", experience_note: "", processConsent: false, shareConsent: false };

function Info({ label, value }) { return <div><dt className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</dt><dd className="mt-1 break-words text-sm text-ink">{value === null || value === undefined || value === "" ? "—" : value}</dd></div>; }
function DateText({ value }) { return value ? new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—"; }

export default function EmployerStaffRequestsAdmin({ userId }) {
  const [requests, setRequests] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [filters, setFilters] = useState({ search: "", role: "", city: "", experience: "", staff: "", status: "", from: "" });
  const [note, setNote] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [candidateForm, setCandidateForm] = useState(initialCandidate);
  const [matchCandidateId, setMatchCandidateId] = useState("");
  const [matchRationale, setMatchRationale] = useState("");
  const [interviewForms, setInterviewForms] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    const db = createClient();
    if (!db) { setMessage("Supabase is not configured."); setLoading(false); return; }
    const [requestResult, candidateResult, adminResult] = await Promise.all([
      db.from("employer_staff_requests").select("*, employer_request_positions(*), employer_request_consents(*), request_internal_notes(*), request_status_history(*), request_candidate_matches(*, recruitment_candidates(*), request_interviews(*))").order("created_at", { ascending: false }),
      db.from("recruitment_candidates").select("*").order("created_at", { ascending: false }),
      db.from("admins").select("user_id,email,role").order("email"),
    ]);
    if (requestResult.error) setMessage(`Unable to load requests: ${requestResult.error.message}. Apply the recruitment migration to the existing Supabase project.`);
    else setRequests(requestResult.data || []);
    if (candidateResult.error) setMessage((old) => old || `Unable to load candidate references: ${candidateResult.error.message}`);
    else setCandidates(candidateResult.data || []);
    if (!adminResult.error) setAdmins(adminResult.data || []);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const selected = requests.find((r) => r.id === selectedId);
  const filtered = useMemo(() => requests.filter((r) => {
    const positions = r.employer_request_positions || [];
    const q = filters.search.toLowerCase();
    if (q && !`${r.request_id} ${r.company_name} ${r.contact_name} ${r.mobile}`.toLowerCase().includes(q)) return false;
    if (filters.role && !positions.some((p) => `${p.role} ${p.custom_role || ""}`.toLowerCase().includes(filters.role.toLowerCase()))) return false;
    if (filters.city && !r.work_city?.toLowerCase().includes(filters.city.toLowerCase())) return false;
    if (filters.experience && !positions.some((p) => p.experience?.toLowerCase().includes(filters.experience.toLowerCase()))) return false;
    if (filters.staff && r.total_staff < Number(filters.staff)) return false;
    if (filters.status && r.status !== filters.status) return false;
    if (filters.from && r.created_at.slice(0, 10) < filters.from) return false;
    return true;
  }), [requests, filters]);

  async function mutate(task, success) {
    setBusy(true); setMessage("");
    try {
      const { error } = await task(createClient());
      if (error) throw error;
      setMessage(success); await load(); return true;
    } catch (error) { setMessage(error.message || "Could not save changes."); return false; }
    finally { setBusy(false); }
  }
  const updateRequest = (changes) => mutate((db) => db.from("employer_staff_requests").update(changes).eq("id", selected.id), "Request updated.");
  const createNote = async () => { if (!note.trim()) return; if (await mutate((db) => db.from("request_internal_notes").insert({ request_id: selected.id, author_user: userId, note: note.trim(), follow_up_at: followUp || null }), "Internal note saved.")) { setNote(""); setFollowUp(""); } };
  const createCandidate = async () => {
    if (!candidateForm.processConsent || !candidateForm.reference_code.trim() || !candidateForm.display_name.trim()) { setMessage("Candidate reference, name, and permission to process are required."); return; }
    const saved = await mutate((db) => db.from("recruitment_candidates").insert({
      reference_code: candidateForm.reference_code.trim(), display_name: candidateForm.display_name.trim(), contact_phone: candidateForm.contact_phone.trim() || null,
      city: candidateForm.city.trim() || null, role_skills: candidateForm.role_skills.trim() || null, experience_note: candidateForm.experience_note.trim() || null,
      consent_to_process_at: new Date().toISOString(), consent_to_share_at: candidateForm.shareConsent ? new Date().toISOString() : null,
    }), "Candidate reference saved.");
    if (saved) setCandidateForm(initialCandidate);
  };
  const createMatch = async () => {
    if (!matchCandidateId) { setMessage("Choose a candidate reference."); return; }
    if (await mutate((db) => db.from("request_candidate_matches").insert({ request_id: selected.id, candidate_id: matchCandidateId, rationale: matchRationale.trim() || null }), "Candidate matched.")) { setMatchCandidateId(""); setMatchRationale(""); }
  };
  const updateMatch = (id, changes) => mutate((db) => db.from("request_candidate_matches").update(changes).eq("id", id), "Match updated.");
  const createInterview = async (matchId) => {
    const form = interviewForms[matchId] || {};
    if (!form.scheduled_at) { setMessage("Choose an interview date and time."); return; }
    if (await mutate((db) => db.from("request_interviews").insert({ match_id: matchId, scheduled_at: new Date(form.scheduled_at).toISOString(), location_or_link: form.location_or_link || null, assessment: form.assessment || null, outcome: "Scheduled", created_by: userId }), "Interview scheduled.")) setInterviewForms((old) => ({ ...old, [matchId]: {} }));
  };
  const interviewField = (matchId, key, value) => setInterviewForms((old) => ({ ...old, [matchId]: { ...old[matchId], [key]: value } }));

  if (loading && !requests.length) return <div><AdminPageHeader title="Employer Staff Requests" /><p className="admin-muted">Loading requests…</p></div>;
  return <div className="space-y-5">
    <AdminPageHeader title="Employer Staff Requests" subtitle={`${requests.length} total requests`} />
    {message && <p role="status" className="rounded-xl border border-orange/30 bg-orange/10 p-3 text-sm text-ink">{message}</p>}
    {selected ? <>
      <button type="button" className={button} onClick={() => setSelectedId(null)}>← Back to requests</button>
      <section className={card}><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-wider text-orange">{selected.request_id}</p><h2 className="mt-1 font-display text-2xl text-ink">{selected.company_name}</h2><p className="text-sm text-muted">Submitted <DateText value={selected.created_at} /></p></div><div className="flex flex-wrap gap-3">
        <label className="text-xs text-muted">Status<select className={`${input} mt-1`} value={selected.status} disabled={busy} onChange={(e) => updateRequest({ status: e.target.value })}>{REQUEST_STATUSES.map((s) => <option key={s}>{s}</option>)}</select></label>
        <label className="text-xs text-muted">Assigned team member<select className={`${input} mt-1`} value={selected.assigned_hr_user || ""} disabled={busy} onChange={(e) => updateRequest({ assigned_hr_user: e.target.value || null })}><option value="">Unassigned</option>{admins.map((a) => <option key={a.user_id} value={a.user_id}>{a.email} ({a.role})</option>)}</select></label>
      </div></div></section>
      <section className={card}><h3 className="mb-4 font-display text-xl">Employer details</h3><dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Info label="Business type" value={selected.business_type === "Other" ? selected.business_type_other : selected.business_type} /><Info label="Contact person" value={selected.contact_name} /><Info label="Owner" value={selected.owner_name} /><Info label="Mobile" value={selected.mobile} /><Info label="WhatsApp" value={selected.whatsapp} /><Info label="Email" value={selected.email} /><Info label="Website" value={selected.website} /><Info label="Address" value={selected.business_address} /><Info label="City / State / PIN" value={`${selected.business_city}, ${selected.business_state} ${selected.pin_code}`} />
      </dl></section>
      <section className={card}><h3 className="mb-4 font-display text-xl">Staff positions · {selected.total_staff} people</h3><div className="grid gap-3 lg:grid-cols-2">{(selected.employer_request_positions || []).map((p) => <div key={p.id} className="rounded-xl border border-ink/10 p-4"><h4 className="font-semibold">{p.role === "Other" ? p.custom_role : p.role} · {p.quantity}</h4><dl className="mt-3 grid grid-cols-2 gap-3"><Info label="Experience" value={p.experience} /><Info label="Skills" value={p.skills} /><Info label="Monthly salary" value={`${p.salary_min == null ? "—" : `₹${p.salary_min}`} – ${p.salary_max == null ? "—" : `₹${p.salary_max}`}`} /><Info label="Negotiable" value={p.negotiable ? "Yes" : "No"} /></dl></div>)}</div></section>
      <section className={card}><h3 className="mb-4 font-display text-xl">Workplace and conditions</h3><dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><Info label="Work address" value={selected.work_address} /><Info label="City / State" value={`${selected.work_city}, ${selected.work_state}`} /><Info label="Workplace type" value={selected.workplace_type === "Other" ? selected.workplace_type_other : selected.workplace_type} /><Info label="Employment" value={selected.employment_type} /><Info label="Expected joining" value={selected.joining_date} /><Info label="Working hours" value={selected.working_hours} /><Info label="Weekly off" value={selected.weekly_off} /><Info label="Accommodation" value={selected.accommodation ? "Yes" : "No"} /><Info label="Food" value={selected.food ? "Yes" : "No"} /><Info label="Benefits" value={selected.benefits} /><Info label="Additional requirements" value={selected.details} /></dl></section>
      <section className={card}><h3 className="mb-4 font-display text-xl">Consent record</h3>{selected.employer_request_consents ? <dl className="grid gap-4 sm:grid-cols-2"><Info label="Accuracy confirmed" value={selected.employer_request_consents.accuracy_confirmed ? "Yes" : "No"} /><Info label="Terms accepted" value={selected.employer_request_consents.terms_accepted ? "Yes" : "No"} /><Info label="Contact consent" value={selected.employer_request_consents.contact_consent ? "Yes" : "No"} /><Info label="Terms version" value={selected.employer_request_consents.terms_version} /><Info label="Accepted at" value={<DateText value={selected.employer_request_consents.accepted_at} />} /></dl> : <p className="text-sm text-muted">Consent record unavailable.</p>}</section>
      <section className={card}><h3 className="mb-4 font-display text-xl">Internal notes and follow-ups</h3><div className="space-y-2">{(selected.request_internal_notes || []).slice().sort((a,b) => b.created_at.localeCompare(a.created_at)).map((n) => <div key={n.id} className="rounded-xl border border-ink/10 p-3 text-sm"><p className="whitespace-pre-wrap">{n.note}</p><p className="mt-2 text-xs text-muted"><DateText value={n.created_at} /> · {admins.find((a) => a.user_id === n.author_user)?.email || "Team"}{n.follow_up_at && <> · Follow up <DateText value={n.follow_up_at} /></>}</p></div>)}</div><div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]"><textarea className={input} rows={2} placeholder="Internal note" aria-label="Internal note" value={note} onChange={(e) => setNote(e.target.value)} /><div><label className="text-xs text-muted">Follow up (optional)<input type="datetime-local" className={`${input} mt-1`} value={followUp} onChange={(e) => setFollowUp(e.target.value)} /></label><button type="button" className={`${primary} mt-2 w-full`} disabled={busy || !note.trim()} onClick={createNote}>Save note</button></div></div></section>
      <section className={card}><h3 className="mb-2 font-display text-xl">Candidate matching</h3><p className="mb-4 text-sm text-muted">Private candidate records are visible only to authorized admin team members. Record candidate permission before sharing a profile with an employer.</p>
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]"><select className={input} value={matchCandidateId} onChange={(e) => setMatchCandidateId(e.target.value)} aria-label="Candidate reference"><option value="">Choose candidate</option>{candidates.filter((c) => !(selected.request_candidate_matches || []).some((m) => m.candidate_id === c.id)).map((c) => <option key={c.id} value={c.id}>{c.reference_code} · {c.display_name} · {c.city || "City unknown"}</option>)}</select><input className={input} placeholder="Matching rationale" aria-label="Matching rationale" value={matchRationale} onChange={(e) => setMatchRationale(e.target.value)} /><button type="button" className={primary} disabled={busy} onClick={createMatch}>Add match</button></div>
        <div className="mt-5 space-y-4">{(selected.request_candidate_matches || []).map((m) => <div key={m.id} className="rounded-xl border border-ink/15 p-4"><div className="flex flex-wrap justify-between gap-3"><div><p className="font-semibold">{m.recruitment_candidates?.reference_code} · {m.recruitment_candidates?.display_name}</p><p className="text-sm text-muted">{m.recruitment_candidates?.city || ""} · {m.recruitment_candidates?.role_skills || "Skills not recorded"}</p><p className="mt-1 text-xs text-muted">{m.rationale || "No rationale recorded"}</p></div><label className="text-xs text-muted">Stage<select className={`${input} mt-1`} value={m.stage} disabled={busy} onChange={(e) => updateMatch(m.id, { stage: e.target.value })}>{MATCH_STAGES.map((s) => <option key={s}>{s}</option>)}</select></label></div>
          <div className="mt-4 flex flex-wrap gap-2"><span className="text-xs text-muted">Profile disclosure: {m.disclosed_at ? `Recorded ${new Date(m.disclosed_at).toLocaleDateString("en-IN")}` : m.recruitment_candidates?.consent_to_share_at ? "Permission recorded" : "Candidate permission not recorded"}</span>{!m.disclosed_at && m.recruitment_candidates?.consent_to_share_at && <button type="button" className={button} disabled={busy} onClick={() => updateMatch(m.id, { disclosed_at: new Date().toISOString(), disclosed_by: userId })}>Record profile disclosure</button>}</div>
          <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto_auto]"><input className={input} defaultValue={m.offer_details || ""} placeholder="Offer / placement terms" aria-label="Offer and placement terms" id={`offer-${m.id}`} /><input className={input} type="date" defaultValue={m.joining_date || ""} aria-label="Joining date" id={`joining-${m.id}`} /><button type="button" className={button} disabled={busy} onClick={() => updateMatch(m.id, { offer_details: document.getElementById(`offer-${m.id}`).value || null, joining_date: document.getElementById(`joining-${m.id}`).value || null })}>Save placement</button></div>
          <div className="mt-4 border-t border-ink/10 pt-4"><h4 className="font-semibold">Interviews & assessments</h4>{(m.request_interviews || []).map((v) => <div key={v.id} className="mt-3 rounded-lg border border-ink/10 p-3 text-sm"><p><DateText value={v.scheduled_at} /> · {v.location_or_link || "Location pending"}</p><p className="text-muted">{v.assessment || "No assessment details"}</p><div className="mt-2 grid gap-2 sm:grid-cols-[1fr_auto_auto]"><input className={input} defaultValue={v.feedback || ""} placeholder="Interview feedback" aria-label="Interview feedback" id={`feedback-${v.id}`} /><select className={input} defaultValue={v.outcome || "Scheduled"} aria-label="Interview outcome" id={`outcome-${v.id}`}>{["Scheduled","Completed","Passed","Not Selected","Cancelled"].map((o) => <option key={o}>{o}</option>)}</select><button type="button" className={button} disabled={busy} onClick={() => mutate((db) => db.from("request_interviews").update({ feedback: document.getElementById(`feedback-${v.id}`).value, outcome: document.getElementById(`outcome-${v.id}`).value }).eq("id", v.id), "Interview updated.")}>Save</button></div></div>)}
            <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]"><input type="datetime-local" className={input} aria-label="Interview date and time" value={interviewForms[m.id]?.scheduled_at || ""} onChange={(e) => interviewField(m.id, "scheduled_at", e.target.value)} /><input className={input} placeholder="Location or meeting link" aria-label="Interview location or link" value={interviewForms[m.id]?.location_or_link || ""} onChange={(e) => interviewField(m.id, "location_or_link", e.target.value)} /><input className={input} placeholder="Assessment plan" aria-label="Assessment plan" value={interviewForms[m.id]?.assessment || ""} onChange={(e) => interviewField(m.id, "assessment", e.target.value)} /><button type="button" className={primary} disabled={busy} onClick={() => createInterview(m.id)}>Schedule</button></div>
          </div></div>)}</div>
      </section>
      <section className={card}><h3 className="mb-4 font-display text-xl">Status history</h3><ol className="space-y-2">{(selected.request_status_history || []).slice().sort((a,b) => b.created_at.localeCompare(a.created_at)).map((h) => <li key={h.id} className="text-sm"><span className="font-semibold">{h.previous_status ? `${h.previous_status} → ` : ""}{h.current_status}</span><span className="ml-2 text-muted"><DateText value={h.created_at} /> · {admins.find((a) => a.user_id === h.actor_user)?.email || "System"}</span></li>)}</ol></section>
    </> : <>
      <section className={card}><h2 className="mb-3 font-semibold">Search and filter</h2><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><input className={input} placeholder="Request ID, employer, contact" aria-label="Search requests" value={filters.search} onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))} /><input className={input} placeholder="Role" aria-label="Filter by role" value={filters.role} onChange={(e) => setFilters((f) => ({ ...f, role: e.target.value }))} /><input className={input} placeholder="City" aria-label="Filter by city" value={filters.city} onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))} /><input className={input} placeholder="Experience" aria-label="Filter by experience" value={filters.experience} onChange={(e) => setFilters((f) => ({ ...f, experience: e.target.value }))} /><input className={input} type="number" min="1" placeholder="Minimum staff" aria-label="Minimum staff count" value={filters.staff} onChange={(e) => setFilters((f) => ({ ...f, staff: e.target.value }))} /><select className={input} value={filters.status} aria-label="Filter by status" onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}><option value="">All statuses</option>{REQUEST_STATUSES.map((s) => <option key={s}>{s}</option>)}</select><label className="text-xs text-muted">From date<input className={`${input} mt-1`} type="date" value={filters.from} onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))} /></label><button type="button" className={button} onClick={() => setFilters({ search: "", role: "", city: "", experience: "", staff: "", status: "", from: "" })}>Clear filters</button></div></section>
      <section className="space-y-3">{filtered.length === 0 ? <p className="admin-muted">No matching requests.</p> : filtered.map((r) => <button key={r.id} type="button" className={`${card} w-full text-left hover:border-orange/50`} onClick={() => setSelectedId(r.id)}><div className="flex flex-wrap items-start justify-between gap-2"><div><span className="text-xs font-semibold tracking-wide text-orange">{r.request_id}</span><h2 className="font-display text-xl">{r.company_name}</h2></div><span className="rounded-full border border-orange/30 px-3 py-1 text-xs text-orange">{r.status}</span></div><div className="mt-3 grid gap-2 text-sm text-muted sm:grid-cols-3 lg:grid-cols-5"><span>{r.work_city}, {r.work_state}</span><span>{(r.employer_request_positions || []).map((p) => p.role === "Other" ? p.custom_role : p.role).join(", ")}</span><span>{r.total_staff} staff</span><span>{admins.find((a) => a.user_id === r.assigned_hr_user)?.email || "Unassigned"}</span><span><DateText value={r.created_at} /></span></div></button>)}</section>
      <section className={card}><h2 className="font-display text-xl">Private candidate references</h2><p className="mt-1 text-sm text-muted">Add a candidate only after receiving permission to process their details. This does not publish a directory.</p><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{[["reference_code","Candidate reference"],["display_name","Name"],["contact_phone","Phone (optional)"],["city","City"],["role_skills","Roles and skills"],["experience_note","Experience note"]].map(([key,label]) => <label key={key} className="text-xs text-muted">{label}<input className={`${input} mt-1`} value={candidateForm[key]} onChange={(e) => setCandidateForm((old) => ({ ...old, [key]: e.target.value }))} /></label>)}</div><div className="mt-4 space-y-2"><label className="flex gap-2 text-sm"><input type="checkbox" checked={candidateForm.processConsent} onChange={(e) => setCandidateForm((old) => ({ ...old, processConsent: e.target.checked }))} /> Candidate gave permission to process details for recruitment.</label><label className="flex gap-2 text-sm"><input type="checkbox" checked={candidateForm.shareConsent} onChange={(e) => setCandidateForm((old) => ({ ...old, shareConsent: e.target.checked }))} /> Candidate gave permission to share a profile with an employer.</label></div><button type="button" className={`${primary} mt-4`} disabled={busy} onClick={createCandidate}>Save candidate reference</button></section>
      <section className={card}><h2 className="font-display text-xl">Candidate permissions</h2><div className="mt-3 space-y-2">{candidates.map((c) => <div key={c.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-ink/10 p-3 text-sm"><div><p className="font-semibold">{c.reference_code} · {c.display_name}</p><p className="text-muted">{c.city || "City not recorded"} · {c.role_skills || "Skills not recorded"}</p><p className="text-xs text-muted">Private contact: {c.contact_phone || "Not recorded"} · Profile sharing: {c.consent_to_share_at ? "Permission recorded" : "Permission not recorded"}</p></div>{!c.consent_to_share_at && <button type="button" className={button} disabled={busy} onClick={() => mutate((db) => db.from("recruitment_candidates").update({ consent_to_share_at: new Date().toISOString() }).eq("id", c.id), "Candidate sharing permission recorded.")}>Record share permission</button>}</div>)}</div></section>
    </>}
  </div>;
}
