import StoreShell from "@/components/student-store/StoreShell";
import CartClient from "@/components/student-store/CartClient";
export const metadata = { title: "Your Student Store Cart" };
export default function CartPage() { return <StoreShell title="Your cart" description="Stock and prices are checked again before your order is placed."><CartClient /></StoreShell>; }
