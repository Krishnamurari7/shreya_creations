import { adminContext, failure, json } from "@/lib/student-store/http";
export const dynamic = "force-dynamic";
export async function GET(_request, { params }) {
  const ctx = await adminContext(); if (ctx.error) return ctx.error;
  const { id } = await params;
  const { data } = await ctx.db.from("store_receipts").select("object_path").eq("id", id).maybeSingle();
  if (!data) return failure("Receipt not found", 404);
  const { data: signed, error } = await ctx.db.storage.from("store-documents").createSignedUrl(data.object_path, 60);
  return error ? failure("Receipt unavailable", 500) : json({ url: signed.signedUrl });
}
