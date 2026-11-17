import { customerContext, failure, json } from "@/lib/student-store/http";
import { cartDetails } from "@/lib/student-store/server";
export const dynamic = "force-dynamic";
export async function GET(request) {
  const ctx = await customerContext(); if (ctx.error) return ctx.error;
  const p = new URL(request.url).searchParams, method = p.get("method"), pin = p.get("pin") || "";
  try {
    const cart = await cartDetails(ctx.db, ctx.user.id);
    if (!cart.items.length || cart.items.some(i => i.unavailable)) return failure("Cart contains unavailable items", 409);
    const { settings } = cart;
    const { data: links } = await ctx.db.from("store_student_links").select("registration_id,student_registrations!inner(status)").eq("user_id", ctx.user.id).eq("student_registrations.status", "admitted");
    if (!settings.public_shopping && !links?.length) return failure("A verified admitted student account is required", 403);
    let delivery = 0, shippingTax = 0, estimate = null;
    if (method === "pickup") {
      if (!settings.pickup_enabled || !settings.pay_at_pickup_enabled || !settings.pickup_address || !settings.pickup_hours) return failure("Pickup is not enabled", 409);
    } else if (method === "home_delivery") {
      if (!settings.home_delivery_enabled || !settings.cash_on_delivery_enabled || !/^[0-9]{6}$/.test(pin)) return failure("Enter a serviceable PIN code", 409);
      const { data: rule } = await ctx.db.from("store_delivery_rules").select("charge_paise,tax_rate_bps,estimate_text").eq("pin_code", pin).eq("active", true).maybeSingle();
      if (!rule || rule.tax_rate_bps == null) return failure("Delivery is unavailable for this PIN code", 409);
      delivery = Number(rule.charge_paise); shippingTax = Math.round(delivery * rule.tax_rate_bps / 10000); estimate = rule.estimate_text;
    } else return failure("Select a delivery method", 400);
    return json({ subtotal_paise: cart.subtotal_paise, discount_paise: cart.discount_paise, delivery_paise: delivery,
      tax_paise: cart.tax_paise + shippingTax, total_paise: cart.subtotal_paise - cart.discount_paise + delivery + cart.tax_paise + shippingTax,
      estimate, pickup: method === "pickup" ? { address: settings.pickup_address, hours: settings.pickup_hours, instructions: settings.pickup_instructions } : null });
  } catch (e) { console.error("store quote", e.message); return failure("Quote could not be prepared", 500); }
}
