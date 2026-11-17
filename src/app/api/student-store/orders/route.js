import { customerContext, failure, json } from "@/lib/student-store/http";
export const dynamic = "force-dynamic";
export async function GET() {
  const ctx = await customerContext(); if (ctx.error) return ctx.error;
  const { data, error } = await ctx.db.from("store_orders").select("id,placed_at,total_paise,delivery_method,payment_state,fulfillment_status").eq("user_id", ctx.user.id).order("placed_at", { ascending: false }).limit(100);
  return error ? failure("Orders could not be loaded", 500) : json({ orders: data });
}
