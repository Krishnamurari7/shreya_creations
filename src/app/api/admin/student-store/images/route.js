import { adminContext, failure, json, sameOrigin } from "@/lib/student-store/http";
export const dynamic = "force-dynamic";
export async function POST(request) {
  const ctx = await adminContext(); if (ctx.error) return ctx.error;
  if (!sameOrigin(request)) return failure("Forbidden origin", 403);
  const form = await request.formData();
  const file = form.get("file"), kind = form.get("kind"), ownerId = form.get("id"), alt = String(form.get("alt") || "").trim();
  if (!(file instanceof File) || !["product","kit","category"].includes(kind) || !/^[0-9a-f-]{36}$/i.test(String(ownerId)) || alt.length < 3 || alt.length > 200)
    return failure("Choose an image and supply descriptive alt text", 400);
  if (!["image/jpeg","image/png","image/webp"].includes(file.type) || file.size > 5_000_000) return failure("Use a JPG, PNG or WebP under 5 MB", 400);
  const table = kind === "product" ? "store_products" : kind === "kit" ? "store_kits" : "store_categories";
  const { data: owner } = await ctx.db.from(table).select("id").eq("id", ownerId).single();
  if (!owner) return failure("Catalog item not found", 404);
  const path = `${kind}/${ownerId}/${crypto.randomUUID()}.${file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg"}`;
  const { error: uploadError } = await ctx.db.storage.from("store-images").upload(path, file, { contentType: file.type, upsert: false });
  if (uploadError) return failure("Image upload failed", 500);
  if (kind === "category") {
    const { data, error } = await ctx.db.from("store_categories").update({ image_path: path, image_alt: alt, updated_at: new Date().toISOString() }).eq("id", ownerId).select("id,image_alt").single();
    if (error) { await ctx.db.storage.from("store-images").remove([path]); return failure("Image could not be attached", 500); }
    return json({ row: data }, 201);
  }
  const imageTable = kind === "product" ? "store_product_images" : "store_kit_images";
  const { data, error } = await ctx.db.from(imageTable).insert({ [kind === "product" ? "product_id" : "kit_id"]: ownerId, object_path: path, alt_text: alt }).select().single();
  if (error) { await ctx.db.storage.from("store-images").remove([path]); return failure("Image could not be attached", 500); }
  return json({ row: data }, 201);
}
