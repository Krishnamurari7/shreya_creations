import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const MAX_FILE = 5 * 1024 * 1024;
const MAX_REQUEST = MAX_FILE + 100_000;
const PDF = "application/pdf";
const DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const roles = new Set(["Fashion Design", "Tailoring", "Embroidery", "Boutique Operations", "Sales & Customer Care", "Marketing & Content", "Other"]);
const attempts = new Map();

function response(error, status) { return NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } }); }
function field(form, key, max = 500) {
  const value = form.get(key);
  return typeof value === "string" ? value.trim().slice(0, max + 1) : "";
}
function validOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const url = new URL(origin);
    const host = url.hostname.toLowerCase();
    return (url.protocol === "https:" && ["shreyacreation.com", "www.shreyacreation.com"].includes(host)) ||
      (url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(host));
  } catch { return false; }
}

async function readFormWithLimit(request) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("invalid");
  const chunks = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_REQUEST) { await reader.cancel(); throw new Error("too_large"); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return new Request(request.url, { method: "POST", headers: { "content-type": request.headers.get("content-type") || "" }, body: bytes }).formData();
}

export async function POST(request) {
  if (!validOrigin(request)) return response("Forbidden.", 403);
  if (Number(request.headers.get("content-length") || 0) > MAX_REQUEST) return response("Resume must be 5 MB or smaller.", 413);
  const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-real-ip") || "unknown";
  const now = Date.now();
  const recent = (attempts.get(ip) || []).filter((time) => now - time < 60_000);
  if (recent.length >= 3) return response("Please wait before submitting again.", 429);
  attempts.set(ip, [...recent, now]);
  if (attempts.size > 2000) attempts.clear();

  let form;
  try { form = await readFormWithLimit(request); }
  catch (error) { return error.message === "too_large" ? response("Resume must be 5 MB or smaller.", 413) : response("Invalid form submission.", 400); }
  if (field(form, "website")) return response("Invalid form submission.", 400);
  const fullName = field(form, "fullName", 120);
  const email = field(form, "email", 254).toLowerCase();
  const phone = field(form, "phone", 20).replace(/\s/g, "");
  const opportunity = field(form, "opportunity", 20);
  const preferredRole = field(form, "preferredRole", 80);
  const city = field(form, "city", 100);
  const experience = field(form, "experience", 500);
  const portfolioUrl = field(form, "portfolioUrl", 500);
  const message = field(form, "message", 2000);
  const resume = form.get("resume");
  if (fullName.length < 2 || fullName.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 ||
      !/^\+?[0-9]{10,15}$/.test(phone) || !["Internship", "Job"].includes(opportunity) || !roles.has(preferredRole) ||
      city.length < 2 || city.length > 100 || experience.length > 500 || portfolioUrl.length > 500 || message.length > 2000 ||
      field(form, "consent") !== "yes") return response("Please check the required fields and consent.", 400);
  if (portfolioUrl) {
    try { if (!['https:', 'http:'].includes(new URL(portfolioUrl).protocol)) return response("Enter a valid portfolio URL.", 400); }
    catch { return response("Enter a valid portfolio URL.", 400); }
  }
  if (!(resume instanceof File) || resume.size < 100 || resume.size > MAX_FILE)
    return response("Upload a PDF or DOCX resume, up to 5 MB.", 400);
  const fileName = String(resume.name || "").replace(/[\\/\r\n\x00-\x1f]/g, "_").slice(0, 160);
  const mime = /\.pdf$/i.test(fileName) ? PDF : /\.docx$/i.test(fileName) ? DOCX : null;
  if (!mime || (resume.type && resume.type !== mime && resume.type !== "application/octet-stream"))
    return response("Resume file type does not match its name.", 400);
  const buffer = new Uint8Array(await resume.arrayBuffer());
  const isPdf = mime === PDF && buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46;
  const isDocx = mime === DOCX && buffer[0] === 0x50 && buffer[1] === 0x4b && buffer[2] === 0x03 && buffer[3] === 0x04;
  if (!isPdf && !isDocx) return response("Resume file is invalid.", 400);

  const db = createAdminClient();
  if (!db) return response("Applications are temporarily unavailable.", 503);
  const { count, error: checkError } = await db.from("career_applications").select("id", { count: "exact", head: true })
    .eq("email", email).gte("created_at", new Date(now - 60 * 60 * 1000).toISOString());
  if (checkError) { console.error("career duplicate check failed", checkError.code, checkError.message); return response("Could not submit your application. Please try later.", 500); }
  if (count >= 2) return response("You have already applied recently. Please wait before trying again.", 429);

  const id = randomUUID();
  const path = `${id}/resume.${isPdf ? "pdf" : "docx"}`;
  const { error: uploadError } = await db.storage.from("career-resumes").upload(path, buffer, { contentType: mime, upsert: false });
  if (uploadError) { console.error("career resume upload failed", uploadError.message); return response("Could not upload your resume. Please try again.", 500); }
  const { error: insertError } = await db.from("career_applications").insert({ id, full_name: fullName, email, phone,
    opportunity, preferred_role: preferredRole, city, experience: experience || null, portfolio_url: portfolioUrl || null,
    message: message || null, resume_path: path, resume_filename: fileName, resume_mime: mime,
    consent_to_process_at: new Date().toISOString() });
  if (insertError) {
    await db.storage.from("career-resumes").remove([path]);
    console.error("career application insert failed", insertError.code);
    return response("Could not save your application. Please try again.", 500);
  }
  return NextResponse.json({ applicationId: id }, { status: 201, headers: { "Cache-Control": "no-store" } });
}
