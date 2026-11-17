import { z } from "zod";
import { customerContext, bodyOf, failure, json } from "@/lib/student-store/http";
import { cartDetails } from "@/lib/student-store/server";

export const dynamic = "force-dynamic";
const itemSchema = z.object({ variant_id: z.uuid().nullable().optional(), kit_id: z.uuid().nullable().optional(), quantity: z.number().int().min(0).max(100) }).refine(x => !!x.variant_id !== !!x.kit_id);
export async function GET() {
  const ctx = await customerContext(); if (ctx.error) return ctx.error;
  try { return json(await cartDetails(ctx.db, ctx.user.id)); }
  catch (e) { console.error("store cart", e.message); return failure("Cart could not be loaded", 500); }
}
export async function POST(request) {
  const ctx = await customerContext(); if (ctx.error) return ctx.error;
  let input;
  try { input = itemSchema.parse(await bodyOf(request)); } catch { return failure("Invalid cart item", 400); }
  const { error } = await ctx.db.rpc("store_set_cart_item", { p_user_id: ctx.user.id, p_variant_id: input.variant_id || null, p_kit_id: input.kit_id || null, p_quantity: input.quantity });
  if (error) return failure(error.message, error.code === "42501" ? 403 : 409);
  return json(await cartDetails(ctx.db, ctx.user.id));
}
