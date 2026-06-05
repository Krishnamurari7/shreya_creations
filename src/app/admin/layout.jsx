import AdminShell from "@/components/admin/AdminShell";

export const metadata = { title: "Admin — Shreya Creations" };

export default function AdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}
