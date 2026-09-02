"use client";

import { useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { ADMIN_LABEL, ADMIN_MUTED } from "@/lib/admin/formClasses";
import { BTN_SECONDARY } from "@/lib/ui";

const MAX_PDF_BYTES = 25 * 1024 * 1024;

function displayName(url = "") {
  if (!url) return "";
  try {
    const path = url.startsWith("http") ? new URL(url).pathname : url;
    return decodeURIComponent(path.split("/").filter(Boolean).pop() || url);
  } catch {
    return url;
  }
}

function sanitizePdfFileName(name = "brochure.pdf") {
  const base = String(name).split(/[/\\]/).pop() || "brochure.pdf";
  const cleaned = base
    .replace(/\.pdf$/i, "")
    .replace(/[^a-zA-Z0-9._\-\s]+/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
  return `${cleaned || "brochure"}.pdf`;
}

/** Upload a single PDF to Supabase (`media/pdfs`) and store the public URL. */
export default function PdfUploader({ value = "", onChange, label = "PDF", hint }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const upload = async (file) => {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setErr("Please choose a PDF file.");
      return;
    }
    if (file.size > MAX_PDF_BYTES) {
      setErr("PDF must be 25 MB or smaller.");
      return;
    }

    const supabase = createClient();
    if (!supabase || !isSupabaseConfigured()) {
      setErr("Connect Supabase to upload PDFs.");
      return;
    }

    setBusy(true);
    setErr("");
    try {
      const safeName = sanitizePdfFileName(file.name);
      const path = `pdfs/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
      const { error } = await supabase.storage.from("media").upload(path, file, {
        contentType: "application/pdf",
        cacheControl: "31536000",
        upsert: false,
      });
      if (error) throw error;
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      onChange(data.publicUrl || "");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <label className={ADMIN_LABEL}>{label}</label>

      {value ? (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-gold/20 bg-black/20 px-3 py-2">
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-0 flex-1 truncate text-sm text-gold hover:underline"
            title={value}
          >
            {displayName(value)}
          </a>
          <button
            type="button"
            className={BTN_SECONDARY + " text-xs py-1 px-2 shrink-0"}
            onClick={() => onChange("")}
            disabled={busy}
          >
            Remove
          </button>
        </div>
      ) : (
        <p className={`${ADMIN_MUTED} mb-2`}>No PDF yet — optional brochure for the course page.</p>
      )}

      <input
        type="file"
        accept="application/pdf,.pdf"
        disabled={busy}
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) upload(file);
        }}
        className="block w-full max-w-full text-sm admin-muted file:mr-2 sm:file:mr-3 file:rounded-full file:border-0 file:bg-gold/20 file:px-3 sm:file:px-4 file:py-2 file:text-gold file:text-xs sm:file:text-sm file:cursor-pointer"
      />
      {busy && <p className="text-xs text-marigold mt-2">Uploading PDF…</p>}
      {err && <p className="text-xs text-rose mt-2">{err}</p>}
      {hint && <p className={`${ADMIN_MUTED} mt-1`}>{hint}</p>}
    </div>
  );
}
