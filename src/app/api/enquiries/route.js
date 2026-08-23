import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from "@/lib/supabase/config";

const RATE_LIMIT_MS = 60_000;
const RATE_LIMIT_MAX = 8;
const hits = new Map();

const enquirySchema = z.object({
  name: z.string().min(1).max(200),
  phone: z.string().min(10).max(20),
  email: z.string().email().optional().or(z.literal("")),
  message: z.string().max(5000).optional(),
  source: z.string().max(100).optional(),
  source_page: z.string().max(500).optional(),
  inquiry_type: z.enum(["contact", "demo", "brochure", "order"]).optional(),
  locale: z.enum(["en", "hi"]).optional(),
  preferred_date: z.string().optional(),
  website: z.string().optional(),
});

function clientIp(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

const ALLOWED_ORIGIN_HOSTS = new Set([
  "shreyacreation.com",
  "www.shreyacreation.com",
  "localhost",
  "127.0.0.1",
]);

function isAllowedOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const { hostname } = new URL(origin);
    if (ALLOWED_ORIGIN_HOSTS.has(hostname)) return true;
    if (hostname.endsWith(".pages.dev") || hostname.endsWith(".workers.dev")) return true;
    return false;
  } catch {
    return false;
  }
}

function isRateLimited(ip) {
  const now = Date.now();
  const bucket = hits.get(ip) || [];
  const recent = bucket.filter((t) => now - t < RATE_LIMIT_MS);
  if (recent.length >= RATE_LIMIT_MAX) return true;
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

function inferType(source = "") {
  if (/demo/i.test(source)) return "demo";
  if (/brochure|fee/i.test(source)) return "brochure";
  if (/order|shop/i.test(source)) return "order";
  return "contact";
}

/** Public enquiry endpoint — honeypot + rate limit. Anon INSERT via RLS. */
export async function POST(request) {
  try {
    if (!isAllowedOrigin(request)) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const ip = clientIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests. Please wait a minute." }, { status: 429 });
    }

    const body = await request.json();
    const parsed = enquirySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
    }

    const data = parsed.data;
    if (data.website?.trim()) {
      return NextResponse.json({ ok: true });
    }

    const phoneDigits = String(data.phone).replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
    }

    const source = data.source || "contact_form";
    const row = {
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email?.trim() || null,
      message: data.message?.trim() || null,
      source,
      source_page: data.source_page || null,
      inquiry_type: data.inquiry_type || inferType(source),
      locale: data.locale || "en",
      preferred_date: data.preferred_date || null,
      is_read: false,
    };

    if (isSupabaseConfigured()) {
      const supabase = createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const { error } = await supabase.from("contact_inquiries").insert(row);
      if (error) {
        console.error("enquiry insert:", error.message);
      }
    }

    // TODO(owner): choose notification channel (email or WhatsApp Business API)

    return NextResponse.json({ ok: true, recordedAt: new Date().toISOString() });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
