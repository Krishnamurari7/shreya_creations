/**
 * Capture a content baseline inventory for preservation checks.
 * Output: reports/content-baseline.json
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

const env = loadEnv();
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const tables = [
  ["courses", "slug,title,title_hi,published,coming_soon,price,duration,description,description_hi,about,about_hi,course_pdf,image,meta_title,meta_description"],
  ["products", "slug,title,published,price,description,images,meta_title"],
  ["portfolio", "slug,title,category,image,caption,featured,sort_order"],
  ["faqs", "q,q_hi,a,a_hi,category,sort_order,published"],
  ["policy_pages", "slug,title,title_hi,body,body_hi,published"],
  ["lookbook_posts", "slug,title,title_hi,excerpt,excerpt_hi,cover_image,published,published_at"],
  ["testimonials", "name,text,rating,category,source,published"],
  ["trust_stats", "label,label_hi,value,value_hi,sort_order,published"],
  ["settings", "brand,students_taught,outfits_delivered,founding_year,express_delivery_hours,phone_primary,phone_secondary,email,address_line,whatsapp_number,pages"],
];

const inventory = {
  capturedAt: new Date().toISOString(),
  routes: {
    en: ["/", "/about", "/shop", "/courses", "/register", "/portfolio", "/blog", "/faq", "/nri-clients", "/contact", "/policies/privacy"],
    hi: ["/hi", "/hi/about", "/hi/shop", "/hi/courses", "/hi/register", "/hi/portfolio", "/hi/blog", "/hi/faq", "/hi/nri-clients", "/hi/contact", "/hi/policies/privacy"],
  },
  footerCourseLinks: [
    "/courses/fashion-designing-course",
    "/courses/blouse-suit-making-course",
    "/courses/basic-boutique-course",
    "/courses/advanced-boutique-course",
    "/courses/lehenga-design-course-patna",
    "/courses/kids-wear-course",
  ],
  records: {},
  errors: {},
};

for (const [table, cols] of tables) {
  const { data, error } = await sb.from(table).select(cols);
  if (error) {
    inventory.errors[table] = error.message;
    inventory.records[table] = [];
  } else {
    inventory.records[table] = data || [];
  }
}

const outDir = path.join(root, "reports");
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "content-baseline.json");
fs.writeFileSync(outPath, JSON.stringify(inventory, null, 2));
console.log("Wrote", outPath);
console.log(
  Object.fromEntries(
    Object.entries(inventory.records).map(([k, v]) => [k, Array.isArray(v) ? v.length : 0])
  )
);
