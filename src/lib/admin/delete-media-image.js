export async function deleteUnusedMediaImage(path) {
  const response = await fetch("/api/admin/media", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path }),
  });

  const body = await response.text();
  let result;
  try {
    result = JSON.parse(body);
  } catch {
    throw new Error("Could not delete image. Please refresh the admin page and try again.");
  }
  if (!response.ok) {
    throw new Error(result.error || "Could not delete image.");
  }
  return result;
}
