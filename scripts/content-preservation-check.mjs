/**
 * After-implementation content preservation check vs reports/content-baseline.json
 */
import fs from "fs";
import { createClient } from "@supabase/supabase-js";

function loadEnv() {
  const env = {};
  for (const line of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    if (!line || line.startsWith("#")) continue;
    const i = line.indexOf("=");
    if (i < 0) continue;
    env[line.slice(0, i)] = line.slice(i + 1).trim();
  }
  return env;
}

const baseline = JSON.parse(fs.readFileSync("reports/content-baseline.json", "utf8"));
const env = loadEnv();
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const checks = [];
function note(ok, msg) {
  checks.push({ ok, msg });
  console.log(ok ? "PASS" : "FAIL", msg);
}

const { data: courses } = await sb.from("courses").select("slug,title,published");
const beforeSlugs = new Set((baseline.records.courses || []).map((c) => c.slug));
const afterSlugs = new Set((courses || []).map((c) => c.slug));
for (const s of beforeSlugs) {
  note(afterSlugs.has(s), `course slug retained: ${s}`);
}

const { data: settings } = await sb
  .from("settings")
  .select("students_taught,outfits_delivered,founding_year,email,phone_primary,whatsapp_number")
  .eq("id", 1)
  .maybeSingle();
const bSet = (baseline.records.settings || [])[0] || {};
for (const key of ["students_taught", "outfits_delivered", "founding_year", "email"]) {
  note(String(settings?.[key]) === String(bSet[key]), `settings.${key} unchanged (${bSet[key]} → ${settings?.[key]})`);
}

const { data: products } = await sb.from("products").select("slug,title,price");
const bProducts = new Map((baseline.records.products || []).map((p) => [p.slug, p]));
for (const p of products || []) {
  const prev = bProducts.get(p.slug);
  if (!prev) continue;
  note(String(prev.price) === String(p.price), `product price ${p.slug}`);
  note(prev.title === p.title, `product title ${p.slug}`);
}

const { data: portfolio } = await sb.from("portfolio").select("slug,title,image");
const bPort = new Map((baseline.records.portfolio || []).map((p) => [p.slug, p]));
for (const p of portfolio || []) {
  const prev = bPort.get(p.slug);
  if (!prev) continue;
  note(prev.title === p.title, `portfolio title ${p.slug}`);
  note(prev.image === p.image, `portfolio image ${p.slug}`);
}

const failed = checks.filter((c) => !c.ok);
fs.writeFileSync(
  "reports/content-preservation.json",
  JSON.stringify({ checkedAt: new Date().toISOString(), checks, failed: failed.length }, null, 2)
);
console.log(`\n${checks.length - failed.length}/${checks.length} passed; ${failed.length} failed`);
process.exit(failed.length ? 1 : 0);
