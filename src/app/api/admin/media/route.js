import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/auth";
import staticMediaPaths from "@/lib/admin/static-media-paths.json";

const IMAGE_FILE = /\.(?:avif|gif|jpe?g|png|webp)$/i;
const PROTECTED_MEDIA = new Set(staticMediaPaths);

export async function DELETE(request) {
  const session = await requireAdmin();
  if (!session.ok) {
    return NextResponse.json({ error: session.message }, { status: session.status });
  }

  let path;
  try {
    ({ path } = await request.json());
  } catch {
    return NextResponse.json({ error: "Choose an image to delete." }, { status: 400 });
  }

  if (
    typeof path !== "string" || !path || path.length > 500 ||
    path.startsWith("/") || path.includes("..") || /[\\\x00-\x1f]/.test(path) ||
    !IMAGE_FILE.test(path)
  ) {
    return NextResponse.json({ error: "Invalid media image path." }, { status: 400 });
  }
  if (PROTECTED_MEDIA.has(path)) {
    return NextResponse.json({
      error: "This image is used by the website design and cannot be deleted from the Media Library.",
    }, { status: 409 });
  }

  const bucket = session.supabase.storage.from("media");
  const { data: publicUrl } = bucket.getPublicUrl(path);
  const { data: references, error: referenceError } = await session.supabase.rpc(
    "media_asset_references",
    { p_url: publicUrl.publicUrl, p_path: path }
  );
  if (referenceError) {
    return NextResponse.json({ error: "Could not check where this image is used. Nothing was deleted." }, { status: 500 });
  }
  if (references?.length) {
    return NextResponse.json({
      error: `This image is still used in ${references.join(", ")}. Remove it there and save before deleting.`,
      usedBy: references,
    }, { status: 409 });
  }

  const { error: storageError } = await bucket.remove([path]);
  if (storageError) {
    return NextResponse.json({ error: storageError.message }, { status: 500 });
  }

  const { error: libraryError } = await session.supabase
    .from("media_library")
    .delete()
    .eq("file_path", path);
  if (libraryError) {
    return NextResponse.json({ error: "Image file was deleted, but its Media Library entry remains. Retry Delete." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
