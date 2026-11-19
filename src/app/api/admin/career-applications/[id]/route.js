import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const reply = (error, status) => NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } });

export async function DELETE(request, { params }) {
  const origin = request.headers.get("origin");
  if (origin) {
    try { if (new URL(origin).host !== new URL(request.url).host) return reply("Forbidden.", 403); }
    catch { return reply("Forbidden.", 403); }
  }
  const session = await requireAdmin();
  if (!session.ok) return reply(session.message, session.status);
  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return reply("Invalid application.", 400);
  const db = createAdminClient();
  if (!db) return reply("Applications are temporarily unavailable.", 503);
  const { data: row, error: readError } = await db.from("career_applications").select("resume_path").eq("id", id).maybeSingle();
  if (readError) return reply("Could not find application.", 500);
  if (!row) return reply("Application not found.", 404);
  const { error: fileError } = await db.storage.from("career-resumes").remove([row.resume_path]);
  if (fileError) return reply("Could not delete resume. Please retry.", 500);
  const { error: deleteError } = await db.from("career_applications").delete().eq("id", id);
  if (deleteError) return reply("Could not delete application. Please retry.", 500);
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
