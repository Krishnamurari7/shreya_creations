import { notFound } from "next/navigation";
import StoreShell from "@/components/student-store/StoreShell";
import AddToCart from "@/components/student-store/AddToCart";
import StoreGallery from "@/components/student-store/StoreGallery";
import { storeDb, productCards, signedImage, storeSettings } from "@/lib/student-store/server";
import { formatMoney } from "@/lib/student-store/format";
export const dynamic = "force-dynamic";
export default async function ProductDetail({ params }) {
  const { slug } = await params; const db = storeDb(); if (!db) notFound();
  const { data: row } = await db.from("store_products").select("id").eq("slug", slug).eq("published", true).is("archived_at", null).maybeSingle();
  if (!row) notFound();
  const product = (await productCards(db, { ids: [row.id], limit: 1 }))[0]; if (!product) notFound();
  const [{ data: images }, settings] = await Promise.all([db.from("store_product_images").select("object_path,alt_text").eq("product_id", product.id).order("display_order").limit(5), storeSettings(db)]);
  const photos = await Promise.all((images || []).map(async i => ({ src: await signedImage(db, i.object_path), alt: i.alt_text })));
  return <StoreShell title={product.name} eyebrow={product.category?.name} description={product.description || "Choose an available variant to see its real price and stock."}>
    <div className="grid lg:grid-cols-2 gap-10"><StoreGallery photos={photos} fallbackAlt="Sewing tools illustration; product image pending" />
      <div><p className="text-[#f2a979] text-2xl font-semibold">From {formatMoney(product.price_paise)}</p><p className="mt-3 text-[#d7bdab]">Sold per {product.unit}. {product.available ? `${product.available} across available variants` : "Currently out of stock"}.</p>
        {product.usage && <section className="mt-6"><h2 className="font-serif text-2xl">How to use</h2><p className="text-[#d7bdab] mt-2">{product.usage}</p></section>}
        {Object.keys(product.specifications || {}).length > 0 && <section className="mt-6"><h2 className="font-serif text-2xl">Specifications</h2><dl className="mt-3 space-y-2">{Object.entries(product.specifications).map(([key,value]) => <div key={key} className="flex gap-5 border-b border-[#614535] pb-2"><dt className="min-w-28 text-[#c8aa96]">{key}</dt><dd>{value}</dd></div>)}</dl></section>}
        {product.compatible_models && <p className="mt-4 text-sm">Compatible models: {product.compatible_models}</p>}
        <AddToCart kind="product" item={product} />
        <div className="mt-8 text-sm text-[#d7bdab] space-y-2"><p>Pickup: {settings.pickup_enabled ? "Available at checkout" : "Not currently offered"}</p><p>Home delivery: {settings.home_delivery_enabled ? "Available for configured PIN codes" : "Not currently offered"}</p><p>Returns: {settings.return_policy || "Ask the institute for the applicable policy before ordering."}</p><p>Replacement: {settings.replacement_policy || "Ask the institute for the applicable policy before ordering."}</p></div>
      </div>
    </div>
  </StoreShell>;
}
