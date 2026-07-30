export const UI = {
  en: {
    home: "Home",
    shop: "Shop",
    courses: "Courses",
    institute: "Institute",
    niftCoaching: "NIFT Coaching",
    gallery: "Gallery",
    boutique: "Boutique",
    testimonials: "Testimonials",
    portfolio: "Portfolio",
    about: "About Us",
    placements: "Placements",
    nriClients: "NRI Clients",
    enquireNow: "Enquire Now",
    contact: "Contact",
    faq: "FAQ",
    lookbook: "Lookbook",
    orderWhatsApp: "Order on WhatsApp",
    stitchWhatsApp: "Stitch to my size",
    enrollWhatsApp: "Enroll on WhatsApp",
    enquireWhatsApp: "Enquire on WhatsApp",
    chatWhatsApp: "WhatsApp",
    applyNow: "Apply Now",
    darkMode: "Dark Mode",
    language: "हिंदी",
    lightMode: "Light mode",
    stitch24h: "24 Hours Stitching",
    skillToBusiness: "Skill to Business",
    highlightStitching: "24 Hours Stitching",
    highlightSkill: "Skill to Business",
    policies: "Policies",
    privacy: "Privacy",
    shipping: "Shipping",
    returns: "Returns",
    terms: "Terms",
    courseCancellation: "Course Cancellation",
  },
  hi: {
    home: "होम",
    shop: "शॉप",
    courses: "कोर्स",
    institute: "इंस्टिट्यूट",
    niftCoaching: "NIFT कोचिंग",
    gallery: "गैलरी",
    boutique: "बुटीक",
    testimonials: "प्रशंसापत्र",
    portfolio: "पोर्टफोलियो",
    about: "हमारे बारे में",
    placements: "प्लेसमेंट",
    nriClients: "NRI क्लाइंट्स",
    enquireNow: "अभी पूछें",
    contact: "संपर्क",
    faq: "सवाल-जवाब",
    lookbook: "लुकबुक",
    orderWhatsApp: "WhatsApp पर ऑर्डर",
    stitchWhatsApp: "मेरे माप पर सिलवाएँ",
    enrollWhatsApp: "WhatsApp पर एनरोल",
    enquireWhatsApp: "WhatsApp पर पूछें",
    chatWhatsApp: "WhatsApp",
    applyNow: "अभी आवेदन करें",
    darkMode: "डार्क मोड",
    language: "English",
    lightMode: "लाइट मोड",
    stitch24h: "24 घंटे सिलाई",
    skillToBusiness: "कौशल से कारोबार",
    highlightStitching: "24 घंटे सिलाई",
    highlightSkill: "कौशल से कारोबार",
    policies: "नीतियाँ",
    privacy: "गोपनीयता",
    shipping: "शिपिंग",
    returns: "रिटर्न",
    terms: "नियम",
    courseCancellation: "कोर्स रद्दीकरण",
  },
};

export const BRAND_MESSAGE_HI = "कौशल से कारोबार तक";
export const SERVICE_USP_HI = "24 घंटे में सिले कपड़े";

/** Brand message — always Hindi sitewide. */
export function pickBrandMessage(site) {
  return site?.boutiqueHi || site?.boutique_hi || BRAND_MESSAGE_HI;
}

/** Normalizes tagline variants to the canonical Service USP. */
export function normalizeServiceUsp(text) {
  const cleaned = (text || "")
    .replace(/^मात्र\s+/, "")
    .replace(/\s+प्राप्त करें\.?$/, "")
    .trim();
  return cleaned || SERVICE_USP_HI;
}

/** Service USP — always Hindi sitewide. */
export function pickServiceUsp(site) {
  return normalizeServiceUsp(site?.taglineHi || site?.tagline_hi);
}

export function pickLocalized(item, lang, enKey, hiKey) {
  if (lang === "hi" && item?.[hiKey]) return item[hiKey];
  return item?.[enKey] ?? item?.[enKey?.replace("Hi", "")] ?? "";
}

export function pickFaq(faq, lang) {
  return {
    q: lang === "hi" && faq.qHi ? faq.qHi : faq.q,
    a: lang === "hi" && faq.aHi ? faq.aHi : faq.a,
  };
}

export function pickTrust(item, lang) {
  const valueHi = item.value_hi ?? item.valueHi;
  return {
    label: lang === "hi" && item.labelHi ? item.labelHi : item.label,
    value: lang === "hi" && valueHi ? valueHi : item.value,
  };
}

export function pickTeamMember(member, lang) {
  const nameHi = member.name_hi ?? member.nameHi;
  const roleHi = member.role_hi ?? member.roleHi;
  return {
    name: lang === "hi" && nameHi ? nameHi : member.name,
    role: lang === "hi" && roleHi ? roleHi : member.role,
  };
}
