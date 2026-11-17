import { Suspense } from "react";
import StoreShell from "@/components/student-store/StoreShell";
import StoreLogin from "@/components/student-store/StoreLogin";
export const metadata = { title: "Student Store Sign In", robots: { index: false } };
export default function LoginPage() { return <StoreShell title="Sign in to the Student Store" description="Use your existing Shreya account or create a compatible Supabase account."><Suspense><StoreLogin /></Suspense></StoreShell>; }
