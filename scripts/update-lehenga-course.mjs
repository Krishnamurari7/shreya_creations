/**
 * Persist Lehenga Design Course syllabus/includes to Supabase.
 *
 * Usage:
 *   node scripts/update-lehenga-course.mjs YOUR_SERVICE_ROLE_KEY
 * Or set SUPABASE_SERVICE_ROLE_KEY in .env.local
 *
 * SQL alternative: supabase/migrations/lehenga_design_course_syllabus_2026.sql
 */
import { createClient } from "@supabase/supabase-js";
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

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.argv[2] || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or pass key as arg).");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const payload = {
  language: "Hindi",
  includes: [
    "6-month professional lehenga design programme",
    "50+ styles from Lehenga Design Book 2026",
    "Measurement, pattern drafting & fabric selection",
    "Flared, panelled, mermaid, layered & A-line cuts",
    "Designer blouse/choli pairing for lehenga sets",
    "Can-can, lining, cape, jacket & heavy finishing",
    "100% hands-on practical training",
    "Certificate on course completion",
  ],
  includes_hi: [
    "6 महीने का प्रोफेशनल लहंगा डिज़ाइन प्रोग्राम",
    "Lehenga Design Book 2026 से 50+ स्टाइल",
    "मेजरमेंट, पैटर्न ड्राफ्टिंग और फैब्रिक चयन",
    "फ्लेयर्ड, पैनल्ड, मरमेड, लेयर्ड और ए-लाइन कट",
    "लहंगा सेट के लिए डिज़ाइनर ब्लाउज़/चोली पेयरिंग",
    "कैन-कैन, लाइनिंग, केप, जैकेट और हेवी फिनिशिंग",
    "100% हैंड्स-ऑन प्रैक्टिकल ट्रेनिंग",
    "कोर्स पूरा करने पर सर्टिफिकेट",
  ],
  syllabus: [
    "Module 1 — Lehenga fundamentals: measurement, fabric calculation, pattern drafting & style selection",
    "Module 2 — Basic flared & A-line lehenga cutting with waistband, can-can & lining",
    "Module 3 — Gather, panelled & kali lehenga construction with boutique finishing",
    "Module 4 — Mermaid / fishtail lehenga silhouette with heavy hem border",
    "Module 5 — Designer choli basics: crop fit, lining, padding & lehenga pairing",
    "Module 6 — Embroidered crop choli with cape / open dupatta coordination (heritage look)",
    "Module 7 — Jacket-style embroidered top with structured lapel for modern lehenga sets",
    "Module 8 — Boat-neck & off-shoulder modern choli with floral placement",
    "Module 9 — Asymmetrical split blouse: embroidery + velvet contrast, deep V & gold cuff",
    "Module 10 — One-shoulder cape blouse with ruched bodice, strap detail & latkan",
    "Module 11 — Quilted velvet V-neck full-sleeve blouse with pearl fringe finishing",
    "Module 12 — Mirror-work off-shoulder blouse & high-neck gold sequin halter choli",
    "Module 13 — Noodle-strap structured bodice & sweetheart scalloped choli with shrug/jacket",
    "Module 14 — Bandhani scoop-neck elbow-sleeve choli with gota border finishing",
    "Module 15 — Square-neck sheer embroidered full-sleeve blouse with waist belt",
    "Module 16 — Corset sweetheart with diagonal strap & 3D floral appliqué",
    "Module 17 — Beaded scalloped corset blouse with sheer cape draping",
    "Module 18 — Tiered, layered & dual-tone draped lehenga skirts",
    "Module 19 — Dupatta, latkan, piping, belt & potli finishing for complete sets",
    "Module 20 — Final bridal / festive lehenga project, fitting correction & assessment",
  ],
  updated_at: new Date().toISOString(),
};

const { data, error } = await supabase
  .from("courses")
  .update(payload)
  .eq("slug", "lehenga-design-course-patna")
  .select("id, slug, title")
  .maybeSingle();

if (error) {
  console.error(error);
  process.exit(1);
}
if (!data) {
  console.error("No course found with slug lehenga-design-course-patna");
  process.exit(1);
}
console.log("Updated:", data);
