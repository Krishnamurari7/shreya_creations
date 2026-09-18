/**
 * Upload remaining local public default images to Supabase media bucket,
 * then print the public URL map for MEDIA constants.
 */
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const env = {};
for (const line of fs.readFileSync(path.join(root, ".env.local"), "utf8").split(/\r?\n/)) {
  if (!line || line.startsWith("#")) continue;
  const i = line.indexOf("=");
  if (i < 0) continue;
  env[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
}

const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const LOCAL_FILES = [
  "slider1.webp",
  "slider2.webp",
  "slider3.webp",
  "slider4.webp",
  "slider1-poster.webp",
  "slider2-poster.webp",
  "hero_studio_banner.webp",
  "boutique.webp",
  "institute.webp",
  "job.webp",
  "atelier_details.webp",
  "background.webp",
  "background-mobile.webp",
  "3d-sm.webp",
  "logo-nav-sm.webp",
  "founders/sanjay-kumar-mishra.webp",
  "founders/sangi-shreya.webp",
  "categories/bridal.webp",
  "categories/ethnic-wear.webp",
  "categories/stitching.webp",
  "categories/fashion-designing.webp",
  "categories/beauty.webp",
];

const mime = (p) => (p.endsWith(".png") ? "image/png" : p.endsWith(".jpg") || p.endsWith(".jpeg") ? "image/jpeg" : "image/webp");

const map = {};
for (const rel of LOCAL_FILES) {
  const abs = path.join(root, "public", rel);
  if (!fs.existsSync(abs)) {
    console.log("SKIP missing", rel);
    continue;
  }
  const dest = `site-defaults/${rel.replace(/\\/g, "/")}`;
  const buf = fs.readFileSync(abs);
  const { error } = await admin.storage.from("media").upload(dest, buf, {
    contentType: mime(rel),
    upsert: true,
  });
  if (error) {
    console.log("FAIL", rel, error.message);
    continue;
  }
  const { data } = admin.storage.from("media").getPublicUrl(dest);
  map[rel] = data.publicUrl;
  console.log("OK", rel, "->", data.publicUrl);
}

fs.writeFileSync(path.join(root, "scripts/_uploaded-default-images.json"), JSON.stringify(map, null, 2));
console.log("\nWrote scripts/_uploaded-default-images.json");
