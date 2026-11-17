import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
export async function GET(request) {
  const url = new URL(request.url); const code = url.searchParams.get("code"); const db = await createClient();
  if (code && db) { const { error } = await db.auth.exchangeCodeForSession(code); if (!error) return NextResponse.redirect(new URL("/student-store/my-orders", url.origin)); }
  return NextResponse.redirect(new URL("/student-store/login?error=confirmation", url.origin));
}
