/**
 * Push the 4-tab Google Doc course copy into Supabase.
 * Uses the service role from .env.local. Does not print secrets.
 */
import fs from "fs";
import { courseRowUpdate } from "../src/lib/course-landings.mjs";

const SLUGS = [
  "basic-boutique-course",
  "advanced-boutique-course",
  "boutique-master-commando-training",
];

function loadEnv(file) {
  const env = fs.readFileSync(file, "utf8");
  const map = {};
  for (const line of env.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const i = trimmed.indexOf("=");
    map[trimmed.slice(0, i).trim()] = trimmed.slice(i + 1).trim();
  }
  return map;
}

const env = loadEnv(".env.local");
const base = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!base || !key || base.includes("YOUR-PROJECT")) {
  console.error("Missing Supabase URL or service role in .env.local");
  process.exit(1);
}

const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

async function rest(path, options = {}) {
  const response = await fetch(`${base}/rest/v1/${path}`, { ...options, headers: { ...headers, ...options.headers } });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${options.method || "GET"} ${path} -> ${response.status} ${text.slice(0, 400)}`);
  }
  return text ? JSON.parse(text) : null;
}

const nriPatch = {
  meta_title: "NRI Fashion Designing Course in Patna | Shreya Creation",
  meta_title_hi: "पटना में NRI फैशन डिजाइनिंग कोर्स | Shreya Creation",
  meta_description:
    "Explore the NRI Fashion Designing Course in Patna at Shreya Creation. Enquire about online training, flexible timings, Indian fashion skills, and admission options.",
  meta_description_hi:
    "Shreya Creation में पटना का NRI फैशन डिजाइनिंग कोर्स। online ट्रेनिंग, लचीली टाइमिंग, भारतीय फैशन स्किल और एडमिशन के बारे में पूछें।",
  header_title: "NRI Fashion Designing Course in Patna – Learn From Anywhere",
  header_title_hi: "पटना में NRI फैशन डिजाइनिंग कोर्स – कहीं से भी सीखें",
  header_subtitle:
    "For NRIs and international students who want Indian fashion and boutique skills from India-based experts.",
  header_subtitle_hi: "NRI और इंटरनेशनल स्टूडेंट्स के लिए — भारत के एक्सपर्ट से भारतीय फैशन और बुटीक स्किल।",
  hero_subtitle:
    "Shreya Creation helps NRIs and international students explore fashion design and boutique skills with flexible learning, remote assistance, and training based on your goals. Confirm online or hybrid options, timings, fees, and admission requirements before you enrol.",
  hero_subtitle_hi:
    "Shreya Creation NRI और इंटरनेशनल स्टूडेंट्स को फैशन डिज़ाइन और बुटीक स्किल में लचीली लर्निंग और रिमोट मदद के साथ आगे बढ़ाती है। एडमिशन से पहले online या hybrid विकल्प, टाइमिंग, फीस और ज़रूरतें कन्फर्म करें।",
  highlights_title: "What makes this course worth considering?",
  highlights_title_hi: "यह कोर्स देखने लायक क्यों है?",
  highlights_subtitle:
    "Ask about schedules, online learning, Indian boutique skills, and remote support before you assume a format is available.",
  highlights_subtitle_hi: "शेड्यूल, online लर्निंग, भारतीय बुटीक स्किल और रिमोट सपोर्ट एडमिशन से पहले पूछ लें।",
  features_title: "Train without relocating",
  features_title_hi: "शिफ्ट किए बिना ट्रेनिंग",
  features_subtitle: "Ask Shreya Creation which of these options are open for your country before you enrol.",
  features_subtitle_hi: "एडमिशन से पहले पूछें कि आपके देश के लिए इनमें से कौन से विकल्प खुले हैं।",
  features: [
    { emoji: "🕐", title: "Flexible learning options", title_hi: "लचीले विकल्प", desc: "Ask for class schedules that suit your time zone.", desc_hi: "अपने टाइम ज़ोन के हिसाब से क्लास शेड्यूल पूछें।" },
    { emoji: "🎓", title: "Online guidance", title_hi: "Online guidance", desc: "Ask how online classes and remote help work for overseas learners.", desc_hi: "ओवरसीज़ विद्यार्थियों के लिए online क्लास और रिमोट मदद कैसे चलती है, पूछें।" },
    { emoji: "🧵", title: "Indian boutique expertise", title_hi: "भारतीय बुटीक स्किल", desc: "Indian clothing, garment design, and boutique skills from Patna.", desc_hi: "पटना से भारतीय कपड़े, गारमेंट डिज़ाइन और बुटीक स्किल।" },
    { emoji: "📡", title: "Remote support", title_hi: "Remote support", desc: "Ask how questions and progress are handled from your country.", desc_hi: "आपके देश से सवाल और प्रोग्रेस कैसे संभले, यह पूछें।" },
  ],
  process_title: "From enquiry to a clear plan",
  process_title_hi: "Enquiry से साफ प्लान तक",
  process_subtitle: "Confirm format, fees, and certificate rules before you pay.",
  process_subtitle_hi: "पेमेंट से पहले फॉर्मेट, फीस और सर्टिफिकेट की शर्तें कन्फर्म करें।",
  process_steps: [
    { step: "01", title: "Share your country and time zone", title_hi: "देश और टाइम ज़ोन बताएँ", desc: "Tell us where you live, when you can study, and what you want to learn.", desc_hi: "आप कहाँ रहते हैं, कब पढ़ सकते हैं, और क्या सीखना चाहते हैं।" },
    { step: "02", title: "Confirm syllabus and fees", title_hi: "सिलेबस और फीस", desc: "Ask what is included, the fee currency, and any extra charges.", desc_hi: "क्या शामिल है, फीस की करेंसी, और अतिरिक्त चार्ज पूछें।" },
    { step: "03", title: "Choose online or hybrid", title_hi: "Online या hybrid", desc: "Confirm whether you can study remotely or need studio days in Patna.", desc_hi: "दूर से पढ़ाई हो सकती है या पटना में स्टूडियो दिन चाहिए — कन्फर्म करें।" },
    { step: "04", title: "Ask about the certificate", title_hi: "सर्टिफिकेट पूछें", desc: "Confirm if a certificate is issued and what you must complete to receive it.", desc_hi: "सर्टिफिकेट मिलता है या नहीं, और उसके लिए क्या पूरा करना होगा।" },
  ],
  highlights: [
    {
      title: "Flexible learning options",
      title_hi: "लचीले सीखने के विकल्प",
      body: "Ask for class schedules that can work with your time zone.",
      body_hi: "अपने टाइम ज़ोन के हिसाब से क्लास शेड्यूल पूछें।",
    },
    {
      title: "Online guidance",
      title_hi: "Online guidance",
      body: "Ask about online learning and assistance for overseas learners.",
      body_hi: "ओवरसीज़ विद्यार्थियों के लिए online लर्निंग और मदद के बारे में पूछें।",
    },
    {
      title: "Indian boutique expertise",
      title_hi: "भारतीय बुटीक विशेषज्ञता",
      body: "Explore Indian clothing, garment design, and boutique-related skills with India-based teachers.",
      body_hi: "भारत के टीचर के साथ भारतीय कपड़े, गारमेंट डिज़ाइन और बुटीक स्किल देखें।",
    },
  ],
  concept_eyebrow: "Who this course is for",
  concept_eyebrow_hi: "यह कोर्स किसके लिए है",
  concept_title: "Who can explore the NRI Fashion Designing Course?",
  concept_title_hi: "NRI फैशन डिजाइनिंग कोर्स कौन देख सकता है?",
  concept_subtitle: "Talk to Shreya Creation about eligibility, the syllabus, and whether the format fits where you live.",
  concept_subtitle_hi: "एलिजिबिलिटी, सिलेबस, और आपके देश के हिसाब से फॉर्मेट Shreya Creation से पूछें।",
  concept_points: [
    { text: "Overseas Indians who want to learn Indian clothing, ethnic wear, and design", text_hi: "भारतीय कपड़े, एथनिक वियर और डिज़ाइन सीखने वाले ओवरसीज़ इंडियन" },
    { text: "International students interested in Indian garment design", text_hi: "भारतीय गारमेंट डिज़ाइन में रुचि रखने वाले इंटरनेशनल स्टूडेंट" },
    { text: "NRIs planning a boutique who want relevant Indian fashion techniques", text_hi: "बुटीक प्लान कर रहे NRI जो भारतीय फैशन तकनीक चाहते हैं" },
    { text: "People who need flexible timings around work, family, and time zones", text_hi: "काम, परिवार और टाइम ज़ोन के हिसाब से लचीली टाइमिंग चाहने वाले" },
  ],
  learn_title: "What will you learn?",
  learn_title_hi: "आप क्या सीखेंगे?",
  learn_subtitle: "Confirm the exact syllabus with Shreya Creation — these are the areas to ask about for the NRI course.",
  learn_subtitle_hi: "पूरा सिलेबस Shreya Creation से कन्फर्म करें — NRI कोर्स में ये विषय पूछने लायक हैं।",
  learn_topics: [
    { label: "Indian garment styles and design concepts", label_hi: "भारतीय गारमेंट स्टाइल और डिज़ाइन" },
    { label: "Stitching and garment construction", label_hi: "सिलाई और गारमेंट कंस्ट्रक्शन" },
    { label: "Fabric selection and design compatibility", label_hi: "कपड़ा चुनाव और डिज़ाइन का मेल" },
    { label: "Measurement, fit, finishing, and pattern making", label_hi: "मेजरमेंट, फिट, फिनिशिंग और पैटर्न मेकिंग" },
    { label: "Boutique planning and creativity", label_hi: "बुटीक प्लानिंग और क्रिएटिविटी" },
  ],
  training_title: "How online or hybrid training can work",
  training_title_hi: "Online या hybrid ट्रेनिंग कैसे चल सकती है",
  training_subtitle: "If you are outside India, confirm the format before you enrol. Do not assume every activity can be done from a distance.",
  training_subtitle_hi: "भारत से बाहर हैं तो एडमिशन से पहले फॉर्मेट कन्फर्म करें। यह न मानें कि हर काम दूर से हो जाएगा।",
  training_online_title: "Online learning",
  training_online_title_hi: "Online learning",
  training_online_desc:
    "Online training can cover fashion designing, stitching, and boutique planning without being in Patna. Ask how remote classes and progress tracking work.",
  training_online_desc_hi:
    "Online ट्रेनिंग फैशन डिजाइनिंग, सिलाई और बुटीक प्लानिंग को पटना आए बिना कवर कर सकती है। रिमोट क्लास और प्रोग्रेस ट्रैकिंग कैसे होती है, पूछें।",
  training_offline_title: "Hybrid learning",
  training_offline_title_hi: "Hybrid learning",
  training_offline_desc:
    "Hybrid training is worth asking about if you can travel to Patna for core stitching and garment construction. Confirm which lessons need you in the studio.",
  training_offline_desc_hi:
    "अगर पटना आ सकते हैं तो कोर सिलाई और गारमेंट कंस्ट्रक्शन के लिए hybrid पूछें। कौन से लेसन स्टूडियो में ज़रूरी हैं, कन्फर्म करें।",
  training_note: "Confirm timings, fees, international payments, and certificate rules before you pay.",
  training_note_hi: "पेमेंट से पहले टाइमिंग, फीस, इंटरनेशनल पेमेंट और सर्टिफिकेट की शर्तें कन्फर्म करें।",
  why_title: "Why enquire with Shreya Creation?",
  why_title_hi: "Shreya Creation से क्यों पूछें?",
  why_subtitle: "Get the syllabus, format, timings, fees, and certificate rules in writing before you decide.",
  why_subtitle_hi: "फैसला करने से पहले सिलेबस, फॉर्मेट, टाइमिंग, फीस और सर्टिफिकेट की शर्तें साफ कर लें।",
  why_points: [
    { text: "Full curriculum and how long the course lasts", text_hi: "पूरा सिलेबस और कोर्स की अवधि" },
    { text: "Whether online, hybrid, or offline learning is available", text_hi: "Online, hybrid या offline उपलब्ध है या नहीं" },
    { text: "Class timings that can flex for an overseas schedule", text_hi: "ओवरसीज़ शेड्यूल के लिए लचीली क्लास टाइमिंग" },
    { text: "Whether the course is open to an overseas learner", text_hi: "कोर्स ओवरसीज़ विद्यार्थी के लिए खुला है या नहीं" },
    { text: "Course fee, payment deadlines, and currency options", text_hi: "कोर्स फीस, पेमेंट की तारीख और करेंसी विकल्प" },
    { text: "Eligibility and documents you need to share", text_hi: "एलिजिबिलिटी और ज़रूरी दस्तावेज़" },
    { text: "Whether a certificate is offered after successful completion", text_hi: "सफलतापूर्वक पूरा करने पर सर्टिफिकेट मिलता है या नहीं" },
  ],
  faq_title: "NRI Fashion Designing Course FAQs",
  faq_title_hi: "NRI फैशन डिजाइनिंग कोर्स FAQ",
  faq_subtitle: "Format, timings, payments, certificate, and how to enquire from another country.",
  faq_subtitle_hi: "फॉर्मेट, टाइमिंग, पेमेंट, सर्टिफिकेट, और दूसरे देश से एडमिशन कैसे पूछें।",
  faqs: [
    ["What is the NRI Fashion Designing Course in Patna?", "पटना में NRI फैशन डिजाइनिंग कोर्स क्या है?", "It is a training option overseas learners can enquire about to explore Indian fashion and boutique skills with Shreya Creation.", "यह ओवरसीज़ विद्यार्थियों के लिए एक ट्रेनिंग विकल्प है — Shreya Creation के साथ भारतीय फैशन और बुटीक स्किल के बारे में पूछ सकते हैं।"],
    ["Can I learn fashion designing from abroad?", "क्या मैं विदेश से फैशन डिजाइनिंग सीख सकता/सकती हूँ?", "Contact Shreya Creation to confirm whether online or hybrid fashion designing training is currently available for overseas learners.", "ओवरसीज़ विद्यार्थियों के लिए online या hybrid ट्रेनिंग अभी उपलब्ध है या नहीं, यह Shreya Creation से कन्फर्म करें।"],
    ["Are flexible timings available for NRI students?", "क्या NRI विद्यार्थियों के लिए लचीली टाइमिंग है?", "Ask about available batches and whether class timings can accommodate your country and time zone.", "उपलब्ध बैच पूछें, और क्लास टाइमिंग आपके देश और टाइम ज़ोन के हिसाब से हो सकती है या नहीं।"],
    ["Does the course offer online guidance?", "क्या कोर्स में online guidance मिलती है?", "Contact Shreya Creation to confirm online instruction, remote guidance, and learning support.", "Online क्लास, रिमोट गाइडेंस और लर्निंग सपोर्ट की उपलब्धता Shreya Creation से कन्फर्म करें।"],
    ["Can international students enrol in the course?", "क्या इंटरनेशनल स्टूडेंट एडमिशन ले सकते हैं?", "International learners can enquire about eligibility, admission requirements, course format, and any documents needed.", "इंटरनेशनल विद्यार्थी एलिजिबिलिटी, एडमिशन ज़रूरतें, कोर्स फॉर्मेट और दस्तावेज़ पूछ सकते हैं।"],
    ["Are international payment options available?", "क्या इंटरनेशनल पेमेंट विकल्प हैं?", "Ask Shreya Creation which payment methods are accepted from overseas and whether extra transaction charges apply.", "विदेश से कौन से पेमेंट तरीके स्वीकार हैं, और अतिरिक्त चार्ज लगते हैं या नहीं — यह पूछें।"],
    ["Will I receive a certificate after completing the course?", "क्या कोर्स पूरा होने पर सर्टिफिकेट मिलेगा?", "Certificate availability and eligibility depend on the programme. Confirm the details with Shreya Creation before you enrol.", "सर्टिफिकेट प्रोग्राम पर निर्भर है। एडमिशन से पहले Shreya Creation से डिटेल कन्फर्म करें।"],
    ["Can I learn Indian boutique and garment-designing skills remotely?", "क्या भारतीय बुटीक और गारमेंट डिज़ाइन दूर से सीख सकते हैं?", "Ask whether the available format covers your topics remotely, and how practical work is taught or assessed.", "पूछें कि फॉर्मेट आपके टॉपिक दूर से कवर करता है या नहीं, और प्रैक्टिकल काम कैसे सिखाया जाता है।"],
    ["Do I need to visit Patna for practical training?", "क्या प्रैक्टिकल ट्रेनिंग के लिए पटना आना ज़रूरी है?", "It depends on the course format. Confirm whether the programme can be completed online or needs in-person sessions in Patna.", "यह कोर्स फॉर्मेट पर निर्भर है। Online पूरा हो सकता है या पटना में सेशन चाहिए — कन्फर्म करें।"],
    ["How can I enquire about admission from another country?", "दूसरे देश से एडमिशन कैसे पूछें?", "Contact Shreya Creation with your country, preferred schedule, and learning goals to discuss the course format and admission process.", "देश, शेड्यूल और लक्ष्य बताकर Shreya Creation से कोर्स फॉर्मेट और एडमिशन प्रोसेस पूछें।"],
  ].map(([q, q_hi, a, a_hi]) => ({ q, q_hi, a, a_hi })),
};

async function main() {
  for (const slug of SLUGS) {
    const row = courseRowUpdate(slug);
    try {
      const updated = await rest(`courses?slug=eq.${slug}`, {
        method: "PATCH",
        body: JSON.stringify(row),
      });
      const saved = Array.isArray(updated) ? updated[0] : null;
      if (!saved) throw new Error(`No course updated for ${slug}`);
      console.log(`updated ${slug}: ${saved.title} | about ${String(saved.about || "").length} chars`);
    } catch (error) {
      console.error(`course ${slug} not written: ${error.message}`);
    }
  }

  const settings = await rest("settings?id=eq.1&select=id,pages");
  const current = settings?.[0];
  if (!current) throw new Error("settings row id=1 not found");
  const pages = current.pages && typeof current.pages === "object" ? current.pages : {};
  const nri = pages.nri && typeof pages.nri === "object" ? pages.nri : {};
  pages.nri = { ...nri, ...nriPatch };
  await rest("settings?id=eq.1", {
    method: "PATCH",
    body: JSON.stringify({ pages }),
  });
  console.log("updated settings.pages.nri");
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
