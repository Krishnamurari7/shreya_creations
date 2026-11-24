"use client";

import { useState } from "react";
import { ADMIN_LABEL } from "@/lib/admin/formClasses";

const BANNERS = [
  { key: "hero_image_mobile", label: "Mobile", width: 750, height: 900, screens: "up to 639px" },
  { key: "hero_image_tablet", label: "Tablet", width: 1280, height: 720, screens: "640–1023px" },
  { key: "hero_image_desktop", label: "Laptop / desktop", width: 1920, height: 900, screens: "1024px and wider" },
];

export default function BoutiqueHeroBannerEditor({ page, onChange, onBusyChange }) {
  const [busyKey, setBusyKey] = useState("");
  const [error, setError] = useState("");
  const [dimensions, setDimensions] = useState({});

  async function upload(key, file) {
    if (!file) return;
    setError("");
    if (!/^image\/(jpeg|png|webp|avif)$/.test(file.type)) {
      setError("Choose a JPG, PNG, WebP or AVIF image.");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setError("Choose an image smaller than 15 MB.");
      return;
    }

    setBusyKey(key);
    onBusyChange?.(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body: form });
      const result = await response.json();
      if (!response.ok || !result.url) throw new Error(result.error || "Upload failed.");
      onChange(key, result.url);
      setDimensions((current) => ({ ...current, [key]: null }));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    } finally {
      setBusyKey("");
      onBusyChange?.(false);
    }
  }

  return (
    <div className="space-y-4">
      <p className="admin-muted">
        Upload a banner for each screen size. Images are saved to Supabase Storage; click “Save all pages”
        to publish the selected banners. Missing sizes use the next larger banner, then the fallback hero image.
      </p>
      <div className="grid gap-4 lg:grid-cols-3">
        {BANNERS.map(({ key, label, width, height, screens }) => {
          const url = page[key] || "";
          const size = dimensions[key]?.url === url ? dimensions[key] : null;
          const tooSmall = size && (size.width < width * 0.75 || size.height < height * 0.75);
          const ratioMismatch = size && Math.abs(size.width / size.height - width / height) > width / height * 0.2;
          return (
            <div key={key} className="rounded-xl border border-gold/20 bg-white/5 p-3 space-y-2">
              <div>
                <p className={ADMIN_LABEL}>{label} banner</p>
                <p className="admin-muted">{screens} · recommended {width} × {height} px</p>
              </div>
              {url ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`${label} banner preview`}
                    className="w-full max-h-60 rounded-lg object-contain border border-gold/20 bg-black/10"
                    style={{ aspectRatio: `${width} / ${height}` }}
                    onLoad={(event) => {
                      const image = event.currentTarget;
                      setDimensions((current) => ({
                        ...current,
                        [key]: { url, width: image.naturalWidth, height: image.naturalHeight },
                      }));
                    }}
                  />
                  <p className="admin-muted">
                    Uploaded size: {size ? `${size.width} × ${size.height} px` : "checking…"}
                  </p>
                  {(tooSmall || ratioMismatch) && (
                    <p className="text-sm text-marigold" role="status">
                      {tooSmall ? "This image may look soft at this screen size. " : ""}
                      {ratioMismatch ? "Its shape differs from the recommended banner and may be cropped." : ""}
                    </p>
                  )}
                  <button type="button" className="text-sm text-rose underline" disabled={Boolean(busyKey)} onClick={() => onChange(key, "")}>Remove banner</button>
                </>
              ) : (
                <p className="admin-muted">No banner uploaded yet.</p>
              )}
              <label className="block text-sm text-gold cursor-pointer">
                {busyKey === key ? "Uploading…" : url ? "Replace banner" : "Upload banner"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  disabled={Boolean(busyKey)}
                  className="block w-full max-w-full mt-1 text-sm admin-muted file:mr-2 file:rounded-full file:border-0 file:bg-gold/20 file:px-3 file:py-2 file:text-gold file:cursor-pointer"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    event.target.value = "";
                    if (file) upload(key, file);
                  }}
                />
              </label>
            </div>
          );
        })}
      </div>
      {error && <p className="text-sm text-rose" role="alert">{error}</p>}
    </div>
  );
}
