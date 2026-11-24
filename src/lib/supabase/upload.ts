import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

const IMAGE_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};
const MAX_IMAGE_BYTES = 15 * 1024 * 1024;

/**
 * Upload the original image to `media` and register it in media_library.
 * Server-only — call from admin route handlers.
 */
export async function uploadMediaImage(
  file,
  options: {
    register?: boolean;
    altEn?: string;
    altHi?: string;
    uploadedBy?: string;
  } = {}
) {
  const admin = createAdminClient();
  if (!admin) throw new Error("Supabase admin client not configured.");

  const extension = IMAGE_EXTENSIONS[file.type];
  if (!extension) throw new Error("Choose a JPG, PNG, WebP or AVIF image.");
  if (file.size > MAX_IMAGE_BYTES) throw new Error("Choose an image smaller than 15 MB.");

  const bytes = new Uint8Array(await file.arrayBuffer());
  const mainPath = `uploads/${Date.now()}-${crypto.randomUUID()}.${extension}`;

  const { error: upErr } = await admin.storage.from("media").upload(mainPath, bytes, {
    contentType: file.type,
    cacheControl: "3600",
    upsert: false,
  });
  if (upErr) throw upErr;

  const { data: pub } = admin.storage.from("media").getPublicUrl(mainPath);

  if (options.register !== false) {
    const { error: libraryError } = await admin.from("media_library").insert({
      file_path: mainPath,
      public_url: pub.publicUrl,
      alt_text_en: options.altEn || null,
      alt_text_hi: options.altHi || null,
      uploaded_by: options.uploadedBy || null,
    });
    if (libraryError) throw libraryError;
  }

  return {
    path: mainPath,
    url: pub.publicUrl,
  };
}

const MAX_PDF_BYTES = 25 * 1024 * 1024; // 25 MB

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

/**
 * Upload a course brochure PDF to the public `media` bucket under `pdfs/`.
 * Server-only — call from admin route handlers.
 */
export async function uploadCoursePdf(file) {
  const admin = createAdminClient();
  if (!admin) throw new Error("Supabase admin client not configured.");

  const type = file.type || "";
  const name = file.name || "";
  if (type !== "application/pdf" && !name.toLowerCase().endsWith(".pdf")) {
    throw new Error("Only PDF files are allowed.");
  }
  if (typeof file.size === "number" && file.size > MAX_PDF_BYTES) {
    throw new Error("PDF must be 25 MB or smaller.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const safeName = sanitizePdfFileName(name);
  const path = `pdfs/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;

  const { error: upErr } = await admin.storage.from("media").upload(path, buffer, {
    contentType: "application/pdf",
    cacheControl: "31536000",
    upsert: false,
  });
  if (upErr) throw upErr;

  const { data: pub } = admin.storage.from("media").getPublicUrl(path);
  return { path, url: pub.publicUrl };
}

/** Signed URL for private documents bucket. */
export async function getDocumentSignedUrl(path, expiresIn = 3600) {
  const admin = createAdminClient();
  if (!admin) throw new Error("Supabase admin client not configured.");
  const { data, error } = await admin.storage.from("documents").createSignedUrl(path, expiresIn);
  if (error) throw error;
  return data.signedUrl;
}
