import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hiringSchema } from "@/lib/hiring-validation";

export const dynamic = "force-dynamic";

const buckets = new Map();
const WINDOW_MS = 60_000;

function allowedOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const url = new URL(origin);
    const host = url.hostname.toLowerCase();
    const configuredHost = process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL).hostname.toLowerCase() : null;
    return (url.protocol === "https:" && (host === "shreyacreation.com" || host === "www.shreyacreation.com" || host === configuredHost)) ||
      (url.protocol === "http:" && (host === "localhost" || host === "127.0.0.1"));
  } catch { return false; }
}

export async function POST(request) {
  if (!allowedOrigin(request)) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  const size = Number(request.headers.get("content-length") || 0);
  if (size > 40_000) return NextResponse.json({ error: "Submission is too large." }, { status: 413 });

  const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const times = (buckets.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (times.length >= 6) return NextResponse.json({ error: "Please wait a minute before trying again." }, { status: 429 });
  times.push(now);
  buckets.set(ip, times);
  if (buckets.size > 3000) buckets.clear();

  let body;
  try {
    const raw = await request.text();
    if (raw.length > 40_000) return NextResponse.json({ error: "Submission is too large." }, { status: 413 });
    body = JSON.parse(raw);
  } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  const result = hiringSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "Please correct the highlighted fields.", issues: result.error.issues.map((issue) => ({ path: issue.path, message: issue.message })) }, { status: 400 });
  }
  if (result.data.websiteTrap) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const supabase = createAdminClient();
  if (!supabase) return NextResponse.json({ error: "The form is temporarily unavailable. Please try again later." }, { status: 503 });
  const fingerprint = createHash("sha256").update(`${process.env.SUPABASE_SERVICE_ROLE_KEY}:${ip}`).digest("hex");
  const { data, error } = await supabase.rpc("submit_employer_staff_request", { p_payload: { ...result.data, sourceFingerprint: fingerprint } });
  if (error) {
    console.error("hiring submission failed", error.code, error.message);
    const limited = /Too many requests/i.test(error.message);
    return NextResponse.json({ error: limited ? "Too many requests. Please try again later." : "We could not save your request. Please try again." }, { status: limited ? 429 : 500 });
  }
  if (!data || typeof data !== "string") return NextResponse.json({ error: "We could not confirm your request. Please contact our team." }, { status: 500 });
  return NextResponse.json({ requestId: data }, { status: 201, headers: { "Cache-Control": "no-store" } });
}
