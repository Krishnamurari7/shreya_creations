import { redirect } from "next/navigation";
import EmployerStaffRequestsAdmin from "@/components/admin/EmployerStaffRequestsAdmin";
import { requireAdmin } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Employer Staff Requests", robots: { index: false, follow: false } };

export default async function EmployerStaffRequestsPage() {
  const session = await requireAdmin();
  if (!session.ok && session.status !== 503) redirect("/admin/login");
  if (!session.ok) return <p className="admin-muted">Supabase is not configured. Connect the existing project to view employer requests.</p>;
  return <EmployerStaffRequestsAdmin userId={session.userId} />;
}
