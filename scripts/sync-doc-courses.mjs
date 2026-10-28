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
  header_subtitle: "Are you an NRI with a passion for Indian fashion?",
  header_subtitle_hi: "क्या आपको भारतीय फैशन का शौक है और आप NRI हैं?",
  hero_subtitle:
    "Shreya Creation makes it easier for NRIs and international students to gain fashion design and boutique skills with India-based experts. Ask about flexible learning, remote assistance, and training based on your goals. Confirm online, hybrid, timings, and practical requirements before you assume every activity can be done from a distance.",
  hero_subtitle_hi:
    "Shreya Creation NRI और इंटरनेशनल स्टूडेंट्स को भारत के एक्सपर्ट से फैशन डिज़ाइन और बुटीक स्किल में मदद करती है। लचीली लर्निंग, रिमोट मदद और अपने लक्ष्य के हिसाब से ट्रेनिंग पूछें। यह न मानें कि हर काम दूर से हो जाएगा — online, hybrid, टाइमिंग और प्रैक्टिकल ज़रूरतें पहले कन्फर्म करें।",
  highlights_title: "What makes this course worth considering?",
  highlights_title_hi: "यह कोर्स देखने लायक क्यों है?",
  highlights_subtitle:
    "Ask about schedules, online learning, Indian boutique skills, remote support, and admission details before you assume a format is available.",
  highlights_subtitle_hi: "शेड्यूल, online लर्निंग, भारतीय बुटीक स्किल, रिमोट सपोर्ट और एडमिशन डिटेल पहले पूछ लें।",
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
      body: "Ask for class schedules that suit you and your time zone.",
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
      body: "Explore Indian clothing, garment design, and boutique-related skills.",
      body_hi: "भारतीय कपड़े, गारमेंट डिज़ाइन और बुटीक स्किल देखें।",
    },
    {
      title: "Remote support",
      title_hi: "Remote support",
      body: "Ask how queries and progress questions are handled from your location.",
      body_hi: "आपके देश से सवाल और प्रोग्रेस कैसे संभले, यह पूछें।",
    },
    {
      title: "Learning from overseas",
      title_hi: "विदेश से सीखना",
      body: "Explore online and hybrid options. Do not assume every activity can be done from a distance.",
      body_hi: "Online और hybrid विकल्प पूछें। यह न मानें कि हर काम दूर से हो जाएगा।",
    },
    {
      title: "Syllabus and admission clarity",
      title_hi: "सिलेबस और एडमिशन की स्पष्टता",
      body: "Get clarity on the syllabus, fees, learning options, and other requirements before you apply.",
      body_hi: "आवेदन से पहले सिलेबस, फीस, लर्निंग विकल्प और बाकी ज़रूरतें साफ कर लें।",
    },
  ],
  concept_eyebrow: "Who this course is for",
  concept_eyebrow_hi: "यह कोर्स किसके लिए है",
  concept_title: "Who can explore the NRI Fashion Designing Course?",
  concept_title_hi: "NRI फैशन डिजाइनिंग कोर्स कौन देख सकता है?",
  concept_subtitle: "Talk to Shreya Creation about eligibility, the syllabus, and whether the format fits where you live.",
  concept_subtitle_hi: "एलिजिबिलिटी, सिलेबस, और आपके देश के हिसाब से फॉर्मेट Shreya Creation से पूछें।",
  concept_points: [
    { text: "Overseas Indians who want to learn Indian clothing, ethnic wear, and design — ask if this course can support that from where you live.", text_hi: "भारतीय कपड़े, एथनिक वियर और डिज़ाइन सीखने वाले ओवरसीज़ इंडियन — पूछें कि यह कोर्स आपके देश से सपोर्ट कर सकता है या नहीं।" },
    { text: "International students who want Indian garment and clothing design — confirm eligibility, course content, and training options.", text_hi: "भारतीय गारमेंट और कपड़ा डिज़ाइन सीखने वाले इंटरनेशनल स्टूडेंट — एलिजिबिलिटी, कंटेंट और ट्रेनिंग विकल्प कन्फर्म करें।" },
    { text: "NRIs who want to open a boutique — ask whether the course fits your business plan and covers boutique-related skills.", text_hi: "बुटीक खोलना चाहने वाले NRI — पूछें कि कोर्स आपके बिज़नेस प्लान से मेल खाता है या नहीं।" },
    { text: "People who need flexible timings around work and family — ask whether class times can match your time zone.", text_hi: "काम और परिवार के साथ लचीली टाइमिंग चाहने वाले — पूछें कि क्लास आपके टाइम ज़ोन से मेल खा सकती है या नहीं।" },
  ],
  services: [
    { emoji: "💻", title: "Online learning", title_hi: "Online learning", desc: "Ask how online classes work, whether you can attend remotely, and how progress is tracked.", desc_hi: "पूछें कि online क्लास कैसे चलती है, रिमोट अटेंड हो सकता है या नहीं, और प्रोग्रेस कैसे ट्रैक होती है।" },
    { emoji: "🧵", title: "Hybrid learning", title_hi: "Hybrid learning", desc: "If you can travel to Patna, ask which core stitching and garment lessons need you in the studio.", desc_hi: "पटना आ सकते हैं तो पूछें कि कोर सिलाई और गारमेंट के कौन से लेसन स्टूडियो में ज़रूरी हैं।" },
    { emoji: "📡", title: "Remote learning", title_hi: "Remote learning", desc: "Ask how instructors guide you, what practical work you complete abroad, and whether remote practical help exists.", desc_hi: "पूछें कि टीचर कैसे गाइड करते हैं, विदेश में कौन सा प्रैक्टिकल काम होगा, और रिमोट प्रैक्टिकल मदद है या नहीं।" },
    { emoji: "🕐", title: "Flexible timings", title_hi: "Flexible timings", desc: "Share your country, time zone, and availability. Ask if a batch fits, or if scheduled online sessions can.", desc_hi: "देश, टाइम ज़ोन और उपलब्धता बताएँ। पूछें कि कोई बैच मेल खाता है, या तय online सेशन हो सकते हैं।" },
    { emoji: "💳", title: "International payments", title_hi: "International payments", desc: "Confirm eligibility documents, fee currency, bank transfer, charges, due dates, instalments, and refund rules before you pay.", desc_hi: "पेमेंट से पहले दस्तावेज़, फीस की करेंसी, बैंक ट्रांसफर, चार्ज, तारीख, किस्त और रिफंड नियम कन्फर्म करें।" },
    { emoji: "📜", title: "Certificate", title_hi: "Certificate", desc: "Ask if a certificate is issued, and what eligibility or assessment you must complete. Confirm its use abroad with the right authority.", desc_hi: "पूछें कि सर्टिफिकेट मिलता है या नहीं, और उसके लिए क्या पूरा करना होगा। विदेश में उसके इस्तेमाल की पुष्टि संबंधित अथॉरिटी से करें।" },
  ],
  services_title: "What to confirm before you enrol",
  services_title_hi: "एडमिशन से पहले क्या कन्फर्म करें",
  services_subtitle: "Online, hybrid, remote learning, timings, international payment, and certificate — confirm each with Shreya Creation. Availability depends on the current batch.",
  services_subtitle_hi: "Online, hybrid, रिमोट लर्निंग, टाइमिंग, इंटरनेशनल पेमेंट और सर्टिफिकेट — हर बात Shreya Creation से कन्फर्म करें। उपलब्धता मौजूदा बैच पर निर्भर है।",
  training_title: "How online or hybrid fashion designing training works",
  training_title_hi: "Online या hybrid फैशन डिजाइनिंग ट्रेनिंग कैसे चलती है",
  training_subtitle: "If you are not based in India, confirm how the NRI Fashion Designing Course in Patna works before you enrol.",
  training_subtitle_hi: "भारत में नहीं रहते तो एडमिशन से पहले पटना के NRI फैशन डिजाइनिंग कोर्स का तरीका कन्फर्म करें।",
  training_online_title: "Online learning",
  training_online_title_hi: "Online learning",
  training_online_desc: "Online training can be a way to study fashion designing, stitching, and boutique planning without being physically present. Ask how remote classes work and how your progress is tracked.",
  training_online_desc_hi: "Online ट्रेनिंग फैशन डिजाइनिंग, सिलाई और बुटीक प्लानिंग को पटना आए बिना कवर कर सकती है। रिमोट क्लास और प्रोग्रेस ट्रैकिंग कैसे होती है, पूछें।",
  training_offline_title: "Hybrid learning",
  training_offline_title_hi: "Hybrid learning",
  training_offline_desc: "Hybrid training is an option to explore if you can travel to Patna for core stitching and garment construction. Confirm which lessons need you in Patna.",
  training_offline_desc_hi: "अगर पटना आ सकते हैं तो कोर सिलाई और गारमेंट कंस्ट्रक्शन के लिए hybrid पूछें। कौन से लेसन पटना में ज़रूरी हैं, कन्फर्म करें।",
  training_note: "Remote learners should also ask how instructors guide them, what practical work they complete from abroad, and whether remote practical guidance is available. Clarify online classes, hybrid mode, video lectures, or remote practical training before you enrol.",
  training_note_hi: "रिमोट विद्यार्थी यह भी पूछें कि टीचर कैसे गाइड करते हैं, विदेश से कौन सा प्रैक्टिकल काम होगा, और रिमोट प्रैक्टिकल गाइडेंस है या नहीं। Online क्लास, hybrid, वीडियो या रिमोट प्रैक्टिकल ट्रेनिंग एडमिशन से पहले साफ करें।",
  learn_subtitle: "Designing clothes is creative, and it also needs technical skill and precision. Confirm which of these topics are in the NRI course, and which are not.",
  learn_subtitle_hi: "कपड़ा डिज़ाइन क्रिएटिव है, और इसमें तकनीकी स्किल भी चाहिए। कन्फर्म करें कि NRI कोर्स में इनमें से कौन से विषय हैं, और कौन से नहीं।",
  classes_title: "Timings, payments, and certificate",
  classes_title_hi: "टाइमिंग, पेमेंट और सर्टिफिकेट",
  classes_subtitle: "Time zones, overseas payment, and whether a certificate is issued all need a direct answer before you pay.",
  classes_subtitle_hi: "टाइम ज़ोन, विदेश से पेमेंट, और सर्टिफिकेट मिलता है या नहीं — पेमेंट से पहले सीधा जवाब लें।",
  class_steps: [
    { step: "01", title: "Flexible time options", title_hi: "लचीले समय के विकल्प", desc: "Tell us your country, time zone, and availability. Ask if a batch fits your hours, or if scheduled online sessions can.", desc_hi: "देश, टाइम ज़ोन और उपलब्धता बताएँ। पूछें कि कोई बैच आपके समय से मेल खाता है, या तय online सेशन हो सकते हैं।" },
    { step: "02", title: "International payments", title_hi: "इंटरनेशनल पेमेंट", desc: "Confirm documents, fee currency, bank transfer, charges, due dates, instalments, refunds, and rescheduling before you transfer money.", desc_hi: "पैसे भेजने से पहले दस्तावेज़, करेंसी, बैंक ट्रांसफर, चार्ज, तारीख, किस्त, रिफंड और रीशेड्यूल कन्फर्म करें।" },
    { step: "03", title: "Certificate", title_hi: "सर्टिफिकेट", desc: "Ask if this course issues a certificate, and what you must complete to receive it. If you need it for work or study abroad, confirm that with the relevant authority.", desc_hi: "पूछें कि सर्टिफिकेट मिलता है या नहीं, और उसके लिए क्या पूरा करना होगा। नौकरी या आगे की पढ़ाई के लिए उसकी मान्यता संबंधित अथॉरिटी से कन्फर्म करें।" },
    { step: "04", title: "Decide with the full picture", title_hi: "पूरी जानकारी के साथ फैसला", desc: "Curriculum, duration, online or hybrid format, timings, overseas eligibility, fees, documents, and certificate rules — get these before you decide.", desc_hi: "सिलेबस, अवधि, online या hybrid, टाइमिंग, ओवरसीज़ एलिजिबिलिटी, फीस, दस्तावेज़ और सर्टिफिकेट — फैसला करने से पहले ये साफ कर लें।" },
  ],
  remote_kicker: "From anywhere",
  remote_kicker_hi: "कहीं से भी",
  remote_title: "Kick start your fashion education from any place",
  remote_title_hi: "कहीं से भी अपनी फैशन शिक्षा शुरू करें",
  remote_script: "Syllabus • Learning method • Fees • Timings • Admission",
  remote_script_hi: "सिलेबस • सीखने का तरीका • फीस • टाइमिंग • एडमिशन",
  remote_body: "Where you live does not have to limit your interest in Indian fashion education. With a clear plan, you can study garment designing, stitching, and boutique skills toward your own goals. If you want the NRI Fashion Designing Course in Patna, contact Shreya Creation about the syllabus, learning method, fees, timings, and admission criteria.",
  remote_body_hi: "आप जहाँ रहते हैं, उससे भारतीय फैशन सीखने की इच्छा रुकनी ज़रूरी नहीं। साफ प्लान के साथ गारमेंट डिजाइनिंग, सिलाई और बुटीक स्किल अपने लक्ष्य के लिए सीख सकते हैं। पटना का NRI फैशन डिजाइनिंग कोर्स चाहिए तो सिलेबस, तरीका, फीस, टाइमिंग और एडमिशन के लिए Shreya Creation से संपर्क करें।",
  why_title: "Why choose Shreya Creation?",
  why_title_hi: "Shreya Creation क्यों चुनें?",
  why_subtitle: "Especially when you are enquiring as an NRI, confirm the curriculum, format, timings, fees, documents, and certificate before you decide.",
  why_subtitle_hi: "NRI के रूप में पूछ रहे हैं तो फैसला करने से पहले सिलेबस, फॉर्मेट, टाइमिंग, फीस, दस्तावेज़ और सर्टिफिकेट कन्फर्म करें।",
  learn_title: "What will you learn during fashion designing training?",
  learn_title_hi: "फैशन डिजाइनिंग ट्रेनिंग में क्या सीखेंगे?",
  learn_topics: [
    { label: "Indian garment styles and design concepts", label_hi: "भारतीय गारमेंट स्टाइल और डिज़ाइन" },
    { label: "Stitching and garment construction", label_hi: "सिलाई और गारमेंट कंस्ट्रक्शन" },
    { label: "Fabric selection and design compatibility", label_hi: "कपड़ा चुनाव और डिज़ाइन का मेल" },
    { label: "Measurement, fit, finishing, and pattern making", label_hi: "मेजरमेंट, फिट, फिनिशिंग और पैटर्न मेकिंग" },
    { label: "Boutique planning and creativity", label_hi: "बुटीक प्लानिंग और क्रिएटिविटी" },
  ],
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
