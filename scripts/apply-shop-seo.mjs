/**
 * Apply boutique/shop page SEO via Supabase REST (merge into pages.shop).
 *
 * Usage:
 *   node scripts/apply-shop-seo.mjs
 *   node scripts/apply-shop-seo.mjs YOUR_SERVICE_ROLE_KEY
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
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

const SHOP_SEO_PATCH = {
  meta_title: "Best Designer Boutique in Patna | Shreya Creation",
  meta_description:
    "Discover Shreya Creation, the best designer boutique in Patna for bridal wear, designer blouses, lehengas, custom stitching, Aari-Zari handwork, & a perfect fit.",
  header_eyebrow: "Boutique",
  header_title: "Boutique",
  header_tagline: "Where Your Imagination Takes Shape in Fashion",
  header_subtitle:
    "Your attire should never look ordinary. At Shreya Creation, the best designer boutique in Patna, we transform your imagination into unique fashion with the help of our signature bridal tops, designer lehengas, designer suits, designer gowns, and other customized dresses with a perfect fit and fine details.",
  intro_body:
    "Being the best designer boutique in Patna, we combine the trendiest styles with our exquisite designs to produce a remarkable fashion line for you.",
  hero_cta_primary_label: "Explore our Creations",
  hero_cta_primary_href: "/portfolio",
  hero_cta_secondary_label: "Chat on WhatsApp",
  about_title: "About Our Boutique",
  about_body:
    "At Shreya Creation, we understand that an ideal outfit does not just come out of a stitch but is made keeping your needs in mind. Whether it is bridal blouses, designer lehengas, or even suits and gowns, each of our creations is a combination of your imagination and our skill. As the best designer boutique in Patna, we have always specialized in personalized designs, fine fitting, Aari & Zari hand embroidery, and finishing.",
  process_title: "From First Sketch to Final Stitch – Your Look, Your Way",
  process_features: [
    { icon: "design", title: "Personalised Designs" },
    { icon: "measure", title: "Precision Fitting" },
    { icon: "bridal", title: "Bridal & Designer Expertise" },
    { icon: "hand", title: "Fine Handwork" },
    { icon: "check", title: "Thoughtful Finishing" },
  ],
  closing_tagline: "We Don't Just Stitch Outfits. We Create the Look You'll Remember.",
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
const shop = pages.shop && typeof pages.shop === "object" ? { ...pages.shop } : {};
pages.shop = { ...shop, ...SHOP_SEO_PATCH };

if (!serviceKey) {
  console.error("No SUPABASE_SERVICE_ROLE_KEY — add to .env.local or pass as first argument.");
  console.error("SQL fallback: supabase/migrations/shop_seo_designer_boutique_patna.sql");
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

console.log("Applied boutique/shop SEO to settings.pages.shop (merged, not overwritten).");
console.log("meta_title:", pages.shop.meta_title);
