import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_PASSPORT_BYTES = 450_000;

/**
 * Upload a client-compressed passport photo (data URL) to the public `media` bucket.
 * No sharp — safe for Workers / public registration flow.
 * Returns public URL, or null if admin storage is unavailable.
 */
export async function uploadPassportPhotoDataUrl(dataUrl) {
  const admin = createAdminClient();
  if (!admin) return null;

  const match = String(dataUrl || "").match(/^data:(image\/(?:jpeg|jpg|png|webp));base64,(.+)$/i);
  if (!match) return null;

  const contentType = match[1].toLowerCase() === "image/jpg" ? "image/jpeg" : match[1].toLowerCase();
  const buffer = Buffer.from(match[2], "base64");
  if (!buffer.length || buffer.length > MAX_PASSPORT_BYTES) {
    throw new Error("Passport photo is too large. Please choose a smaller image.");
  }

  const ext = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
  const path = `passport-photos/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error: upErr } = await admin.storage.from("media").upload(path, buffer, {
    contentType,
    cacheControl: "31536000",
    upsert: false,
  });
  if (upErr) throw upErr;

  const { data: pub } = admin.storage.from("media").getPublicUrl(path);
  return pub.publicUrl;
}
