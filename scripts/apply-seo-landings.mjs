/**
 * Seed ladiesTailor + boutiqueBoringRoad into settings.pages (merge keys, force patch fields).
 *
 * Usage:
 *   node scripts/apply-seo-landings.mjs
 *
 * Needs anon (read) + service_role (write). If service_role lacks GRANT on settings,
 * run supabase/migrations/seo_landings_ladies_tailor_boutique_boring_road.sql in SQL Editor.
 */
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = resolve(root, ".env.local");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
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

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const LANDING_PATCHES = {
  ladiesTailor: {
    meta_title: "Best Ladies Tailor in Patna | Shreya Creation",
    meta_description:
      "Looking for the best ladies tailor in Patna? Shreya Creation offers designer blouses, bridal wear, custom stitching, perfect fitting, and Aari-Zari handwork.",
    header_eyebrow: "Ladies Tailor in Patna",
    header_eyebrow_hi: "पटना में लेडीज़ टेलर",
    header_title: "Ladies Tailor in Patna: Where Every Stitch Is Designed Around You",
    header_title_hi: "पटना में लेडीज़ टेलर: हर टांका आपके लिए",
    header_subtitle:
      "Looking for the best ladies tailor in Patna? Shreya Creation offers designer blouses, bridal wear, custom stitching, perfect fitting, and Aari-Zari handwork.",
    header_subtitle_hi:
      "पटना में बेस्ट लेडीज़ टेलर ढूँढ रहे हैं? Shreya Creation — डिज़ाइनर ब्लाउज, ब्राइडल वियर, कस्टम सिलाई, परफेक्ट फिटिंग और आरी-ज़री हैंडवर्क।",
    intro_body:
      "Finding the best ladies tailor in Patna is not only about getting the cloth stitched but about choosing the perfect fit and a beautiful, unique design according to your choice. We at Shreya Creation offer a wide range of stitching and designing services, including designer blouses, bridal wear, lehenga, suits, gowns, saree pre-stitching, custom outfits, and the best Aari & Zari work, based on your choice of measurements and design.\n\nBacked by a great experience of tailoring, our professional tailors provide you with the best-fitting clothes stitched right to you.",
    hero_cta_primary_label: "Book Your Custom Stitching",
    hero_cta_primary_label_hi: "कस्टम सिलाई बुक करें",
    hero_cta_secondary_label: "Explore Our Designer Collection",
    hero_cta_secondary_label_hi: "डिज़ाइनर कलेक्शन देखें",
    hero_cta_secondary_href: "/shop",
    cta_title: "Ready to Wear Something Made Just for You?",
    cta_title_hi: "अपने लिए बना कुछ पहनने को तैयार?",
    cta_subtitle:
      "Step into the world of Shreya Creation, the best ladies tailor in Patna, where your style comes first, every measurement matters, and every stitch has a purpose. You Imagine; We Will Shape It for You.",
    cta_subtitle_hi:
      "Shreya Creation में आएँ — पटना का बेस्ट लेडीज़ टेलर, जहाँ आपकी स्टाइल पहले, हर माप मायने रखती है।",
    cta_primary_label: "Book Your Custom Stitching",
    cta_primary_label_hi: "कस्टम सिलाई बुक करें",
    cta_secondary_href: "/shop",
    cta_secondary_label: "Explore Our Designer Collection",
    cta_secondary_label_hi: "डिज़ाइनर कलेक्शन देखें",
    cta_wa_message:
      "Hi Shreya Creation! 👋 I'm looking for a ladies tailor in Patna for custom stitching. Please share design options, fitting, and timing.",
  },
  boutiqueBoringRoad: {
    meta_title: "Boutique Boring Road | Shreya Creation",
    meta_description:
      "Discover Shreya Creation, a boutique Boring Road offering designer blouses, bridal wear, custom stitching, and designer collections. Your best boutique near me.",
    header_eyebrow: "Boutique · East Boring Canal Road, Patna",
    header_eyebrow_hi: "बुटीक · ईस्ट बोरिंग कैनाल रोड, पटना",
    header_title: "Where Your Style Finds Its Perfect Address",
    header_title_hi: "जहाँ आपकी स्टाइल को सही पता मिलता है",
    header_subtitle:
      "Looking for Boutique Boring Road that understands your style beyond the standard stitch? Welcome to Shreya Creation, a fashion destination where personalised design and exquisite fitting meet. From designer blouse, bridal wear to elegant suits, gowns, lehengas, and customised outfit are made according to your desired specifications and fit.",
    header_subtitle_hi:
      "बोरिंग रोड पर ऐसा बुटीक ढूँढ रहे हैं जो सिर्फ सिलाई नहीं, आपकी स्टाइल समझे? Shreya Creation में आपका स्वागत है — डिज़ाइनर ब्लाउज, ब्राइडल वियर, सूट, गाउन, लहंगा और कस्टम आउटफिट आपके माप और डिज़ाइन पर।",
    intro_body:
      "For those who have been searching for the best boutique near me can explore a range of designer clothes that are not picked off the rack but created for the customer.",
    hero_cta_primary_label: "Book Your Custom Stitching",
    hero_cta_primary_label_hi: "कस्टम सिलाई बुक करें",
    hero_cta_secondary_label: "Explore Our Designer Collection",
    hero_cta_secondary_label_hi: "डिज़ाइनर कलेक्शन देखें",
    hero_cta_secondary_href: "/shop",
    cta_title: "Come With An Idea & Leave With The Creation",
    cta_title_hi: "आइडिया लेकर आएँ, क्रिएशन लेकर जाएँ",
    cta_subtitle:
      "Visit our boutique boring road destination for designer collections, customized stitching, designer bridal, and fashion designed around you.",
    cta_subtitle_hi:
      "बोरिंग रोड बुटीक पर डिज़ाइनर कलेक्शन, कस्टम सिलाई और ब्राइडल फ़ैशन देखें — आपके लिए डिज़ाइन किया गया।",
    cta_primary_label: "Book Your Custom Stitching",
    cta_primary_label_hi: "कस्टम सिलाई बुक करें",
    cta_secondary_href: "/shop",
    cta_secondary_label: "Explore Our Designer Collection",
    cta_secondary_label_hi: "डिज़ाइनर कलेक्शन देखें",
    cta_wa_message:
      "Hi Shreya Creation! 👋 I found your boutique on Boring Road and would like custom stitching / designer wear. Please share options and timings.",
  },
};

function headers(key) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

if (!url || !anon) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  process.exit(1);
}
if (!serviceKey) {
  console.error("Missing SUPABASE_SERVICE_ROLE_KEY");
  console.error("SQL fallback: supabase/migrations/seo_landings_ladies_tailor_boutique_boring_road.sql");
  process.exit(1);
}

const readRes = await fetch(`${url}/rest/v1/settings?id=eq.1&select=pages`, {
  headers: headers(anon),
});
if (!readRes.ok) {
  console.error("Read failed:", readRes.status, await readRes.text());
  process.exit(1);
}

const [row] = await readRes.json();
const pages = row?.pages && typeof row.pages === "object" ? { ...row.pages } : {};

for (const [key, patch] of Object.entries(LANDING_PATCHES)) {
  const existing = pages[key] && typeof pages[key] === "object" ? pages[key] : {};
  pages[key] = { ...existing, ...patch };
}

const writeRes = await fetch(`${url}/rest/v1/settings?id=eq.1`, {
  method: "PATCH",
  headers: { ...headers(serviceKey), Prefer: "return=minimal" },
  body: JSON.stringify({ pages, updated_at: new Date().toISOString() }),
});

if (!writeRes.ok) {
  console.error("Write failed:", writeRes.status, await writeRes.text());
  console.error("\nFix: run this SQL in Supabase SQL Editor first:");
  console.error("  GRANT SELECT, INSERT, UPDATE ON public.settings TO service_role;");
  console.error("Or paste full migration:");
  console.error("  supabase/migrations/seo_landings_ladies_tailor_boutique_boring_road.sql");
  process.exit(1);
}

console.log("Seeded settings.pages.ladiesTailor + boutiqueBoringRoad");
for (const key of Object.keys(LANDING_PATCHES)) {
  console.log(`  ${key}.meta_title =`, pages[key].meta_title);
}
