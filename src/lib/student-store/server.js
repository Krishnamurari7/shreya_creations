import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const storeDb = () => createAdminClient();
export const money = (paise = 0) => `₹${(Number(paise) / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export async function storeUser() {
  const client = await createClient();
  if (!client) return null;
  const { data: { user }, error } = await client.auth.getUser();
  return error ? null : user;
}

export async function storeSettings(db) {
  const { data, error } = await db.from("store_settings").select("*").eq("id", true).single();
  if (error) throw error;
  return data;
}

export async function signedImage(db, path) {
  if (!path) return null;
  const { data } = await db.storage.from("store-images").createSignedUrl(path, 3600);
  return data?.signedUrl || null;
}

async function imagesFor(db, table, key, ids) {
  if (!ids.length) return new Map();
  const { data, error } = await db.from(table).select(`${key},object_path,alt_text`).in(key, ids).order("display_order");
  if (error) throw error;
  const first = new Map();
  for (const row of data || []) if (!first.has(row[key])) first.set(row[key], row);
  return new Map(await Promise.all([...first].map(async ([id, row]) => [id, { src: await signedImage(db, row.object_path), alt: row.alt_text }])));
}

async function variantAvailability(db, ids) {
  if (!ids.length) return new Map();
  const { data, error } = await db.from("store_inventory").select("variant_id,on_hand,reserved").in("variant_id", ids);
  if (error) throw error;
  return new Map((data || []).map(x => [x.variant_id, Math.max(0, x.on_hand - x.reserved)]));
}

export async function productCards(db, { ids: selectedIds, category, course, search, min, max, stockOnly = false, sort = "newest", page = 1, limit = 12 } = {}) {
  let order = selectedIds, totalCount = selectedIds?.length || 0;
  if (!selectedIds) {
    const { data, error } = await db.rpc("store_catalog_product_ids", {
      p_search: search?.replaceAll("%", "").replaceAll("_", "") || null,
      p_category_slug: category || null, p_course_id: course || null,
      p_min_price: min, p_max_price: max, p_stock_only: stockOnly,
      p_sort: sort, p_limit: limit, p_offset: (page - 1) * limit,
    });
    if (error) throw error;
    order = (data || []).map(row => row.product_id);
    totalCount = Number(data?.[0]?.total_count || 0);
  }
  if (!order?.length) { const empty = []; empty.totalCount = totalCount; return empty; }
  const { data: products, error } = await db.from("store_products").select("id,name,slug,description,usage,compatible_models,specifications,unit,created_at,category_id,store_categories!inner(name,slug,published)")
    .in("id", order).eq("published", true).is("archived_at", null).eq("store_categories.published", true);
  if (error) throw error;
  if (!products?.length) { const empty = []; empty.totalCount = totalCount; return empty; }
  const ids = products.map(p => p.id);
  const { data: variants, error: ve } = await db.from("store_product_variants").select("id,product_id,sku,attributes,price_paise,tax_rate_bps,active").in("product_id", ids).eq("active", true).not("tax_rate_bps", "is", null);
  if (ve) throw ve;
  const available = await variantAvailability(db, (variants || []).map(v => v.id));
  const cards = products.map(p => {
    const choices = (variants || []).filter(v => v.product_id === p.id).map(v => ({ ...v, available: available.get(v.id) || 0 }));
    return { ...p, category: p.store_categories, variants: choices, price_paise: choices.length ? Math.min(...choices.map(v => Number(v.price_paise))) : null,
      available: choices.reduce((n, v) => n + v.available, 0) };
  });
  const byId = new Map(cards.map(card => [card.id, card]));
  const selected = order.map(id => byId.get(id)).filter(card => card?.variants.length);
  const images = await imagesFor(db, "store_product_images", "product_id", selected.map(p => p.id));
  const result = selected.map(p => ({ ...p, image: images.get(p.id) || null }));
  result.totalCount = totalCount;
  return result;
}

export async function kitCards(db, { ids: selectedIds, course, search, stockOnly = false, limit = 30 } = {}) {
  let query = db.from("store_kits").select("id,name,slug,description,specifications,price_paise,tax_rate_bps,course_id,excluded_items,courses(title)").eq("published", true).is("archived_at", null).not("tax_rate_bps", "is", null).order("created_at", { ascending: false }).limit(100);
  if (selectedIds) { if (!selectedIds.length) return []; query = query.in("id", selectedIds); }
  if (course) query = query.eq("course_id", course);
  if (search) query = query.ilike("name", `%${search.replaceAll("%", "").replaceAll("_", "")}%`);
  const { data: kits, error } = await query;
  if (error) throw error;
  if (!kits?.length) return [];
  const { data: components, error: ce } = await db.from("store_kit_components").select("kit_id,variant_id,required_quantity,store_product_variants(sku,attributes,active,store_products(name,published,archived_at))").in("kit_id", kits.map(k => k.id));
  if (ce) throw ce;
  const available = await variantAvailability(db, (components || []).map(c => c.variant_id));
  const cards = kits.map(k => {
    const parts = (components || []).filter(c => c.kit_id === k.id);
    const valid = parts.length > 0 && parts.every(c => c.store_product_variants?.active && c.store_product_variants?.store_products?.published && !c.store_product_variants?.store_products?.archived_at);
    return { ...k, components: valid ? parts : [], available: valid ? Math.min(...parts.map(c => Math.floor((available.get(c.variant_id) || 0) / c.required_quantity))) : 0 };
  });
  const selected = cards.filter(k => k.components.length && (!stockOnly || k.available > 0)).slice(0, limit);
  const images = await imagesFor(db, "store_kit_images", "kit_id", selected.map(k => k.id));
  return selected.map(k => ({ ...k, image: images.get(k.id) || null }));
}

export async function cartDetails(db, userId) {
  const { data: cart } = await db.from("store_carts").select("id").eq("user_id", userId).maybeSingle();
  if (!cart) return { items: [], subtotal_paise: 0, tax_paise: 0, discount_paise: 0 };
  const { data: rows, error } = await db.from("store_cart_items").select("id,quantity,variant_id,kit_id").eq("cart_id", cart.id).order("created_at");
  if (error) throw error;
  const variantIds = (rows || []).map(r => r.variant_id).filter(Boolean);
  const { data: cartVariants, error: cartVariantError } = variantIds.length ? await db.from("store_product_variants").select("id,product_id").in("id", variantIds) : { data: [] };
  if (cartVariantError) throw cartVariantError;
  const productIds = [...new Set((cartVariants || []).map(v => v.product_id))];
  const kitIds = (rows || []).map(r => r.kit_id).filter(Boolean);
  const [products, kits, settings, links] = await Promise.all([
    productCards(db, { ids: productIds, limit: productIds.length }), kitCards(db, { ids: kitIds, limit: kitIds.length }), storeSettings(db),
    db.from("store_student_links").select("registration_id,student_registrations!inner(status)").eq("user_id", userId).eq("student_registrations.status", "admitted"),
  ]);
  const discountBps = settings.student_discount_enabled && links.data?.length ? settings.student_discount_bps || 0 : 0;
  let subtotal = 0, tax = 0, discount = 0;
  const items = (rows || []).map(row => {
    const p = row.variant_id ? products.find(p => p.variants.some(v => v.id === row.variant_id)) : null;
    const k = row.kit_id ? kits.find(k => k.id === row.kit_id) : null;
    const v = p?.variants.find(v => v.id === row.variant_id);
    const unit = Number(v?.price_paise ?? k?.price_paise ?? 0);
    const rate = v?.tax_rate_bps ?? k?.tax_rate_bps;
    const gross = unit * row.quantity;
    const lineDiscount = Math.round(gross * discountBps / 10000);
    const lineTax = rate == null ? null : Math.round((gross - lineDiscount) * rate / 10000);
    subtotal += gross; discount += lineDiscount; tax += lineTax || 0;
    return { ...row, kind: p ? "product" : "kit", name: p?.name || k?.name || "Unavailable item", slug: p?.slug || k?.slug,
      image: p?.image || k?.image, variant: v?.attributes, unit_price_paise: unit, tax_rate_bps: rate,
      available: v?.available ?? k?.available ?? 0, unavailable: !(p || k) || rate == null || (v?.available ?? k?.available ?? 0) < row.quantity,
      line_discount_paise: lineDiscount, line_tax_paise: lineTax, line_total_paise: gross - lineDiscount + (lineTax || 0) };
  });
  const demand = new Map();
  for (const item of items) {
    if (item.variant_id) demand.set(item.variant_id, (demand.get(item.variant_id) || 0) + item.quantity);
    if (item.kit_id) {
      const kit = kits.find(k => k.id === item.kit_id);
      for (const part of kit?.components || []) demand.set(part.variant_id, (demand.get(part.variant_id) || 0) + item.quantity * part.required_quantity);
    }
  }
  const stock = await variantAvailability(db, [...demand.keys()]);
  const short = new Set([...demand].filter(([id, quantity]) => quantity > (stock.get(id) || 0)).map(([id]) => id));
  for (const item of items) {
    if (item.variant_id && short.has(item.variant_id)) item.unavailable = true;
    if (item.kit_id && (kits.find(k => k.id === item.kit_id)?.components || []).some(part => short.has(part.variant_id))) item.unavailable = true;
  }
  return { items, subtotal_paise: subtotal, tax_paise: tax, discount_paise: discount, settings };
}
