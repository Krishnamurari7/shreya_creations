import Link from "next/link";
import CartBadge from "./CartBadge";
import RecommendedForStudent from "./RecommendedForStudent";
export default function StoreShell({ children, title, eyebrow, description, lang = "en" }) {
  const hi = lang === "hi";
  return <div className="min-h-screen bg-[#120d0b] text-[#f8f0e5] pt-32 pb-24">
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <nav aria-label="Student Store" className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold uppercase tracking-[.17em] text-[#e5aa7d] mb-9">
        <Link href={hi ? "/hi/student-store" : "/student-store"}>{hi ? "स्टोर होम" : "Store home"}</Link><Link href="/student-store/products">{hi ? "प्रोडक्ट्स" : "Products"}</Link><Link href="/student-store/categories">{hi ? "कैटेगरी" : "Categories"}</Link><CartBadge lang={lang} /><Link href="/student-store/my-orders">{hi ? "मेरे ऑर्डर" : "My orders"}</Link>
      </nav>
      {title && <header className="mb-10 max-w-3xl"><p className="text-[#e68b53] text-xs uppercase tracking-[.26em] font-bold mb-3">{eyebrow || "Shreya Student Store"}</p><h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight">{title}</h1>{description && <p className="mt-4 text-[#ddcaba] leading-relaxed">{description}</p>}</header>}
      {children}
      {hi && <RecommendedForStudent lang="hi" />}
    </div>
  </div>;
}
