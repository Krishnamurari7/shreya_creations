export const UI = {
  en: {
    home: "Home",
    shop: "Shop",
    courses: "Courses",
    portfolio: "Portfolio",
    about: "About",
    contact: "Contact",
    faq: "FAQ",
    lookbook: "Lookbook",
    orderWhatsApp: "Order on WhatsApp",
    stitchWhatsApp: "Stitch to my size",
    enrollWhatsApp: "Enroll on WhatsApp",
    enquireWhatsApp: "Enquire on WhatsApp",
    chatWhatsApp: "Chat on WhatsApp",
    language: "हिंदी",
    darkMode: "Dark mode",
    lightMode: "Light mode",
    policies: "Policies",
    privacy: "Privacy",
    shipping: "Shipping",
    returns: "Returns",
  },
  hi: {
    home: "होम",
    shop: "शॉप",
    courses: "कोर्स",
    portfolio: "पोर्टफोलियो",
    about: "हमारे बारे में",
    contact: "संपर्क",
    faq: "सवाल-जवाब",
    lookbook: "लुकबुक",
    orderWhatsApp: "WhatsApp पर ऑर्डर",
    stitchWhatsApp: "मेरे माप पर सिलवाएँ",
    enrollWhatsApp: "WhatsApp पर एनरोल",
    enquireWhatsApp: "WhatsApp पर पूछें",
    chatWhatsApp: "WhatsApp पर चैट",
    language: "English",
    darkMode: "डार्क मोड",
    lightMode: "लाइट मोड",
    policies: "नीतियाँ",
    privacy: "गोपनीयता",
    shipping: "शिपिंग",
    returns: "रिटर्न",
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
  return {
    label: lang === "hi" && item.labelHi ? item.labelHi : item.label,
    value: item.value,
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
