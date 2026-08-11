import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

/** Load .env.local without committing secrets. */
function loadEnv() {
  const path = resolve(root, ".env.local");
  if (!existsSync(path)) {
    console.error("Missing .env.local — add SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL.");
    process.exit(1);
  }
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
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

/** Dynamic import seed module — run from repo root after `npm run build` is NOT required. */
async function loadSeed() {
  const seedPath = resolve(root, "src/lib/seed.js");
  const mod = await import(`file://${seedPath.replace(/\\/g, "/")}`);
  return mod;
}

function mapCourse(c) {
  return {
    slug: c.slug,
    title: c.title,
    title_hi: c.titleHi || c.title_hi || null,
    category: c.category || null,
    price: c.price ?? null,
    compare_price: c.compare_price ?? c.original_price ?? null,
    duration: c.duration || null,
    language: c.language || "Hindi",
    description: c.description || null,
    description_hi: c.description_hi || c.descriptionHi || null,
    about: c.about || null,
    about_hi: c.about_hi || c.aboutHi || null,
    includes: c.includes || [],
    includes_hi: c.includes_hi || c.includesHi || [],
    syllabus: Array.isArray(c.syllabus) ? c.syllabus : [],
    course_pdf: c.course_pdf || c.coursePdf || null,
    is_addon: !!(c.is_addon ?? c.isAddon),
    badge: c.badge || null,
    image: c.image || null,
    preview_video: c.preview_video || c.previewVideo || null,
    published: c.published !== false,
    features: c.includes || [],
    hero_image: c.image || null,
    starting_from: true,
    sort_order: c.sort_order ?? 0,
  };
}

function mapProduct(p) {
  return {
    slug: p.slug,
    title: p.title,
    name_en: p.title,
    name_hi: p.titleHi || p.title_hi || null,
    category: p.category || null,
    price: p.price ?? null,
    description: p.description || null,
    description_en: p.description || null,
    description_hi: p.description_hi || p.descriptionHi || null,
    description_long: p.description_long || p.descriptionLong || null,
    images: p.images || [],
    fabric: p.fabric || null,
    sizes: p.sizes || null,
    care: p.care || null,
    colours: p.colours || null,
    estimated_delivery: p.estimated_delivery || p.estimatedDelivery || null,
    whatsapp_text: p.whatsapp_text || p.whatsappText || null,
    stitchable: !!p.stitchable,
    ready_made: !!(p.ready_made ?? p.readyMade),
    is_ready_made: !!(p.ready_made ?? p.readyMade),
    published: p.published !== false,
    sort_order: p.sort_order ?? 0,
  };
}

function mapPortfolio(item, i) {
  return {
    slug: item.slug || item.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    title: item.title,
    title_en: item.title,
    category: item.category || null,
    image: item.image || null,
    images: item.image ? [item.image] : [],
    sort_order: item.sort_order ?? i + 1,
    featured: item.featured === true,
    is_published: true,
  };
}

function mapTestimonial(t, i) {
  return {
    name: t.name,
    author_name: t.name,
    text: t.text,
    quote_en: t.text,
    quote_hi: t.quote_hi || null,
    rating: t.rating ?? 5,
    photo: t.photo || null,
    source: t.source || "manual",
    review_url: t.review_url || null,
    category: t.category || "boutique",
    type: t.category || "boutique",
    is_published: true,
    sort_order: i + 1,
  };
}

function mapLookbook(post) {
  return {
    slug: post.slug,
    title: post.title,
    title_hi: post.title_hi || null,
    excerpt: post.excerpt || null,
    excerpt_hi: post.excerpt_hi || null,
    body: post.body || null,
    body_hi: post.body_hi || null,
    image: post.image || null,
    cover_image: post.image || null,
    published: post.published !== false,
    locale: post.locale || "en",
    published_at: post.published_at || new Date().toISOString(),
  };
}

async function upsertBySlug(table, rows, slugField = "slug") {
  let inserted = 0;
  let updated = 0;
  for (const row of rows) {
    const slug = row[slugField];
    if (!slug) continue;
    const { data: existing } = await supabase.from(table).select("id").eq(slugField, slug).maybeSingle();
    if (existing?.id) {
      const { error } = await supabase.from(table).update(row).eq("id", existing.id);
      if (error) console.warn(`Update ${table}/${slug}:`, error.message);
      else updated++;
    } else {
      const { error } = await supabase.from(table).insert(row);
      if (error) console.warn(`Insert ${table}/${slug}:`, error.message);
      else inserted++;
    }
  }
  return { inserted, updated };
}

async function main() {
  console.log("Phase 8 seed — REVIEW BEFORE RUNNING IN PRODUCTION");
  console.log("Target:", url);

  let seed;
  try {
    seed = await loadSeed();
  } catch (err) {
    console.error("Could not import src/lib/seed.js (path aliases). Run: npm run seed:phase8:next");
    console.error(err.message);
    process.exit(1);
  }

  const { SITE, COURSES, PRODUCTS, PORTFOLIO, TESTIMONIALS, LOOKBOOK } = seed;

  const settingsPatch = {
    id: 1,
    brand: SITE.brand,
    boutique: SITE.boutique,
    boutique_hi: SITE.boutiqueHi,
    tagline: SITE.tagline,
    tagline_hi: SITE.taglineHi,
    intro: SITE.intro,
    intro_hi: SITE.introHi,
    about_body: SITE.aboutBody,
    about_body_hi: SITE.aboutBodyHi,
    whatsapp_number: SITE.whatsappNumber || "919031105666",
    phone_primary: SITE.phonePrimary || "+91 90311 05666",
    phone_secondary: SITE.phoneSecondary || "+91 79031 55125",
    email: SITE.email || "hello@shreyacreation.com",
    address_line: SITE.addressLine,
    city: SITE.city || "Patna",
    pincode: SITE.pincode || "800001",
    founding_year: SITE.foundingYear || 2012,
    students_taught: SITE.studentsTaught || 2000,
    outfits_delivered: SITE.outfitsDelivered || 5000,
    studio_hours: SITE.studioHours || "Mon-Sat, 10 AM - 8 PM",
    closed_days: SITE.closedDays || "Sunday",
    course_count: 10,
    socials: SITE.socials || {},
  };

  const { error: settingsErr } = await supabase.from("settings").upsert(settingsPatch);
  if (settingsErr) console.warn("settings:", settingsErr.message);
  else console.log("✓ settings");

  const courseStats = await upsertBySlug("courses", COURSES.map(mapCourse));
  console.log(`✓ courses (+${courseStats.inserted} ~${courseStats.updated})`);

  const productStats = await upsertBySlug("products", PRODUCTS.map(mapProduct));
  console.log(`✓ products (+${productStats.inserted} ~${productStats.updated})`);

  const portfolioStats = await upsertBySlug("portfolio", PORTFOLIO.map(mapPortfolio));
  console.log(`✓ portfolio (+${portfolioStats.inserted} ~${portfolioStats.updated})`);

  const testimonialStats = await upsertBySlug(
    "testimonials",
    TESTIMONIALS.map(mapTestimonial),
    "author_name"
  );
  console.log(`✓ testimonials (+${testimonialStats.inserted} ~${testimonialStats.updated})`);

  const blogStats = await upsertBySlug("lookbook_posts", LOOKBOOK.map(mapLookbook));
  console.log(`✓ lookbook_posts (+${blogStats.inserted} ~${blogStats.updated})`);

  console.log("\nDone. TODO(owner): verify rows in Supabase dashboard.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
