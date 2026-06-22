// Central helper for building wa.me links with prefilled messages.
// Every "Order / Stitch / Enroll / Enquire" button on the site uses this.

const FALLBACK_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210";

export function waLink(number, message) {
  const n = (number || FALLBACK_NUMBER).replace(/[^0-9]/g, "");
  return `https://wa.me/${n}?text=${encodeURIComponent(message)}`;
}

export function productMessage(product, url) {
  const price = product.price ? ` (₹${product.price})` : "";
  const custom = product.whatsapp_text;
  if (custom) return `${custom}\n${url || ""}`.trim();
  return `Hi! I'm interested in *${product.title}*${price}.\n${url || ""}`.trim();
}

export function stitchMessage(product, url) {
  return `Hi! I'd like this stitched to my size: *${product.title}*. Please share the details.\n${url || ""}`.trim();
}

export function courseMessage(course, url, lang = "en") {
  const title =
    lang === "hi" ? course.title_hi ?? course.titleHi ?? course.title : course.title;
  const price = course.price ? ` (₹${course.price})` : "";
  return `Hi! I'd like to enroll in *${title}*${price}. Please share the details.\n${url || ""}`.trim();
}

export function greetingMessage() {
  return "Hi Shreya creation! 👋 I came across your website and have a question.";
}

export function admissionMessage() {
  return "Hi Shreya creation! 👋 I would like to apply for admission. Please share details about demo class and courses.";
}

export function portfolioMessage() {
  return "Hi Shreya creation! 👋 I saw your portfolio on the website and would like a similar custom piece. Please share details and pricing.";
}

export function enquiryMessage(name, msg, phone) {
  const lines = ["Hi Shreya creation! 👋", `Name: ${name || "-"}`];
  if (phone?.trim()) lines.push(`Phone: ${phone.trim()}`);
  if (msg?.trim()) lines.push(msg.trim());
  return lines.join("\n");
}
