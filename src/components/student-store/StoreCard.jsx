import Link from "next/link";
import { formatMoney } from "@/lib/student-store/format";
export default function StoreCard({ item, kind = "product" }) {
  const href = `/student-store/${kind === "kit" ? "kits" : "product"}/${item.slug}`;
  return <article className="overflow-hidden rounded-2xl border border-[#634637] bg-[#211815] transition hover:border-[#d17a45] hover:-translate-y-1">
    <Link href={href} className="block aspect-[4/3] bg-[#30241f] relative overflow-hidden">
      {item.image?.src ? <img src={item.image.src} alt={item.image.alt || item.name} className="h-full w-full object-cover" /> : <div className="h-full flex flex-col items-center justify-center bg-[url('/student-store-tools.webp')] bg-cover bg-center"><span className="absolute inset-0 bg-[#1b120e]/70"/><span className="relative text-xs uppercase tracking-[.2em] text-[#f3d0aa]">Image coming soon</span></div>}
      {item.available < 1 && <span className="absolute right-3 top-3 rounded-full bg-[#1a100c]/90 px-3 py-1 text-xs text-white">Out of stock</span>}
    </Link>
    <div className="p-5"><p className="text-[11px] uppercase tracking-[.17em] text-[#e5aa7d]">{kind === "kit" ? item.courses?.title || "Student kit" : item.category?.name || "Student essentials"}</p><h3 className="font-serif text-xl mt-2 min-h-14"><Link href={href}>{item.name}</Link></h3>
      {kind === "kit" && <p className="text-xs text-[#c6ada0] mt-1">{item.components?.length || 0} included items</p>}
      <div className="flex items-center justify-between gap-3 mt-5"><p className="font-semibold text-[#f3ad75]">{item.price_paise != null ? `${kind === "product" ? "From " : ""}${formatMoney(item.price_paise)}` : "Price pending"}</p><Link href={href} className="rounded-full border border-[#cb6932] px-4 py-2 text-xs font-bold text-[#ffbe8a] hover:bg-[#cb6932] hover:text-white">View details</Link></div>
    </div>
  </article>;
}
