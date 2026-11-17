import { adminContext, failure, json, sameOrigin } from "@/lib/student-store/http";
export const dynamic = "force-dynamic";
export async function POST(request) {
  const ctx = await adminContext(true); if (ctx.error) return ctx.error;
  if (!sameOrigin(request)) return failure("Forbidden origin", 403);
  const form = await request.formData();
  const file = form.get("file"), orderId = String(form.get("order_id") || "");
  if (!(file instanceof File) || !/^[0-9a-f-]{36}$/i.test(orderId) || file.type !== "application/pdf" || file.size > 10_000_000) return failure("Choose a PDF under 10 MB and a real order", 400);
  const { data: order } = await ctx.db.from("store_orders").select("id").eq("id", orderId).single();
  if (!order) return failure("Order not found", 404);
  const path = `${orderId}/${crypto.randomUUID()}.pdf`;
  const { error: uploadError } = await ctx.db.storage.from("store-documents").upload(path, file, { contentType: file.type, upsert: false });
  if (uploadError) return failure("Receipt upload failed", 500);
  const { data, error } = await ctx.db.from("store_receipts").insert({ order_id: orderId, object_path: path, file_name: file.name.slice(0, 180), uploaded_by: ctx.session.userId }).select("id,file_name").single();
  if (error) { await ctx.db.storage.from("store-documents").remove([path]); return failure("Receipt could not be attached", 500); }
  return json({ row: data }, 201);
}
