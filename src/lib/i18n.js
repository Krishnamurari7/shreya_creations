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
    policies: "नीतियाँ",
    privacy: "गोपनीयता",
    shipping: "शिपिंग",
    returns: "रिटर्न",
  },
};

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
