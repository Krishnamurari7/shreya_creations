import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/auth";
import { mediaUsage } from "@/lib/admin/media-usage";

const IMAGE_FILE = /\.(?:avif|gif|jpe?g|png|webp)$/i;

function validImagePath(path) {
  return typeof path === "string" && Boolean(path) && path.length <= 500 &&
    !path.startsWith("/") && !path.includes("..") &&
    !/[\\\x00-\x1f]/.test(path) && IMAGE_FILE.test(path);
}

export async function GET(request) {
  const session = await requireAdmin();
  if (!session.ok) {
    return NextResponse.json({ error: session.message }, { status: session.status });
  }

  const path = new URL(request.url).searchParams.get("path");
  if (!validImagePath(path)) {
    return NextResponse.json({ error: "Invalid media image path." }, { status: 400 });
  }
  try {
    const locations = await mediaUsage(session.supabase, path);
    return NextResponse.json({ locations, canDelete: locations.length === 0 });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Could not check image usage." }, { status: 500 });
  }
}

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

  if (!validImagePath(path)) {
    return NextResponse.json({ error: "Invalid media image path." }, { status: 400 });
  }

  let locations;
  try {
    locations = await mediaUsage(session.supabase, path);
  } catch (error) {
    return NextResponse.json({ error: error.message || "Could not check image usage." }, { status: 500 });
  }
  if (locations.length) {
    return NextResponse.json({
      error: "This image is still in use. Remove it from the listed places and save before deleting.",
      locations,
    }, { status: 409 });
  }

  const bucket = session.supabase.storage.from("media");
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
