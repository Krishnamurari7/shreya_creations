/**
 * Inspect settings.pages on Shreya Supabase (anon read + service write probe).
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

function jwtClaims(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

console.log("Project:", url);
if (anon) console.log("anon claims:", jwtClaims(anon));
if (serviceKey) console.log("service claims:", jwtClaims(serviceKey));

async function readPages(key, label) {
  const res = await fetch(`${url}/rest/v1/settings?id=eq.1&select=pages`, {
    headers: { apikey: key, Authorization: `Bearer ${key}`, Accept: "application/json" },
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  console.log(`\n[${label}] status=${res.status}`);
  if (!res.ok) {
    console.log(data);
    return null;
  }
  const pages = data[0]?.pages || {};
  console.log("page keys:", Object.keys(pages).sort().join(", ") || "(none)");
  for (const k of Object.keys(pages).sort()) {
    const p = pages[k] || {};
    console.log(
      `  ${k}: fields=${Object.keys(p).length} meta=${p.meta_title || p.metaTitle || "(none)"}`
    );
  }
  console.log("MISSING ladiesTailor?", !pages.ladiesTailor);
  console.log("MISSING boutiqueBoringRoad?", !pages.boutiqueBoringRoad);
  return pages;
}

if (!url || !anon) {
  console.error("Missing URL/anon");
  process.exit(1);
}

await readPages(anon, "anon");
if (serviceKey) await readPages(serviceKey, "service_role");
