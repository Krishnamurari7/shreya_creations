import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from "@/lib/supabase/config";

const RATE_LIMIT_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const hits = new Map();

const registrationSchema = z.object({
  name: z.string().min(1).max(200),
  phone: z.string().min(10).max(20),
  email: z.string().email().optional().or(z.literal("")),
  date_of_birth: z.string().optional(),
  gender: z.enum(["female", "male", "other", ""]).optional(),
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  course_id: z.string().uuid().optional().or(z.literal("")),
  course_name: z.string().min(1).max(300),
  course_slug: z.string().max(200).optional(),
  preferred_batch: z.enum(["morning", "afternoon", "evening", "any", ""]).optional(),
  education: z.string().max(200).optional(),
  guardian_name: z.string().max(200).optional(),
  aadhaar_last4: z.string().max(4).optional(),
  referral_source: z.string().max(200).optional(),
  message: z.string().max(5000).optional(),
  locale: z.enum(["en", "hi"]).optional(),
  source_page: z.string().max(500).optional(),
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

/** Public student registration endpoint — honeypot + rate limit. Anon INSERT via RLS. */
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
    const parsed = registrationSchema.safeParse(body);
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

    const aadhaar = data.aadhaar_last4?.trim();
    if (aadhaar && !/^\d{4}$/.test(aadhaar)) {
      return NextResponse.json({ error: "Aadhaar last 4 digits must be exactly 4 numbers." }, { status: 400 });
    }

    const row = {
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email?.trim() || null,
      date_of_birth: data.date_of_birth || null,
      gender: data.gender || null,
      address: data.address?.trim() || null,
      city: data.city?.trim() || "Patna",
      course_id: data.course_id || null,
      course_name: data.course_name.trim(),
      course_slug: data.course_slug?.trim() || null,
      preferred_batch: data.preferred_batch || null,
      education: data.education?.trim() || null,
      guardian_name: data.guardian_name?.trim() || null,
      aadhaar_last4: aadhaar || null,
      referral_source: data.referral_source?.trim() || null,
      message: data.message?.trim() || null,
      locale: data.locale || "en",
      source_page: data.source_page || null,
      status: "pending",
      is_read: false,
    };

    if (isSupabaseConfigured()) {
      const supabase = createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const { error } = await supabase.from("student_registrations").insert(row);
      if (error) {
        console.error("registration insert:", error.message);
        return NextResponse.json({ error: "Could not save registration. Please try WhatsApp." }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true, recordedAt: new Date().toISOString() });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
