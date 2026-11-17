import { Suspense } from "react";
import StoreShell from "@/components/student-store/StoreShell";
import CatalogBrowser from "@/components/student-store/CatalogBrowser";
export const metadata = { title: "Student Store Products" };
export default function ProductsPage() { return <StoreShell title="Explore sewing essentials" description="Search actual products and course kits, then choose the exact variant you need."><Suspense fallback={<p>Loading catalog…</p>}><CatalogBrowser /></Suspense></StoreShell>; }
