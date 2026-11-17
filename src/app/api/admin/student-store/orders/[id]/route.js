import { z } from "zod";
import { adminContext, bodyOf, failure, json } from "@/lib/student-store/http";
export const dynamic = "force-dynamic";
export async function GET(_request, { params }) {
  const ctx = await adminContext(); if (ctx.error) return ctx.error;
  const { id } = await params;
  const { data: order, error } = await ctx.db.from("store_orders").select("*").eq("id", id).maybeSingle();
  if (error || !order) return failure("Order not found", 404);
  const [items, history, payments, receipts] = await Promise.all([
    ctx.db.from("store_order_items").select("*").eq("order_id", id), ctx.db.from("store_order_status_history").select("*").eq("order_id", id).order("created_at"),
    ctx.db.from("store_payments").select("id,provider,provider_reference,amount_paise,state,verified_at,verification_note").eq("order_id", id),
    ctx.db.from("store_receipts").select("id,file_name,created_at").eq("order_id", id),
  ]);
  return json({ order, items: items.data, history: history.data, payments: payments.data, receipts: receipts.data });
}
const schema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("status"), status: z.enum(["preparing","ready_for_pickup","collected","processing","shipped","delivered","cancelled"]), notes: z.string().max(1000).optional(), tracking_reference: z.string().max(200).optional() }),
  z.object({ action: z.literal("payment"), reference: z.string().trim().min(4).max(200), note: z.string().trim().min(8).max(1000) }),
]);
export async function POST(request, { params }) {
  const { id } = await params;
  const ctx = await adminContext(); if (ctx.error) return ctx.error;
  let input; try { input = schema.parse(await bodyOf(request)); } catch { return failure("Invalid order update", 400); }
  if (input.action === "payment" && ctx.session.role !== "owner") return failure("Owner access required", 403);
  const { error } = input.action === "payment" ? await ctx.db.rpc("store_record_offline_payment", { p_order_id: id, p_actor: ctx.session.userId, p_reference: input.reference, p_note: input.note }) :
    await ctx.db.rpc("store_transition_order", { p_order_id: id, p_new_status: input.status, p_actor: ctx.session.userId, p_notes: input.notes || null, p_tracking_reference: input.tracking_reference || null });
  return error ? failure(error.message, 409) : json({ ok: true });
}
