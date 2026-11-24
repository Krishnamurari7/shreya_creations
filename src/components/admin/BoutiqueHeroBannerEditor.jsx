"use client";

import { useRef, useState } from "react";
import { ADMIN_LABEL } from "@/lib/admin/formClasses";
import { uploadAdminImage } from "@/lib/supabase/upload-admin-image";

const BANNERS = [
  { key: "hero_image_mobile", label: "Mobile", width: 750, height: 900, screens: "up to 639px" },
  { key: "hero_image_tablet", label: "Tablet", width: 1280, height: 720, screens: "640–1023px" },
  { key: "hero_image_desktop", label: "Laptop / desktop", width: 1920, height: 900, screens: "1024px and wider" },
];

export default function BoutiqueHeroBannerEditor({ page, onChange, onBusyChange }) {
  const activeUploads = useRef(new Set());
  const [busyKeys, setBusyKeys] = useState(new Set());
  const [messages, setMessages] = useState({});
  const [dimensions, setDimensions] = useState({});

  async function upload(key, file) {
    if (!file || activeUploads.current.has(key)) return;
    setMessages((current) => ({ ...current, [key]: null }));

    activeUploads.current.add(key);
    setBusyKeys(new Set(activeUploads.current));
    onBusyChange?.(true);
    try {
      const result = await uploadAdminImage(file, { folder: "banners" });
      onChange(key, result.url);
      setDimensions((current) => ({ ...current, [key]: null }));
      if (result.warning) {
        setMessages((current) => ({ ...current, [key]: { text: result.warning, warning: true } }));
      }
    } catch (uploadError) {
      setMessages((current) => ({
        ...current,
        [key]: { text: uploadError instanceof Error ? uploadError.message : "Upload failed." },
      }));
    } finally {
      activeUploads.current.delete(key);
      setBusyKeys(new Set(activeUploads.current));
      onBusyChange?.(activeUploads.current.size > 0);
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
                  <button type="button" className="text-sm text-rose underline" disabled={busyKeys.has(key)} onClick={() => onChange(key, "")}>Remove banner</button>
                </>
              ) : (
                <p className="admin-muted">No banner uploaded yet.</p>
              )}
              <label className="block text-sm text-gold cursor-pointer">
                {busyKeys.has(key) ? "Uploading…" : url ? "Replace banner" : "Upload banner"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  disabled={busyKeys.has(key)}
                  className="block w-full max-w-full mt-1 text-sm admin-muted file:mr-2 file:rounded-full file:border-0 file:bg-gold/20 file:px-3 file:py-2 file:text-gold file:cursor-pointer"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    event.target.value = "";
                    if (file) upload(key, file);
                  }}
                />
              </label>
              {messages[key] && (
                <p className={`text-sm ${messages[key].warning ? "text-marigold" : "text-rose"}`} role={messages[key].warning ? "status" : "alert"}>
                  {messages[key].text}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
