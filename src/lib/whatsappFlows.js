// Topic flows for the floating WhatsApp assistant.
// Each selection shows follow-up questions, then builds a prefilled wa.me message.

import { COURSE_WA_OPTIONS } from "@/lib/seed";

export const WA_FLOWS = {
  course: {
    id: "course",
    label: { en: "🎓 Enroll in a Course", hi: "🎓 कोर्स में एनरोल करें" },
    greeting: {
      en: "Wonderful! Let's find the right course batch for you.",
      hi: "बहुत अच्छा! आपके लिए सही कोर्स बैच ढूंढते हैं।",
    },
    steps: [
      {
        id: "course_type",
        question: {
          en: "Which course are you interested in?",
          hi: "आप किस कोर्स में रुचि रखते हैं?",
        },
        options: COURSE_WA_OPTIONS,
      },
      {
        id: "batch",
        question: {
          en: "Preferred batch timing?",
          hi: "पसंदीदा बैच का समय?",
        },
        options: [
          { en: "Morning", hi: "सुबह" },
          { en: "Afternoon", hi: "दोपहर" },
          { en: "Evening", hi: "शाम" },
          { en: "Weekend", hi: "वीकेंड" },
          { en: "Flexible", hi: "कोई भी समय" },
        ],
      },
      {
        id: "mode",
        question: {
          en: "How would you like to study?",
          hi: "आप कैसे पढ़ना चाहेंगे?",
        },
        options: [
          { en: "In-studio (Patna)", hi: "स्टूडियो में (पटना)" },
          { en: "Online guidance", hi: "ऑनलाइन गाइडेंस" },
          { en: "Either works", hi: "दोनों ठीक हैं" },
        ],
      },
    ],
    buildMessage: (answers, { name, note, url, pageTitle, lang }) => {
      const L = lang === "hi";
      const lines = L
        ? [
            "नमस्ते Shreya creation! 🙏",
            "मैं आपके फैशन कोर्स में एनरोल करना चाहता/चाहती हूँ।",
            "",
            `📚 कोर्स: ${answers.course_type || "-"}`,
            `🕐 बैच: ${answers.batch || "-"}`,
            `🏫 मोड: ${answers.mode || "-"}`,
          ]
        : [
            "Hello Shreya creation! 🙏",
            "I would like to enroll in your fashion course.",
            "",
            `📚 Course: ${answers.course_type || "-"}`,
            `🕐 Batch: ${answers.batch || "-"}`,
            `🏫 Mode: ${answers.mode || "-"}`,
          ];
      if (pageTitle) lines.push("", L ? `📄 पेज: ${pageTitle}` : `📄 Page: ${pageTitle}`);
      if (name) lines.push("", L ? `👤 नाम: ${name}` : `👤 Name: ${name}`);
      if (note) lines.push("", L ? `💬 नोट: ${note}` : `💬 Note: ${note}`);
      if (url) lines.push("", url);
      return lines.join("\n").trim();
    },
  },

  custom: {
    id: "custom",
    label: { en: "👗 Custom Lehenga/Gown Stitching", hi: "👗 कस्टम लहंगा/गाउन सिलाई" },
    greeting: {
      en: "Perfect! Let's plan your custom designer outfit.",
      hi: "बढ़िया! आपका कस्टम डिज़ाइनर आउटफिट प्लान करते हैं।",
    },
    steps: [
      {
        id: "garment",
        question: {
          en: "What would you like stitched?",
          hi: "आप क्या सिलवाना चाहते हैं?",
        },
        options: [
          { en: "Lehenga", hi: "लहंगा" },
          { en: "Gown", hi: "गाउन" },
          { en: "Blouse / Saree blouse", hi: "ब्लाउज / साड़ी ब्लाउज" },
          { en: "Anarkali / Suit", hi: "अनारकली / सूट" },
          { en: "Other", hi: "अन्य" },
        ],
      },
      {
        id: "occasion",
        question: {
          en: "What's the occasion?",
          hi: "किस अवसर के लिए?",
        },
        options: [
          { en: "Bridal", hi: "शादी (ब्राइडल)" },
          { en: "Reception", hi: "रिसेप्शन" },
          { en: "Party / Engagement", hi: "पार्टी / सगाई" },
          { en: "Casual / Regular", hi: "कैज़ुअल / रोज़मर्रा" },
        ],
      },
      {
        id: "timeline",
        question: {
          en: "When do you need it?",
          hi: "आपको कब चाहिए?",
        },
        options: [
          { en: "Within 24 hours", hi: "24 घंटे में" },
          { en: "Within a week", hi: "एक हफ्ते में" },
          { en: "1–2 weeks", hi: "1–2 हफ्ते में" },
          { en: "No rush", hi: "जल्दी नहीं" },
        ],
      },
      {
        id: "fabric",
        question: {
          en: "Fabric preference?",
          hi: "कपड़े की पसंद?",
        },
        options: [
          { en: "I have my own fabric", hi: "मेरे पास कपड़ा है" },
          { en: "Help me choose fabric", hi: "कपड़ा चुनने में मदद चाहिए" },
          { en: "Not decided yet", hi: "अभी तय नहीं" },
        ],
      },
    ],
    buildMessage: (answers, { name, note, url, pageTitle, lang }) => {
      const L = lang === "hi";
      const lines = L
        ? [
            "नमस्ते Shreya creation! 🙏",
            "मैं कस्टम डिज़ाइनर आउटफिट अपने माप पर सिलवाना चाहता/चाहती हूँ।",
            "",
            `👗 परिधान: ${answers.garment || "-"}`,
            `🎉 अवसर: ${answers.occasion || "-"}`,
            `📅 समय: ${answers.timeline || "-"}`,
            `🧵 कपड़ा: ${answers.fabric || "-"}`,
          ]
        : [
            "Hello Shreya creation! 🙏",
            "I would like a custom designer outfit stitched to my size.",
            "",
            `👗 Garment: ${answers.garment || "-"}`,
            `🎉 Occasion: ${answers.occasion || "-"}`,
            `📅 Timeline: ${answers.timeline || "-"}`,
            `🧵 Fabric: ${answers.fabric || "-"}`,
          ];
      if (pageTitle) lines.push("", L ? `📄 पेज: ${pageTitle}` : `📄 Page: ${pageTitle}`);
      if (name) lines.push("", L ? `👤 नाम: ${name}` : `👤 Name: ${name}`);
      if (note) lines.push("", L ? `💬 नोट: ${note}` : `💬 Note: ${note}`);
      if (url) lines.push("", url);
      return lines.join("\n").trim();
    },
  },

  express: {
    id: "express",
    label: { en: "⚡ 24-Hour Express Tailoring", hi: "⚡ 24 घंटे एक्सप्रेस सिलाई" },
    greeting: {
      en: "Got it — let's check express availability for you.",
      hi: "समझ गए — आपके लिए एक्सप्रेस उपलब्धता देखते हैं।",
    },
    steps: [
      {
        id: "style",
        question: {
          en: "Which style do you need?",
          hi: "आपको कौन सी स्टाइल चाहिए?",
        },
        options: [
          { en: "Anarkali", hi: "अनारकली" },
          { en: "Gown", hi: "गाउन" },
          { en: "Lehenga", hi: "लहंगा" },
          { en: "Salwar suit", hi: "सलवार सूट" },
          { en: "Blouse", hi: "ब्लाउज" },
        ],
      },
      {
        id: "urgency",
        question: {
          en: "When do you need delivery?",
          hi: "डिलीवरी कब चाहिए?",
        },
        options: [
          { en: "Today / Tomorrow", hi: "आज / कल" },
          { en: "Within 24 hours", hi: "24 घंटे में" },
          { en: "This weekend", hi: "इस वीकेंड" },
        ],
      },
      {
        id: "size",
        question: {
          en: "Do you have measurements ready?",
          hi: "क्या आपके पास माप तैयार हैं?",
        },
        options: [
          { en: "Yes, I can share now", hi: "हाँ, अभी भेज सकता/सकती हूँ" },
          { en: "Need measurement help", hi: "माप में मदद चाहिए" },
          { en: "Will visit studio", hi: "स्टूडियो आऊँगा/आऊँगी" },
        ],
      },
    ],
    buildMessage: (answers, { name, note, url, pageTitle, lang }) => {
      const L = lang === "hi";
      const lines = L
        ? [
            "नमस्ते Shreya creation! 🙏",
            "मुझे जल्दी एक आउटफिट चाहिए — 24 घंटे एक्सप्रेस सिलाई।",
            "",
            `👗 स्टाइल: ${answers.style || "-"}`,
            `⏰ डिलीवरी: ${answers.urgency || "-"}`,
            `📏 माप: ${answers.size || "-"}`,
          ]
        : [
            "Hello Shreya creation! 🙏",
            "I have an urgent requirement — 24-hour express tailoring.",
            "",
            `👗 Style: ${answers.style || "-"}`,
            `⏰ Delivery: ${answers.urgency || "-"}`,
            `📏 Measurements: ${answers.size || "-"}`,
          ];
      if (pageTitle) lines.push("", L ? `📄 पेज: ${pageTitle}` : `📄 Page: ${pageTitle}`);
      if (name) lines.push("", L ? `👤 नाम: ${name}` : `👤 Name: ${name}`);
      if (note) lines.push("", L ? `💬 नोट: ${note}` : `💬 Note: ${note}`);
      if (url) lines.push("", url);
      return lines.join("\n").trim();
    },
  },

  general: {
    id: "general",
    label: { en: "💬 General Design Consultation", hi: "💬 सामान्य डिज़ाइन कंसल्टेशन" },
    greeting: {
      en: "Happy to help! Tell us a bit about your query.",
      hi: "खुशी से मदद करेंगे! अपने सवाल के बारे में बताइए।",
    },
    steps: [
      {
        id: "topic",
        question: {
          en: "What would you like help with?",
          hi: "आपको किस बारे में मदद चाहिए?",
        },
        options: [
          { en: "Pricing & quote", hi: "कीमत और कोट" },
          { en: "Fabric selection", hi: "कपड़ा चुनना" },
          { en: "Measurements", hi: "माप" },
          { en: "Studio visit", hi: "स्टूडियो विज़िट" },
          { en: "Other query", hi: "अन्य सवाल" },
        ],
      },
      {
        id: "urgency",
        question: {
          en: "How soon do you need a reply?",
          hi: "जवाब कितनी जल्दी चाहिए?",
        },
        options: [
          { en: "Today", hi: "आज" },
          { en: "This week", hi: "इस हफ्ते" },
          { en: "No rush", hi: "जल्दी नहीं" },
        ],
      },
    ],
    buildMessage: (answers, { name, note, url, pageTitle, lang }) => {
      const L = lang === "hi";
      const lines = L
        ? [
            "नमस्ते Shreya creation! 🙏",
            "मुझे आपकी डिज़ाइन टीम से बात करनी है।",
            "",
            `💬 विषय: ${answers.topic || "-"}`,
            `⏰ जवाब: ${answers.urgency || "-"}`,
          ]
        : [
            "Hello Shreya creation! 🙏",
            "I have a general query and would love to connect with your designer.",
            "",
            `💬 Topic: ${answers.topic || "-"}`,
            `⏰ Reply needed: ${answers.urgency || "-"}`,
          ];
      if (pageTitle) lines.push("", L ? `📄 पेज: ${pageTitle}` : `📄 Page: ${pageTitle}`);
      if (name) lines.push("", L ? `👤 नाम: ${name}` : `👤 Name: ${name}`);
      if (note) lines.push("", L ? `💬 नोट: ${note}` : `💬 Note: ${note}`);
      if (url) lines.push("", url);
      return lines.join("\n").trim();
    },
  },

  product: {
    id: "product",
    label: { en: "📦 Order this product", hi: "📦 यह प्रोडक्ट ऑर्डर करें" },
    greeting: {
      en: "Great choice! A few quick details for your order.",
      hi: "बढ़िया चुनाव! ऑर्डर के लिए कुछ जानकारी।",
    },
    steps: [
      {
        id: "action",
        question: {
          en: "What would you like to do?",
          hi: "आप क्या करना चाहते हैं?",
        },
        options: [
          { en: "Order as shown", hi: "जैसा दिख रहा है वैसा ऑर्डर" },
          { en: "Stitch to my size", hi: "मेरे माप पर सिलवाएँ" },
          { en: "Customise design", hi: "डिज़ाइन कस्टमाइज़ करें" },
        ],
      },
      {
        id: "timeline",
        question: {
          en: "When do you need it?",
          hi: "आपको कब चाहिए?",
        },
        options: [
          { en: "Within 24 hours", hi: "24 घंटे में" },
          { en: "Within a week", hi: "एक हफ्ते में" },
          { en: "1–2 weeks", hi: "1–2 हफ्ते में" },
          { en: "No rush", hi: "जल्दी नहीं" },
        ],
      },
      {
        id: "fabric",
        question: {
          en: "Fabric preference?",
          hi: "कपड़े की पसंद?",
        },
        options: [
          { en: "Use product fabric", hi: "प्रोडक्ट वाला कपड़ा" },
          { en: "I have my own fabric", hi: "मेरे पास कपड़ा है" },
          { en: "Help me choose", hi: "चुनने में मदद चाहिए" },
        ],
      },
    ],
    buildMessage: (answers, { name, note, url, pageTitle, lang }) => {
      const L = lang === "hi";
      const item = pageTitle || (L ? "यह प्रोडक्ट" : "this product");
      const lines = L
        ? [
            "नमस्ते Shreya creation! 🙏",
            `मुझे *${item}* में रुचि है।`,
            "",
            `🛍️ कार्य: ${answers.action || "-"}`,
            `📅 समय: ${answers.timeline || "-"}`,
            `🧵 कपड़ा: ${answers.fabric || "-"}`,
          ]
        : [
            "Hello Shreya creation! 🙏",
            `I'm interested in *${item}*.`,
            "",
            `🛍️ Action: ${answers.action || "-"}`,
            `📅 Timeline: ${answers.timeline || "-"}`,
            `🧵 Fabric: ${answers.fabric || "-"}`,
          ];
      if (name) lines.push("", L ? `👤 नाम: ${name}` : `👤 Name: ${name}`);
      if (note) lines.push("", L ? `💬 नोट: ${note}` : `💬 Note: ${note}`);
      if (url) lines.push("", url);
      return lines.join("\n").trim();
    },
  },

  coursePage: {
    id: "coursePage",
    label: { en: "📚 Enroll in this course", hi: "📚 इस कोर्स में एनरोल करें" },
    greeting: {
      en: "Excellent! Let's get you enrolled in this course.",
      hi: "शानदार! इस कोर्स में आपका एनरोलमेंट करते हैं।",
    },
    steps: [
      {
        id: "batch",
        question: {
          en: "Preferred batch timing?",
          hi: "पसंदीदा बैच का समय?",
        },
        options: [
          { en: "Morning", hi: "सुबह" },
          { en: "Afternoon", hi: "दोपहर" },
          { en: "Evening", hi: "शाम" },
          { en: "Weekend", hi: "वीकेंड" },
          { en: "Flexible", hi: "कोई भी समय" },
        ],
      },
      {
        id: "experience",
        question: {
          en: "Your experience level?",
          hi: "आपका अनुभव स्तर?",
        },
        options: [
          { en: "Complete beginner", hi: "पूर्ण शुरुआती" },
          { en: "Some stitching experience", hi: "थोड़ा सिलाई अनुभव" },
          { en: "Professional / advanced", hi: "प्रोफेशनल / एडवांस" },
        ],
      },
      {
        id: "mode",
        question: {
          en: "How would you like to study?",
          hi: "आप कैसे पढ़ना चाहेंगे?",
        },
        options: [
          { en: "In-studio (Patna)", hi: "स्टूडियो में (पटना)" },
          { en: "Online guidance", hi: "ऑनलाइन गाइडेंस" },
          { en: "Either works", hi: "दोनों ठीक हैं" },
        ],
      },
    ],
    buildMessage: (answers, { name, note, url, pageTitle, lang }) => {
      const L = lang === "hi";
      const course = pageTitle || (L ? "यह कोर्स" : "this course");
      const lines = L
        ? [
            "नमस्ते Shreya creation! 🙏",
            `मैं *${course}* में एनरोल करना चाहता/चाहती हूँ।`,
            "",
            `🕐 बैच: ${answers.batch || "-"}`,
            `📊 अनुभव: ${answers.experience || "-"}`,
            `🏫 मोड: ${answers.mode || "-"}`,
          ]
        : [
            "Hello Shreya creation! 🙏",
            `I'd like to enroll in *${course}*.`,
            "",
            `🕐 Batch: ${answers.batch || "-"}`,
            `📊 Experience: ${answers.experience || "-"}`,
            `🏫 Mode: ${answers.mode || "-"}`,
          ];
      if (name) lines.push("", L ? `👤 नाम: ${name}` : `👤 Name: ${name}`);
      if (note) lines.push("", L ? `💬 नोट: ${note}` : `💬 Note: ${note}`);
      if (url) lines.push("", url);
      return lines.join("\n").trim();
    },
  },
};

export const DEFAULT_FLOW_IDS = ["course", "custom", "express", "general"];

export function pickLocalized(item, lang) {
  if (!item) return "";
  if (typeof item === "string") return item;
  return item[lang] || item.en || "";
}

export function getFlowOptions(pageContext, lang) {
  const ids = [...DEFAULT_FLOW_IDS];
  if (pageContext?.type === "product") ids.unshift("product");
  if (pageContext?.type === "course") ids.unshift("coursePage");
  return ids.map((id) => WA_FLOWS[id]).filter(Boolean);
}

export function buildFlowMessage(flowId, answers, meta) {
  const flow = WA_FLOWS[flowId];
  if (!flow) return "";
  return flow.buildMessage(answers, meta);
}
