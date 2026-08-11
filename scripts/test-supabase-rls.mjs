/**
 * RLS security tests — run AFTER applying phase8 migrations:
 *   node scripts/test-supabase-rls.mjs
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnv() {
  const path = resolve(root, ".env.local");
  if (!existsSync(path)) {
    console.error("Missing .env.local");
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
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.error("Need NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY");
  process.exit(1);
}

const anon = createClient(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

let passed = 0;
let failed = 0;

function assert(name, condition, detail = "") {
  if (condition) {
    console.log(`  PASS  ${name}`);
    passed++;
  } else {
    console.log(`  FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
    failed++;
  }
}

async function main() {
  console.log("Supabase RLS tests (anonymous client)\n");

  const { data: enquiries, error: enqErr } = await anon
    .from("contact_inquiries")
    .select("id")
    .limit(1);
  assert(
    "anon cannot SELECT contact_inquiries",
    enqErr != null || (Array.isArray(enquiries) && enquiries.length === 0),
    enqErr?.message || `got ${enquiries?.length} rows`
  );

  const { data: unpublishedCourses } = await anon
    .from("courses")
    .select("id, slug, published")
    .eq("published", false)
    .limit(5);
  assert(
    "anon cannot SELECT unpublished courses",
    !unpublishedCourses || unpublishedCourses.length === 0,
    `got ${unpublishedCourses?.length} unpublished rows`
  );

  const { error: insertCourseErr } = await anon.from("courses").insert({
    title: "RLS probe",
    slug: "rls-probe-should-fail",
  });
  assert("anon cannot INSERT courses", insertCourseErr != null, insertCourseErr?.message);

  const { error: storageErr } = await anon.storage.from("media").upload("rls-probe.txt", "test");
  assert("anon cannot upload to media bucket", storageErr != null, storageErr?.message);

  const { error: enqInsertErr } = await anon.from("contact_inquiries").insert({
    name: "RLS Test",
    phone: "9999999999",
    message: "automated test",
    source: "rls_test",
  });
  assert("anon CAN INSERT contact_inquiries", enqInsertErr == null, enqInsertErr?.message);

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
