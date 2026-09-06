import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from "@/lib/supabase/config";
import { uploadPassportPhotoDataUrl } from "@/lib/supabase/upload-passport";

const RATE_LIMIT_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const hits = new Map();

const optionalDate = z
  .string()
  .optional()
  .or(z.literal(""))
  .transform((v) => (v && String(v).trim() ? String(v).trim() : undefined));

const optionalNum = z
  .union([z.number(), z.string(), z.null(), z.undefined()])
  .optional()
  .transform((v) => {
    if (v == null || v === "") return null;
    const n = typeof v === "number" ? v : Number(String(v).replace(/[^\d.]/g, ""));
    return Number.isFinite(n) ? n : null;
  });

const passportPhotoSchema = z
  .string()
  .max(600_000)
  .optional()
  .or(z.literal(""))
  .transform((v) => {
    const s = String(v || "").trim();
    if (!s) return undefined;
    if (/^data:image\/(jpeg|jpg|png|webp);base64,/i.test(s)) return s;
    return undefined;
  });

const registrationSchema = z.object({
  name: z.string().min(1).max(200),
  phone: z.string().min(10).max(20),
  email: z.string().email().optional().or(z.literal("")),
  date_of_birth: optionalDate,
  gender: z.enum(["female", "male", "other", ""]).optional(),
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  whatsapp_phone: z.string().max(20).optional(),
  district: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  pin_code: z.string().max(12).optional(),
  course_id: z.string().uuid().optional().or(z.literal("")),
  course_name: z.string().min(1).max(300),
  course_slug: z.string().max(200).optional(),
  preferred_batch: z.enum(["morning", "afternoon", "evening", "any", ""]).optional(),
  course_mode: z.enum(["offline", "online", ""]).optional(),
  education: z.string().max(200).optional(),
  guardian_name: z.string().max(200).optional(),
  experience: z.string().max(500).optional(),
  sewing_machine: z.enum(["yes", "no", ""]).optional(),
  previous_training: z.string().max(500).optional(),
  documents_submitted: z.string().max(500).optional(),
  passport_photo: passportPhotoSchema,
  aadhaar_last4: z.string().max(4).optional(),
  referral_source: z.string().max(200).optional(),
  message: z.string().max(5000).optional(),
  locale: z.enum(["en", "hi"]).optional(),
  source_page: z.string().max(500).optional(),
  website: z.string().optional(),

  invoice_no: z.string().max(100).optional(),
  form_date: optionalDate,
  course_code: z.string().max(100).optional(),
  duration_months: z.string().max(20).optional(),
  start_date: optionalDate,
  end_date: optionalDate,
  fee_course: optionalNum,
  fee_discount: optionalNum,
  fee_registration: optionalNum,
  fee_material: optionalNum,
  fee_gst_percent: optionalNum,
  fee_gst_amount: optionalNum,
  fee_total: optionalNum,
  installment_1_due: optionalDate,
  installment_1_amount: optionalNum,
  installment_1_paid: z.boolean().optional(),
  installment_2_due: optionalDate,
  installment_2_amount: optionalNum,
  installment_2_paid: z.boolean().optional(),
  installment_3_due: optionalDate,
  installment_3_amount: optionalNum,
  installment_3_paid: z.boolean().optional(),
  payment_mode: z.enum(["cash", "upi", "card", "bank", ""]).optional(),
  amount_received: optionalNum,
  payment_received_date: optionalDate,
  received_by: z.string().max(200).optional(),
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

function money(n) {
  if (n == null) return null;
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

function buildMessageFallback(data) {
  const lines = [];
  if (data.message?.trim()) lines.push(data.message.trim());
  if (data.whatsapp_phone) lines.push(`WhatsApp: ${data.whatsapp_phone}`);
  if (data.district) lines.push(`District: ${data.district}`);
  if (data.state) lines.push(`State: ${data.state}`);
  if (data.pin_code) lines.push(`PIN: ${data.pin_code}`);
  if (data.course_mode) lines.push(`Mode: ${data.course_mode}`);
  if (data.fee_discount != null) lines.push(`Discount / Scholarship: ${money(data.fee_discount)}`);
  if (data.experience) lines.push(`Previous stitching / fashion experience: ${data.experience}`);
  if (data.sewing_machine) lines.push(`Sewing machine available: ${data.sewing_machine}`);
  if (data.previous_training) lines.push(`Previous course / training: ${data.previous_training}`);
  if (data.documents_submitted) lines.push(`Documents submitted: ${data.documents_submitted}`);
  if (data.passport_photo_url && /^https?:\/\//i.test(data.passport_photo_url)) {
    lines.push(`Passport photo: ${data.passport_photo_url}`);
  }
  if (data.invoice_no) lines.push(`Invoice No: ${data.invoice_no}`);
  if (data.form_date) lines.push(`Form Date: ${data.form_date}`);
  if (data.course_code) lines.push(`Course Code: ${data.course_code}`);
  if (data.duration_months) lines.push(`Duration: ${data.duration_months} Months`);
  if (data.start_date) lines.push(`Start Date: ${data.start_date}`);
  if (data.end_date) lines.push(`End Date: ${data.end_date}`);
  const fees = [
    data.fee_course != null ? `Course Fee: ${money(data.fee_course)}` : null,
    data.fee_registration != null ? `Registration Fee: ${money(data.fee_registration)}` : null,
    data.fee_material != null ? `Material/Kit: ${money(data.fee_material)}` : null,
    data.fee_gst_percent != null ? `GST %: ${data.fee_gst_percent}` : null,
    data.fee_gst_amount != null ? `GST Amount: ${money(data.fee_gst_amount)}` : null,
    data.fee_total != null ? `Total: ${money(data.fee_total)}` : null,
  ].filter(Boolean);
  if (fees.length) lines.push(`Fees — ${fees.join(" | ")}`);
  if (data.payment_mode) lines.push(`Payment mode: ${data.payment_mode}`);
  if (data.amount_received != null) lines.push(`Amount received: ${money(data.amount_received)}`);
  if (data.payment_received_date) lines.push(`Payment date: ${data.payment_received_date}`);
  if (data.received_by) lines.push(`Received by: ${data.received_by}`);
  return lines.join("\n") || null;
}

function coreRow(data) {
  return {
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
    aadhaar_last4: data.aadhaar_last4?.trim() || null,
    referral_source: data.referral_source?.trim() || null,
    message: buildMessageFallback(data),
    locale: data.locale || "en",
    source_page: data.source_page || null,
    status: "pending",
    is_read: false,
  };
}

function fullRow(data) {
  return {
    ...coreRow(data),
    message: data.message?.trim() || null,
    whatsapp_phone: data.whatsapp_phone?.trim() || null,
    district: data.district?.trim() || null,
    state: data.state?.trim() || null,
    pin_code: data.pin_code?.trim() || null,
    course_mode: data.course_mode || null,
    experience: data.experience?.trim() || null,
    sewing_machine: data.sewing_machine || null,
    previous_training: data.previous_training?.trim() || null,
    documents_submitted: data.documents_submitted?.trim() || null,
    passport_photo_url: data.passport_photo_url || null,
    invoice_no: data.invoice_no?.trim() || null,
    form_date: data.form_date || null,
    course_code: data.course_code?.trim() || null,
    duration_months: data.duration_months?.trim() || null,
    start_date: data.start_date || null,
    end_date: data.end_date || null,
    fee_course: data.fee_course,
    fee_discount: data.fee_discount,
    fee_registration: data.fee_registration,
    fee_material: data.fee_material,
    fee_gst_percent: data.fee_gst_percent,
    fee_gst_amount: data.fee_gst_amount,
    fee_total: data.fee_total,
    installment_1_due: data.installment_1_due || null,
    installment_1_amount: data.installment_1_amount,
    installment_1_paid: Boolean(data.installment_1_paid),
    installment_2_due: data.installment_2_due || null,
    installment_2_amount: data.installment_2_amount,
    installment_2_paid: Boolean(data.installment_2_paid),
    installment_3_due: data.installment_3_due || null,
    installment_3_amount: data.installment_3_amount,
    installment_3_paid: Boolean(data.installment_3_paid),
    payment_mode: data.payment_mode || null,
    amount_received: data.amount_received,
    payment_received_date: data.payment_received_date || null,
    received_by: data.received_by?.trim() || null,
  };
}

function invoiceRow(data) {
  const row = { ...fullRow(data) };
  delete row.whatsapp_phone;
  delete row.district;
  delete row.state;
  delete row.pin_code;
  delete row.course_mode;
  delete row.experience;
  delete row.sewing_machine;
  delete row.previous_training;
  delete row.documents_submitted;
  delete row.passport_photo_url;
  delete row.fee_discount;
  row.message = buildMessageFallback(data);
  return row;
}

async function resolvePassportPhotoUrl(dataUrl) {
  if (!dataUrl) return null;
  try {
    const uploaded = await uploadPassportPhotoDataUrl(dataUrl);
    if (uploaded) return uploaded;
  } catch (err) {
    console.error("passport photo upload:", err?.message || err);
  }
  // Do not store raw data URLs in Postgres — registration still saves without photo
  return null;
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

    if (!isSupabaseConfigured()) {
      console.error("registration: Supabase is not configured");
      return NextResponse.json(
        { error: "Could not save registration. Please try WhatsApp." },
        { status: 500 }
      );
    }

    const supabase = createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const passport_photo_url = await resolvePassportPhotoUrl(data.passport_photo);
    const payload = { ...data, aadhaar_last4: aadhaar, passport_photo_url };

    let { error } = await supabase.from("student_registrations").insert(fullRow(payload));

    // Missing passport column — retry without it
    if (error && /passport_photo_url/i.test(error.message || "")) {
      const row = fullRow(payload);
      delete row.passport_photo_url;
      const retry = await supabase.from("student_registrations").insert(row);
      error = retry.error;
    }

    // Older DB without enrollment columns — try invoice columns
    if (error && /column|schema cache|does not exist/i.test(error.message || "")) {
      const { error: invoiceError } = await supabase
        .from("student_registrations")
        .insert(invoiceRow(payload));
      error = invoiceError;
    }

    // Oldest DB — core columns + message summary only
    if (error && /column|schema cache|does not exist/i.test(error.message || "")) {
      const { error: coreError } = await supabase
        .from("student_registrations")
        .insert(coreRow(payload));
      error = coreError;
    }

    if (error) {
      console.error("registration insert:", error.message);
      const missingTable = /could not find the table|relation .* does not exist/i.test(
        error.message || ""
      );
      return NextResponse.json(
        {
          error: missingTable
            ? "Registration table is missing in Supabase. Run student_registrations_complete_setup.sql, then try again."
            : "Could not save registration. Please try WhatsApp.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, recordedAt: new Date().toISOString() });
  } catch (err) {
    console.error("registration fatal:", err?.message || err);
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
