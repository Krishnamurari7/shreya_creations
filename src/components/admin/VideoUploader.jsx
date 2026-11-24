"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ADMIN_INPUT } from "@/lib/admin/formClasses";

export default function VideoUploader({ value = "", onChange }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const upload = async (file) => {
    if (!file) return;
    if (!["video/mp4", "video/webm"].includes(file.type) || file.size > 50 * 1024 * 1024) {
      setError("Choose an MP4 or WebM video under 50 MB.");
      return;
    }
    const supabase = createClient();
    if (!supabase) {
      setError("Connect Supabase to upload videos.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const ext = file.type === "video/webm" ? "webm" : "mp4";
      const path = `home-hero/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("media").upload(path, file, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: false,
      });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Video upload failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="https://…/video.mp4 or upload below"
        className={ADMIN_INPUT}
      />
      {value && <video src={value} controls muted playsInline preload="none" className="max-h-36 max-w-full rounded-lg" />}
      <input
        type="file"
        accept="video/mp4,video/webm"
        disabled={busy}
        onChange={(event) => {
          upload(event.target.files?.[0]);
          event.target.value = "";
        }}
        className="block max-w-full text-sm admin-muted file:mr-3 file:rounded-full file:border-0 file:bg-gold/20 file:px-3 file:py-2 file:text-gold file:cursor-pointer"
      />
      {busy && <p className="text-xs text-marigold">Uploading video…</p>}
      {error && <p className="text-xs text-rose" role="alert">{error}</p>}
    </div>
  );
}
