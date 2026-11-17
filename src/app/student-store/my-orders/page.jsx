import StoreShell from "@/components/student-store/StoreShell";
import OrdersClient from "@/components/student-store/OrdersClient";
export const metadata = { title: "My Student Store Orders", robots: { index: false } };
export default function OrdersPage() { return <StoreShell title="My orders" description="See your real order and payment status in one place."><OrdersClient /></StoreShell>; }
