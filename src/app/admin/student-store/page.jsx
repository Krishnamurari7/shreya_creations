import StudentStoreManager from "@/components/admin/StudentStoreManager";
export const dynamic = "force-dynamic";
export const metadata = { title: "Student Store Management", robots: { index: false } };
export default function AdminStudentStore() { return <div><h1 className="font-display text-3xl mb-2">Student Store Management</h1><p className="text-sm opacity-70 mb-7">Manage real catalog items, shared stock, orders and enabled checkout methods.</p><StudentStoreManager /></div>; }
