import { z } from "zod";
import { adminContext, bodyOf, failure, json } from "@/lib/student-store/http";

export const dynamic = "force-dynamic";
const uuid = z.uuid();
const slug = z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const text = z.string().trim().max(3000);
const schemas = {
  categories: { table: "store_categories", schema: z.object({ name: z.string().trim().min(2).max(120), slug, description: text.nullable().optional(), display_order: z.number().int().default(0), published: z.boolean().default(false) }) },
  products: { table: "store_products", schema: z.object({ category_id: uuid, name: z.string().trim().min(2).max(200), slug, description: text.nullable().optional(), usage: text.nullable().optional(), specifications: z.record(z.string(), z.string()).default({}), compatible_models: text.nullable().optional(), unit: z.enum(["piece","set","metre"]), published: z.boolean().default(false), archived_at: z.iso.datetime().nullable().optional() }) },
  variants: { table: "store_product_variants", schema: z.object({ product_id: uuid, sku: z.string().trim().min(2).max(80), attributes: z.record(z.string(), z.string()).default({}), price_paise: z.number().int().min(0), tax_rate_bps: z.number().int().min(0).max(10000).nullable(), active: z.boolean().default(true) }) },
  kits: { table: "store_kits", schema: z.object({ course_id: uuid, name: z.string().trim().min(2).max(200), slug, description: text.nullable().optional(), specifications: z.record(z.string(), z.string()).default({}), excluded_items: text.nullable().optional(), price_paise: z.number().int().min(0), tax_rate_bps: z.number().int().min(0).max(10000).nullable(), published: z.boolean().default(false), archived_at: z.iso.datetime().nullable().optional() }) },
  components: { table: "store_kit_components", schema: z.object({ kit_id: uuid, variant_id: uuid, required_quantity: z.number().int().min(1).max(1000) }), conflict: "kit_id,variant_id" },
  delivery: { table: "store_delivery_rules", schema: z.object({ pin_code: z.string().regex(/^[0-9]{6}$/), charge_paise: z.number().int().min(0), tax_rate_bps: z.number().int().min(0).max(10000).nullable(), estimate_text: text.nullable().optional(), active: z.boolean().default(false) }) },
  recommendations: { table: "store_course_recommendations", schema: z.object({ course_id: uuid, product_id: uuid.nullable().optional(), kit_id: uuid.nullable().optional(), display_order: z.number().int().default(0) }).refine(x => !!x.product_id !== !!x.kit_id) },
};
const settingsSchema = z.object({ public_shopping: z.boolean(), pickup_enabled: z.boolean(), home_delivery_enabled: z.boolean(), pay_at_pickup_enabled: z.boolean(), cash_on_delivery_enabled: z.boolean(), student_discount_enabled: z.boolean(), student_discount_bps: z.number().int().min(0).max(10000).nullable(), pickup_address: text.nullable(), pickup_hours: text.nullable(), pickup_instructions: text.nullable(), support_email: z.email().nullable().or(z.literal("")), support_phone: text.nullable(), return_policy: text.nullable(), replacement_policy: text.nullable(), cancellation_policy: text.nullable(), store_terms: text.nullable() }).superRefine((x, ctx) => {
  if (x.pickup_enabled && (!x.pay_at_pickup_enabled || !x.pickup_address || !x.pickup_hours)) ctx.addIssue({ code: "custom", message: "Pickup requires pay-at-pickup, address and hours" });
  if (x.home_delivery_enabled && !x.cash_on_delivery_enabled) ctx.addIssue({ code: "custom", message: "Home delivery requires COD" });
  if (x.student_discount_enabled && x.student_discount_bps == null) ctx.addIssue({ code: "custom", message: "Student discount rate is required" });
});
const readResources = {
  ...Object.fromEntries(Object.entries(schemas).map(([key, value]) => [key, value.table])),
  settings: "store_settings", orders: "store_orders", order_items: "store_order_items", payments: "store_payments",
  inventory: "store_inventory", movements: "store_inventory_movements", students: "store_student_links",
  receipts: "store_receipts", courses: "courses", registrations: "student_registrations",
};
export async function GET(_request, { params }) {
  const ctx = await adminContext(); if (ctx.error) return ctx.error;
  const { resource } = await params;
  const table = readResources[resource]; if (!table) return failure("Unknown resource", 404);
  const { data, error } = await ctx.db.from(table).select("*").limit(resource === "orders" ? 200 : 500);
  return error ? failure(error.message, 500) : json({ rows: data });
}
export async function POST(request, { params }) {
  const { resource } = await params;
  const ctx = await adminContext(["settings", "delivery", "students"].includes(resource)); if (ctx.error) return ctx.error;
  if (resource !== "settings" && !schemas[resource]) return failure("Unknown resource", 404);
  let body; try { body = await bodyOf(request); } catch { return failure("Invalid request", 400); }
  if (resource === "settings") {
    const parsed = settingsSchema.safeParse(body);
    if (!parsed.success) return failure(parsed.error.issues[0].message, 400);
    const { data, error } = await ctx.db.from("store_settings").update({ ...parsed.data, updated_at: new Date().toISOString() }).eq("id", true).select().single();
    return error ? failure(error.message, 400) : json({ row: data });
  }
  const config = schemas[resource];
  const parsed = config.schema.safeParse(body);
  if (!parsed.success) return failure(parsed.error.issues[0].message, 400);
  if (resource === "kits" && parsed.data.published) {
    const { count } = await ctx.db.from("store_kit_components").select("*", { count: "exact", head: true }).eq("kit_id", body.id || "00000000-0000-0000-0000-000000000000");
    if (!count) return failure("Add real components before publishing a kit", 400);
  }
  let query;
  if (body.id && resource !== "components") {
    if (!uuid.safeParse(body.id).success) return failure("Invalid ID", 400);
    query = ctx.db.from(config.table).update(["recommendations"].includes(resource) ? parsed.data : { ...parsed.data, updated_at: new Date().toISOString() }).eq("id", body.id).select().single();
  } else if (resource === "components") {
    query = ctx.db.from(config.table).upsert(parsed.data, { onConflict: config.conflict }).select().single();
  } else {
    query = ctx.db.from(config.table).insert(parsed.data).select().single();
  }
  const { data, error } = await query;
  if (error) return failure(error.message, 400);
  if (resource === "variants" && !body.id) await ctx.db.from("store_inventory").insert({ variant_id: data.id, on_hand: 0, reserved: 0 });
  return json({ row: data }, body.id ? 200 : 201);
}
export async function DELETE(request, { params }) {
  const { resource } = await params;
  if (!["components", "recommendations"].includes(resource)) return failure("Deletion is not supported", 405);
  const ctx = await adminContext(); if (ctx.error) return ctx.error;
  let input; try { input = await bodyOf(request); } catch { return failure("Invalid request", 400); }
  let query;
  if (resource === "components" && uuid.safeParse(input.kit_id).success && uuid.safeParse(input.variant_id).success)
    query = ctx.db.from("store_kit_components").delete().eq("kit_id", input.kit_id).eq("variant_id", input.variant_id);
  else if (resource === "recommendations" && uuid.safeParse(input.id).success)
    query = ctx.db.from("store_course_recommendations").delete().eq("id", input.id);
  else return failure("Invalid item", 400);
  const { error } = await query;
  return error ? failure(error.message, 409) : json({ ok: true });
}
