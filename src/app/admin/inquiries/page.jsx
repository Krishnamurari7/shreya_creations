"use client";

import { GLASS } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

export default function InquiriesAdmin() {
  const configured = isSupabaseConfigured();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!configured) return setLoading(false);
      const supabase = createClient();
      const { data } = await supabase.from("contact_inquiries").select("*").order("created_at", { ascending: false });
      setRows(data || []);
      setLoading(false);
    })();
  }, [configured]);

  if (!configured) {
    return (
      <div>
        <AdminPageHeader title="Contact inquiries" />
        <div className={cn(GLASS, "rounded-2xl", "p-5", "text-marigold", "border", "border-marigold/30", "text-sm")}>Connect Supabase to view submissions.</div>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Contact inquiries"
        subtitle="Saved from the contact form and home/courses popups."
      />
      {loading ? (
        <p className="admin-muted">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="admin-muted">No inquiries yet.</p>
      ) : (
        <ul className="space-y-3 sm:space-y-4">
          {rows.map((r) => (
            <li key={r.id} className={cn(GLASS, "rounded-2xl", "p-4", "sm:p-5")}>
              <div className="admin-inquiry-meta">
                <span className="font-medium">{r.name}</span>
                <span>{new Date(r.created_at).toLocaleString()}</span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs admin-muted mt-1">
                {r.phone && <span>📱 {r.phone}</span>}
                {r.source && (
                  <span className="uppercase tracking-wider">
                    {r.source.replace(/_/g, " ")}
                  </span>
                )}
              </div>
              {r.message && (
                <p className="text-sm whitespace-pre-wrap break-words leading-relaxed mt-2">{r.message}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
