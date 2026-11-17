import { z } from "zod";
import { adminContext, bodyOf, failure, json } from "@/lib/student-store/http";
export const dynamic = "force-dynamic";
const schema = z.object({ variant_id: z.uuid(), delta: z.number().int().min(-100000).max(100000).refine(x => x !== 0), reason: z.enum(["receive","adjust"]), notes: z.string().trim().min(4).max(1000) });
export async function POST(request) {
  const ctx = await adminContext(); if (ctx.error) return ctx.error;
  let input; try { input = schema.parse(await bodyOf(request)); } catch { return failure("Invalid stock adjustment", 400); }
  const { data, error } = await ctx.db.rpc("store_adjust_inventory", { p_variant_id: input.variant_id, p_delta: input.delta, p_actor: ctx.session.userId, p_reason: input.reason, p_notes: input.notes });
  return error ? failure(error.message, 409) : json({ on_hand: data });
}
