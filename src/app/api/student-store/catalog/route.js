import { storeDb, productCards, kitCards, storeSettings, signedImage } from "@/lib/student-store/server";
import { json, failure } from "@/lib/student-store/http";

export const dynamic = "force-dynamic";
export async function GET(request) {
  const db = storeDb();
  if (!db) return failure("Store temporarily unavailable", 503);
  const p = new URL(request.url).searchParams;
  const search = (p.get("q") || "").trim().slice(0, 80);
  const category = (p.get("category") || "").slice(0, 100);
  const course = p.get("course") || "";
  const page = Math.max(1, Math.min(100, Number(p.get("page")) || 1));
  const sort = ["newest", "price_asc", "price_desc"].includes(p.get("sort")) ? p.get("sort") : "newest";
  const stockOnly = p.get("stock") === "1";
  const min = p.get("min") ? Math.max(0, Number(p.get("min"))) : null;
  const max = p.get("max") ? Math.max(0, Number(p.get("max"))) : null;
  if ((course && !/^[0-9a-f-]{36}$/i.test(course)) || (min != null && !Number.isSafeInteger(min)) || (max != null && !Number.isSafeInteger(max))) return failure("Invalid filter", 400);
  try {
    const [products, kits, categories, courses, settings] = await Promise.all([
      productCards(db, { category, course, search, min, max, stockOnly, sort, page }),
      kitCards(db, { course, search, stockOnly }),
      db.from("store_categories").select("id,name,slug,description,image_path,image_alt").eq("published", true).order("display_order"),
      db.from("courses").select("id,title").order("title"), storeSettings(db),
    ]);
    if (categories.error || courses.error) throw categories.error || courses.error;
    const publicCategories = await Promise.all((categories.data || []).map(async c => ({ id: c.id, name: c.name, slug: c.slug, description: c.description, image: c.image_path ? { src: await signedImage(db, c.image_path), alt: c.image_alt || c.name } : null })));
    return json({ products, total_count: products.totalCount, kits, categories: publicCategories, courses: courses.data,
      options: { public_shopping: settings.public_shopping, pickup_enabled: settings.pickup_enabled && settings.pay_at_pickup_enabled,
        home_delivery_enabled: settings.home_delivery_enabled && settings.cash_on_delivery_enabled } });
  } catch (error) { console.error("store catalog", error.message); return failure("Catalog could not be loaded", 500); }
}
