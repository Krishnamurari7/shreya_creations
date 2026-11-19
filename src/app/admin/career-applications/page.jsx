import { redirect } from "next/navigation";
import CareerApplicationsAdmin from "@/components/admin/CareerApplicationsAdmin";
import { requireAdmin } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Career Applications", robots: { index: false, follow: false } };

export default async function CareerApplicationsPage() {
  const session = await requireAdmin();
  if (!session.ok && session.status !== 503) redirect("/admin/login");
  if (!session.ok) return <p className="admin-muted">Supabase is not configured.</p>;
  return <CareerApplicationsAdmin />;
}
