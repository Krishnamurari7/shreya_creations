import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/supabase/auth";

/** Admin-only cache bust after CMS saves. */
export async function POST(request) {
  const session = await requireAdmin();
  if (!session.ok) {
    return NextResponse.json({ error: session.message }, { status: session.status });
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const paths = Array.isArray(body.paths) ? body.paths : ["/", "/courses", "/shop", "/portfolio", "/blog"];
  const tags = Array.isArray(body.tags) ? body.tags : ["site-content"];

  for (const path of paths) {
    if (typeof path === "string" && path.startsWith("/")) {
      revalidatePath(path);
    }
  }
  for (const tag of tags) {
    if (typeof tag === "string") revalidateTag(tag);
  }

  return NextResponse.json({ ok: true, paths, tags });
}
