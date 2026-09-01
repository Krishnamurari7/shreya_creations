/**
 * Hindi page metadata — unique titles/descriptions for local search.
 * Do not machine-translate English meta; each entry is written for Patna queries.
 */
import { buildMetadata, DEFAULT_OG_IMAGE } from "@/lib/seo";

const HI_PAGES = {
  home: {
    title: "पटना बुटीक, सिलाई सेंटर और फैशन कोर्स | Shreya Creation",
    description:
      "ईस्ट बोरिंग कैनाल रोड, पटना — ब्लाउज, लहंगा सिलाई, बुटीक कोर्स और फैशन डिज़ाइनिंग। 24 घंटे सिलाई। WhatsApp पर संपर्क करें।",
    path: "/",
    imageAlt: "पटना में Shreya Creation — बुटीक, सिलाई सेंटर और फैशन इंस्टिट्यूट",
  },
  about: {
    title: "Shreya Creation — पटना का बुटीक और फैशन इंस्टिट्यूट",
    description:
      "2012 से पटना में बुटीक सिलाई और फैशन ट्रेनिंग। कौशल से कारोबार तक — ब्राइडल, कस्टम सिलाई और जॉब ओरिएंटेड कोर्स।",
    path: "/about",
    imageAlt: "पटना में Shreya Creation बुटीक और फैशन इंस्टिट्यूट के बारे में",
  },
  shop: {
    title: "लहंगा सिलाई पटना | ब्लाउज सिलाई बोरिंग रोड",
    description:
      "Shreya Creation बुटीक — पटना में डिज़ाइनर ब्लाउज, ब्राइडल लहंगा और 24 घंटे कस्टम सिलाई। ईस्ट बोरिंग कैनाल रोड। WhatsApp ऑर्डर।",
    path: "/shop",
    imageAlt: "पटना में Shreya Creation बुटीक और कस्टम सिलाई",
  },
  courses: {
    title: "पटना का बेस्ट फैशन इंस्टिट्यूट | Shreya Creation",
    description:
      "पटना के बेस्ट फैशन इंस्टिट्यूट में शामिल हों — प्रैक्टिकल फैशन डिज़ाइनिंग, सिलाई, बुटीक मैनेजमेंट, ब्लाउज मेकिंग और करियर-फोकस्ड ट्रेनिंग।",
    path: "/courses",
    imageAlt: "पटना में बेस्ट फैशन इंस्टिट्यूट और डिज़ाइनिंग कोर्स",
  },
  contact: {
    title: "संपर्क — पटना में सिलाई सेंटर | Shreya Creation",
    description:
      "Shreya Creation, ईस्ट बोरिंग कैनाल रोड, पटना। कोर्स, कस्टम सिलाई और ब्राइडल ऑर्डर के लिए कॉल या WhatsApp करें।",
    path: "/contact",
    imageAlt: "पटना में Shreya Creation बुटीक — संपर्क और पता",
  },
  register: {
    title: "छात्र एडमिशन फॉर्म | Shreya Creation पटना",
    description:
      "Shreya Creation में ऑनलाइन एडमिशन फॉर्म भरें — फैशन डिज़ाइनिंग, बुटीक, ब्लाउज मेकिंग कोर्स। जानकारी सुरक्षित सेव, WhatsApp पर कन्फर्म।",
    path: "/register",
    imageAlt: "Shreya Creation पटना — छात्र एडमिशन फॉर्म",
  },
  blog: {
    title: "बुटीक और फैशन डिजाइनिंग ब्लॉग पटना | Shreya Creation",
    description:
      "बुटीक फैशन, सिलाई टिप्स, डिजाइनर ब्लाउज़, स्टिचिंग गाइड और फैशन डिजाइनिंग अपडेट — Shreya Creation, बोरिंग रोड, पटना।",
    path: "/blog",
    imageAlt: "Shreya Creation पटना — बुटीक और फैशन डिजाइनिंग ब्लॉग",
  },
  faq: {
    title: "सवाल-जवाब — बुटीक कोर्स और सिलाई पटना",
    description:
      "Shreya Creation कोर्स, फीस, मुफ़्त डेमो, 24 घंटे सिलाई और बुटीक ट्रेनिंग के बारे में जवाब। बोरिंग रोड, पटना।",
    path: "/faq",
    imageAlt: "पटना में बुटीक कोर्स और सिलाई FAQ",
  },
  nriClients: {
    title: "NRI Boutique & Fashion Classes | Custom Stitching Patna",
    description:
      "NRI clients — custom Indian wear, bridal blouse, lehenga, ready-to-wear saree और 1-to-1 online/offline fashion classes। Shreya Creation Patna।",
    path: "/nri-clients",
    imageAlt: "NRI boutique, custom stitching और fashion classes — Shreya Creation Patna",
  },
  portfolio: {
    title: "पोर्टफोलियो — ब्राइडल और डिज़ाइनर काम पटना",
    description:
      "पटना एटेलियर में बनी ब्राइडल लहंगा, गाउन और डिज़ाइनर ब्लाउज — आपके माप पर, कई स्टाइल 24 घंटे में।",
    path: "/portfolio",
    imageAlt: "Shreya Creation पटना — ब्राइडल और डिज़ाइनर पोर्टफोलियो",
  },
};

const HI_POLICY_META = {
  privacy: {
    title: "गोपनीयता नीति | Shreya Creation पटना",
    description: "Shreya Creation की गोपनीयता नीति — बुटीक कोर्स और कस्टम सिलाई सेवाओं के लिए पटना, बिहार।",
  },
  shipping: {
    title: "शिपिंग नीति | Shreya Creation पटना",
    description: "Shreya Creation शिपिंग और डिलीवरी नीति — पटना बुटीक और NRI ऑर्डर के लिए।",
  },
  returns: {
    title: "रिटर्न नीति | Shreya Creation पटना",
    description: "Shreya Creation रिटर्न और एक्सचेंज नीति — कस्टम सिलाई और बुटीक ऑर्डर, पटना।",
  },
  terms: {
    title: "नियम और शर्तें | Shreya Creation पटना",
    description: "Shreya Creation सेवा नियम — बुटीक कोर्स, सिलाई और ऑर्डर के लिए पटना।",
  },
  "course-cancellation": {
    title: "कोर्स रद्दीकरण नीति | Shreya Creation",
    description: "Shreya Creation कोर्स रद्दीकरण और रिफंड नीति — फैशन और बुटीक कोर्स, पटना।",
  },
};

/** Build Hindi metadata for a static page key. */
export function buildHiPageMetadata(pageKey, overrides = {}) {
  const page = HI_PAGES[pageKey];
  if (!page) {
    return buildMetadata({
      title: overrides.title || "Shreya Creation पटना",
      description: overrides.description || "TODO(owner): needs Hindi meta for this page",
      path: overrides.path || "/",
      locale: "hi",
      ...overrides,
    });
  }
  return buildMetadata({
    title: page.title,
    description: page.description,
    path: page.path,
    image: DEFAULT_OG_IMAGE,
    imageAlt: page.imageAlt,
    locale: "hi",
    ...overrides,
  });
}

/** Build Hindi metadata for a policy page. */
export function buildHiPolicyMetadata(slug, page) {
  const preset = HI_POLICY_META[slug];
  const title = preset?.title || (page?.titleHi ? `${page.titleHi} | Shreya Creation` : "नीति | Shreya Creation");
  const description =
    preset?.description ||
    page?.bodyHi?.slice(0, 155) ||
    "TODO(owner): needs Hindi policy meta description";
  return buildMetadata({
    title,
    description,
    path: `/policies/${slug}`,
    image: DEFAULT_OG_IMAGE,
    imageAlt: page?.titleHi || page?.title || "Shreya Creation नीति",
    locale: "hi",
  });
}
