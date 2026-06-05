"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ADMIN_LABEL } from "@/lib/admin/formClasses";

// Uploads images to the public "media" bucket and returns their public URLs.
export default function ImageUploader({ value = [], onChange, multiple = true, label = "Images" }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const urls = Array.isArray(value) ? value : value ? [value] : [];

  const upload = async (files) => {
    const supabase = createClient();
    if (!supabase) {
      setErr("Connect Supabase to upload images.");
      return;
    }
    setBusy(true);
    setErr("");
    const next = [...urls];
    try {
      for (const file of files) {
        const ext = file.name.split(".").pop();
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error } = await supabase.storage.from("media").upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });
        if (error) throw error;
        const { data } = supabase.storage.from("media").getPublicUrl(path);
        next.push(data.publicUrl);
      }
      onChange(multiple ? next : next[next.length - 1] || "");
    } catch (e) {
      setErr(e.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  const remove = (i) => {
    const next = urls.filter((_, idx) => idx !== i);
    onChange(multiple ? next : next[0] || "");
  };

  return (
    <div>
      <label className={ADMIN_LABEL}>{label}</label>
      <div className="flex flex-wrap gap-3 mb-3">
        {urls.map((u, i) => (
          <div key={i} className="relative h-20 w-16 rounded-lg overflow-hidden border border-gold/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={u} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-0 right-0 bg-black/70 text-rose text-xs px-1.5 py-0.5"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        disabled={busy}
        onChange={(e) => e.target.files && upload(Array.from(e.target.files))}
        className="block w-full max-w-full text-sm admin-muted file:mr-2 sm:file:mr-3 file:rounded-full file:border-0 file:bg-gold/20 file:px-3 sm:file:px-4 file:py-2 file:text-gold file:text-xs sm:file:text-sm file:cursor-pointer"
      />
      {busy && <p className="text-xs text-marigold mt-2">Uploading…</p>}
      {err && <p className="text-xs text-rose mt-2">{err}</p>}
    </div>
  );
}
