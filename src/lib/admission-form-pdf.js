import { jsPDF } from "jspdf";

const ORANGE = [229, 91, 19];
const INK = [42, 26, 18];
const MUTED = [90, 60, 40];
const GST_NUMBER = "10CROPS2823L2ZI";
const HSN_CODE = "999293";
const WEBSITE = "www.shreyacreation.com";

function val(v, fallback = "—") {
  if (v == null) return fallback;
  const s = String(v).trim();
  return s || fallback;
}

function money(n) {
  if (n == null || n === "") return "";
  const num = Number(n);
  if (!Number.isFinite(num)) return String(n);
  return `₹${num.toLocaleString("en-IN")}`;
}

function formatDate(d) {
  if (!d) return "";
  const s = String(d);
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
    const [y, m, day] = s.slice(0, 10).split("-");
    return `${day}/${m}/${y}`;
  }
  try {
    return new Date(s).toLocaleDateString("en-IN");
  } catch {
    return s;
  }
}

function parseMessageExtras(message) {
  const out = {};
  if (!message) return out;
  const lines = String(message).split(/\n+/);
  for (const line of lines) {
    const m = line.match(/^([^:]+):\s*(.+)$/);
    if (!m) continue;
    const key = m[1].trim().toLowerCase();
    const value = m[2].trim();
    if (key.startsWith("whatsapp")) out.whatsapp_phone = value;
    else if (key === "district") out.district = value;
    else if (key === "state") out.state = value;
    else if (key === "pin" || key === "pin code") out.pin_code = value;
    else if (key === "mode") out.course_mode = value;
    else if (key.includes("discount")) out.fee_discount = value.replace(/[^\d.]/g, "");
    else if (key.includes("experience")) out.experience = value;
    else if (key.includes("sewing")) out.sewing_machine = value;
    else if (key.includes("previous course") || key.includes("previous training"))
      out.previous_training = value;
    else if (key.includes("documents")) out.documents_submitted = value;
    else if (key.includes("passport photo")) out.passport_photo_url = value;
  }
  return out;
}

/** Merge DB row + message fallbacks into one enrollment record for PDF / admin. */
export function normalizeEnrollment(row = {}) {
  const extras = parseMessageExtras(row.message);
  return {
    ...row,
    whatsapp_phone: row.whatsapp_phone || extras.whatsapp_phone || "",
    district: row.district || extras.district || "",
    state: row.state || extras.state || "",
    pin_code: row.pin_code || extras.pin_code || "",
    course_mode: row.course_mode || extras.course_mode || "",
    fee_discount: row.fee_discount ?? extras.fee_discount ?? null,
    experience: row.experience || extras.experience || "",
    sewing_machine: row.sewing_machine || extras.sewing_machine || "",
    previous_training: row.previous_training || extras.previous_training || "",
    documents_submitted: row.documents_submitted || extras.documents_submitted || "",
    passport_photo_url: row.passport_photo_url || extras.passport_photo_url || "",
  };
}

function drawCheck(doc, x, y, on) {
  doc.setDrawColor(...INK);
  doc.setLineWidth(0.35);
  doc.rect(x, y - 2.8, 3.2, 3.2);
  if (on) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...ORANGE);
    doc.text("✓", x + 0.45, y);
    doc.setTextColor(...INK);
  }
}

async function resolveImageDataUrl(src) {
  const value = String(src || "").trim();
  if (!value) return null;
  if (value.startsWith("data:image/")) return value;
  if (!/^https?:\/\//i.test(value)) return null;
  try {
    const res = await fetch(value);
    if (!res.ok) return null;
    const blob = await res.blob();
    if (!String(blob.type || "").startsWith("image/")) return null;
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("read failed"));
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function imageFormatFromDataUrl(dataUrl) {
  if (/^data:image\/png/i.test(dataUrl)) return "PNG";
  if (/^data:image\/webp/i.test(dataUrl)) return "WEBP";
  return "JPEG";
}

function sectionBar(doc, y, title, pageW, margin) {
  doc.setFillColor(...ORANGE);
  doc.roundedRect(margin, y, pageW - margin * 2, 7, 1, 1, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(title, pageW / 2, y + 4.8, { align: "center" });
  doc.setTextColor(...INK);
  return y + 10;
}

function fieldLine(doc, x, y, label, value, width) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...INK);
  const labelText = `${label} :`;
  doc.text(labelText, x, y);
  const labelW = doc.getTextWidth(labelText) + 2;
  const lineX = x + labelW;
  const lineW = Math.max(20, width - labelW);
  doc.setDrawColor(...INK);
  doc.setLineWidth(0.25);
  doc.line(lineX, y + 0.8, x + width, y + 0.8);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  const text = val(value, "");
  if (text) {
    doc.text(text, lineX + 1, y - 0.2, { maxWidth: lineW - 2 });
  }
  return y + 7;
}

function checkboxRow(doc, x, y, label, options, selected) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(`${label} :`, x, y);
  let cx = x + doc.getTextWidth(`${label} :`) + 4;
  doc.setFont("helvetica", "normal");
  for (const opt of options) {
    const on =
      String(selected || "")
        .toLowerCase()
        .includes(String(opt.value).toLowerCase()) ||
      String(selected || "").toLowerCase() === String(opt.value).toLowerCase();
    drawCheck(doc, cx, y, on);
    doc.text(opt.label, cx + 4.5, y);
    cx += doc.getTextWidth(opt.label) + 12;
  }
  return y + 7;
}

/**
 * Download an A4 admission / enrollment PDF matching the studio paper form.
 * @param {object} row - student_registrations row
 * @param {object} [site] - optional site contact overrides
 */
export async function downloadAdmissionFormPdf(row, site = {}) {
  const data = normalizeEnrollment(row);
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 10;

  // Outer border
  doc.setDrawColor(...ORANGE);
  doc.setLineWidth(0.8);
  doc.roundedRect(5, 5, pageW - 10, pageH - 10, 2, 2);

  let y = 12;

  // Header
  doc.setTextColor(...ORANGE);
  doc.setFont("times", "bold");
  doc.setFontSize(20);
  doc.text("SHREYA CREATION", pageW / 2, y + 6, { align: "center" });

  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("BOUTIQUE & INSTITUTE", pageW / 2, y + 12, { align: "center" });

  // Services banner
  doc.setFillColor(...ORANGE);
  doc.roundedRect(pageW / 2 - 55, y + 15, 110, 6, 1, 1, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.text("FASHION DESIGNING • STITCHING • BOUTIQUE TRAINING", pageW / 2, y + 19, {
    align: "center",
  });

  doc.setTextColor(...ORANGE);
  doc.setFont("times", "italic");
  doc.setFontSize(11);
  doc.text("Learn • Create • Earn", pageW / 2, y + 27, { align: "center" });

  // Photo box
  const photoX = pageW - margin - 28;
  const photoY = 12;
  const photoW = 26;
  const photoH = 32;
  doc.setDrawColor(...ORANGE);
  doc.setLineDashPattern([1.5, 1.2], 0);
  doc.roundedRect(photoX, photoY, photoW, photoH, 1, 1);
  doc.setLineDashPattern([], 0);

  const photoData = await resolveImageDataUrl(data.passport_photo_url);
  if (photoData) {
    try {
      doc.addImage(
        photoData,
        imageFormatFromDataUrl(photoData),
        photoX + 0.6,
        photoY + 0.6,
        photoW - 1.2,
        photoH - 1.2
      );
    } catch {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(...MUTED);
      doc.text("Passport Size", pageW - margin - 15, 27, { align: "center" });
      doc.text("Photo", pageW - margin - 15, 31, { align: "center" });
    }
  } else {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...MUTED);
    doc.text("Passport Size", pageW - margin - 15, 27, { align: "center" });
    doc.text("Photo", pageW - margin - 15, 31, { align: "center" });
  }

  y = 44;
  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("ADMISSION / ENROLLMENT FORM", pageW / 2, y, { align: "center" });
  y += 6;

  // STUDENT DETAILS
  y = sectionBar(doc, y, "STUDENT DETAILS", pageW, margin);
  y = fieldLine(doc, margin, y, "Student Name (In Capital)", data.name, pageW - margin * 2);
  y = fieldLine(
    doc,
    margin,
    y,
    "Father/Husband / Guardian Name",
    data.guardian_name,
    pageW - margin * 2
  );

  const half = (pageW - margin * 2 - 4) / 2;
  const yDob = y;
  fieldLine(doc, margin, yDob, "Date of Birth", formatDate(data.date_of_birth), half);
  checkboxRow(
    doc,
    margin + half + 4,
    yDob,
    "Gender",
    [
      { value: "female", label: "Female" },
      { value: "male", label: "Male" },
      { value: "other", label: "Other" },
    ],
    data.gender
  );
  y += 7;

  fieldLine(doc, margin, y, "Mobile Number", data.phone, half);
  fieldLine(doc, margin + half + 4, y, "WhatsApp Number", data.whatsapp_phone || data.phone, half);
  y += 7;
  y = fieldLine(doc, margin, y, "Email ID", data.email, pageW - margin * 2);
  y = fieldLine(doc, margin, y, "Full Address", data.address, pageW - margin * 2);

  const q = (pageW - margin * 2 - 9) / 4;
  fieldLine(doc, margin, y, "City", data.city, q);
  fieldLine(doc, margin + q + 3, y, "District", data.district, q);
  fieldLine(doc, margin + (q + 3) * 2, y, "State", data.state, q);
  fieldLine(doc, margin + (q + 3) * 3, y, "PIN Code", data.pin_code, q);
  y += 9;

  // COURSE DETAILS
  y = sectionBar(doc, y, "COURSE DETAILS", pageW, margin);
  fieldLine(doc, margin, y, "Course Name", data.course_name, half);
  fieldLine(
    doc,
    margin + half + 4,
    y,
    "Course Duration",
    data.duration_months
      ? `${data.duration_months}${/\d/.test(String(data.duration_months)) && !/month/i.test(String(data.duration_months)) ? " Months" : ""}`
      : "",
    half
  );
  y += 7;

  const batchLabel =
    { morning: "Morning 9–12", afternoon: "Afternoon 12–3", evening: "Evening 3–6", any: "Flexible" }[
      data.preferred_batch
    ] || data.preferred_batch;
  fieldLine(doc, margin, y, "Batch/Timing", batchLabel, half);
  checkboxRow(
    doc,
    margin + half + 4,
    y,
    "Mode",
    [
      { value: "offline", label: "Offline" },
      { value: "online", label: "Online" },
    ],
    data.course_mode
  );
  y += 7;
  y = fieldLine(doc, margin, y, "Admission Date", formatDate(data.form_date), half);

  // Fee boxes
  const boxW = (pageW - margin * 2 - 8) / 3;
  const fees = [
    { label: "Course Fee (₹)", value: money(data.fee_course) },
    { label: "Discount / Scholarship (₹)", value: money(data.fee_discount) },
    { label: "Final Payable (₹)", value: money(data.fee_total) },
  ];
  fees.forEach((f, i) => {
    const bx = margin + i * (boxW + 4);
    doc.setDrawColor(...ORANGE);
    doc.setFillColor(255, 244, 235);
    doc.roundedRect(bx, y, boxW, 14, 1, 1, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(...ORANGE);
    doc.text(f.label, bx + 2, y + 4.5);
    doc.setTextColor(...INK);
    doc.setFontSize(10);
    doc.text(f.value || "—", bx + 2, y + 11);
  });
  y += 18;

  // EDUCATIONAL
  y = sectionBar(doc, y, "EDUCATIONAL / SKILL BACKGROUND", pageW, margin);
  y = fieldLine(doc, margin, y, "Highest Qualification", data.education, pageW - margin * 2);
  y = fieldLine(
    doc,
    margin,
    y,
    "Previous Stitching / Fashion Designing Experience",
    data.experience,
    pageW - margin * 2
  );
  y = checkboxRow(
    doc,
    margin,
    y,
    "Sewing Machine Available",
    [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
    data.sewing_machine
  );
  y = fieldLine(
    doc,
    margin,
    y,
    "Previous Course / Training if any",
    data.previous_training,
    pageW - margin * 2
  );

  // DOCUMENTS
  y = sectionBar(doc, y, "DOCUMENT SUBMITTED", pageW, margin);
  const docsRaw = String(data.documents_submitted || "").toLowerCase();
  const hasPhoto = Boolean(data.passport_photo_url) || docsRaw.includes("photo");
  const docOpts = [
    { key: "id", label: "ID Proof" },
    { key: "photo", label: "Passport Size Photo" },
    { key: "address", label: "Address Proof" },
    { key: "edu", label: "Educational Proof" },
  ];
  let dx = margin;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  for (const d of docOpts) {
    const on =
      (d.key === "photo" && hasPhoto) ||
      docsRaw.includes(d.key) ||
      docsRaw.includes(d.label.toLowerCase()) ||
      (d.key === "id" && docsRaw.includes("id proof")) ||
      (d.key === "edu" && docsRaw.includes("educational"));
    drawCheck(doc, dx, y, on);
    doc.text(d.label, dx + 4.5, y);
    dx += doc.getTextWidth(d.label) + 12;
  }
  const otherMatch = String(data.documents_submitted || "").match(/Other:\s*(.+)/i);
  drawCheck(doc, dx, y, Boolean(otherMatch));
  doc.text("Other :", dx + 4.5, y);
  doc.setDrawColor(...INK);
  doc.line(dx + 18, y + 0.8, pageW - margin, y + 0.8);
  if (otherMatch) doc.text(otherMatch[1], dx + 19, y - 0.2);
  y += 9;

  // Declaration
  y = sectionBar(doc, y, "Declaration", pageW, margin);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...INK);
  const decl =
    "I hereby declare that the above information is true and correct to the best of my knowledge. I have read and understood all the rules & regulations of Shreya Creation Boutique & Institute and I agree to abide by them. I am aware that the course fee once paid is non-refundable.";
  const declLines = doc.splitTextToSize(decl, pageW - margin * 2);
  doc.text(declLines, margin, y);
  y += declLines.length * 3.4 + 6;

  // Signatures
  const signs = [
    "Student Signature",
    "Parent / Guardian Signature",
    "Counsellor Signature",
    "Institute Authorized Signature",
  ];
  const signW = (pageW - margin * 2 - 9) / 4;
  signs.forEach((s, i) => {
    const sx = margin + i * (signW + 3);
    doc.setDrawColor(...INK);
    doc.line(sx, y + 8, sx + signW, y + 8);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.text(s, sx + signW / 2, y + 12, { align: "center" });
  });
  y += 18;

  // Footer strip
  const footerY = Math.max(y, pageH - 42);
  doc.setFillColor(...ORANGE);
  doc.roundedRect(margin, footerY, pageW - margin * 2, 32, 1.5, 1.5, "F");

  // Trust badge
  doc.setFillColor(255, 192, 120);
  doc.circle(margin + 12, footerY + 16, 9, "F");
  doc.setTextColor(...ORANGE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("17", margin + 12, footerY + 14, { align: "center" });
  doc.setFontSize(4.8);
  doc.text("YEARS OF", margin + 12, footerY + 18.2, { align: "center" });
  doc.text("TRUST", margin + 12, footerY + 21.2, { align: "center" });

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.text("CONTACT US", margin + 26, footerY + 6);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  const phone1 = site.phone1 || site.phonePrimary || "";
  const phone2 = site.phone2 || site.phoneSecondary || "";
  const phones =
    [phone1, phone2].filter(Boolean).join(" / ") || "9031105666 / 7903155125";
  doc.text(phones, margin + 26, footerY + 11);
  const address =
    site.addressLine || site.address || "East Boring Canal Road, Patna-800001 (Bihar)";
  doc.text(address, margin + 26, footerY + 16, { maxWidth: 70 });
  doc.text(WEBSITE, margin + 26, footerY + 24);

  // 24h badge
  doc.setDrawColor(255, 255, 255);
  doc.circle(pageW / 2 + 18, footerY + 14, 7);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.text("24h", pageW / 2 + 18, footerY + 15.5, { align: "center" });
  doc.setFontSize(5);
  doc.text("Get your clothes", pageW / 2 + 18, footerY + 24, { align: "center" });
  doc.text("stitched within", pageW / 2 + 18, footerY + 27.5, { align: "center" });

  // GST
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.text("GST DETAILS", pageW - margin - 48, footerY + 6);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.8);
  doc.text(`GSTIN — ${GST_NUMBER}`, pageW - margin - 48, footerY + 11);
  doc.text("Trade Name — Shreya Creation", pageW - margin - 48, footerY + 15.5);
  doc.text("Boutique & Institute", pageW - margin - 48, footerY + 19.5);
  doc.text("Service — Training / Coaching", pageW - margin - 48, footerY + 24);
  doc.text(`HSN Code — ${HSN_CODE}`, pageW - margin - 48, footerY + 28.5);

  const safeName = String(data.name || "student")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 40);
  const fileDate = (data.form_date || data.created_at || new Date().toISOString()).slice(0, 10);
  doc.save(`admission-form-${safeName || "student"}-${fileDate}.pdf`);
}
