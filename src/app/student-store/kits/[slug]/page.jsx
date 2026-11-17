import { notFound } from "next/navigation";
import StoreShell from "@/components/student-store/StoreShell";
import AddToCart from "@/components/student-store/AddToCart";
import StoreGallery from "@/components/student-store/StoreGallery";
import { storeDb, kitCards, storeSettings, signedImage } from "@/lib/student-store/server";
import { formatMoney } from "@/lib/student-store/format";
export const dynamic = "force-dynamic";
export default async function KitDetail({ params }) {
  const { slug } = await params; const db = storeDb(); if (!db) notFound();
  const { data: row } = await db.from("store_kits").select("id").eq("slug", slug).eq("published", true).is("archived_at", null).maybeSingle();
  if (!row) notFound();
  const kit = (await kitCards(db, { ids: [row.id], limit: 1 }))[0]; if (!kit) notFound();
  const [{ data: images }, settings] = await Promise.all([db.from("store_kit_images").select("object_path,alt_text").eq("kit_id", kit.id).order("display_order").limit(5), storeSettings(db)]);
  const photos = await Promise.all((images || []).map(async i => ({ src: await signedImage(db, i.object_path), alt: i.alt_text })));
  return <StoreShell title={kit.name} eyebrow={kit.courses?.title || "Student kit"} description={kit.description || "Review the actual kit contents before ordering."}>
    <div className="grid lg:grid-cols-2 gap-10"><StoreGallery photos={photos} fallbackAlt="Sewing tools illustration; kit image pending" />
      <div><p className="text-[#f2a979] text-2xl font-semibold">{formatMoney(kit.price_paise)}</p><p className="mt-3 text-[#d7bdab]">{kit.available} kit{kit.available === 1 ? "" : "s"} possible from shared component stock.</p>
        <h2 className="font-serif text-2xl mt-8">Included in this kit</h2><ul className="mt-3 divide-y divide-[#614535]">{kit.components.map(c => <li key={c.variant_id} className="flex justify-between py-3 gap-4"><span>{c.store_product_variants?.store_products?.name} <span className="text-[#bfa492]">{Object.values(c.store_product_variants?.attributes || {}).join(" / ")}</span></span><strong>× {c.required_quantity}</strong></li>)}</ul>
        {Object.keys(kit.specifications || {}).length > 0 && <section className="mt-6"><h2 className="font-serif text-2xl">Kit specifications</h2><dl className="mt-3 space-y-2">{Object.entries(kit.specifications).map(([key,value]) => <div key={key} className="flex gap-5 border-b border-[#614535] pb-2"><dt className="min-w-28 text-[#c8aa96]">{key}</dt><dd>{value}</dd></div>)}</dl></section>}
        {kit.excluded_items && <p className="mt-4 text-sm text-[#d9c0ae]">Not included: {kit.excluded_items}</p>}<AddToCart kind="kit" item={kit} />
        <div className="mt-8 text-sm text-[#d7bdab] space-y-2"><p>Pickup: {settings.pickup_enabled ? "Available at checkout" : "Not currently offered"}</p><p>Home delivery: {settings.home_delivery_enabled ? "Available for configured PIN codes" : "Not currently offered"}</p><p>Returns: {settings.return_policy || "Ask the institute before ordering."}</p><p>Replacement: {settings.replacement_policy || "Ask the institute before ordering."}</p></div>
      </div>
    </div>
  </StoreShell>;
}
