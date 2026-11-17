import StoreShell from "@/components/student-store/StoreShell";
import CheckoutClient from "@/components/student-store/CheckoutClient";
export const metadata = { title: "Student Store Checkout", robots: { index: false } };
export default function CheckoutPage() { return <StoreShell title="Checkout" description="Review current prices, stock, tax and your enabled fulfillment options before placing your order."><CheckoutClient /></StoreShell>; }
