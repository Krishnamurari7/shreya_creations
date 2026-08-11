import "server-only";
import sharp from "sharp";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_WIDTH = 1920;
const THUMB_WIDTH = 400;

/**
 * Compress image to WebP, upload to `media` bucket, register in media_library.
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

  const buffer = Buffer.from(await file.arrayBuffer());
  const meta = await sharp(buffer).metadata();
  const webp = await sharp(buffer)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();

  const thumb = await sharp(buffer)
    .rotate()
    .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
    .webp({ quality: 75 })
    .toBuffer();

  const base = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const mainPath = `uploads/${base}.webp`;
  const thumbPath = `uploads/${base}-thumb.webp`;

  const { error: upErr } = await admin.storage.from("media").upload(mainPath, webp, {
    contentType: "image/webp",
    cacheControl: "31536000",
    upsert: false,
  });
  if (upErr) throw upErr;

  await admin.storage.from("media").upload(thumbPath, thumb, {
    contentType: "image/webp",
    cacheControl: "31536000",
    upsert: false,
  });

  const { data: pub } = admin.storage.from("media").getPublicUrl(mainPath);
  const { data: thumbPub } = admin.storage.from("media").getPublicUrl(thumbPath);

  if (options.register !== false) {
    await admin.from("media_library").insert({
      file_path: mainPath,
      public_url: pub.publicUrl,
      alt_text_en: options.altEn || null,
      alt_text_hi: options.altHi || null,
      width: meta.width || null,
      height: meta.height || null,
      uploaded_by: options.uploadedBy || null,
    });
  }

  return {
    path: mainPath,
    thumbPath,
    url: pub.publicUrl,
    thumbUrl: thumbPub.publicUrl,
    width: meta.width,
    height: meta.height,
  };
}

/** Signed URL for private documents bucket. */
export async function getDocumentSignedUrl(path, expiresIn = 3600) {
  const admin = createAdminClient();
  if (!admin) throw new Error("Supabase admin client not configured.");
  const { data, error } = await admin.storage.from("documents").createSignedUrl(path, expiresIn);
  if (error) throw error;
  return data.signedUrl;
}
