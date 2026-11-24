"use client";

import { GLASS, BTN_PRIMARY, BTN_SECONDARY } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminModal from "@/components/admin/AdminModal";
import { ADMIN_INPUT, ADMIN_LABEL } from "@/lib/admin/formClasses";
import { revalidateSiteContent } from "@/lib/admin/revalidate";
import { listStorageGalleryImages } from "@/lib/supabase/storage-gallery";
import { uploadAdminImage } from "@/lib/supabase/upload-admin-image";

export default function MediaAdmin() {
  const configured = isSupabaseConfigured();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [storageFallback, setStorageFallback] = useState(false);

  const load = useCallback(async () => {
    if (!configured) return setLoading(false);
    setLoading(true);
    const supabase = createClient();
    const [library, storage] = await Promise.all([
      supabase.from("media_library").select("*").order("created_at", { ascending: false }),
      listStorageGalleryImages(supabase)
        .then((data) => ({ data, error: null }))
        .catch((error) => ({ data: [], error })),
    ]);
    const combined = [...(library.data || [])];
    const registered = new Set(combined.map((row) => row.file_path || row.public_url));
    for (const row of storage.data) {
      if (!registered.has(row.file_path) && !registered.has(row.public_url)) combined.push(row);
    }
    setRows(combined);
    setStorageFallback(Boolean(library.error));
    if (storage.error && !combined.length) setError(storage.error.message);
    setLoading(false);
  }, [configured]);

  useEffect(() => {
    load();
  }, [load]);

  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const result = await uploadAdminImage(file);
      await load();
      if (result.warning) setError(result.warning);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const saveAlt = async () => {
    if (!editing || editing.storage_only) return;
    const supabase = createClient();
    const { error: err } = await supabase
      .from("media_library")
      .update({
        alt_text_en: editing.alt_text_en || null,
        alt_text_hi: editing.alt_text_hi || null,
      })
      .eq("id", editing.id);
    if (err) setError(err.message);
    else {
      setEditing(null);
      await load();
      await revalidateSiteContent([]);
    }
  };

  const remove = async (row) => {
    if (row.storage_only) return;
    if (!confirm("Delete this media record? Storage file is kept until you remove it in Supabase.")) return;
    const supabase = createClient();
    await supabase.from("media_library").delete().eq("id", row.id);
    await load();
  };

  if (!configured) {
    return (
      <div>
        <AdminPageHeader title="Media library" />
        <div className={cn(GLASS, "rounded-2xl", "p-5", "text-marigold", "border", "border-marigold/30", "text-sm")}>
          Connect Supabase to manage media.
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Media library"
        subtitle="Images are saved to Supabase Storage and listed in the Media Library."
        action={
          <label className={cn(BTN_PRIMARY, "cursor-pointer")}>
            {uploading ? "Uploading…" : "+ Upload"}
            <input type="file" accept="image/*" className="sr-only" disabled={uploading} onChange={upload} />
          </label>
        }
      />

      {error && <p className="text-rose text-sm mb-4">{error}</p>}
      {storageFallback && <p className="admin-muted text-sm mb-4">Images are loaded from Supabase Storage. Image metadata editing needs the Media Library database table.</p>}

      {loading ? (
        <p className="admin-muted">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="admin-muted">No media yet. Upload your first image.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {rows.map((r) => (
            <div key={r.id} className={cn(GLASS, "rounded-xl", "overflow-hidden")}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.public_url} alt={r.alt_text_en || ""} className="w-full aspect-square object-cover" />
              <div className="p-2 space-y-2">
                <p className="text-[10px] admin-muted truncate">{r.file_path}</p>
                <div className="flex gap-2">
                  {r.storage_only ? (
                    <span className="admin-muted text-xs">Storage image</span>
                  ) : (
                    <>
                      <button type="button" className={BTN_SECONDARY} onClick={() => setEditing({ ...r })}>
                        Alt text
                      </button>
                      <button type="button" className="admin-btn-danger text-xs px-2" onClick={() => remove(r)}>
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminModal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edit alt text"
        footer={
          <div className="admin-form-actions">
            <button type="button" onClick={saveAlt} className={BTN_PRIMARY}>
              Save
            </button>
            <button type="button" onClick={() => setEditing(null)} className={BTN_SECONDARY}>
              Cancel
            </button>
          </div>
        }
      >
        {editing && (
          <div className="space-y-4">
            <div>
              <label className={ADMIN_LABEL}>Alt text (English)</label>
              <input
                className={ADMIN_INPUT}
                value={editing.alt_text_en || ""}
                onChange={(e) => setEditing({ ...editing, alt_text_en: e.target.value })}
              />
            </div>
            <div>
              <label className={ADMIN_LABEL}>Alt text (Hindi)</label>
              <input
                className={ADMIN_INPUT}
                value={editing.alt_text_hi || ""}
                onChange={(e) => setEditing({ ...editing, alt_text_hi: e.target.value })}
              />
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
