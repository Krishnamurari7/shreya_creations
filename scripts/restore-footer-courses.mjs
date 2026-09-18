/**
 * Restore footer-linked courses missing from Supabase using seed content.
 * Does not invent courses — only upserts seed rows for known footer slugs.
 */
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function loadEnv() {
  const env = {};
  const raw = fs.readFileSync(path.join(root, ".env.local"), "utf8");
  for (const line of raw.split(/\r?\n/)) {
    if (!line || line.startsWith("#")) continue;
    const i = line.indexOf("=");
    if (i < 0) continue;
    env[line.slice(0, i)] = line.slice(i + 1).trim();
  }
  return env;
}

const LOCAL_IMGS = [
  "/slider1.webp",
  "/slider2.webp",
  "/slider3.webp",
  "/background.webp",
  "/background-mobile.webp",
  "/media/atelier-details.webp",
];

/** Authoritative seed payloads for footer destinations (must match src/lib/seed.js). */
const COURSES = [
  {
    slug: "kids-wear-course",
    title: "Kids Wear Course",
    title_hi: "किड्स वियर कोर्स",
    category: "Stitching",
    price: 12000,
    duration: "6 months",
    language: "Hindi",
    published: true,
    coming_soon: true,
    description:
      "Learn to stitch adorable, comfortable kids' outfits — frocks, ethnic sets, western wear, and seasonal styles with safe finishing for children.",
    syllabus: [
      "Kids measurement & sizing basics",
      "Frocks, frock suits & ethnic sets",
      "Kids kurti, salwar & ethnic wear",
      "Western tops, shorts & casual wear",
      "Fabric selection, comfort & finishing",
    ],
    preview_video: "",
    image: LOCAL_IMGS[0],
  },
  {
    slug: "fashion-designing-course",
    title: "Fashion Designing Course",
    title_hi: "फैशन डिज़ाइनिंग कोर्स",
    category: "Fashion Design",
    price: 55000,
    duration: "1.5 years",
    language: "Hindi & English",
    published: true,
    coming_soon: true,
    description:
      "Our flagship fashion design programme — sketching, draping, pattern making, garment construction, embroidery, and portfolio building for a career in fashion.",
    syllabus: [
      "Fashion illustration & design fundamentals",
      "Fabric science, draping & pattern making",
      "Ethnic, western & fusion garment construction",
      "Embroidery, surface ornamentation & detailing",
      "Portfolio, boutique internship & career guidance",
    ],
    preview_video: "",
    image: LOCAL_IMGS[5] || LOCAL_IMGS[0],
  },
];

const env = loadEnv();
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const { data: existing, error: listErr } = await sb.from("courses").select("slug").in(
  "slug",
  COURSES.map((c) => c.slug)
);
if (listErr) {
  console.error("list failed", listErr);
  process.exit(1);
}
const have = new Set((existing || []).map((r) => r.slug));
const missing = COURSES.filter((c) => !have.has(c.slug));
if (!missing.length) {
  console.log("All footer courses already present.");
  process.exit(0);
}

const { data, error } = await sb.from("courses").insert(missing).select("slug,title,published,coming_soon");
if (error) {
  console.error("insert failed", error);
  process.exit(1);
}
console.log("Restored courses:", data);
