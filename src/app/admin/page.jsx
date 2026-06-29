import { GLASS, TEXT_GOLD_GRADIENT } from "@/lib/ui";
import { cn } from "@/lib/utils";
import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { getSiteSettings, getAdminCounts } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export default async function Dashboard() {
  const [counts, site] = await Promise.all([getAdminCounts(), getSiteSettings()]);
  const configured = isSupabaseConfigured();

  const stats = [
    { label: "Products", value: counts.products, href: "/admin/products" },
    { label: "Courses", value: counts.courses, href: "/admin/courses" },
    { label: "Portfolio", value: counts.portfolio, href: "/admin/portfolio" },
    { label: "Testimonials", value: counts.testimonials, href: "/admin/testimonials" },
    { label: "Trust stats", value: counts.trust, href: "/admin/trust" },
    { label: "FAQs", value: counts.faqs, href: "/admin/faqs" },
    { label: "Inquiries", value: counts.inquiries, href: "/admin/inquiries" },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        subtitle="Manage everything that appears on your public site."
      />

      {!configured ? (
        <div className={cn(GLASS, "mb-6", "rounded-2xl", "p-4", "sm:p-5", "border", "border-marigold/30", "text-marigold", "text-sm", "leading-relaxed")}>
          <strong>Demo mode.</strong> Add Supabase env vars and run <code className="text-gold break-all">supabase/schema.sql</code> to
          enable editing.
        </div>
      ) : (
        <div className={cn(GLASS, "mb-6", "rounded-2xl", "p-4", "sm:p-5", "border", "border-orange/30", "text-orange-light", "text-sm", "leading-relaxed")}>
          <strong>Supabase connected.</strong> Changes you save appear on the live site instantly.
        </div>
      )}

      <div className="admin-stats-grid mb-8">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className={cn(GLASS, "admin-stat-card", "hover:border-gold/40", "transition-colors")}>
            <div className={cn(TEXT_GOLD_GRADIENT, "admin-stat-card__value")}>{s.value}</div>
            <div className="admin-stat-card__label">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className={cn(GLASS, "rounded-2xl", "p-5", "sm:p-6")}>
          <h2 className="text-gold uppercase tracking-[0.2em] text-xs mb-3">WhatsApp number</h2>
          <p className="text-base sm:text-lg break-all">{site.whatsapp}</p>
          <p className="admin-muted mt-2">
            Edit in <Link href="/admin/settings" className="text-gold hover:underline">Settings</Link>.
          </p>
        </div>
        <div className={cn(GLASS, "rounded-2xl", "p-5", "sm:p-6")}>
          <h2 className="text-gold uppercase tracking-[0.2em] text-xs mb-3">Quick links</h2>
          <ul className="text-sm space-y-2">
            <li>
              <Link href="/admin/pages" className="text-gold hover:underline">Page editor</Link>
              <span className="hidden sm:inline"> — All page copy, features & CTAs</span>
            </li>
            <li>
              <Link href="/admin/content" className="text-gold hover:underline">Site content</Link>
              <span className="hidden sm:inline"> — services, process, marquee</span>
            </li>
            <li>
              <Link href="/admin/policies" className="text-gold hover:underline">Policy pages</Link>
            </li>
            <li>
              <Link href="/admin/lookbook" className="text-gold hover:underline">Lookbook</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
