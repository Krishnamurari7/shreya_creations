import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/auth";
import { uploadMediaImage } from "@/lib/supabase/upload";

export async function POST(request) {
  const session = await requireAdmin();
  if (!session.ok) {
    return NextResponse.json({ error: session.message }, { status: session.status });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const result = await uploadMediaImage(file, {
      altEn: String(form.get("alt_en") || ""),
      altHi: String(form.get("alt_hi") || ""),
      uploadedBy: session.userId,
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed." },
      { status: 500 }
    );
  }
}
