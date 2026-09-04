/**
 * Apply institute/courses page SEO via Supabase REST (merge into pages.courses, preserve other keys).
 * Reads with anon key; writes with service role from argv or .env.local.
 *
 * Usage:
 *   node scripts/apply-courses-seo.mjs
 *   node scripts/apply-courses-seo.mjs YOUR_SERVICE_ROLE_KEY
 */
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnv() {
  const path = resolve(root, ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

const COURSES_SEO_PATCH = {
  meta_title: "Best Fashion Institute in Patna | Shreya Creation",
  meta_description:
    "Join the Best Fashion Institute in Patna for practical fashion designing, stitching, boutique management, blouse making, & career-focused training.",
  header_eyebrow: "Best Fashion Institute in Patna",
  header_title: "Fashion Designing Stitching & Boutique master Courses in Patna",
  header_title_hi: "पटना में फैशन डिजाइनिंग, सिलाई और बुटीक मास्टर कोर्स",
  header_highlight: "",
  header_highlight_hi: "",
  header_subtitle:
    "Fashion is not just about drawing pretty designs; it's about knowing how to realize them. At Shreya Creation, we blend creativity, craftsmanship, and industry insights to assist emerging designers in turning their dreams into reality.",
  intro_body:
    "We, at the Best Fashion Institute in Patna, emphasize \"learning through practice\" and teach everything related to stitching, pattern making, embroidery, garment making, and boutique management.",
  intro_cta_primary: "Check Our Programs",
  intro_cta_secondary: "Book Your free demo class",
  intro_cta_secondary_hi: "अपनी मुफ़्त डेमो क्लास बुक करें",
  seo_practical_title: "A Fashion Design Institute in Patna Focused on Practical Training",
  seo_practical_body:
    "Are you looking for the best fashion design institute in Patna that offers practical training to develop your skills? Then visit Shreya Creation, where you can learn from scratch to create professional garments using all practical methods.\n\nWe will teach you everything, right from understanding fabrics, measurements, cutting, and sewing to finishing and design development.",
  seo_practical_tagline: "Learn. Practice. Master. Create.",
  seo_practical_cta: "Explore our Fashion Courses",
  seo_classes_title: "Fashion Designing Classes in Patna That Will Teach You to Create",
  seo_classes_body:
    "Great designers are not created just by learning techniques – great designers are created by practicing them.\n\nOur Fashion Designing Courses in Patna are meant for those students who want real hands-on experience with various aspects of fashion designing.\n\nBe it learning a new skill or improving your existing skills, we make sure that you grow into a confident designer, piece by piece.",
  seo_classes_tagline: "From Learning to Mastering – The Journey Begins Here",
  seo_classes_cta: "Book Your Free Demo Class",
  seo_stitching_title: "Master The Craft That Turns Fabric Into Fashion",
  seo_stitching_body:
    "The stitching classes in Patna revolve around garment making, measuring, cutting, stitching, and finishing skills.\n\nThere is much more: learn specialised courses like Designer Blouse Stitching in Patna and get to learn about construction, designing, and finishing of garments.",
  seo_stitching_tagline: "Learn the Stitch. Master the Fit. Elevate the Finish.",
  seo_stitching_cta: "Stitching Program Courses",
  seo_boutique_title: "Boutique Management Course in Patna – From Skill to Business",
  seo_boutique_body:
    "Creating fashionable attire is one thing, while turning that skill into a profitable business is another thing altogether.\n\nOur boutique management course in Patna is geared towards those interested in learning the basics of operating a fashion business, from product development to costing, pricing, dealing with customers, order processing, and operating boutiques.",
  seo_boutique_steps:
    "Learn The Skill → Gain Confidence → Take Orders → Generate Income → Run Your Boutique",
  seo_closing_title: "Your Fashion Journey Starts Here",
  seo_closing_body:
    "There is no need to wait for the \"perfect moment\" before starting on your fashion journey.\n\nIf you wish to be a professional designer, learn to stitch, master designer blouse designing, work in the fashion industry, or open your very own boutique, Shreya Creation has everything needed to take the first step.",
};

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.argv[2] || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anon) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
  process.exit(1);
}

const headers = (key) => ({
  apikey: key,
  Authorization: `Bearer ${key}`,
  "Content-Type": "application/json",
});

const readRes = await fetch(`${url}/rest/v1/settings?id=eq.1&select=pages`, {
  headers: { ...headers(anon), Accept: "application/json" },
});

if (!readRes.ok) {
  console.error("Read failed:", readRes.status, await readRes.text());
  process.exit(1);
}

const [row] = await readRes.json();
const pages = row?.pages && typeof row.pages === "object" ? { ...row.pages } : {};
const courses = pages.courses && typeof pages.courses === "object" ? { ...pages.courses } : {};
pages.courses = { ...courses, ...COURSES_SEO_PATCH };

if (!serviceKey) {
  console.error("No SUPABASE_SERVICE_ROLE_KEY — add to .env.local or pass as first argument.");
  console.error("SQL fallback: supabase/migrations/courses_seo_fashion_institute_patna.sql");
  process.exit(1);
}

const writeRes = await fetch(`${url}/rest/v1/settings?id=eq.1`, {
  method: "PATCH",
  headers: { ...headers(serviceKey), Prefer: "return=minimal" },
  body: JSON.stringify({ pages, updated_at: new Date().toISOString() }),
});

if (!writeRes.ok) {
  console.error("Write failed:", writeRes.status, await writeRes.text());
  process.exit(1);
}

console.log("Applied institute/courses SEO to settings.pages.courses (merged, not overwritten).");
