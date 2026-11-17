import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { storeUser } from "./server";
import { requireAdmin, requireOwner } from "@/lib/supabase/auth";

export function json(data, status = 200) { return NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } }); }
export function failure(message, status = 400) { return json({ error: message }, status); }
export function sameOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try { return new URL(origin).host === new URL(request.url).host; } catch { return false; }
}
export async function bodyOf(request, max = 20000) {
  if (!sameOrigin(request)) throw new Error("Forbidden origin");
  const raw = await request.text();
  if (raw.length > max) throw new Error("Request too large");
  return JSON.parse(raw);
}
export async function customerContext() {
  const user = await storeUser();
  const db = createAdminClient();
  if (!db) return { error: failure("Store temporarily unavailable", 503) };
  if (!user) return { error: failure("Sign in to continue", 401) };
  return { user, db };
}
export async function adminContext(owner = false) {
  const session = owner ? await requireOwner() : await requireAdmin();
  if (!session.ok) return { error: failure(session.message, session.status) };
  const db = createAdminClient();
  if (!db) return { error: failure("Store temporarily unavailable", 503) };
  return { session, db };
}
