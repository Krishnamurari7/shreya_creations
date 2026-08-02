// Central helper for building wa.me links with prefilled messages.
// Every "Order / Stitch / Enroll / Enquire" button on the site uses this.

import { DEFAULT_WHATSAPP, telHref } from "@/lib/site-config";

const FALLBACK_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_WHATSAPP;

export function waLink(number, message) {
  const n = (number || FALLBACK_NUMBER).replace(/[^0-9]/g, "");
  return `https://wa.me/${n}?text=${encodeURIComponent(message || greetingMessage())}`;
}

/** First dialable number from a display string like "+91 90311 05666 / 79031 55125". */
export function telLink(phone) {
  if (!phone?.trim()) return null;
  const first = phone.split(/\s*[/|,]\s*|\s+or\s+/i)[0].trim();
  return telHref(first);
}

function productPageUrl(product, url) {
  if (url) return url;
  if (product?.slug) return `/shop/${product.slug}`;
  return "";
}

function coursePageUrl(course, url) {
  if (url) return url;
  if (course?.slug) return `/courses/${course.slug}`;
  return "";
}

export function productMessage(product, url) {
  const page = productPageUrl(product, url);
  const price = product.price ? ` (₹${product.price})` : "";
  const custom = product.whatsapp_text;
  if (custom) return `${custom}\n${page}`.trim();
  return `Hi Shreya Creation! 👋 I'm interested in *${product.title}*${price}. Please share availability and ordering details.\n${page}`.trim();
}

export function stitchMessage(product, url) {
  const page = productPageUrl(product, url);
  return `Hi Shreya Creation! 👋 I'd like *${product.title}* stitched to my size. Please share measurements, fabric options, and timing.\n${page}`.trim();
}

export function courseMessage(course, url, lang = "en") {
  const title =
    lang === "hi" ? course.title_hi ?? course.titleHi ?? course.title : course.title;
  const price = course.price ? ` (₹${course.price})` : "";
  const page = coursePageUrl(course, url);
  if (lang === "hi") {
    return `नमस्ते श्रेया क्रिएशन! 👋 मुझे *${title}*${price} में एनरोल करना है। कृपया फीस, बैच टाइमिंग और विवरण बताएँ।\n${page}`.trim();
  }
  return `Hi Shreya Creation! 👋 I'd like to enroll in *${title}*${price}. Please share fees, batch timings, and details.\n${page}`.trim();
}

/** Generic site chat (navbar, footer, floating assistant). */
export function greetingMessage(lang = "en") {
  if (lang === "hi") {
    return "नमस्ते श्रेया क्रिएशन! 👋 मैं आपकी वेबसाइट से आया/आई हूँ — कृपया मदद करें।";
  }
  return "Hi Shreya Creation! 👋 I came across your website and have a question.";
}

/** Free demo / admission interest. */
export function admissionMessage(lang = "en") {
  if (lang === "hi") {
    return "नमस्ते श्रेया क्रिएशन! 👋 मुझे एडमिशन और फ्री डेमो क्लास की जानकारी चाहिए। कृपया कोर्स और बैच डिटेल्स भेजें।";
  }
  return "Hi Shreya Creation! 👋 I would like to apply for admission. Please share details about the demo class and courses.";
}

export function demoClassMessage(lang = "en") {
  if (lang === "hi") {
    return "नमस्ते श्रेया क्रिएशन! 👋 मुझे फ्री ऑफलाइन डेमो क्लास में दिलचस्पी है। कृपया सीट उपलब्धता बताएँ।";
  }
  return "Hi Shreya Creation! 👋 I am interested in the FREE OFFLINE DEMO CLASS. Please share seat availability.";
}

/** Custom stitching / 24hr boutique order (no specific product). */
export function stitchOrderMessage(lang = "en") {
  if (lang === "hi") {
    return "नमस्ते श्रेया क्रिएशन! 👋 मुझे कस्टम सिलाई ऑर्डर चाहिए — मात्र 24 घंटे में सिले कपड़े। कृपया डिज़ाइन, माप और कीमत बताएँ।";
  }
  return "Hi Shreya Creation! 👋 I want a custom stitching order — stitched clothes in just 24 hours. Please share design, sizing, and pricing.";
}

/** Courses page CTA — enroll without a specific course selected. */
export function courseEnrollMessage(lang = "en") {
  if (lang === "hi") {
    return "नमस्ते श्रेया क्रिएशन! 👋 मुझे कोर्स में एनरोल करना है। कृपया कोर्स डिटेल्स, फीस और बैच टाइमिंग बताएँ।";
  }
  return "Hi Shreya Creation! 👋 I would like to enroll in a course. Please share course details, fees, and batch timings.";
}

/** Shop page CTA — browsing / general order help. */
export function shopInquiryMessage(lang = "en") {
  if (lang === "hi") {
    return "नमस्ते श्रेया क्रिएशन! 👋 मुझे शॉप से कुछ ऑर्डर करना है। कृपया उपलब्ध डिज़ाइन, माप और डिलीवरी बताएँ।";
  }
  return "Hi Shreya Creation! 👋 I'd like to order from the shop. Please share available designs, sizing, and delivery details.";
}

export function portfolioMessage(lang = "en") {
  if (lang === "hi") {
    return "नमस्ते श्रेया क्रिएशन! 👋 मैंने वेबसाइट पर आपका पोर्टफोलियो देखा — ऐसा ही कस्टम पीस चाहिए। कृपया कीमत और प्रक्रिया बताएँ।";
  }
  return "Hi Shreya Creation! 👋 I saw your portfolio on the website and would like a similar custom piece. Please share details and pricing.";
}

export function nriClientMessage(lang = "en") {
  if (lang === "hi") {
    return "नमस्ते श्रेया क्रिएशन! 👋 मैं NRI क्लाइंट हूँ। ब्राइडल/कस्टम सिलाई और शिपिंग के बारे में जानकारी चाहिए। कृपया प्रोसेस बताएँ।";
  }
  return "Hi Shreya Creation! 👋 I'm an NRI client. I'd like details on bridal/custom stitching and shipping support. Please share the process.";
}

export function lookbookMessage(lang = "en") {
  if (lang === "hi") {
    return "नमस्ते श्रेया क्रिएशन! 👋 मैंने आपका ब्लॉग देखा — मुझे एक लुक अपने माप पर चाहिए। कृपया कपड़ा, डिज़ाइन और टाइमलाइन बताएँ।";
  }
  return "Hi Shreya Creation! 👋 I saw your blog — I'd love a look made in my size. Please share fabric, design, and timeline.";
}

export function studioVisitMessage(lang = "en") {
  if (lang === "hi") {
    return "नमस्ते श्रेया क्रिएशन! 👋 मैं स्टूडियो विज़िट बुक करना चाहता/चाहती हूँ। कृपया उपलब्ध समय बताएँ।";
  }
  return "Hi Shreya Creation! 👋 I'd like to book a studio visit. Please share available timings.";
}

export function shaktiMessage(lang = "en") {
  if (lang === "hi") {
    return "नमस्ते श्रेया क्रिएशन! 👋 मुझे शक्ति 50 प्रोग्राम की जानकारी चाहिए — मुफ़्त ट्रेनिंग और कौशल से कारोबार तक।";
  }
  return "Hi Shreya Creation! 👋 I'd like to know more about the Shakti 50 program — free training and skill-to-business support.";
}

export function faqMessage(lang = "en") {
  if (lang === "hi") {
    return "नमस्ते श्रेया क्रिएशन! 👋 मेरे कुछ सवाल हैं — कृपया मदद करें।";
  }
  return "Hi Shreya Creation! 👋 I have a few questions after reading your FAQ. Please help.";
}

export function contactMessage(lang = "en") {
  if (lang === "hi") {
    return "नमस्ते श्रेया क्रिएशन! 👋 मैं संपर्क पेज से लिख रहा/रही हूँ — कृपया जवाब दें।";
  }
  return "Hi Shreya Creation! 👋 I'm reaching out from your contact page. Please get back to me.";
}

/** Premium stitching course (hero book video). */
export function premiumStitchingCourseMessage(lang = "en") {
  if (lang === "hi") {
    return "नमस्ते श्रेया क्रिएशन! 👋 मैं प्रीमियम सिलाई कोर्स बुक करना चाहता/चाहती हूँ। कृपया विवरण भेजें।";
  }
  return "Hi Shreya Creation! 👋 I want to BOOK the PREMIUM STITCHING COURSE. Please share the details.";
}

export function enquiryMessage(name, msg, phone) {
  const lines = ["Hi Shreya Creation! 👋", `Name: ${name || "-"}`];
  if (phone?.trim()) lines.push(`Phone: ${phone.trim()}`);
  if (msg?.trim()) lines.push(msg.trim());
  return lines.join("\n");
}
