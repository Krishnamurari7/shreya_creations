const IMAGE_FILE = /\.(?:avif|gif|jpe?g|png|webp)$/i;
const THUMBNAIL_FILE = /-thumb\.(?:avif|gif|jpe?g|png|webp)$/i;

/** List images already saved in the public Supabase media bucket. */
export async function listStorageGalleryImages(supabase, maxImages = 1000) {
  const bucket = supabase.storage.from("media");
  const folders = [""];
  const images = [];
  let visited = 0;

  while (folders.length && visited < 30 && images.length < maxImages) {
    const folder = folders.shift();
    visited += 1;
    for (let offset = 0; offset < 5000 && images.length < maxImages; offset += 1000) {
      const { data, error } = await bucket.list(folder, { limit: 1000, offset });
      if (error) throw error;
      for (const entry of data || []) {
        const path = folder ? `${folder}/${entry.name}` : entry.name;
        if (!entry.metadata) {
          folders.push(path);
        } else if (IMAGE_FILE.test(entry.name) && !THUMBNAIL_FILE.test(entry.name)) {
          const { data: publicUrl } = bucket.getPublicUrl(path);
          images.push({
            id: path,
            file_path: path,
            public_url: publicUrl.publicUrl,
            alt_text_en: "",
            alt_text_hi: "",
            created_at: entry.created_at || "",
            storage_only: true,
          });
        }
      }
      if (!data || data.length < 1000) break;
    }
  }

  return images.sort((a, b) => b.created_at.localeCompare(a.created_at));
}
