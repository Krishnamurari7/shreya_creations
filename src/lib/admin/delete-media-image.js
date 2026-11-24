async function readMediaResponse(response) {
  const body = await response.text();
  let result;
  try {
    result = JSON.parse(body);
  } catch {
    throw new Error("Could not check the image. Please refresh the admin page and try again.");
  }
  if (!response.ok) throw new Error(result.error || "Could not check the image.");
  return result;
}

export async function getMediaImageUsage(path) {
  const response = await fetch(`/api/admin/media?path=${encodeURIComponent(path)}`, { cache: "no-store" });
  return readMediaResponse(response);
}

export async function deleteUnusedMediaImage(path) {
  const response = await fetch("/api/admin/media", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path }),
  });
  return readMediaResponse(response);
}
