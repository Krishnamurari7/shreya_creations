import { z } from "zod";
import { customerContext, bodyOf, failure, json } from "@/lib/student-store/http";

export const dynamic = "force-dynamic";
const schema = z.object({ idempotency_key: z.uuid(), customer_name: z.string().trim().min(2).max(120),
  mobile: z.string().regex(/^([+]91[ -]?)?[6-9][0-9]{9}$/), email: z.email().max(200).optional().or(z.literal("")),
  delivery_method: z.enum(["pickup", "home_delivery"]), payment_method: z.enum(["pay_at_pickup", "cash_on_delivery"]),
  address: z.object({ line1: z.string().trim().min(5).max(250), line2: z.string().trim().max(250).optional(), city: z.string().trim().min(2).max(100), state: z.string().trim().min(2).max(100), pin_code: z.string().regex(/^[0-9]{6}$/) }).nullable().optional(),
  notes: z.string().max(2000).optional() });
export async function POST(request) {
  const ctx = await customerContext(); if (ctx.error) return ctx.error;
  let input; try { input = schema.parse(await bodyOf(request)); } catch { return failure("Check your checkout details", 400); }
  const { data: id, error } = await ctx.db.rpc("store_place_offline_order", {
    p_user_id: ctx.user.id, p_idempotency_key: input.idempotency_key, p_customer_name: input.customer_name,
    p_mobile: input.mobile, p_email: input.email || null, p_delivery_method: input.delivery_method,
    p_payment_method: input.payment_method, p_address: input.address || null, p_notes: input.notes || null,
  });
  if (error) return failure(error.message, error.code === "42501" ? 403 : 409);
  return json({ order_id: id }, 201);
}
