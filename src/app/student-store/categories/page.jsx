import Link from "next/link";
import StoreShell from "@/components/student-store/StoreShell";
import { storeDb, signedImage } from "@/lib/student-store/server";
export const dynamic = "force-dynamic";
export const metadata = { title: "Student Store Categories" };
export default async function CategoriesPage() {
  const db = storeDb(); const { data: categories } = db ? await db.from("store_categories").select("id,name,slug,description,image_path,image_alt").eq("published", true).order("display_order") : { data: [] };
  const cards = await Promise.all((categories || []).map(async c => ({ ...c, image: c.image_path ? await signedImage(db, c.image_path) : null })));
  return <StoreShell title="Shop by category" description="Find the tools and materials that match your project."><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{cards.map((c,i) => <Link href={`/student-store/products?category=${c.slug}`} key={c.id} className="relative min-h-56 rounded-2xl overflow-hidden border border-[#6b4933] bg-cover" style={{ backgroundImage: `url('${c.image || "/student-store-tools.webp"}')`, backgroundPosition: `${i*25}% center` }}><div className="absolute inset-0 bg-gradient-to-t from-[#120b08] via-[#120b08]/55 to-transparent"/><div className="absolute bottom-0 p-6"><h2 className="font-serif text-2xl">{c.name}</h2><p className="text-[#dbc4b0] text-sm mt-2">{c.description || "Explore available products"}</p></div></Link>)}</div></StoreShell>;
}
