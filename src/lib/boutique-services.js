/**
 * Boutique navbar dropdown + /boutique/[slug] service pages.
 * CMS keys live on settings.pages (same pattern as shop / SEO landings).
 */

import { MEDIA } from "@/lib/media";

const OG_DEFAULT =
  "https://mvnllmfidxslxfqexkxs.supabase.co/storage/v1/object/public/media/1782239288560-v7jdgv.png";

function serviceDefaults({
  metaTitle,
  metaDescription,
  eyebrow,
  eyebrowHi,
  title,
  titleHi,
  tagline,
  taglineHi,
  subtitle,
  subtitleHi,
  intro,
  introHi,
  aboutTitle,
  aboutTitleHi,
  aboutBody,
  aboutBodyHi,
  waMessage,
}) {
  return {
    meta_title: metaTitle,
    meta_description: metaDescription,
    og_image: OG_DEFAULT,
    header_eyebrow: eyebrow,
    header_eyebrow_hi: eyebrowHi,
    header_title: title,
    header_title_hi: titleHi,
    header_tagline: tagline,
    header_tagline_hi: taglineHi,
    header_highlight: "",
    header_highlight_hi: "",
    header_subtitle: subtitle,
    header_subtitle_hi: subtitleHi,
    intro_body: intro,
    intro_body_hi: introHi,
    hero_cta_primary_label: "Explore designs",
    hero_cta_primary_label_hi: "डिज़ाइन देखें",
    hero_cta_primary_href: "/portfolio",
    hero_cta_secondary_label: "Chat on WhatsApp",
    hero_cta_secondary_label_hi: "WhatsApp पर चैट करें",
    about_title: aboutTitle,
    about_title_hi: aboutTitleHi,
    about_body: aboutBody,
    about_body_hi: aboutBodyHi,
    process_title: "From First Sketch to Final Stitch – Your Look, Your Way",
    process_title_hi: "पहले स्केच से आखिरी सिलाई तक — आपका लुक, आपके तरीके से",
    process_features: [
      { icon: "design", title: "Personalised Designs", title_hi: "व्यक्तिगत डिज़ाइन" },
      { icon: "measure", title: "Precision Fitting", title_hi: "सटीक फिटिंग" },
      { icon: "bridal", title: "Boutique Finishing", title_hi: "बुटीक फिनिशिंग" },
      { icon: "hand", title: "Fine Handwork", title_hi: "बारीक हैंडवर्क" },
      { icon: "check", title: "Thoughtful Finishing", title_hi: "सोच-समझकर फिनिशिंग" },
    ],
    closing_tagline: "We Don't Just Stitch Outfits. We Create the Look You'll Remember.",
    closing_tagline_hi: "हम सिर्फ कपड़े नहीं सिलते — वह लुक बनाते हैं जो आप याद रखेंगी।",
    features: [
      {
        emoji: "📏",
        title: "Custom sizing",
        title_hi: "कस्टम माप",
        desc: "Every piece stitched to your exact measurements.",
        desc_hi: "हर पीस आपके माप पर सिला जाता है।",
      },
      {
        emoji: "⚡",
        title: "24h express",
        title_hi: "24 घंटे एक्सप्रेस",
        desc: "Many ready styles delivered within a day.",
        desc_hi: "कई स्टाइल एक दिन में डिलीवर।",
      },
      {
        emoji: "💬",
        title: "WhatsApp order",
        title_hi: "WhatsApp ऑर्डर",
        desc: "Consult and confirm sizing in chat.",
        desc_hi: "चैट में कंसल्ट और माप कन्फर्म करें।",
      },
    ],
    cta_title: "Ready to start your outfit?",
    cta_title_hi: "अपना आउटफ़िट शुरू करने के लिए तैयार?",
    cta_subtitle: "Book a studio visit or start a custom stitching consultation on WhatsApp.",
    cta_subtitle_hi: "स्टूडियो विज़िट बुक करें या WhatsApp पर कस्टम सिलाई की सलाह लें।",
    cta_primary_label: "Chat on WhatsApp",
    cta_primary_label_hi: "WhatsApp पर चैट करें",
    cta_secondary_href: "/contact",
    cta_secondary_label: "Contact us",
    cta_secondary_label_hi: "संपर्क करें",
    cta_wa_message: waMessage,
    hero_image: MEDIA.boutique,
  };
}

/** Nav + routing registry (order = dropdown order). */
export const BOUTIQUE_SERVICES = [
  {
    slug: "stitching",
    cmsKey: "boutiqueStitching",
    href: "/boutique/stitching",
    navLabel: "Boutique Stitch",
    navLabelHi: "बुटीक सिलाई",
    navDesc: "Custom stitching & 24h express",
    navDescHi: "कस्टम सिलाई और 24 घंटे एक्सप्रेस",
    productCategories: null,
    icon: "stitch",
  },
  {
    slug: "blouse",
    cmsKey: "boutiqueBlouse",
    href: "/boutique/blouse",
    navLabel: "Blouse",
    navLabelHi: "ब्लाउज",
    navDesc: "Designer & bridal blouses",
    navDescHi: "डिज़ाइनर और ब्राइडल ब्लाउज",
    productCategories: ["Blouse"],
    icon: "blouse",
  },
  {
    slug: "lehenga",
    cmsKey: "boutiqueLehenga",
    href: "/boutique/lehenga",
    navLabel: "Lehenga",
    navLabelHi: "लहंगा",
    navDesc: "Bridal & festive lehengas",
    navDescHi: "ब्राइडल और फेस्टिव लहंगे",
    productCategories: ["Lehenga"],
    icon: "lehenga",
  },
  {
    slug: "suit",
    cmsKey: "boutiqueSuit",
    href: "/boutique/suit",
    navLabel: "Suit",
    navLabelHi: "सूट",
    navDesc: "Salwar suits & Anarkali",
    navDescHi: "सलवार सूट और अनारकली",
    productCategories: ["Suit"],
    icon: "suit",
  },
  {
    slug: "gown",
    cmsKey: "boutiqueGown",
    href: "/boutique/gown",
    navLabel: "Gown",
    navLabelHi: "गाउन",
    navDesc: "Reception & party gowns",
    navDescHi: "रिसेप्शन और पार्टी गाउन",
    productCategories: ["Gown"],
    icon: "gown",
  },
  {
    slug: "bridal",
    cmsKey: "boutiqueBridal",
    href: "/boutique/bridal",
    navLabel: "Bridal Wear",
    navLabelHi: "ब्राइडल वियर",
    navDesc: "Wedding & reception looks",
    navDescHi: "शादी और रिसेप्शन लुक",
    productCategories: ["Lehenga", "Gown", "Blouse"],
    icon: "bridal",
  },
  {
    slug: "jewellery",
    cmsKey: "boutiqueJewellery",
    href: "/boutique/jewellery",
    navLabel: "Jewellery",
    navLabelHi: "ज्वेलरी",
    navDesc: "Kundan & statement sets",
    navDescHi: "कुंदन और स्टेटमेंट सेट",
    productCategories: ["Jewellery"],
    icon: "spark",
  },
  {
    slug: "accessories",
    cmsKey: "boutiqueAccessories",
    href: "/boutique/accessories",
    navLabel: "Accessories",
    navLabelHi: "एक्सेसरीज़",
    navDesc: "Potli, dupatta & finishing",
    navDescHi: "पोतली, दुपट्टा और फिनिशिंग",
    productCategories: ["Accessories"],
    icon: "spark",
  },
];

/** Overview link shown first in the Boutique dropdown. */
export const BOUTIQUE_OVERVIEW = {
  href: "/shop",
  navLabel: "All Boutique",
  navLabelHi: "सभी बुटीक",
  navDesc: "Full designer collection",
  navDescHi: "पूरा डिज़ाइनर कलेक्शन",
  icon: "boutique",
};

export const BOUTIQUE_SERVICE_SLUGS = BOUTIQUE_SERVICES.map((s) => s.slug);

export function getBoutiqueService(slug) {
  return BOUTIQUE_SERVICES.find((s) => s.slug === slug) || null;
}

export function filterProductsForBoutiqueService(products = [], service) {
  if (!service?.productCategories?.length) return products;
  const allowed = new Set(service.productCategories.map((c) => c.toLowerCase()));
  return products.filter((p) => p.category && allowed.has(String(p.category).toLowerCase()));
}

/** Default CMS blobs keyed by cmsKey — merged into PAGE_DEFAULTS. */
export const BOUTIQUE_PAGE_DEFAULTS = {
  boutiqueStitching: serviceDefaults({
    metaTitle: "Boutique Stitching Patna | Custom Stitching | Shreya Creation",
    metaDescription:
      "Boutique stitch & custom stitching in Patna — designer blouses, bridal wear, suits, gowns and 24-hour express stitching at Shreya Creation, Boring Road.",
    eyebrow: "Boutique Stitch",
    eyebrowHi: "बुटीक सिलाई",
    title: "Boutique Stitching in Patna",
    titleHi: "पटना में बुटीक सिलाई",
    tagline: "Custom fit. Designer finish. Express when you need it.",
    taglineHi: "कस्टम फिट। डिज़ाइनर फिनिश। जब ज़रूरत हो एक्सप्रेस।",
    subtitle:
      "Bring your fabric or pick from our designs — Shreya Creation stitches every outfit to your measurements with boutique-quality finishing on Boring Road, Patna.",
    subtitleHi:
      "अपना कपड़ा लाएँ या हमारे डिज़ाइन चुनें — Shreya Creation बोरिंग रोड, पटना पर हर आउटफ़िट आपके माप पर बुटीक-क्वालिटी फिनिशिंग के साथ सिलता है।",
    intro:
      "From everyday blouses to bridal sets, our boutique stitch desk handles measurement, trial, alteration and handwork — many styles ready in about 24 hours.",
    introHi:
      "रोज़मर्रा के ब्लाउज से ब्राइडल सेट तक — माप, ट्रायल, ऑल्टरेशन और हैंडवर्क। कई स्टाइल लगभग 24 घंटे में तैयार।",
    aboutTitle: "Why boutique stitch with us?",
    aboutTitleHi: "हमारे साथ बुटीक सिलाई क्यों?",
    aboutBody:
      "We combine practical tailoring with fashion design — personalised silhouettes, precision fitting, Aari-Zari options, and clear WhatsApp consultation before you pay.",
    aboutBodyHi:
      "हम प्रैक्टिकल टेलरिंग और फैशन डिज़ाइन मिलाते हैं — व्यक्तिगत सिल्हूट, सटीक फिटिंग, आरी-ज़री विकल्प, और पेमेंट से पहले साफ़ WhatsApp कंसल्टेशन।",
    waMessage:
      "Hi Shreya Creation! 👋 I'd like boutique / custom stitching. Please share design options, timing, and pricing.",
  }),
  boutiqueBlouse: serviceDefaults({
    metaTitle: "Designer Blouse Stitching Patna | Shreya Creation",
    metaDescription:
      "Designer blouse stitching in Patna — bridal, backless, collar, sleeveless and saree blouses with boutique finishing at Shreya Creation.",
    eyebrow: "Blouse",
    eyebrowHi: "ब्लाउज",
    title: "Designer Blouse Boutique",
    titleHi: "डिज़ाइनर ब्लाउज बुटीक",
    tagline: "Necklines, backs & fits made for your saree.",
    taglineHi: "नेकलाइन, बैक और फिट — आपकी साड़ी के लिए।",
    subtitle:
      "From classic to contemporary — padded, princess-cut, dori-back and embroidered blouses stitched to your exact measurements.",
    subtitleHi:
      "क्लासिक से समकालीन तक — पैडेड, प्रिंसेस-कट, डोरी-बैक और एम्ब्रॉयडरी ब्लाउज आपके माप पर।",
    intro:
      "Browse blouse designs or share a reference photo. We handle fabric matching, lining, piping and latkan finishing for saree and lehenga blouses.",
    introHi:
      "ब्लाउज डिज़ाइन देखें या रेफरेंस फोटो भेजें। साड़ी और लहंगा ब्लाउज के लिए फैब्रिक मैचिंग, लाइनिंग, पाइपिंग और लटकन फिनिशिंग।",
    aboutTitle: "Blouse craft that fits",
    aboutTitleHi: "ब्लाउज क्राफ्ट जो फिट बैठे",
    aboutBody:
      "Every blouse is drafted for your body — cups, armholes, back depth and sleeve style — so your saree drapes cleanly and feels secure all day.",
    aboutBodyHi:
      "हर ब्लाउज आपके बॉडी के लिए ड्राफ्ट होता है — कप, आर्महोल, बैक डेप्थ और स्लीव स्टाइल — ताकि साड़ी साफ़ ड्रेप हो और पूरा दिन सहज लगे।",
    waMessage:
      "Hi Shreya Creation! 👋 I'm interested in a designer blouse. Please share styles, fabric options, and stitching time.",
  }),
  boutiqueLehenga: serviceDefaults({
    metaTitle: "Lehenga Stitching Patna | Bridal Lehenga | Shreya Creation",
    metaDescription:
      "Custom lehenga stitching in Patna — bridal, festive and party lehengas with boutique fitting and finishing at Shreya Creation.",
    eyebrow: "Lehenga",
    eyebrowHi: "लहंगा",
    title: "Lehenga & Bridal Skirts",
    titleHi: "लहंगा और ब्राइडल स्कर्ट",
    tagline: "Flare, fall and finish — measured for you.",
    taglineHi: "फ्लेयर, फॉल और फिनिश — आपके माप पर।",
    subtitle:
      "Panelled, kali and mermaid lehengas with matching blouses — crafted for weddings, receptions and festive evenings.",
    subtitleHi:
      "पैनल्ड, काली और मरमेड लहंगे मैचिंग ब्लाउज के साथ — शादी, रिसेप्शन और त्योहारों के लिए।",
    intro:
      "Choose fabric and silhouette with our team, or bring your own cloth. We focus on hip ease, waist stay and dupatta finishing.",
    introHi:
      "हमारी टीम के साथ फैब्रिक और सिल्हूट चुनें, या अपना कपड़ा लाएँ। हिप ईज़, वेस्ट स्टे और दुपट्टा फिनिशिंग पर ध्यान।",
    aboutTitle: "Lehengas that move with you",
    aboutTitleHi: "लहंगे जो आपके साथ चलें",
    aboutBody:
      "From lightweight party wear to heavy bridal canvases, we balance structure and comfort so you can sit, walk and dance with confidence.",
    aboutBodyHi:
      "हल्के पार्टी वेयर से भारी ब्राइडल तक — स्ट्रक्चर और कम्फर्ट का बैलेंस, ताकि आप आराम से बैठें, चलें और डांस करें।",
    waMessage:
      "Hi Shreya Creation! 👋 I'd like a custom lehenga. Please share design ideas, fabric options, and timeline.",
  }),
  boutiqueSuit: serviceDefaults({
    metaTitle: "Suit Stitching Patna | Salwar Suit Boutique | Shreya Creation",
    metaDescription:
      "Custom suit stitching in Patna — salwar suits, Anarkali and designer ethnic sets with boutique finishing at Shreya Creation.",
    eyebrow: "Suit",
    eyebrowHi: "सूट",
    title: "Designer Suit Stitching",
    titleHi: "डिज़ाइनर सूट सिलाई",
    tagline: "Everyday elegance to festive sets.",
    taglineHi: "रोज़ की एलीगेंस से फेस्टिव सेट तक।",
    subtitle:
      "Salwar, churidar and Anarkali suits tailored for comfort and clean fall — ideal for office, functions and family celebrations.",
    subtitleHi:
      "सलवार, चूड़ीदार और अनारकली सूट — आराम और साफ़ फॉल के साथ। ऑफिस, फंक्शन और फैमिली सेलिब्रेशन के लिए।",
    intro:
      "Share your preferred neckline, sleeve and bottom style. We stitch kurti length, flare and lining to your measurements.",
    introHi:
      "अपनी पसंद की नेकलाइन, स्लीव और बॉटम स्टाइल बताएँ। हम कुर्ती लंबाई, फ्लेयर और लाइनिंग आपके माप पर सिलते हैं।",
    aboutTitle: "Suits with boutique polish",
    aboutTitleHi: "बुटीक पॉलिश वाले सूट",
    aboutBody:
      "We finish seams, hems and necks like boutique pieces — not rushed market stitching — so your suit looks sharp wash after wash.",
    aboutBodyHi:
      "सीम, हेम और नेक को बुटीक पीस की तरह फिनिश करते हैं — जल्दबाज़ी वाली मार्केट सिलाई नहीं — ताकि सूट हर धुलाई के बाद भी शार्प लगे।",
    waMessage:
      "Hi Shreya Creation! 👋 I'd like a designer suit stitched. Please share options and timing.",
  }),
  boutiqueGown: serviceDefaults({
    metaTitle: "Gown Stitching Patna | Reception & Party Gowns | Shreya Creation",
    metaDescription:
      "Custom gown stitching in Patna — reception, Indo-western and party gowns with precise fitting at Shreya Creation boutique.",
    eyebrow: "Gown",
    eyebrowHi: "गाउन",
    title: "Reception & Party Gowns",
    titleHi: "रिसेप्शन और पार्टी गाउन",
    tagline: "Silhouette first. Comfort always.",
    taglineHi: "पहले सिल्हूट। हमेशा कम्फर्ट।",
    subtitle:
      "Floor-length, cocktail and fusion gowns — structured bodices, soft drapes and boutique finishing for your big evenings.",
    subtitleHi:
      "फ्लोर-लेंथ, कॉकटेल और फ्यूजन गाउन — स्ट्रक्चर्ड बॉडीस, सॉफ्ट ड्रेप्स और बुटीक फिनिशिंग।",
    intro:
      "Bring a reference look or pick from our portfolio. We adjust bust, waist, hip and hem for a red-carpet fit.",
    introHi:
      "रेफरेंस लुक लाएँ या पोर्टफोलियो से चुनें। बस्ट, वेस्ट, हिप और हेम को रेड-कार्पेट फिट के लिए एडजस्ट करते हैं।",
    aboutTitle: "Gowns that photograph well",
    aboutTitleHi: "गाउन जो फोटो में अच्छे लगें",
    aboutBody:
      "Clean lines, secure closures and thoughtful lining — so you look polished in person and in pictures.",
    aboutBodyHi:
      "साफ़ लाइन्स, सुरक्षित क्लोज़र और सोच-समझकर लाइनिंग — ताकि आप लाइव और फोटो दोनों में पॉलिश्ड दिखें।",
    waMessage:
      "Hi Shreya Creation! 👋 I'm looking for a custom gown. Please share designs and stitching timeline.",
  }),
  boutiqueBridal: serviceDefaults({
    metaTitle: "Bridal Wear Patna | Bridal Boutique | Shreya Creation",
    metaDescription:
      "Bridal wear boutique in Patna — bridal lehenga, reception gown, designer blouse and custom wedding stitching at Shreya Creation.",
    eyebrow: "Bridal Wear",
    eyebrowHi: "ब्राइडल वियर",
    title: "Bridal & Wedding Outfits",
    titleHi: "ब्राइडल और वेडिंग आउटफ़िट",
    tagline: "Your most important looks, made for you.",
    taglineHi: "आपके सबसे खास लुक — आपके लिए।",
    subtitle:
      "Bridal lehengas, reception gowns and statement blouses — measured, trialled and finished for wedding-day confidence.",
    subtitleHi:
      "ब्राइडल लहंगे, रिसेप्शन गाउन और स्टेटमेंट ब्लाउज — माप, ट्रायल और वेडिंग-डे कन्फिडेंस के लिए फिनिश।",
    intro:
      "Plan the full bridal set with our boutique desk — colour, fabric weight, handwork density and timeline for each function.",
    introHi:
      "हमारे बुटीक डेस्क के साथ पूरा ब्राइडल सेट प्लान करें — रंग, फैब्रिक वेट, हैंडवर्क और हर फंक्शन का टाइमलाइन।",
    aboutTitle: "A bridal partner, not just a tailor",
    aboutTitleHi: "सिर्फ टेलर नहीं — ब्राइडल पार्टनर",
    aboutBody:
      "We guide silhouette choices for your body type, manage trials patiently, and finish embellishment so the outfit feels as special as the day.",
    aboutBodyHi:
      "हम आपके बॉडी टाइप के हिसाब से सिल्हूट गाइड करते हैं, ट्रायल धैर्य से करते हैं, और एम्बेलिशमेंट ऐसा फिनिश करते हैं कि आउटफ़िट दिन जितना खास लगे।",
    waMessage:
      "Hi Shreya Creation! 👋 I'm planning bridal wear. Please share consultation options and timelines.",
  }),
  boutiqueJewellery: serviceDefaults({
    metaTitle: "Bridal Jewellery Patna | Boutique Accessories | Shreya Creation",
    metaDescription:
      "Boutique jewellery and statement sets in Patna — kundan, bridal and festive pieces to complete your outfit at Shreya Creation.",
    eyebrow: "Jewellery",
    eyebrowHi: "ज्वेलरी",
    title: "Jewellery & Statement Sets",
    titleHi: "ज्वेलरी और स्टेटमेंट सेट",
    tagline: "Finish the look with the right shine.",
    taglineHi: "सही चमक से लुक पूरा करें।",
    subtitle:
      "Curated bridal and festive jewellery pieces that pair with our stitched outfits — ask WhatsApp for availability.",
    subtitleHi:
      "ब्राइडल और फेस्टिव ज्वेलरी जो हमारी सिले आउटफ़िट के साथ जाएँ — उपलब्धता के लिए WhatsApp करें।",
    intro:
      "Match metal tone and density to your blouse and lehenga. We help you choose pieces that photograph cleanly.",
    introHi:
      "ब्लाउज और लहंगे के साथ मेटल टोन और डेंसिटी मैच करें। हम ऐसे पीस चुनने में मदद करते हैं जो फोटो में साफ़ दिखें।",
    aboutTitle: "Complete the bridal canvas",
    aboutTitleHi: "ब्राइडल कैनवस पूरा करें",
    aboutBody:
      "Jewellery is part of the boutique experience — coordinated with your outfit colour, neckline and occasion.",
    aboutBodyHi:
      "ज्वेलरी बुटीक अनुभव का हिस्सा है — आपके आउटफ़िट के रंग, नेकलाइन और अवसर से मैच।",
    waMessage:
      "Hi Shreya Creation! 👋 I'm interested in boutique jewellery / sets. Please share available pieces.",
  }),
  boutiqueAccessories: serviceDefaults({
    metaTitle: "Boutique Accessories Patna | Potli & Dupatta | Shreya Creation",
    metaDescription:
      "Boutique accessories in Patna — potli bags, dupatta finishing and styling pieces to complete custom outfits at Shreya Creation.",
    eyebrow: "Accessories",
    eyebrowHi: "एक्सेसरीज़",
    title: "Boutique Accessories",
    titleHi: "बुटीक एक्सेसरीज़",
    tagline: "Small details that finish the outfit.",
    taglineHi: "छोटे डिटेल जो आउटफ़िट पूरा करें।",
    subtitle:
      "Potli bags, embroidered dupattas and finishing pieces styled with your custom stitch order.",
    subtitleHi:
      "पोतली बैग, एम्ब्रॉयडर्ड दुपट्टे और फिनिशिंग पीस — आपकी कस्टम सिलाई ऑर्डर के साथ।",
    intro:
      "Ask us to coordinate accessories with your blouse or lehenga colour so the full look feels intentional.",
    introHi:
      "ब्लाउज या लहंगे के रंग से एक्सेसरीज़ कोऑर्डिनेट करने को कहें — ताकि पूरा लुक सोच-समझकर लगे।",
    aboutTitle: "Details that matter",
    aboutTitleHi: "डिटेल जो मायने रखते हैं",
    aboutBody:
      "From tassels to potlis, we treat accessories as part of the outfit story — not an afterthought.",
    aboutBodyHi:
      "टैसल से पोतली तक — एक्सेसरीज़ को आउटफ़िट की कहानी का हिस्सा मानते हैं, बाद की सोच नहीं।",
    waMessage:
      "Hi Shreya Creation! 👋 I'd like boutique accessories to match my outfit. Please share options.",
  }),
};

export const BOUTIQUE_CMS_KEYS = BOUTIQUE_SERVICES.map((s) => s.cmsKey);
