import { customerContext, failure, json } from "@/lib/student-store/http";
export const dynamic = "force-dynamic";
export async function GET(_request, { params }) {
  const ctx = await customerContext(); if (ctx.error) return ctx.error;
  const { id } = await params;
  const { data: order, error } = await ctx.db.from("store_orders").select("*").eq("id", id).eq("user_id", ctx.user.id).maybeSingle();
  if (error || !order) return failure("Order not found", 404);
  const [items, history, receipts] = await Promise.all([
    ctx.db.from("store_order_items").select("*").eq("order_id", id),
    ctx.db.from("store_order_status_history").select("previous_status,new_status,notes,created_at").eq("order_id", id).order("created_at"),
    ctx.db.from("store_receipts").select("id,file_name,created_at").eq("order_id", id),
  ]);
  if (items.error || history.error || receipts.error) return failure("Order details could not be loaded", 500);
  return json({ order, items: items.data, history: history.data, receipts: receipts.data });
}
