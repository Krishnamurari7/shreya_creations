import "server-only";
import staticMediaPaths from "@/lib/admin/static-media-paths.json";

const TABLES = {
  settings: { label: "Website pages and settings", columns: "*" },
  portfolio: { label: "Portfolio gallery", columns: "id,title,caption,image,og_image" },
  lookbook_posts: { label: "Blog", columns: "id,title,image,og_image,body,body_hi" },
  courses: { label: "Courses", columns: "id,title,image,og_image,preview_video" },
  products: { label: "Boutique products", columns: "id,title,images,og_image" },
  testimonials: { label: "Testimonials", columns: "id,name,photo,video_url" },
  questions: { label: "Quiz questions", columns: "id,question_text,image_url,options" },
  student_registrations: { label: "Student registrations", columns: "id,name,passport_photo_url" },
  users: { label: "User profiles", columns: "id,full_name,avatar_url" },
};

const STATIC_SOURCES = {
  "lib/media.js": "Site-wide default images",
  "lib/boutique-service-landing.js": "Boutique service pages",
  "lib/seed.js": "Default gallery, products or courses",
  "lib/cms/defaults.js": "Default page content",
  "lib/hi-seo.js": "Hindi search preview",
  "lib/json-ld.js": "Search result metadata",
  "lib/boutique-services.js": "Boutique page social preview",
  "app/shop/page.jsx": "Shop page social preview",
  "app/courses/page.jsx": "Courses page social preview",
};

const FIELD_LABELS = {
  award_items: "Recognized & Award Winning carousel",
  hero_image: "Hero image",
  hero_image_mobile: "Mobile hero banner",
  hero_image_tablet: "Tablet hero banner",
  hero_image_desktop: "Desktop hero banner",
  og_image: "Social share image",
  image: "Image",
  images: "Images",
};

function label(value) {
  return FIELD_LABELS[value] || String(value)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/^./, (letter) => letter.toUpperCase());
}

function pathsContaining(value, url, path, trail = [], results = []) {
  if (results.length >= 30) return results;
  if (typeof value === "string") {
    if (value.includes(path) || value.includes(url)) results.push(trail);
  } else if (Array.isArray(value)) {
    value.forEach((item, index) => pathsContaining(item, url, path, [...trail, String(index)], results));
  } else if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => pathsContaining(item, url, path, [...trail, key], results));
  }
  return results;
}

function locationInSettings(parts) {
  if (parts[0] !== "pages") return `Site settings > ${parts.map(label).join(" > ")}`;
  const page = parts[1] === "home" ? "Home page" : parts[1] === "shop" ? "Boutique main page" : `${label(parts[1] || "Page")} page`;
  const section = parts.slice(2).map((part) => /^\d+$/.test(part) ? `Item ${Number(part) + 1}` : label(part));
  return [page, ...section].join(" > ");
}

async function databaseLocations(supabase, table, url, path) {
  const config = TABLES[table];
  if (!config) return [label(table)];

  let query = supabase.from(table).select(config.columns);
  if (table === "settings") query = query.eq("id", 1);
  else query = query.limit(500);
  const { data, error } = await query;
  if (error || !data?.length) return [config.label];

  const results = [];
  for (const row of data) {
    const matches = pathsContaining(row, url, path);
    for (const parts of matches) {
      if (table === "settings") {
        results.push(locationInSettings(parts));
      } else {
        const name = row.title || row.name || row.full_name || row.question_text || row.id;
        const field = parts.map((part) => /^\d+$/.test(part) ? `Item ${Number(part) + 1}` : label(part)).join(" > ");
        results.push(`${config.label}: ${String(name || "Record").slice(0, 65)}${field ? ` (${field})` : ""}`);
      }
    }
    if (results.length >= 30) break;
  }

  return results.length ? results : [config.label];
}

export async function mediaUsage(supabase, path) {
  const { data: publicUrl } = supabase.storage.from("media").getPublicUrl(path);
  const { data: referencedTables, error } = await supabase.rpc("media_asset_references", {
    p_url: publicUrl.publicUrl,
    p_path: path,
  });
  if (error) throw new Error("Could not check where this image is used. Nothing was deleted.");

  const staticLocations = (staticMediaPaths[path] || []).map((source) => STATIC_SOURCES[source] || "Built-in website content");
  const databaseMatches = await Promise.all(
    (referencedTables || []).map((table) => databaseLocations(supabase, table, publicUrl.publicUrl, path))
  );
  return [...new Set([...staticLocations, ...databaseMatches.flat()])].slice(0, 50);
}
