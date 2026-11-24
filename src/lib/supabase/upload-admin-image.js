import { createClient } from "@/lib/supabase/client";

const IMAGE_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

const MAX_IMAGE_BYTES = 15 * 1024 * 1024;

async function prepareImage(file) {
  if (file.size <= 6 * 1024 * 1024 || typeof createImageBitmap !== "function") return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 2560 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext("2d");
    if (!context) {
      bitmap.close?.();
      return file;
    }
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/webp", 0.82));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.webp`, { type: "image/webp" });
  } catch {
    return file;
  }
}

async function imageDimensions(file) {
  if (typeof createImageBitmap !== "function") return {};
  try {
    const bitmap = await createImageBitmap(file);
    const dimensions = { width: bitmap.width, height: bitmap.height };
    bitmap.close?.();
    return dimensions;
  } catch {
    return {};
  }
}

// Upload directly from the admin browser to avoid proxy request limits on Cloudflare.
export async function uploadAdminImage(file, { folder = "uploads", altEn = "", altHi = "" } = {}) {
  if (!IMAGE_TYPES[file?.type]) throw new Error("Choose a JPG, PNG, WebP or AVIF image.");
  if (file.size > MAX_IMAGE_BYTES) throw new Error("Choose an image smaller than 15 MB.");

  const supabase = createClient();
  if (!supabase) throw new Error("Connect Supabase to upload images.");

  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) throw new Error("Session expired. Log in again at /admin/login.");

  const uploadFile = await prepareImage(file);
  const path = `${folder}/${Date.now()}-${crypto.randomUUID()}.${IMAGE_TYPES[uploadFile.type]}`;
  const { error: storageError } = await supabase.storage.from("media").upload(path, uploadFile, {
    contentType: uploadFile.type,
    cacheControl: "3600",
    upsert: false,
  });
  if (storageError) throw storageError;

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  const { error: libraryError } = await supabase.from("media_library").insert({
    file_path: path,
    public_url: data.publicUrl,
    alt_text_en: altEn || null,
    alt_text_hi: altHi || null,
    uploaded_by: auth.user.id,
    ...(await imageDimensions(uploadFile)),
  });

  return {
    path,
    url: data.publicUrl,
    warning: libraryError ? "Image uploaded, but its Media Library record could not be saved." : "",
  };
}
