"use client";

import { useEffect, useState } from "react";
import AdminModal from "@/components/admin/AdminModal";
import { BTN_SECONDARY } from "@/lib/ui";
import { deleteUnusedMediaImage, getMediaImageUsage } from "@/lib/admin/delete-media-image";

export default function MediaDeleteDialog({ asset, localUsage = "", onClose, onDeleted }) {
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [usage, setUsage] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!asset?.filePath) return;
    let active = true;
    setLoading(true);
    setUsage([]);
    setError("");
    getMediaImageUsage(asset.filePath)
      .then((result) => { if (active) setUsage(result.locations || []); })
      .catch((err) => { if (active) setError(err instanceof Error ? err.message : "Could not check image usage."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [asset?.filePath]);

  if (!asset) return null;

  const locations = [...new Set([...usage, ...(localUsage ? [localUsage] : [])])];
  const close = () => { if (!deleting) onClose(); };

  const remove = async () => {
    if (loading || deleting || error || locations.length) return;
    setDeleting(true);
    setError("");
    try {
      await deleteUnusedMediaImage(asset.filePath);
      onDeleted(asset.filePath);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete image.");
      try {
        const latest = await getMediaImageUsage(asset.filePath);
        setUsage(latest.locations || []);
      } catch {
        // Keep the original deletion error visible.
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminModal
      open
      onClose={close}
      title="Delete image"
      footer={
        <div className="admin-form-actions">
          <button type="button" className={BTN_SECONDARY} onClick={close} disabled={deleting}>Cancel</button>
          <button
            type="button"
            className="admin-btn-danger px-4 py-2 disabled:opacity-50"
            onClick={remove}
            disabled={loading || deleting || Boolean(error) || locations.length > 0}
          >
            {deleting ? "Deleting…" : "Delete permanently"}
          </button>
        </div>
      }
    >
      <div className="space-y-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset.image} alt={asset.title || "Image to delete"} className="h-32 w-auto max-w-full rounded-lg object-contain" />
        <p className="admin-muted break-all text-xs">{asset.filePath}</p>
        {loading ? <p className="admin-muted" role="status">Checking where this image is used…</p> : locations.length ? (
          <div className="rounded-lg border border-rose/30 bg-rose/10 p-3" role="alert">
            <p className="font-medium text-rose">This image is in use:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              {locations.map((location) => <li key={location}>{location}</li>)}
            </ul>
            <p className="mt-2 text-sm">Remove it from these places and save your changes before deleting.</p>
          </div>
        ) : (
          <p className="text-sm">This image is not used in saved website content. Deleting removes its Supabase file and Media Library record permanently.</p>
        )}
        {error && <p className="text-sm text-rose" role="alert">{error}</p>}
      </div>
    </AdminModal>
  );
}
