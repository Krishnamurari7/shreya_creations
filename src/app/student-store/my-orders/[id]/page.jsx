import StoreShell from "@/components/student-store/StoreShell";
import OrderDetailClient from "@/components/student-store/OrderDetailClient";
export const dynamic = "force-dynamic";
export const metadata = { title: "Student Store Order", robots: { index: false } };
export default async function OrderPage({ params, searchParams }) { const { id } = await params; const p = await searchParams; return <StoreShell title="Order details"><OrderDetailClient id={id} placed={p?.placed === "1"} /></StoreShell>; }
