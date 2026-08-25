"use client";

import { GLASS, BTN_PRIMARY, BTN_SECONDARY } from "@/lib/ui";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminModal from "@/components/admin/AdminModal";
import { ADMIN_INPUT, ADMIN_LABEL, ADMIN_MUTED } from "@/lib/admin/formClasses";
import { revalidateSiteContent } from "@/lib/admin/revalidate";

export default function CourseBatchesAdmin() {
  const params = useParams();
  const courseId = params?.id;
  const configured = isSupabaseConfigured();
  const [course, setCourse] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modalError, setModalError] = useState("");

  const load = useCallback(async () => {
    if (!configured || !courseId) return setLoading(false);
    setLoading(true);
    setError("");
    const supabase = createClient();
    if (!supabase) {
      setError("Supabase is not configured.");
      setLoading(false);
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      setError("You are not logged in. Go to /admin/login and sign in first.");
      setLoading(false);
      return;
    }

    const [{ data: c, error: courseErr }, { data: batches, error: batchErr }] = await Promise.all([
      supabase.from("courses").select("id, title, slug").eq("id", courseId).single(),
      supabase.from("batches").select("*").eq("course_id", courseId).order("start_date", { ascending: true }),
    ]);

    if (courseErr) setError(courseErr.message);
    else if (batchErr) setError(batchErr.message);
    setCourse(c);
    setRows(batches || []);
    setLoading(false);
  }, [configured, courseId]);

  useEffect(() => {
    load();
  }, [load]);

  const blank = () => ({
    course_id: courseId,
    start_date: "",
    seats_total: 20,
    seats_left: 20,
    is_active: true,
  });

  const save = async () => {
    setModalError("");
    if (!editing?.start_date) {
      setModalError("Start date is required.");
      return;
    }
    setSaving(true);
    const supabase = createClient();
    if (!supabase) {
      setModalError("Supabase is not configured.");
      setSaving(false);
      return;
    }

    const seatsTotal = Number(editing.seats_total);
    const seatsLeft = Number(editing.seats_left);
    const payload = {
      course_id: courseId,
      start_date: editing.start_date,
      seats_total: Number.isFinite(seatsTotal) && seatsTotal > 0 ? seatsTotal : 20,
      seats_left: Number.isFinite(seatsLeft) && seatsLeft >= 0 ? seatsLeft : 0,
      is_active: editing.is_active !== false,
    };

    const res = editing.id
      ? await supabase.from("batches").update(payload).eq("id", editing.id)
      : await supabase.from("batches").insert(payload);

    setSaving(false);
    if (res.error) {
      setModalError(res.error.message);
      return;
    }

    setEditing(null);
    await load();
    const paths = ["/"];
    if (course?.slug) paths.push(`/courses/${course.slug}`, "/courses");
    await revalidateSiteContent(paths);
  };

  const remove = async (id) => {
    if (!confirm("Delete this batch?")) return;
    setError("");
    const supabase = createClient();
    const { error: err } = await supabase.from("batches").delete().eq("id", id);
    if (err) {
      setError(err.message);
      return;
    }
    await load();
    await revalidateSiteContent(["/", "/courses"]);
  };

  if (!configured) {
    return (
      <div>
        <AdminPageHeader title="Course batches" />
        <div className={cn(GLASS, "rounded-2xl", "p-5", "text-marigold", "text-sm")}>Connect Supabase first.</div>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title={course?.title ? `Batches — ${course.title}` : "Course batches"}
        subtitle="Drives the Next Batch urgency banner on the homepage."
        action={
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/courses" className={BTN_SECONDARY}>
              ← Courses
            </Link>
            <button
              type="button"
              onClick={() => {
                setModalError("");
                setEditing(blank());
              }}
              className={BTN_PRIMARY}
            >
              + Add batch
            </button>
          </div>
        }
      />

      {error && (
        <div className="rounded-xl border border-rose/40 bg-rose/10 px-4 py-3 text-sm text-rose mb-4 break-words">
          {error}
        </div>
      )}

      {loading ? (
        <p className="admin-muted">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="admin-muted">No batches yet. Add the next start date and seats left.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((b) => (
            <li key={b.id} className={cn(GLASS, "rounded-2xl", "p-4", "flex", "flex-wrap", "justify-between", "gap-3")}>
              <div>
                <p className="font-medium">{b.start_date}</p>
                <p className={`text-sm ${ADMIN_MUTED}`}>
                  {b.seats_left}/{b.seats_total} seats left · {b.is_active ? "Active" : "Inactive"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={BTN_SECONDARY}
                  onClick={() => {
                    setModalError("");
                    setEditing({ ...b });
                  }}
                >
                  Edit
                </button>
                <button type="button" className="admin-btn-danger" onClick={() => remove(b.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <AdminModal
        open={!!editing}
        onClose={() => {
          setEditing(null);
          setModalError("");
        }}
        title={editing?.id ? "Edit batch" : "New batch"}
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
        {editing && (
          <div className="space-y-4">
            {modalError && (
              <div className="rounded-xl border border-rose/40 bg-rose/10 px-4 py-3 text-sm text-rose break-words">
                {modalError}
              </div>
            )}
            <div>
              <label className={ADMIN_LABEL}>Start date</label>
              <input
                type="date"
                className={ADMIN_INPUT}
                value={editing.start_date || ""}
                onChange={(e) => setEditing({ ...editing, start_date: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={ADMIN_LABEL}>Seats total</label>
                <input
                  type="number"
                  className={ADMIN_INPUT}
                  value={editing.seats_total ?? 20}
                  onChange={(e) => setEditing({ ...editing, seats_total: e.target.value })}
                />
              </div>
              <div>
                <label className={ADMIN_LABEL}>Seats left</label>
                <input
                  type="number"
                  className={ADMIN_INPUT}
                  value={editing.seats_left ?? 20}
                  onChange={(e) => setEditing({ ...editing, seats_left: e.target.value })}
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={editing.is_active !== false}
                onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
              />
              Active (shown on site)
            </label>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
