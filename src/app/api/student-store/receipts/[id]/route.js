import { customerContext, failure, json } from "@/lib/student-store/http";
export const dynamic = "force-dynamic";
export async function GET(_request, { params }) {
  const ctx = await customerContext(); if (ctx.error) return ctx.error;
  const { id } = await params;
  const { data, error } = await ctx.db.from("store_receipts").select("id,order_id,object_path,store_orders!inner(user_id)").eq("id", id).eq("store_orders.user_id", ctx.user.id).maybeSingle();
  if (error || !data) return failure("Receipt not found", 404);
  const { data: signed, error: signError } = await ctx.db.storage.from("store-documents").createSignedUrl(data.object_path, 60);
  return signError ? failure("Receipt temporarily unavailable", 500) : json({ url: signed.signedUrl });
}
