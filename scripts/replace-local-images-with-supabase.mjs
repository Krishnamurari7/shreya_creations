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

const MEDIA = `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media`;
const URLS = {
  founderSanjay: `${MEDIA}/1781886543737-7cnjnu.jpeg`,
  founderShreya: `${MEDIA}/1781196462114-6xdquf.jpeg`,
  hero1: `${MEDIA}/1782239288560-v7jdgv.png`,
  hero2: `${MEDIA}/1782239324371-pvtg8u.png`,
  hero3: `${MEDIA}/1782239351751-hx7j4m.png`,
  hero4: `${MEDIA}/1782239321951-oli47t.png`,
  atelier: `${MEDIA}/1780591144093-ouxds5.png`,
  institute: `${MEDIA}/1783527114529-jmf764.jpeg`, // basic boutique / institute feel
  boutique: `${MEDIA}/1781369767660-awo362.jpeg`,
};

const isLocalPath = (v) =>
  typeof v === "string" && v.startsWith("/") && !v.startsWith("//");

function replaceLocalImages(value) {
  if (Array.isArray(value)) return value.map(replaceLocalImages);
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = replaceLocalImages(v);
    return out;
  }
  return value;
}

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

const { data: settings, error } = await sb.from("settings").select("pages").eq("id", 1).single();
if (error) throw error;

const pages = structuredClone(settings.pages || {});

// Home
pages.home = pages.home || {};
pages.home.founder_image = URLS.founderSanjay;
pages.home.mentor_image = URLS.founderShreya;
pages.home.hero_demo_thumb = URLS.hero1;
pages.home.hero_book_thumb = URLS.hero2;
if (!pages.home.hero_image) pages.home.hero_image = URLS.hero1;
if (!Array.isArray(pages.home.hero_images) || pages.home.hero_images.some(isLocalPath) || pages.home.hero_images.length < 3) {
  pages.home.hero_images = [URLS.hero1, URLS.hero2, URLS.hero3, URLS.hero4];
}
if (isLocalPath(pages.home.atelier_image) || !pages.home.atelier_image) {
  pages.home.atelier_image = URLS.atelier;
}
if (isLocalPath(pages.home.collection_image_left) || !pages.home.collection_image_left) {
  pages.home.collection_image_left = URLS.boutique;
}

// About / NRI / others with local hero
if (pages.about) {
  if (isLocalPath(pages.about.hero_image) || !pages.about.hero_image) {
    pages.about.hero_image = URLS.atelier;
  }
}
if (pages.nri) {
  if (isLocalPath(pages.nri.hero_image) || !pages.nri.hero_image) {
    pages.nri.hero_image = URLS.institute;
  }
}
if (pages.shop && isLocalPath(pages.shop.hero_image)) {
  pages.shop.hero_image = URLS.boutique;
}
if (pages.courses && isLocalPath(pages.courses.hero_image)) {
  pages.courses.hero_image = URLS.institute;
}

// Sweep any remaining local image-like fields under pages
for (const [pageKey, page] of Object.entries(pages)) {
  if (!page || typeof page !== "object") continue;
  for (const [field, val] of Object.entries(page)) {
    if (!/image|thumb|poster|banner|photo/i.test(field)) continue;
    if (isLocalPath(val)) {
      console.log(`leftover local ${pageKey}.${field} = ${val}`);
    }
    if (Array.isArray(val) && val.some(isLocalPath)) {
      console.log(`leftover local array ${pageKey}.${field}`, val.filter(isLocalPath));
    }
  }
}

const { error: upErr } = await sb.from("settings").update({ pages }).eq("id", 1);
console.log("update via anon:", upErr?.message || "ok");

if (upErr) {
  const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
  const { error: upErr2 } = await admin.from("settings").update({ pages }).eq("id", 1);
  console.log("update via service:", upErr2?.message || "ok");
}

const { data: verify } = await sb.from("settings").select("pages").eq("id", 1).single();
const h = verify.pages.home;
console.log("verify home images", {
  founder_image: h.founder_image,
  mentor_image: h.mentor_image,
  hero_demo_thumb: h.hero_demo_thumb,
  hero_book_thumb: h.hero_book_thumb,
  atelier_image: h.atelier_image,
  about: verify.pages.about?.hero_image,
  nri: verify.pages.nri?.hero_image,
});
