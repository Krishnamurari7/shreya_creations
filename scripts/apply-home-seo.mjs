/**
 * Apply homepage SEO via Supabase REST (merge into pages.home, preserve other keys).
 * Reads with anon key; writes with service role from argv or .env.local.
 *
 * Usage:
 *   node scripts/apply-home-seo.mjs
 *   node scripts/apply-home-seo.mjs YOUR_SERVICE_ROLE_KEY
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

const HOME_SEO_PATCH = {
  meta_title: "Best Boutique in Patna | Shreya Creation",
  meta_description:
    "Discover Shreya Creation, the best boutique in Patna, offering designer bridal wear, custom stitching, stylish outfits, exquisite detailing, and personalised fashion solutions.",
  category_eyebrow: "Where Fashion Meets Creativity, Craft, & Opportunity",
  category_title_before: "",
  category_title_highlight: "One destination. Every expression of fashion.",
  category_title_after: "",
  category_subtitle:
    "Experience the best in designer fashion, quality bridal stitching, and a fashion design institute, all in one place at the best boutique in Patna. Be it crafting your dream wedding outfit or acquiring skills in fashion design, Shreya Creation can be your guide to all things fashion-related.\n\nAt the best boutique in Patna, fashion is not just about choosing what to wear but also involves learning the craft, creating confidently, and wearing something truly your own. With the right fashion designing courses and specialized institute programs, expert boutique stitching made to your measurements and style, Shreya Creation brings all aspects of fashion together. Explore our designer collection, discover intricate bridal and occasion wear, or learn the art of fashion designing and boutique craftsmanship through hands-on training designed to take you from skills to style and from passion to profession.",
  academy_heading: "Boutique Courses & Stitching Classes in Patna",
  academy_heading_highlight: "",
  courses_script_tagline: "Learn It. Create It. Make It Yours.",
  courses_subtitle:
    "Whether you seek to develop a career in fashion or create an outfit that feels truly yours, Shreya Creation provides you with the excellence, craftsmanship, and mentorship to make it happen.\n\nIf you are searching for the best boutique in Patna, explore our custom stitching services at Shreya Creation.",
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
const home = pages.home && typeof pages.home === "object" ? { ...pages.home } : {};
pages.home = { ...home, ...HOME_SEO_PATCH };

if (!serviceKey) {
  console.error("No SUPABASE_SERVICE_ROLE_KEY — add to .env.local or pass as first argument.");
  console.error("SQL fallback: supabase/migrations/home_seo_boutique_patna.sql");
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

console.log("Applied homepage SEO to settings.pages.home (merged, not overwritten).");
