/**
 * Conversion-landing content for every /boutique/[slug] service page.
 * Shared layout: BoutiqueServiceLandingClient
 */

import { MEDIA } from "@/lib/media";

const SB = "https://mvnllmfidxslxfqexkxs.supabase.co/storage/v1/object/public/media";

const IMG = {
  blouseBridal: `${SB}/1786290945897-ewbdy9.jpg`,
  collar: `${SB}/1783527025222-bn0dlg.jpeg`,
  backless: `${SB}/1783526726411-yegh8h.jpeg`,
  rajwadi: `${SB}/1783527063710-jwvmxg.jpeg`,
  sleeveless: `${SB}/1783527085090-0toedw.jpeg`,
  madhubala: `${SB}/1783527043668-lzyi5k.jpeg`,
  blouseSuit: `${SB}/1783526973254-2wibuc.jpeg`,
  lehenga: `${SB}/1788540494073-kna8pv.jpg`,
  boutique: MEDIA.boutique,
  bridal: MEDIA.categories.bridal,
  ethnic: MEDIA.categories.ethnicWear,
  stitch: MEDIA.categories.stitching,
  slider1: MEDIA.slider1,
  slider2: MEDIA.slider2,
  slider3: MEDIA.slider3,
  slider4: MEDIA.slider4,
};

/** Real boutique photos — portrait shots and lookbook crops. Blouse page keeps its own set. */
const WORK = {
  orangeLehenga: `${SB}/1780726183809-7pla6l.jpeg`,
  heavyBridal: `${SB}/1780590285921-cgi8gy.jpeg`,
  greenReception: `${SB}/1780726309151-06rmye.jpeg`,
  creamGown: `${SB}/1780590251090-nq4von.jpeg`,
  eveningPair: `${SB}/1780726223713-3bw2q1.jpeg`,
  purpleSuit: `${SB}/1780726249320-wwg256.jpeg`,
  magentaKurta: `${SB}/1792462825238-pr320l.jpeg`,
  redGold: `${SB}/1789472263820-q5c1b0.jpg`,
  peachBridal: `${SB}/1786637606091-jfhnwy.jpeg`,
  creamLehenga: `${SB}/1788540494073-kna8pv.jpg`,
  tricolorBlouse: `${SB}/1786638759113-b35gaz.jpeg`,
};
const PORTRAIT = "object-[center_18%]";
const CROP_RIGHT = "object-[78%_center]";
const CROP_LEFT = "object-[22%_center]";

const SHARED_MEASURE = [
  { value: "Visit studio for measurement", hi: "स्टूडियो आकर माप लें" },
  { value: "I will share measurements on WhatsApp", hi: "WhatsApp पर माप भेजूँगी" },
  { value: "Copy from existing outfit", hi: "पुराने आउटफ़िट से कॉपी करें" },
];

const SHARED_LOCATION_FAQ = {
  q: "Where is your boutique in Patna?",
  qHi: "पटना में आपका बुटीक कहाँ है?",
  a: "Shreya Creation, Sisodiya Place, East Boring Canal Road, Sri Krishna Puri, Patna, Bihar 800001. Open Mon–Sat.",
  aHi: "Shreya Creation, सिसोदिया प्लेस, ईस्ट बोरिंग कैनाल रोड, श्री कृष्णा पुरी, पटना, बिहार 800001। सोम–शनि खुला।",
};

function makeProcess(noun, nounHi) {
  return [
    {
      step: 1,
      title: "Choose Design",
      titleHi: "डिज़ाइन चुनें",
      desc: "Browse gallery or share your own reference.",
      descHi: "गैलरी देखें या अपना रेफरेंस भेजें।",
    },
    {
      step: 2,
      title: "Share Details",
      titleHi: "डिटेल्स भेजें",
      desc: "Fabric, measurements, and requirements.",
      descHi: "फैब्रिक, माप और ज़रूरतें बताएँ।",
    },
    {
      step: 3,
      title: "Get Confirmation",
      titleHi: "कन्फर्मेशन पाएँ",
      desc: "Design details, price, and delivery time.",
      descHi: "डिज़ाइन, कीमत और डिलीवरी समय।",
    },
    {
      step: 4,
      title: "Stitching in Progress",
      titleHi: "सिलाई शुरू",
      desc: "Our experts stitch with boutique finish.",
      descHi: "एक्सपर्ट बुटीक फिनिश के साथ सिलते हैं।",
    },
    {
      step: 5,
      title: "Pickup / Delivery",
      titleHi: "पिकअप / डिलीवरी",
      desc: `Try and collect your perfect ${noun}.`,
      descHi: `ट्रायल करें और अपना परफेक्ट ${nounHi} लें।`,
    },
  ];
}

const DEFAULT_USPS = [
  { icon: "clock", en: "Get It Stitched Within 24 Hours*", hi: "मात्र 24 घंटे में सिलाएँ*" },
  { icon: "fit", en: "Perfect Fitting", hi: "परफेक्ट फिटिंग" },
  { icon: "finish", en: "Designer Finishing", hi: "डिज़ाइनर फिनिशिंग" },
  { icon: "occasion", en: "For Weddings, Parties & Everyday", hi: "शादी, पार्टी और रोज़मर्रा के लिए" },
];

/** @type {Record<string, object>} */
export const BOUTIQUE_LANDINGS = {
  blouse: {
    slug: "blouse",
    href: "/boutique/blouse",
    formId: "boutique-booking",
    source: "blouse_booking_form",
    noun: "blouse",
    nounHi: "ब्लाउज",
    typeLabel: "Blouse Type",
    typeLabelHi: "ब्लाउज प्रकार",
    eyebrow: "CUSTOM FIT. TIMELESS STYLE.",
    eyebrowHi: "कस्टम फिट। टाइमलेस स्टाइल।",
    h1: "Designer Blouse Stitching in Patna",
    h1Hi: "पटना में डिज़ाइनर ब्लाउज सिलाई",
    tagline: "Traditional to Trendy – We Stitch Your Style",
    taglineHi: "पारंपरिक से ट्रेंडी – हम आपके स्टाइल में सिलते हैं",
    heroQuote: "Every Saree Deserves a Beautiful Blouse",
    heroQuoteHi: "हर साड़ी एक खूबसूरत ब्लाउज की हकदार है",
    heroQuoteCta: "Design it With Us",
    heroQuoteCtaHi: "हमारे साथ डिज़ाइन करें",
    heroImage: IMG.blouseBridal,
    usps: DEFAULT_USPS,
    primaryCta: "Book Your Blouse Stitching",
    primaryCtaHi: "ब्लाउज सिलाई बुक करें",
    bookMsg:
      "Hi Shreya Creation! 👋 I'd like to book designer blouse stitching. Please share styles, pricing, and timeline.",
    bookMsgHi:
      "नमस्ते श्रेया क्रिएशन! 👋 मुझे डिज़ाइनर ब्लाउज सिलाई बुक करनी है। कृपया स्टाइल, कीमत और टाइमलाइन बताएँ।",
    galleryTitle: "Designer Blouse Designs – Style & Stitching Reference",
    galleryTitleHi: "डिज़ाइनर ब्लाउज डिज़ाइन – स्टाइल और सिलाई रेफरेंस",
    galleryLead:
      "Browse necklines, backs and sleeve styles. Select a design you love — we stitch it to your measurements.",
    galleryLeadHi: "नेकलाइन, बैक और स्लीव स्टाइल देखें। पसंद आए तो चुनें — हम आपके माप पर सिलेंगे।",
    designs: [
      { id: "halter", title: "Halter Neck Blouse", titleHi: "हॉल्टर नेक ब्लाउज", image: IMG.collar },
      { id: "designer-back", title: "Designer Back Blouse", titleHi: "डिज़ाइनर बैक ब्लाउज", image: IMG.backless },
      { id: "bridal", title: "Bridal Blouse Design", titleHi: "ब्राइडल ब्लाउज डिज़ाइन", image: IMG.rajwadi },
      { id: "sleeveless", title: "Sleeveless Blouse", titleHi: "स्लीवलेस ब्लाउज", image: IMG.sleeveless },
      { id: "madhubala", title: "Madhubala Style Blouse", titleHi: "मधुबाला स्टाइल ब्लाउज", image: IMG.madhubala },
      { id: "collar", title: "Collar Neck Blouse", titleHi: "कॉलर नेक ब्लाउज", image: IMG.collar },
      { id: "embroidered", title: "Embroidered Designer Blouse", titleHi: "एम्ब्रॉयडर्ड डिज़ाइनर ब्लाउज", image: IMG.blouseSuit },
      { id: "classic", title: "Classic Saree Blouse", titleHi: "क्लासिक साड़ी ब्लाउज", image: IMG.boutique },
    ],
    servicesTitle: "Our Blouse Stitching Services",
    servicesTitleHi: "हमारी ब्लाउज सिलाई सेवाएँ",
    services: [
      { icon: "needle", en: "Designer Blouse Stitching", hi: "डिज़ाइनर ब्लाउज सिलाई" },
      { icon: "saree", en: "Saree Blouse Stitching", hi: "साड़ी ब्लाउज सिलाई" },
      { icon: "bridal", en: "Bridal Blouse Stitching", hi: "ब्राइडल ब्लाउज सिलाई" },
      { icon: "alter", en: "Blouse Alteration & Fitting", hi: "ब्लाउज ऑल्टरेशन और फिटिंग" },
      { icon: "pad", en: "Padded / Princess Cut Options", hi: "पैडेड / प्रिंसेस कट विकल्प" },
      { icon: "hand", en: "Embroidery & Embellishment", hi: "एम्ब्रॉयडरी और एम्बेलिशमेंट" },
      { icon: "express", en: "24-Hour Express Stitching*", hi: "24 घंटे एक्सप्रेस सिलाई*" },
      { icon: "match", en: "Fabric Matching & Lining", hi: "फैब्रिक मैचिंग और लाइनिंग" },
    ],
    pricesTitle: "Blouse Stitching Price (Starting From)",
    pricesTitleHi: "ब्लाउज सिलाई कीमत (शुरुआती)",
    prices: [
      { type: "Basic Blouse Stitching", typeHi: "बेसिक ब्लाउज सिलाई", price: "599" },
      { type: "Designer Blouse", typeHi: "डिज़ाइनर ब्लाउज", price: "999" },
      { type: "Bridal Blouse", typeHi: "ब्राइडल ब्लाउज", price: "1,499" },
      { type: "Blouse with Heavy Work", typeHi: "हेवी वर्क ब्लाउज", price: "1,999" },
      { type: "Blouse Alteration", typeHi: "ब्लाउज ऑल्टरेशन", price: "299" },
      { type: "Lining / Padding Add-on", typeHi: "लाइनिंग / पैडिंग ऐड-ऑन", price: "199" },
    ],
    formTitle: "Book Your Blouse Stitching",
    formTitleHi: "अपनी ब्लाउज सिलाई बुक करें",
    typeOptions: [
      { value: "Basic Blouse", hi: "बेसिक ब्लाउज" },
      { value: "Designer Blouse", hi: "डिज़ाइनर ब्लाउज" },
      { value: "Bridal Blouse", hi: "ब्राइडल ब्लाउज" },
      { value: "Saree Blouse", hi: "साड़ी ब्लाउज" },
      { value: "Alteration / Fitting", hi: "ऑल्टरेशन / फिटिंग" },
    ],
    measureOptions: SHARED_MEASURE,
    processTitle: "How to Book Your Blouse",
    processTitleHi: "ब्लाउज कैसे बुक करें",
    process: makeProcess("blouse", "ब्लाउज"),
    quote: "A well-stitched blouse can change the entire look of your saree.",
    quoteHi: "एक अच्छी सिलाई वाला ब्लाउज साड़ी का पूरा लुक बदल सकता है।",
    faqs: [
      {
        q: "How long does blouse stitching take?",
        qHi: "ब्लाउज सिलाई में कितना समय लगता है?",
        a: "Many styles are ready within about 24 hours. Heavy embroidery or bridal work may take longer — we confirm on WhatsApp first.",
        aHi: "कई स्टाइल लगभग 24 घंटे में तैयार। हेवी/ब्राइडल वर्क में ज़्यादा समय — पहले WhatsApp पर कन्फर्म।",
      },
      {
        q: "Do I need to bring my own fabric?",
        qHi: "क्या मुझे अपना फैब्रिक लाना होगा?",
        a: "Bring your saree fabric / blouse piece, or choose matching fabric at the studio. Share a photo on WhatsApp for advice.",
        aHi: "साड़ी फैब्रिक / ब्लाउज पीस लाएँ, या स्टूडियो में मैचिंग फैब्रिक चुनें। सलाह के लिए WhatsApp पर फोटो भेजें।",
      },
      {
        q: "Can you copy a blouse design from a photo?",
        qHi: "क्या फोटो से ब्लाउज डिज़ाइन कॉपी कर सकते हैं?",
        a: "Yes. Send clear front and back reference photos. We adapt neckline, back, sleeves and fit to your measurements.",
        aHi: "हाँ। साफ़ फ्रंट/बैक फोटो भेजें। नेकलाइन, बैक, स्लीव और फिट आपके माप पर अडैप्ट करते हैं।",
      },
      {
        q: "Is trial and alteration included?",
        qHi: "क्या ट्रायल और ऑल्टरेशन शामिल है?",
        a: "Studio trial is available for most orders. Minor fitting tweaks after trial are handled at the boutique.",
        aHi: "ज़्यादातर ऑर्डर पर स्टूडियो ट्रायल। ट्रायल के बाद छोटी फिटिंग ट्वीक बुटीक पर।",
      },
      SHARED_LOCATION_FAQ,
    ],
    popularSearches: [
      { label: "Designer Blouse Stitching in Patna", href: "/boutique/blouse" },
      { label: "Bridal Blouse Stitching Patna", href: "/boutique/blouse" },
      { label: "Ladies Tailor Boring Road Patna", href: "/ladies-tailor-patna" },
      { label: "Saree Blouse Stitching Patna", href: "/boutique/blouse" },
      { label: "Boutique Boring Road", href: "/boutique-boring-road" },
      { label: "24 Hour Blouse Stitching", href: "/boutique/stitching" },
      { label: "Best Designer Boutique Patna", href: "/shop" },
      { label: "Custom Blouse Fitting Patna", href: "/boutique/blouse" },
    ],
  },

  stitching: {
    slug: "stitching",
    href: "/boutique/stitching",
    formId: "boutique-booking",
    source: "stitching_booking_form",
    noun: "outfit",
    nounHi: "आउटफ़िट",
    typeLabel: "Stitch Type",
    typeLabelHi: "सिलाई प्रकार",
    eyebrow: "CUSTOM STITCH. EXPRESS WHEN NEEDED.",
    eyebrowHi: "कस्टम सिलाई। ज़रूरत पर एक्सप्रेस।",
    h1: "Boutique Stitching in Patna",
    h1Hi: "पटना में बुटीक सिलाई",
    tagline: "Bring fabric or pick a design — we stitch to your size",
    taglineHi: "कपड़ा लाएँ या डिज़ाइन चुनें — आपके साइज़ पर सिलाई",
    heroQuote: "Every Outfit Deserves a Perfect Fit",
    heroQuoteHi: "हर आउटफ़िट परफेक्ट फिट का हकदार है",
    heroQuoteCta: "Stitch it With Us",
    heroQuoteCtaHi: "हमारे साथ सिलाएँ",
    heroImage: WORK.orangeLehenga,
    heroPosition: PORTRAIT,
    usps: DEFAULT_USPS,
    primaryCta: "Book Your Stitching",
    primaryCtaHi: "सिलाई बुक करें",
    bookMsg:
      "Hi Shreya Creation! 👋 I'd like boutique / custom stitching. Please share design options, timing, and pricing.",
    bookMsgHi:
      "नमस्ते श्रेया क्रिएशन! 👋 मुझे बुटीक / कस्टम सिलाई चाहिए। कृपया डिज़ाइन, टाइमिंग और कीमत बताएँ।",
    galleryTitle: "Boutique Stitch Styles – Design Reference",
    galleryTitleHi: "बुटीक सिलाई स्टाइल – डिज़ाइन रेफरेंस",
    galleryLead: "Browse popular stitch categories. Select a look — we confirm fabric, fit and timeline on WhatsApp.",
    galleryLeadHi: "लोकप्रिय सिलाई कैटेगरी देखें। लुक चुनें — फैब्रिक, फिट और टाइमलाइन WhatsApp पर कन्फर्म।",
    designs: [
      { id: "blouse", title: "Saree Blouse", titleHi: "साड़ी ब्लाउज", image: WORK.tricolorBlouse, position: PORTRAIT },
      { id: "lehenga", title: "Festive Lehenga", titleHi: "फेस्टिव लहंगा", image: WORK.orangeLehenga, position: PORTRAIT },
      { id: "suit", title: "Embroidered Salwar Suit", titleHi: "एम्ब्रॉयडर्ड सलवार सूट", image: WORK.purpleSuit, position: PORTRAIT },
      { id: "kurta", title: "Printed Kurta Set", titleHi: "प्रिंटेड कुर्ता सेट", image: WORK.magentaKurta, position: PORTRAIT },
      { id: "gown", title: "Cream & Gold Gown", titleHi: "क्रीम और गोल्ड गाउन", image: WORK.creamGown, position: PORTRAIT },
      { id: "bridal", title: "Bridal Lehenga", titleHi: "ब्राइडल लहंगा", image: WORK.heavyBridal, position: PORTRAIT },
      { id: "reception", title: "Reception Look", titleHi: "रिसेप्शन लुक", image: WORK.greenReception, position: PORTRAIT },
      { id: "evening", title: "Evening Ensembles", titleHi: "इवनिंग एन्सेम्बल", image: WORK.eveningPair, position: "object-center" },
    ],
    servicesTitle: "Our Boutique Stitch Services",
    servicesTitleHi: "हमारी बुटीक सिलाई सेवाएँ",
    services: [
      { icon: "needle", en: "Custom Outfit Stitching", hi: "कस्टम आउटफ़िट सिलाई" },
      { icon: "express", en: "24-Hour Express Stitching*", hi: "24 घंटे एक्सप्रेस सिलाई*" },
      { icon: "alter", en: "Alteration & Restyling", hi: "ऑल्टरेशन और रीस्टाइलिंग" },
      { icon: "fit", en: "Precision Measurement & Trial", hi: "सटीक माप और ट्रायल" },
      { icon: "hand", en: "Aari / Zardozi Handwork", hi: "आरी / ज़रदोज़ी हैंडवर्क" },
      { icon: "match", en: "Fabric Consultation", hi: "फैब्रिक कंसल्टेशन" },
      { icon: "bridal", en: "Bridal & Occasion Wear", hi: "ब्राइडल और अवसर वेयर" },
      { icon: "pad", en: "Lining, Piping & Finishing", hi: "लाइनिंग, पाइपिंग और फिनिशिंग" },
    ],
    pricesTitle: "Boutique Stitching Price (Starting From)",
    pricesTitleHi: "बुटीक सिलाई कीमत (शुरुआती)",
    prices: [
      { type: "Basic Blouse / Simple Stitch", typeHi: "बेसिक ब्लाउज / सिंपल सिलाई", price: "599" },
      { type: "Designer Suit Stitching", typeHi: "डिज़ाइनर सूट सिलाई", price: "1,499" },
      { type: "Lehenga Stitching", typeHi: "लहंगा सिलाई", price: "2,999" },
      { type: "Gown Stitching", typeHi: "गाउन सिलाई", price: "2,499" },
      { type: "Alteration / Fitting", typeHi: "ऑल्टरेशन / फिटिंग", price: "299" },
      { type: "Express Add-on*", typeHi: "एक्सप्रेस ऐड-ऑन*", price: "Ask" },
    ],
    formTitle: "Book Your Boutique Stitching",
    formTitleHi: "अपनी बुटीक सिलाई बुक करें",
    typeOptions: [
      { value: "Blouse", hi: "ब्लाउज" },
      { value: "Suit / Anarkali", hi: "सूट / अनारकली" },
      { value: "Lehenga", hi: "लहंगा" },
      { value: "Gown", hi: "गाउन" },
      { value: "Alteration", hi: "ऑल्टरेशन" },
      { value: "Other Custom Stitch", hi: "अन्य कस्टम सिलाई" },
    ],
    measureOptions: SHARED_MEASURE,
    processTitle: "How to Book Boutique Stitching",
    processTitleHi: "बुटीक सिलाई कैसे बुक करें",
    process: makeProcess("outfit", "आउटफ़िट"),
    quote: "We don't just stitch outfits. We create the look you'll remember.",
    quoteHi: "हम सिर्फ कपड़े नहीं सिलते। हम वो लुक बनाते हैं जो याद रहे।",
    faqs: [
      {
        q: "What can I get stitched here?",
        qHi: "यहाँ क्या-क्या सिलाया जा सकता है?",
        a: "Blouses, suits, lehengas, gowns, bridal sets, kids wear, alterations and restyling — confirm your style on WhatsApp.",
        aHi: "ब्लाउज, सूट, लहंगे, गाउन, ब्राइडल सेट, किड्स वेयर, ऑल्टरेशन — स्टाइल WhatsApp पर कन्फर्म करें।",
      },
      {
        q: "Is 24-hour express always available?",
        qHi: "क्या 24 घंटे एक्सप्रेस हमेशा मिलता है?",
        a: "Many styles qualify. Heavy handwork, bridal canvases or fabric sourcing may need more time — we confirm before starting.",
        aHi: "कई स्टाइल योग्य हैं। हेवी हैंडवर्क/ब्राइडल में ज़्यादा समय — शुरू से पहले कन्फर्म।",
      },
      {
        q: "Can I bring my own fabric?",
        qHi: "क्या अपना फैब्रिक ला सकते हैं?",
        a: "Yes. Bring fabric or choose with us at the studio. Share a photo for guidance.",
        aHi: "हाँ। फैब्रिक लाएँ या स्टूडियो में चुनें। गाइडेंस के लिए फोटो भेजें।",
      },
      SHARED_LOCATION_FAQ,
    ],
    popularSearches: [
      { label: "Boutique Stitching Patna", href: "/boutique/stitching" },
      { label: "24 Hour Stitching Patna", href: "/boutique/stitching" },
      { label: "Ladies Tailor Boring Road", href: "/ladies-tailor-patna" },
      { label: "Custom Stitching Patna", href: "/boutique/stitching" },
      { label: "Boutique Boring Road", href: "/boutique-boring-road" },
      { label: "Designer Blouse Patna", href: "/boutique/blouse" },
      { label: "Best Boutique Patna", href: "/shop" },
    ],
  },

  lehenga: {
    slug: "lehenga",
    href: "/boutique/lehenga",
    formId: "boutique-booking",
    source: "lehenga_booking_form",
    noun: "lehenga",
    nounHi: "लहंगा",
    typeLabel: "Lehenga Type",
    typeLabelHi: "लहंगा प्रकार",
    eyebrow: "FLARE. FALL. PERFECT FINISH.",
    eyebrowHi: "फ्लेयर। फॉल। परफेक्ट फिनिश।",
    h1: "Lehenga Stitching in Patna",
    h1Hi: "पटना में लहंगा सिलाई",
    tagline: "Bridal, festive & party lehengas — measured for you",
    taglineHi: "ब्राइडल, फेस्टिव और पार्टी लहंगे — आपके माप पर",
    heroQuote: "Every Celebration Deserves a Beautiful Lehenga",
    heroQuoteHi: "हर सेलिब्रेशन एक खूबसूरत लहंगे की हकदार है",
    heroQuoteCta: "Design it With Us",
    heroQuoteCtaHi: "हमारे साथ डिज़ाइन करें",
    heroImage: WORK.orangeLehenga,
    heroPosition: PORTRAIT,
    usps: [
      { icon: "clock", en: "Clear Timeline on WhatsApp", hi: "WhatsApp पर साफ़ टाइमलाइन" },
      { icon: "fit", en: "Precision Fitting & Trial", hi: "सटीक फिटिंग और ट्रायल" },
      { icon: "finish", en: "Boutique Finishing", hi: "बुटीक फिनिशिंग" },
      { icon: "occasion", en: "Wedding, Reception & Festive", hi: "शादी, रिसेप्शन और त्योहार" },
    ],
    primaryCta: "Book Your Lehenga Stitching",
    primaryCtaHi: "लहंगा सिलाई बुक करें",
    bookMsg:
      "Hi Shreya Creation! 👋 I'd like a custom lehenga. Please share design ideas, fabric options, and timeline.",
    bookMsgHi:
      "नमस्ते श्रेया क्रिएशन! 👋 मुझे कस्टम लहंगा चाहिए। कृपया डिज़ाइन, फैब्रिक और टाइमलाइन बताएँ।",
    galleryTitle: "Lehenga Designs – Style & Stitching Reference",
    galleryTitleHi: "लहंगा डिज़ाइन – स्टाइल और सिलाई रेफरेंस",
    galleryLead: "Browse silhouettes and looks. Select a design — we tailor flare, waist and blouse to you.",
    galleryLeadHi: "सिल्हूट और लुक देखें। डिज़ाइन चुनें — फ्लेयर, वेस्ट और ब्लाउज आपके लिए।",
    designs: [
      { id: "festive", title: "Festive Orange Lehenga", titleHi: "फेस्टिव ऑरेंज लहंगा", image: WORK.orangeLehenga, position: PORTRAIT },
      { id: "bridal-l", title: "Heavy Bridal Lehenga", titleHi: "हेवी ब्राइडल लहंगा", image: WORK.heavyBridal, position: PORTRAIT },
      { id: "reception", title: "Reception Lehenga", titleHi: "रिसेप्शन लहंगा", image: WORK.greenReception, position: PORTRAIT },
      { id: "red-gold", title: "Red & Gold Bridal Lehenga", titleHi: "रेड और गोल्ड ब्राइडल लहंगा", image: WORK.redGold, position: CROP_RIGHT },
      { id: "peach", title: "Embroidered Peach Lehenga", titleHi: "एम्ब्रॉयडर्ड पीच लहंगा", image: WORK.peachBridal, position: CROP_RIGHT },
      { id: "cream-l", title: "Cream & Gold Lehenga", titleHi: "क्रीम और गोल्ड लहंगा", image: WORK.creamLehenga, position: "object-[86%_center]" },
    ],
    servicesTitle: "Our Lehenga Stitching Services",
    servicesTitleHi: "हमारी लहंगा सिलाई सेवाएँ",
    services: [
      { icon: "bridal", en: "Bridal Lehenga Stitching", hi: "ब्राइडल लहंगा सिलाई" },
      { icon: "needle", en: "Festive & Party Lehengas", hi: "फेस्टिव और पार्टी लहंगे" },
      { icon: "match", en: "Matching Blouse & Dupatta", hi: "मैचिंग ब्लाउज और दुपट्टा" },
      { icon: "hand", en: "Zardozi / Embroidery Work", hi: "ज़रदोज़ी / एम्ब्रॉयडरी" },
      { icon: "fit", en: "Waist, Hip & Flare Fitting", hi: "वेस्ट, हिप और फ्लेयर फिटिंग" },
      { icon: "alter", en: "Lehenga Alteration", hi: "लहंगा ऑल्टरेशन" },
      { icon: "pad", en: "Can-can / Structure Options", hi: "कैन-कैन / स्ट्रक्चर विकल्प" },
      { icon: "express", en: "Express Options*", hi: "एक्सप्रेस विकल्प*" },
    ],
    pricesTitle: "Lehenga Stitching Price (Starting From)",
    pricesTitleHi: "लहंगा सिलाई कीमत (शुरुआती)",
    prices: [
      { type: "Simple / Party Lehenga", typeHi: "सिंपल / पार्टी लहंगा", price: "2,999" },
      { type: "Designer Lehenga", typeHi: "डिज़ाइनर लहंगा", price: "4,999" },
      { type: "Bridal Lehenga", typeHi: "ब्राइडल लहंगा", price: "9,999" },
      { type: "Lehenga + Blouse Set", typeHi: "लहंगा + ब्लाउज सेट", price: "5,999" },
      { type: "Lehenga Alteration", typeHi: "लहंगा ऑल्टरेशन", price: "499" },
      { type: "Heavy Work Add-on", typeHi: "हेवी वर्क ऐड-ऑन", price: "Ask" },
    ],
    formTitle: "Book Your Lehenga Stitching",
    formTitleHi: "अपनी लहंगा सिलाई बुक करें",
    typeOptions: [
      { value: "Party Lehenga", hi: "पार्टी लहंगा" },
      { value: "Festive Lehenga", hi: "फेस्टिव लहंगा" },
      { value: "Bridal Lehenga", hi: "ब्राइडल लहंगा" },
      { value: "Lehenga + Blouse", hi: "लहंगा + ब्लाउज" },
      { value: "Alteration", hi: "ऑल्टरेशन" },
    ],
    measureOptions: SHARED_MEASURE,
    processTitle: "How to Book Your Lehenga",
    processTitleHi: "लहंगा कैसे बुक करें",
    process: makeProcess("lehenga", "लहंगा"),
    quote: "A well-fitted lehenga lets you celebrate freely — sit, walk and dance with confidence.",
    quoteHi: "अच्छी फिटिंग वाला लहंगा आपको आज़ादी से सेलिब्रेट करने देता है — बैठें, चलें, डांस करें।",
    faqs: [
      {
        q: "How long does lehenga stitching take?",
        qHi: "लहंगा सिलाई में कितना समय लगता है?",
        a: "Party styles often take several days; bridal and heavy work need more time. We share a clear timeline after seeing your design.",
        aHi: "पार्टी स्टाइल में कुछ दिन; ब्राइडल/हेवी वर्क में ज़्यादा। डिज़ाइन देखने के बाद टाइमलाइन देते हैं।",
      },
      {
        q: "Do you stitch matching blouses?",
        qHi: "क्या मैचिंग ब्लाउज भी सिलते हैं?",
        a: "Yes — blouse, lehenga and dupatta finishing can be planned as one set.",
        aHi: "हाँ — ब्लाउज, लहंगा और दुपट्टा फिनिशिंग एक सेट के रूप में।",
      },
      {
        q: "Is trial included?",
        qHi: "क्या ट्रायल शामिल है?",
        a: "Studio trial is available for most lehenga orders so flare and waist sit correctly.",
        aHi: "ज़्यादातर लहंगा ऑर्डर पर स्टूडियो ट्रायल — फ्लेयर और वेस्ट सही बैठें।",
      },
      SHARED_LOCATION_FAQ,
    ],
    popularSearches: [
      { label: "Lehenga Stitching Patna", href: "/boutique/lehenga" },
      { label: "Bridal Lehenga Patna", href: "/boutique/lehenga" },
      { label: "Custom Lehenga Boring Road", href: "/boutique-boring-road" },
      { label: "Designer Lehenga Patna", href: "/boutique/lehenga" },
      { label: "Bridal Wear Patna", href: "/boutique/bridal" },
      { label: "Best Boutique Patna", href: "/shop" },
    ],
  },

  suit: {
    slug: "suit",
    href: "/boutique/suit",
    formId: "boutique-booking",
    source: "suit_booking_form",
    noun: "suit",
    nounHi: "सूट",
    typeLabel: "Suit Type",
    typeLabelHi: "सूट प्रकार",
    eyebrow: "EVERYDAY ELEGANCE TO FESTIVE SETS.",
    eyebrowHi: "रोज़ की एलीगेंस से फेस्टिव सेट तक।",
    h1: "Designer Suit Stitching in Patna",
    h1Hi: "पटना में डिज़ाइनर सूट सिलाई",
    tagline: "Salwar, churidar & Anarkali — stitched for comfort and fall",
    taglineHi: "सलवार, चूड़ीदार और अनारकली — आराम और फॉल के साथ",
    heroQuote: "A Well-Fitted Suit Makes Every Day Feel Special",
    heroQuoteHi: "अच्छी फिटिंग वाला सूट हर दिन खास बनाता है",
    heroQuoteCta: "Stitch it With Us",
    heroQuoteCtaHi: "हमारे साथ सिलाएँ",
    heroImage: WORK.purpleSuit,
    heroPosition: PORTRAIT,
    usps: DEFAULT_USPS,
    primaryCta: "Book Your Suit Stitching",
    primaryCtaHi: "सूट सिलाई बुक करें",
    bookMsg:
      "Hi Shreya Creation! 👋 I'd like a designer suit stitched. Please share options and timing.",
    bookMsgHi:
      "नमस्ते श्रेया क्रिएशन! 👋 मुझे डिज़ाइनर सूट सिलाई चाहिए। कृपया विकल्प और टाइमिंग बताएँ।",
    galleryTitle: "Suit Designs – Style & Stitching Reference",
    galleryTitleHi: "सूट डिज़ाइन – स्टाइल और सिलाई रेफरेंस",
    galleryLead: "Browse suit silhouettes. Select a style — we stitch kurti length, neck and bottom to your size.",
    galleryLeadHi: "सूट सिल्हूट देखें। स्टाइल चुनें — कुर्ती लंबाई, नेक और बॉटम आपके साइज़ पर।",
    designs: [
      { id: "salwar", title: "Embroidered Salwar Suit", titleHi: "एम्ब्रॉयडर्ड सलवार सूट", image: WORK.purpleSuit, position: PORTRAIT },
      { id: "printed", title: "Printed Kurta Set", titleHi: "प्रिंटेड कुर्ता सेट", image: WORK.magentaKurta, position: PORTRAIT },
      { id: "festive-s", title: "Festive Embroidered Set", titleHi: "फेस्टिव एम्ब्रॉयडर्ड सेट", image: WORK.eveningPair, position: CROP_LEFT },
      { id: "drape", title: "Draped Evening Set", titleHi: "ड्रेप्ड इवनिंग सेट", image: WORK.eveningPair, position: CROP_RIGHT },
    ],
    servicesTitle: "Our Suit Stitching Services",
    servicesTitleHi: "हमारी सूट सिलाई सेवाएँ",
    services: [
      { icon: "needle", en: "Salwar & Churidar Suits", hi: "सलवार और चूड़ीदार सूट" },
      { icon: "bridal", en: "Anarkali & Flared Suits", hi: "अनारकली और फ्लेयर्ड सूट" },
      { icon: "fit", en: "Kurti Length & Fitting", hi: "कुर्ती लंबाई और फिटिंग" },
      { icon: "alter", en: "Suit Alteration", hi: "सूट ऑल्टरेशन" },
      { icon: "hand", en: "Neck & Sleeve Styles", hi: "नेक और स्लीव स्टाइल" },
      { icon: "match", en: "Dupatta Finishing", hi: "दुपट्टा फिनिशिंग" },
      { icon: "express", en: "24-Hour Express*", hi: "24 घंटे एक्सप्रेस*" },
      { icon: "pad", en: "Lining & Boutique Finish", hi: "लाइनिंग और बुटीक फिनिश" },
    ],
    pricesTitle: "Suit Stitching Price (Starting From)",
    pricesTitleHi: "सूट सिलाई कीमत (शुरुआती)",
    prices: [
      { type: "Basic Suit Stitching", typeHi: "बेसिक सूट सिलाई", price: "999" },
      { type: "Designer Suit", typeHi: "डिज़ाइनर सूट", price: "1,499" },
      { type: "Anarkali Suit", typeHi: "अनारकली सूट", price: "1,999" },
      { type: "Party / Embroidered Suit", typeHi: "पार्टी / एम्ब्रॉयडर्ड सूट", price: "2,499" },
      { type: "Suit Alteration", typeHi: "सूट ऑल्टरेशन", price: "299" },
      { type: "Dupatta Finishing", typeHi: "दुपट्टा फिनिशिंग", price: "199" },
    ],
    formTitle: "Book Your Suit Stitching",
    formTitleHi: "अपनी सूट सिलाई बुक करें",
    typeOptions: [
      { value: "Salwar Suit", hi: "सलवार सूट" },
      { value: "Anarkali", hi: "अनारकली" },
      { value: "Straight Kurti Set", hi: "स्ट्रेट कुर्ती सेट" },
      { value: "Party Suit", hi: "पार्टी सूट" },
      { value: "Alteration", hi: "ऑल्टरेशन" },
    ],
    measureOptions: SHARED_MEASURE,
    processTitle: "How to Book Your Suit",
    processTitleHi: "सूट कैसे बुक करें",
    process: makeProcess("suit", "सूट"),
    quote: "Boutique finishing means your suit looks sharp wash after wash — not rushed market stitching.",
    quoteHi: "बुटीक फिनिशिंग का मतलब — सूट हर धुलाई के बाद भी शार्प, जल्दबाज़ी वाली सिलाई नहीं।",
    faqs: [
      {
        q: "How long does suit stitching take?",
        qHi: "सूट सिलाई में कितना समय लगता है?",
        a: "Many everyday suits qualify for express timelines. Embroidered or Anarkali styles may need a few more days — confirm on WhatsApp.",
        aHi: "कई रोज़मर्रा सूट एक्सप्रेस में। एम्ब्रॉयडर्ड/अनारकली में कुछ दिन ज़्यादा — WhatsApp पर कन्फर्म।",
      },
      {
        q: "Can I choose neck and sleeve style?",
        qHi: "क्या नेक और स्लीव स्टाइल चुन सकते हैं?",
        a: "Yes. Share a reference photo or pick from our style options when you book.",
        aHi: "हाँ। रेफरेंस फोटो भेजें या बुकिंग पर स्टाइल विकल्प चुनें।",
      },
      SHARED_LOCATION_FAQ,
    ],
    popularSearches: [
      { label: "Suit Stitching Patna", href: "/boutique/suit" },
      { label: "Salwar Suit Boutique Patna", href: "/boutique/suit" },
      { label: "Anarkali Stitching Patna", href: "/boutique/suit" },
      { label: "Ladies Tailor Boring Road", href: "/ladies-tailor-patna" },
      { label: "Custom Suit Patna", href: "/boutique/suit" },
      { label: "Boutique Boring Road", href: "/boutique-boring-road" },
    ],
  },

  gown: {
    slug: "gown",
    href: "/boutique/gown",
    formId: "boutique-booking",
    source: "gown_booking_form",
    noun: "gown",
    nounHi: "गाउन",
    typeLabel: "Gown Type",
    typeLabelHi: "गाउन प्रकार",
    eyebrow: "SILHOUETTE FIRST. COMFORT ALWAYS.",
    eyebrowHi: "पहले सिल्हूट। हमेशा कम्फर्ट।",
    h1: "Gown Stitching in Patna",
    h1Hi: "पटना में गाउन सिलाई",
    tagline: "Reception, party & Indo-western gowns — red-carpet fit",
    taglineHi: "रिसेप्शन, पार्टी और इंडो-वेस्टर्न गाउन — रेड-कार्पेट फिट",
    heroQuote: "Every Evening Deserves a Gown That Photographs Well",
    heroQuoteHi: "हर शाम एक ऐसे गाउन की हकदार है जो फोटो में सुंदर लगे",
    heroQuoteCta: "Design it With Us",
    heroQuoteCtaHi: "हमारे साथ डिज़ाइन करें",
    heroImage: WORK.creamGown,
    heroPosition: PORTRAIT,
    usps: [
      { icon: "fit", en: "Precision Bodice Fitting", hi: "सटीक बॉडीस फिटिंग" },
      { icon: "finish", en: "Boutique Finishing", hi: "बुटीक फिनिशिंग" },
      { icon: "occasion", en: "Reception & Party Ready", hi: "रिसेप्शन और पार्टी रेडी" },
      { icon: "clock", en: "Clear Delivery Timeline", hi: "साफ़ डिलीवरी टाइमलाइन" },
    ],
    primaryCta: "Book Your Gown Stitching",
    primaryCtaHi: "गाउन सिलाई बुक करें",
    bookMsg:
      "Hi Shreya Creation! 👋 I'm looking for a custom gown. Please share designs and stitching timeline.",
    bookMsgHi:
      "नमस्ते श्रेया क्रिएशन! 👋 मुझे कस्टम गाउन चाहिए। कृपया डिज़ाइन और सिलाई टाइमलाइन बताएँ।",
    galleryTitle: "Gown Designs – Style & Stitching Reference",
    galleryTitleHi: "गाउन डिज़ाइन – स्टाइल और सिलाई रेफरेंस",
    galleryLead: "Browse gown looks. Select a silhouette — we adjust bust, waist, hip and hem for you.",
    galleryLeadHi: "गाउन लुक देखें। सिल्हूट चुनें — बस्ट, वेस्ट, हिप और हेम आपके लिए।",
    designs: [
      { id: "floor", title: "Cream & Gold Gown", titleHi: "क्रीम और गोल्ड गाउन", image: WORK.creamGown, position: PORTRAIT },
      { id: "red", title: "Red Evening Gown", titleHi: "रेड इवनिंग गाउन", image: WORK.eveningPair, position: CROP_LEFT },
      { id: "black", title: "Black Draped Gown", titleHi: "ब्लैक ड्रेप्ड गाउन", image: WORK.eveningPair, position: CROP_RIGHT },
      { id: "reception-g", title: "Reception Gown", titleHi: "रिसेप्शन गाउन", image: WORK.greenReception, position: PORTRAIT },
    ],
    servicesTitle: "Our Gown Stitching Services",
    servicesTitleHi: "हमारी गाउन सिलाई सेवाएँ",
    services: [
      { icon: "needle", en: "Reception & Party Gowns", hi: "रिसेप्शन और पार्टी गाउन" },
      { icon: "bridal", en: "Indo-Western Fusion Gowns", hi: "इंडो-वेस्टर्न फ्यूजन गाउन" },
      { icon: "fit", en: "Bodice & Hem Fitting", hi: "बॉडीस और हेम फिटिंग" },
      { icon: "hand", en: "Beadwork & Embellishment", hi: "बीडवर्क और एम्बेलिशमेंट" },
      { icon: "pad", en: "Lining & Structure", hi: "लाइनिंग और स्ट्रक्चर" },
      { icon: "alter", en: "Gown Alteration", hi: "गाउन ऑल्टरेशन" },
      { icon: "match", en: "Fabric Consultation", hi: "फैब्रिक कंसल्टेशन" },
      { icon: "express", en: "Timeline Planning", hi: "टाइमलाइन प्लानिंग" },
    ],
    pricesTitle: "Gown Stitching Price (Starting From)",
    pricesTitleHi: "गाउन सिलाई कीमत (शुरुआती)",
    prices: [
      { type: "Simple Party Gown", typeHi: "सिंपल पार्टी गाउन", price: "2,499" },
      { type: "Designer Gown", typeHi: "डिज़ाइनर गाउन", price: "3,999" },
      { type: "Reception Gown", typeHi: "रिसेप्शन गाउन", price: "5,999" },
      { type: "Indo-Western Gown", typeHi: "इंडो-वेस्टर्न गाउन", price: "4,499" },
      { type: "Gown Alteration", typeHi: "गाउन ऑल्टरेशन", price: "499" },
      { type: "Heavy Work Add-on", typeHi: "हेवी वर्क ऐड-ऑन", price: "Ask" },
    ],
    formTitle: "Book Your Gown Stitching",
    formTitleHi: "अपनी गाउन सिलाई बुक करें",
    typeOptions: [
      { value: "Party Gown", hi: "पार्टी गाउन" },
      { value: "Reception Gown", hi: "रिसेप्शन गाउन" },
      { value: "Indo-Western", hi: "इंडो-वेस्टर्न" },
      { value: "Cocktail Gown", hi: "कॉकटेल गाउन" },
      { value: "Alteration", hi: "ऑल्टरेशन" },
    ],
    measureOptions: SHARED_MEASURE,
    processTitle: "How to Book Your Gown",
    processTitleHi: "गाउन कैसे बुक करें",
    process: makeProcess("gown", "गाउन"),
    quote: "Clean lines, secure closures and thoughtful lining — so you look polished in person and in pictures.",
    quoteHi: "साफ़ लाइन्स, सुरक्षित क्लोज़र और सोच-समझकर लाइनिंग — लाइव और फोटो दोनों में पॉलिश्ड।",
    faqs: [
      {
        q: "How long does gown stitching take?",
        qHi: "गाउन सिलाई में कितना समय लगता है?",
        a: "Typically several days to a couple of weeks depending on structure and embellishment. We confirm after seeing your reference.",
        aHi: "स्ट्रक्चर और एम्बेलिशमेंट के अनुसार कुछ दिन से दो हफ़्ते। रेफरेंस देखने के बाद कन्फर्म।",
      },
      {
        q: "Can you copy a gown from a photo?",
        qHi: "क्या फोटो से गाउन कॉपी कर सकते हैं?",
        a: "Yes. Share clear reference images and we adapt the silhouette to your measurements.",
        aHi: "हाँ। साफ़ रेफरेंस इमेज भेजें — सिल्हूट आपके माप पर अडैप्ट करते हैं।",
      },
      SHARED_LOCATION_FAQ,
    ],
    popularSearches: [
      { label: "Gown Stitching Patna", href: "/boutique/gown" },
      { label: "Reception Gown Patna", href: "/boutique/gown" },
      { label: "Party Gown Boutique Patna", href: "/boutique/gown" },
      { label: "Indo Western Gown Patna", href: "/boutique/gown" },
      { label: "Bridal Wear Patna", href: "/boutique/bridal" },
      { label: "Boutique Boring Road", href: "/boutique-boring-road" },
    ],
  },

  bridal: {
    slug: "bridal",
    href: "/boutique/bridal",
    formId: "boutique-booking",
    source: "bridal_booking_form",
    noun: "bridal outfit",
    nounHi: "ब्राइडल आउटफ़िट",
    typeLabel: "Bridal Type",
    typeLabelHi: "ब्राइडल प्रकार",
    eyebrow: "YOUR MOST IMPORTANT LOOKS.",
    eyebrowHi: "आपके सबसे खास लुक।",
    h1: "Bridal Wear Boutique in Patna",
    h1Hi: "पटना में ब्राइडल वेयर बुटीक",
    tagline: "Bridal lehenga, reception gown & statement blouses — made for you",
    taglineHi: "ब्राइडल लहंगा, रिसेप्शन गाउन और स्टेटमेंट ब्लाउज — आपके लिए",
    heroQuote: "Your Wedding Looks Deserve Expert Hands",
    heroQuoteHi: "आपके वेडिंग लुक एक्सपर्ट हाथों के हकदार हैं",
    heroQuoteCta: "Plan With Us",
    heroQuoteCtaHi: "हमारे साथ प्लान करें",
    heroImage: WORK.heavyBridal,
    heroPosition: PORTRAIT,
    usps: [
      { icon: "fit", en: "Patient Trials & Perfect Fit", hi: "धैर्य से ट्रायल और परफेक्ट फिट" },
      { icon: "finish", en: "Bridal Finishing & Handwork", hi: "ब्राइडल फिनिशिंग और हैंडवर्क" },
      { icon: "occasion", en: "Wedding to Reception Looks", hi: "शादी से रिसेप्शन तक" },
      { icon: "clock", en: "Function-wise Timeline", hi: "फंक्शन-वाइज़ टाइमलाइन" },
    ],
    primaryCta: "Book Bridal Consultation",
    primaryCtaHi: "ब्राइडल कंसल्टेशन बुक करें",
    bookMsg:
      "Hi Shreya Creation! 👋 I'm planning bridal wear. Please share consultation options and timelines.",
    bookMsgHi:
      "नमस्ते श्रेया क्रिएशन! 👋 मैं ब्राइडल वेयर प्लान कर रही हूँ। कृपया कंसल्टेशन और टाइमलाइन बताएँ।",
    galleryTitle: "Bridal Looks – Style & Stitching Reference",
    galleryTitleHi: "ब्राइडल लुक – स्टाइल और सिलाई रेफरेंस",
    galleryLead: "Browse bridal and reception looks. Select a direction — we plan fabric, handwork and timeline together.",
    galleryLeadHi: "ब्राइडल और रिसेप्शन लुक देखें। दिशा चुनें — फैब्रिक, हैंडवर्क और टाइमलाइन साथ प्लान।",
    designs: [
      { id: "bridal-lehenga", title: "Heavy Bridal Lehenga", titleHi: "हेवी ब्राइडल लहंगा", image: WORK.heavyBridal, position: PORTRAIT },
      { id: "red-gold", title: "Red & Gold Bridal Set", titleHi: "रेड और गोल्ड ब्राइडल सेट", image: WORK.redGold, position: CROP_RIGHT },
      { id: "peach", title: "Peach Bridal Lehenga", titleHi: "पीच ब्राइडल लहंगा", image: WORK.peachBridal, position: CROP_RIGHT },
      { id: "reception-gown", title: "Reception Gown", titleHi: "रिसेप्शन गाउन", image: WORK.greenReception, position: PORTRAIT },
      { id: "sangeet", title: "Festive Function Look", titleHi: "फेस्टिव फंक्शन लुक", image: WORK.orangeLehenga, position: PORTRAIT },
      { id: "cream", title: "Reception Gown in Gold", titleHi: "गोल्ड रिसेप्शन गाउन", image: WORK.creamGown, position: PORTRAIT },
    ],
    servicesTitle: "Our Bridal Wear Services",
    servicesTitleHi: "हमारी ब्राइडल वेयर सेवाएँ",
    services: [
      { icon: "bridal", en: "Bridal Lehenga Stitching", hi: "ब्राइडल लहंगा सिलाई" },
      { icon: "needle", en: "Reception Gown & Outfits", hi: "रिसेप्शन गाउन और आउटफ़िट" },
      { icon: "hand", en: "Aari / Zardozi Handwork", hi: "आरी / ज़रदोज़ी हैंडवर्क" },
      { icon: "fit", en: "Multiple Trials", hi: "मल्टीपल ट्रायल" },
      { icon: "match", en: "Full Set Coordination", hi: "फुल सेट कोऑर्डिनेशन" },
      { icon: "pad", en: "Statement Bridal Blouses", hi: "स्टेटमेंट ब्राइडल ब्लाउज" },
      { icon: "alter", en: "Bridal Alterations", hi: "ब्राइडल ऑल्टरेशन" },
      { icon: "express", en: "Function Timeline Planning", hi: "फंक्शन टाइमलाइन प्लानिंग" },
    ],
    pricesTitle: "Bridal Wear Price (Starting From)",
    pricesTitleHi: "ब्राइडल वेयर कीमत (शुरुआती)",
    prices: [
      { type: "Bridal Blouse", typeHi: "ब्राइडल ब्लाउज", price: "1,499" },
      { type: "Reception Outfit Stitching", typeHi: "रिसेप्शन आउटफ़िट सिलाई", price: "4,999" },
      { type: "Bridal Lehenga Stitching", typeHi: "ब्राइडल लहंगा सिलाई", price: "9,999" },
      { type: "Full Bridal Set Consult", typeHi: "फुल ब्राइडल सेट कंसल्ट", price: "Ask" },
      { type: "Heavy Handwork Add-on", typeHi: "हेवी हैंडवर्क ऐड-ऑन", price: "Ask" },
      { type: "Bridal Alteration", typeHi: "ब्राइडल ऑल्टरेशन", price: "499" },
    ],
    formTitle: "Book Bridal Consultation",
    formTitleHi: "ब्राइडल कंसल्टेशन बुक करें",
    typeOptions: [
      { value: "Bridal Lehenga", hi: "ब्राइडल लहंगा" },
      { value: "Reception Look", hi: "रिसेप्शन लुक" },
      { value: "Bridal Blouse", hi: "ब्राइडल ब्लाउज" },
      { value: "Full Bridal Set", hi: "फुल ब्राइडल सेट" },
      { value: "Mehendi / Haldi / Sangeet", hi: "मेंहदी / हल्दी / संगीत" },
    ],
    measureOptions: SHARED_MEASURE,
    processTitle: "How to Plan Your Bridal Wear",
    processTitleHi: "ब्राइडल वेयर कैसे प्लान करें",
    process: makeProcess("bridal outfit", "ब्राइडल आउटफ़िट"),
    quote: "A bridal partner, not just a tailor — silhouette guidance, patient trials, and finishing that feels as special as the day.",
    quoteHi: "सिर्फ टेलर नहीं — ब्राइडल पार्टनर। सिल्हूट गाइडेंस, धैर्य से ट्रायल, और दिन जितना खास फिनिश।",
    faqs: [
      {
        q: "When should I book bridal stitching?",
        qHi: "ब्राइडल सिलाई कब बुक करें?",
        a: "Ideally several weeks before the first function, especially for heavy handwork. Share your wedding dates on WhatsApp for a plan.",
        aHi: "पहले फंक्शन से कई हफ़्ते पहले बेहतर — खासकर हेवी हैंडवर्क। वेडिंग डेट्स WhatsApp पर भेजें।",
      },
      {
        q: "Do you handle multiple function outfits?",
        qHi: "क्या कई फंक्शन के आउटफ़िट करते हैं?",
        a: "Yes — we can plan lehenga, reception, mehendi and more with a shared timeline.",
        aHi: "हाँ — लहंगा, रिसेप्शन, मेंहदी आदि एक टाइमलाइन के साथ प्लान कर सकते हैं।",
      },
      SHARED_LOCATION_FAQ,
    ],
    popularSearches: [
      { label: "Bridal Wear Patna", href: "/boutique/bridal" },
      { label: "Bridal Lehenga Patna", href: "/boutique/lehenga" },
      { label: "Bridal Boutique Boring Road", href: "/boutique-boring-road" },
      { label: "Wedding Outfit Stitching Patna", href: "/boutique/bridal" },
      { label: "Reception Gown Patna", href: "/boutique/gown" },
      { label: "Best Bridal Boutique Patna", href: "/shop" },
    ],
  },

  jewellery: {
    slug: "jewellery",
    href: "/boutique/jewellery",
    formId: "boutique-booking",
    source: "jewellery_enquiry_form",
    noun: "jewellery set",
    nounHi: "ज्वेलरी सेट",
    typeLabel: "Jewellery Type",
    typeLabelHi: "ज्वेलरी प्रकार",
    expressLabel: "I need pieces urgently for an event",
    expressLabelHi: "इवेंट के लिए जल्दी चाहिए",
    eyebrow: "FINISH THE LOOK WITH THE RIGHT SHINE.",
    eyebrowHi: "सही चमक से लुक पूरा करें।",
    h1: "Boutique Jewellery in Patna",
    h1Hi: "पटना में बुटीक ज्वेलरी",
    tagline: "Kundan, bridal & statement sets to complete your outfit",
    taglineHi: "कुंदन, ब्राइडल और स्टेटमेंट सेट — आउटफ़िट पूरा करें",
    heroQuote: "The Right Jewellery Completes Every Outfit",
    heroQuoteHi: "सही ज्वेलरी हर आउटफ़िट को पूरा करती है",
    heroQuoteCta: "Enquire With Us",
    heroQuoteCtaHi: "हमसे पूछें",
    heroImage: WORK.heavyBridal,
    heroPosition: "object-[center_28%]",
    usps: [
      { icon: "finish", en: "Statement & Bridal Sets", hi: "स्टेटमेंट और ब्राइडल सेट" },
      { icon: "match", en: "Matched to Your Outfit", hi: "आपके आउटफ़िट से मैच" },
      { icon: "occasion", en: "Wedding & Festive Ready", hi: "शादी और त्योहार रेडी" },
      { icon: "clock", en: "WhatsApp Availability Check", hi: "WhatsApp पर उपलब्धता" },
    ],
    primaryCta: "Enquire About Jewellery",
    primaryCtaHi: "ज्वेलरी के बारे में पूछें",
    bookMsg:
      "Hi Shreya Creation! 👋 I'm interested in boutique jewellery / sets. Please share available pieces.",
    bookMsgHi:
      "नमस्ते श्रेया क्रिएशन! 👋 मुझे बुटीक ज्वेलरी / सेट चाहिए। कृपया उपलब्ध पीस बताएँ।",
    galleryTitle: "Jewellery Sets – Style Reference",
    galleryTitleHi: "ज्वेलरी सेट – स्टाइल रेफरेंस",
    galleryLead: "Browse statement looks. Select a style — we share availability and outfit-matching advice on WhatsApp.",
    galleryLeadHi: "स्टेटमेंट लुक देखें। स्टाइल चुनें — उपलब्धता और आउटफ़िट-मैच WhatsApp पर।",
    designs: [
      { id: "complete", title: "Complete Bridal Jewellery", titleHi: "कंप्लीट ब्राइडल ज्वेलरी", image: WORK.heavyBridal, position: "object-[center_22%]" },
      { id: "matha", title: "Necklace & Maang Tikka", titleHi: "नेकलेस और मांग टिक्का", image: WORK.peachBridal, position: "object-[82%_22%]" },
      { id: "earrings", title: "Statement Earrings", titleHi: "स्टेटमेंट ईयररिंग्स", image: WORK.greenReception, position: "object-[center_16%]" },
      { id: "neckline", title: "Neckline Jewellery", titleHi: "नेकलाइन ज्वेलरी", image: WORK.redGold, position: "object-[72%_28%]" },
    ],
    servicesTitle: "Our Jewellery Services",
    servicesTitleHi: "हमारी ज्वेलरी सेवाएँ",
    services: [
      { icon: "bridal", en: "Bridal Jewellery Sets", hi: "ब्राइडल ज्वेलरी सेट" },
      { icon: "finish", en: "Kundan & Statement Pieces", hi: "कुंदन और स्टेटमेंट पीस" },
      { icon: "match", en: "Outfit Colour Matching", hi: "आउटफ़िट कलर मैचिंग" },
      { icon: "needle", en: "Festive Jewellery", hi: "फेस्टिव ज्वेलरी" },
      { icon: "hand", en: "Styling Advice", hi: "स्टाइलिंग सलाह" },
      { icon: "express", en: "WhatsApp Availability", hi: "WhatsApp उपलब्धता" },
      { icon: "pad", en: "Complete Look Coordination", hi: "कंप्लीट लुक कोऑर्डिनेशन" },
      { icon: "alter", en: "Pair with Stitched Outfits", hi: "सिले आउटफ़िट के साथ" },
    ],
    pricesTitle: "Jewellery (Indicative / Ask)",
    pricesTitleHi: "ज्वेलरी (संकेतात्मक / पूछें)",
    prices: [
      { type: "Earrings Pair", typeHi: "ईयररिंग्स", price: "Ask" },
      { type: "Statement Necklace", typeHi: "स्टेटमेंट नेकलेस", price: "Ask" },
      { type: "Festive Set", typeHi: "फेस्टिव सेट", price: "Ask" },
      { type: "Kundan Set", typeHi: "कुंदन सेट", price: "Ask" },
      { type: "Bridal Complete Set", typeHi: "ब्राइडल कंप्लीट सेट", price: "Ask" },
      { type: "Custom Match Consult", typeHi: "कस्टम मैच कंसल्ट", price: "Free*" },
    ],
    formTitle: "Enquire About Jewellery",
    formTitleHi: "ज्वेलरी के बारे में पूछें",
    typeOptions: [
      { value: "Kundan Set", hi: "कुंदन सेट" },
      { value: "Bridal Set", hi: "ब्राइडल सेट" },
      { value: "Statement Necklace", hi: "स्टेटमेंट नेकलेस" },
      { value: "Earrings", hi: "ईयररिंग्स" },
      { value: "Complete Look Match", hi: "कंप्लीट लुक मैच" },
    ],
    measureOptions: [
      { value: "Match to my stitched outfit", hi: "मेरे सिले आउटफ़िट से मैच करें" },
      { value: "I will share reference photos", hi: "रेफरेंस फोटो भेजूँगी" },
      { value: "Visit studio to try pieces", hi: "स्टूडियो आकर ट्राई करूँगी" },
    ],
    processTitle: "How to Enquire for Jewellery",
    processTitleHi: "ज्वेलरी कैसे पूछें",
    process: [
      {
        step: 1,
        title: "Choose Style",
        titleHi: "स्टाइल चुनें",
        desc: "Browse sets or share a reference.",
        descHi: "सेट देखें या रेफरेंस भेजें।",
      },
      {
        step: 2,
        title: "Share Outfit Details",
        titleHi: "आउटफ़िट डिटेल्स",
        desc: "Colour, neckline and occasion.",
        descHi: "रंग, नेकलाइन और अवसर।",
      },
      {
        step: 3,
        title: "Check Availability",
        titleHi: "उपलब्धता चेक",
        desc: "We confirm pieces and options.",
        descHi: "पीस और विकल्प कन्फर्म।",
      },
      {
        step: 4,
        title: "Studio Visit / Order",
        titleHi: "स्टूडियो / ऑर्डर",
        desc: "Try pieces or reserve on WhatsApp.",
        descHi: "ट्राई करें या WhatsApp पर रिज़र्व।",
      },
      {
        step: 5,
        title: "Complete the Look",
        titleHi: "लुक पूरा करें",
        desc: "Pair with your stitched outfit.",
        descHi: "सिले आउटफ़िट के साथ पेयर करें।",
      },
    ],
    quote: "Jewellery is part of the boutique experience — coordinated with your outfit colour, neckline and occasion.",
    quoteHi: "ज्वेलरी बुटीक अनुभव का हिस्सा है — रंग, नेकलाइन और अवसर से मैच।",
    faqs: [
      {
        q: "Do you keep jewellery in stock?",
        qHi: "क्या ज्वेलरी स्टॉक में रहती है?",
        a: "Availability changes — message on WhatsApp with your outfit photo for current pieces and matching advice.",
        aHi: "उपलब्धता बदलती रहती है — आउटफ़िट फोटो के साथ WhatsApp करें।",
      },
      {
        q: "Can jewellery be matched to my blouse/lehenga?",
        qHi: "क्या ज्वेलरी ब्लाउज/लहंगे से मैच हो सकती है?",
        a: "Yes. Share fabric colour and neckline — we help pick metal tone and density that photograph cleanly.",
        aHi: "हाँ। फैब्रिक रंग और नेकलाइन भेजें — मेटल टोन और डेंसिटी चुनने में मदद।",
      },
      SHARED_LOCATION_FAQ,
    ],
    popularSearches: [
      { label: "Bridal Jewellery Patna", href: "/boutique/jewellery" },
      { label: "Kundan Jewellery Boutique Patna", href: "/boutique/jewellery" },
      { label: "Boutique Accessories Patna", href: "/boutique/accessories" },
      { label: "Bridal Wear Patna", href: "/boutique/bridal" },
      { label: "Boutique Boring Road", href: "/boutique-boring-road" },
    ],
  },

  accessories: {
    slug: "accessories",
    href: "/boutique/accessories",
    formId: "boutique-booking",
    source: "accessories_enquiry_form",
    noun: "accessory",
    nounHi: "एक्सेसरी",
    typeLabel: "Accessory Type",
    typeLabelHi: "एक्सेसरी प्रकार",
    expressLabel: "I need this urgently for an event",
    expressLabelHi: "इवेंट के लिए जल्दी चाहिए",
    eyebrow: "SMALL DETAILS. COMPLETE LOOK.",
    eyebrowHi: "छोटे डिटेल। पूरा लुक।",
    h1: "Boutique Accessories in Patna",
    h1Hi: "पटना में बुटीक एक्सेसरीज़",
    tagline: "Potli, dupatta finishing & styling pieces for your outfit",
    taglineHi: "पोतली, दुपट्टा फिनिशिंग और स्टाइलिंग पीस",
    heroQuote: "The Right Finish Makes the Outfit Complete",
    heroQuoteHi: "सही फिनिश आउटफ़िट को पूरा बनाती है",
    heroQuoteCta: "Style With Us",
    heroQuoteCtaHi: "हमारे साथ स्टाइल करें",
    heroImage: WORK.purpleSuit,
    heroPosition: PORTRAIT,
    usps: [
      { icon: "finish", en: "Dupatta & Potli Finishing", hi: "दुपट्टा और पोतली फिनिशिंग" },
      { icon: "match", en: "Matched to Your Outfit", hi: "आउटफ़िट से मैच" },
      { icon: "occasion", en: "Wedding & Festive Ready", hi: "शादी और त्योहार रेडी" },
      { icon: "clock", en: "Quick WhatsApp Guidance", hi: "झटपट WhatsApp गाइडेंस" },
    ],
    primaryCta: "Book Accessory / Finishing",
    primaryCtaHi: "एक्सेसरी / फिनिशिंग बुक करें",
    bookMsg:
      "Hi Shreya Creation! 👋 I'm looking for boutique accessories / finishing. Please share options.",
    bookMsgHi:
      "नमस्ते श्रेया क्रिएशन! 👋 मुझे बुटीक एक्सेसरीज़ / फिनिशिंग चाहिए। कृपया विकल्प बताएँ।",
    galleryTitle: "Accessories – Style & Finishing Reference",
    galleryTitleHi: "एक्सेसरीज़ – स्टाइल और फिनिशिंग रेफरेंस",
    galleryLead: "Browse finishing pieces. Select what you need — we coordinate with your custom stitch order.",
    galleryLeadHi: "फिनिशिंग पीस देखें। ज़रूरत चुनें — कस्टम सिलाई ऑर्डर से कोऑर्डिनेट।",
    designs: [
      { id: "dupatta", title: "Embroidered Dupatta", titleHi: "एम्ब्रॉयडर्ड दुपट्टा", image: WORK.purpleSuit, position: PORTRAIT },
      { id: "festive-d", title: "Festive Dupatta Drape", titleHi: "फेस्टिव दुपट्टा ड्रेप", image: WORK.orangeLehenga, position: PORTRAIT },
      { id: "sheer", title: "Sheer Overlay & Finish", titleHi: "शियर ओवरले और फिनिश", image: WORK.creamGown, position: PORTRAIT },
      { id: "bridal-d", title: "Bridal Dupatta", titleHi: "ब्राइडल दुपट्टा", image: WORK.heavyBridal, position: PORTRAIT },
    ],
    servicesTitle: "Our Accessory Services",
    servicesTitleHi: "हमारी एक्सेसरी सेवाएँ",
    services: [
      { icon: "needle", en: "Potli & Party Bags", hi: "पोतली और पार्टी बैग" },
      { icon: "hand", en: "Dupatta Embroidery & Finish", hi: "दुपट्टा एम्ब्रॉयडरी और फिनिश" },
      { icon: "finish", en: "Latkan / Tassel Work", hi: " लटकन / टैसल वर्क" },
      { icon: "match", en: "Colour Matching", hi: "कलर मैचिंग" },
      { icon: "pad", en: "Border & Lace Finishing", hi: "बॉर्डर और लेस फिनिशिंग" },
      { icon: "bridal", en: "Bridal Finishing Touches", hi: "ब्राइडल फिनिशिंग टच" },
      { icon: "alter", en: "Restyle Existing Pieces", hi: "पुराने पीस रीस्टाइल" },
      { icon: "express", en: "Pair with Stitch Order", hi: "सिलाई ऑर्डर के साथ" },
    ],
    pricesTitle: "Accessories Price (Starting From)",
    pricesTitleHi: "एक्सेसरीज़ कीमत (शुरुआती)",
    prices: [
      { type: "Dupatta Finishing", typeHi: "दुपट्टा फिनिशिंग", price: "199" },
      { type: "Latkan / Tassel Work", typeHi: " लटकन / टैसल वर्क", price: "149" },
      { type: "Border / Lace Finish", typeHi: "बॉर्डर / लेस फिनिश", price: "249" },
      { type: "Potli / Clutch (Ask)", typeHi: "पोतली / क्लच (पूछें)", price: "Ask" },
      { type: "Custom Embellishment", typeHi: "कस्टम एम्बेलिशमेंट", price: "Ask" },
      { type: "Styling Consult", typeHi: "स्टाइलिंग कंसल्ट", price: "Free*" },
    ],
    formTitle: "Book Accessory / Finishing",
    formTitleHi: "एक्सेसरी / फिनिशिंग बुक करें",
    typeOptions: [
      { value: "Potli / Bag", hi: "पोतली / बैग" },
      { value: "Dupatta Finishing", hi: "दुपट्टा फिनिशिंग" },
      { value: "Latkan / Tassel", hi: " लटकन / टैसल" },
      { value: "Border / Lace", hi: "बॉर्डर / लेस" },
      { value: "Other Finishing", hi: "अन्य फिनिशिंग" },
    ],
    measureOptions: [
      { value: "Match to my stitch order", hi: "मेरे सिलाई ऑर्डर से मैच" },
      { value: "I will share reference photos", hi: "रेफरेंस फोटो भेजूँगी" },
      { value: "Visit studio", hi: "स्टूडियो आऊँगी" },
    ],
    processTitle: "How to Book Accessories",
    processTitleHi: "एक्सेसरीज़ कैसे बुक करें",
    process: makeProcess("accessory", "एक्सेसरी"),
    quote: "Small details finish the outfit — potli, dupatta and tassels styled with your custom stitch.",
    quoteHi: "छोटे डिटेल आउटफ़िट पूरा करते हैं — पोतली, दुपट्टा और टैसल आपकी कस्टम सिलाई के साथ।",
    faqs: [
      {
        q: "Can accessories be ordered with my outfit?",
        qHi: "क्या एक्सेसरीज़ आउटफ़िट के साथ ऑर्डर हो सकती हैं?",
        a: "Yes — mention finishing needs when you book stitching so colour and timeline stay aligned.",
        aHi: "हाँ — सिलाई बुकिंग पर फिनिशिंग बताएँ ताकि रंग और टाइमलाइन मैच रहें।",
      },
      {
        q: "Do you only sell ready accessories?",
        qHi: "क्या सिर्फ रेडी एक्सेसरीज़ मिलती हैं?",
        a: "We offer finishing work, styling pieces and availability checks — ask on WhatsApp for current options.",
        aHi: "फिनिशिंग वर्क, स्टाइलिंग पीस और उपलब्धता — वर्तमान विकल्प WhatsApp पर पूछें।",
      },
      SHARED_LOCATION_FAQ,
    ],
    popularSearches: [
      { label: "Boutique Accessories Patna", href: "/boutique/accessories" },
      { label: "Dupatta Finishing Patna", href: "/boutique/accessories" },
      { label: "Potli Bag Patna", href: "/boutique/accessories" },
      { label: "Bridal Finishing Patna", href: "/boutique/bridal" },
      { label: "Boutique Boring Road", href: "/boutique-boring-road" },
    ],
  },
};

export function getBoutiqueLanding(slug) {
  return BOUTIQUE_LANDINGS[slug] || null;
}

/** Snake_case CMS blob for admin / PAGE_DEFAULTS (synced from code landing). */
export function landingToCms(landing) {
  if (!landing) return {};
  return {
    hero_image: landing.heroImage || "",
    header_eyebrow: landing.eyebrow || "",
    header_eyebrow_hi: landing.eyebrowHi || "",
    header_title: landing.h1 || "",
    header_title_hi: landing.h1Hi || "",
    header_tagline: landing.tagline || "",
    header_tagline_hi: landing.taglineHi || "",
    hero_cta_primary_label: landing.primaryCta || "",
    hero_cta_primary_label_hi: landing.primaryCtaHi || "",
    hero_cta_secondary_label: "Chat on WhatsApp",
    hero_cta_secondary_label_hi: "WhatsApp पर चैट करें",
    cta_wa_message: landing.bookMsg || "",
    landing_book_msg_hi: landing.bookMsgHi || "",
    landing_hero_quote: landing.heroQuote || "",
    landing_hero_quote_hi: landing.heroQuoteHi || "",
    landing_hero_quote_cta: landing.heroQuoteCta || "",
    landing_hero_quote_cta_hi: landing.heroQuoteCtaHi || "",
    landing_select_design: "Select This Design →",
    landing_select_design_hi: "यह डिज़ाइन चुनें →",
    landing_price_col: "Starting Price (₹)",
    landing_price_col_hi: "शुरुआती कीमत (₹)",
    landing_price_note: "*Final price depends on design, fabric and work complexity.",
    landing_price_note_hi: "*अंतिम कीमत डिज़ाइन, फैब्रिक और वर्क पर निर्भर करती है।",
    landing_reviews_title: "What Our Customers Say",
    landing_reviews_title_hi: "हमारे ग्राहक क्या कहते हैं",
    landing_faq_title: "Frequently Asked Questions",
    landing_faq_title_hi: "अक्सर पूछे जाने वाले प्रश्न",
    landing_visit_title: "Visit Our Boutique in Patna",
    landing_visit_title_hi: "पटना में हमारे बुटीक पर आएँ",
    landing_directions_label: "Get Directions",
    landing_directions_label_hi: "दिशा-निर्देश पाएँ",
    landing_searches_title: "Popular Searches",
    landing_searches_title_hi: "लोकप्रिय खोजें",
    landing_submit_label: "Submit Booking Request →",
    landing_submit_label_hi: "बुकिंग अनुरोध भेजें →",
    landing_usps: (landing.usps || []).map((u) => ({
      icon: u.icon || "finish",
      title: u.en || u.title || "",
      title_hi: u.hi || u.titleHi || "",
    })),
    landing_gallery_title: landing.galleryTitle || "",
    landing_gallery_title_hi: landing.galleryTitleHi || "",
    landing_gallery_lead: landing.galleryLead || "",
    landing_gallery_lead_hi: landing.galleryLeadHi || "",
    landing_designs: (landing.designs || []).map((d, i) => ({
      id: d.id || `design-${i + 1}`,
      title: d.title || "",
      title_hi: d.titleHi || "",
      image: d.image || "",
      position: d.position || "",
    })),
    landing_services_title: landing.servicesTitle || "",
    landing_services_title_hi: landing.servicesTitleHi || "",
    landing_services: (landing.services || []).map((s) => ({
      icon: s.icon || "needle",
      title: s.en || s.title || "",
      title_hi: s.hi || s.titleHi || "",
    })),
    landing_prices_title: landing.pricesTitle || "",
    landing_prices_title_hi: landing.pricesTitleHi || "",
    landing_prices: (landing.prices || []).map((p) => ({
      type: p.type || "",
      type_hi: p.typeHi || "",
      price: p.price || "",
    })),
    landing_form_title: landing.formTitle || "",
    landing_form_title_hi: landing.formTitleHi || "",
    landing_type_label: landing.typeLabel || "",
    landing_type_label_hi: landing.typeLabelHi || "",
    landing_type_options: (landing.typeOptions || []).map((o) => ({
      value: o.value || "",
      value_hi: o.hi || o.valueHi || "",
    })),
    landing_measure_options: (landing.measureOptions || []).map((o) => ({
      value: o.value || "",
      value_hi: o.hi || o.valueHi || "",
    })),
    landing_express_label: landing.expressLabel || "I want 24-Hour Express Stitching",
    landing_express_label_hi: landing.expressLabelHi || "मुझे 24-Hour Express Stitching चाहिए",
    landing_process_title: landing.processTitle || "",
    landing_process_title_hi: landing.processTitleHi || "",
    landing_process: (landing.process || []).map((s) => ({
      step: String(s.step ?? ""),
      title: s.title || "",
      title_hi: s.titleHi || "",
      desc: s.desc || "",
      desc_hi: s.descHi || "",
    })),
    landing_quote: landing.quote || "",
    landing_quote_hi: landing.quoteHi || "",
    landing_faqs: (landing.faqs || []).map((f) => ({
      q: f.q || "",
      q_hi: f.qHi || "",
      a: f.a || "",
      a_hi: f.aHi || "",
    })),
    landing_popular_searches: (landing.popularSearches || []).map((t) => ({
      label: t.label || "",
      href: t.href || "",
    })),
  };
}

/** Merge code landing defaults into each boutique PAGE_DEFAULTS entry. */
export function withLandingCmsDefaults(boutiquePageDefaults, services) {
  const out = { ...boutiquePageDefaults };
  for (const service of services) {
    const landing = BOUTIQUE_LANDINGS[service.slug];
    if (!landing || !out[service.cmsKey]) continue;
    out[service.cmsKey] = {
      ...out[service.cmsKey],
      ...landingToCms(landing),
    };
  }
  return out;
}

function filled(value, fallback) {
  if (value == null) return fallback;
  if (typeof value === "string") return value.trim() ? value : fallback;
  return value;
}

function mapUsps(raw, fallback) {
  if (!Array.isArray(raw) || !raw.length) return fallback;
  return raw.map((u, i) => {
    const fb = fallback[i] || fallback[0] || { icon: "finish", en: "", hi: "" };
    return {
      icon: u.icon || fb.icon,
      en: filled(u.title || u.en, fb.en),
      hi: filled(u.titleHi || u.title_hi || u.hi, fb.hi),
    };
  });
}

function mapDesigns(raw, fallback) {
  if (!Array.isArray(raw) || !raw.length) return fallback;
  return raw.map((d, i) => {
    const byId = fallback.find((item) => item.id && item.id === d.id);
    const fb = byId || fallback[i] || fallback[0] || { id: `d-${i}`, title: "", titleHi: "", image: "", position: "" };
    return {
      id: d.id || fb.id || `design-${i + 1}`,
      title: filled(d.title, fb.title),
      titleHi: filled(d.titleHi || d.title_hi, fb.titleHi),
      image: filled(d.image, fb.image),
      position: filled(d.position, fb.position || ""),
    };
  });
}

function mapServices(raw, fallback) {
  if (!Array.isArray(raw) || !raw.length) return fallback;
  return raw.map((s, i) => {
    const fb = fallback[i] || fallback[0] || { icon: "needle", en: "", hi: "" };
    return {
      icon: s.icon || fb.icon,
      en: filled(s.title || s.en, fb.en),
      hi: filled(s.titleHi || s.title_hi || s.hi, fb.hi),
    };
  });
}

function mapPrices(raw, fallback) {
  if (!Array.isArray(raw) || !raw.length) return fallback;
  return raw.map((p, i) => {
    const fb = fallback[i] || fallback[0] || { type: "", typeHi: "", price: "" };
    return {
      type: filled(p.type, fb.type),
      typeHi: filled(p.typeHi || p.type_hi, fb.typeHi),
      price: filled(String(p.price ?? ""), fb.price),
    };
  });
}

function mapOptions(raw, fallback) {
  if (!Array.isArray(raw) || !raw.length) return fallback;
  return raw.map((o, i) => {
    const fb = fallback[i] || fallback[0] || { value: "", hi: "" };
    return {
      value: filled(o.value, fb.value),
      hi: filled(o.valueHi || o.value_hi || o.hi, fb.hi),
    };
  });
}

function mapProcess(raw, fallback) {
  if (!Array.isArray(raw) || !raw.length) return fallback;
  return raw.map((s, i) => {
    const fb = fallback[i] || fallback[0] || { step: i + 1, title: "", titleHi: "", desc: "", descHi: "" };
    return {
      step: Number(s.step) || fb.step || i + 1,
      title: filled(s.title, fb.title),
      titleHi: filled(s.titleHi || s.title_hi, fb.titleHi),
      desc: filled(s.desc, fb.desc),
      descHi: filled(s.descHi || s.desc_hi, fb.descHi),
    };
  });
}

function mapFaqs(raw, fallback) {
  if (!Array.isArray(raw) || !raw.length) return fallback;
  return raw.map((f, i) => {
    const fb = fallback[i] || fallback[0] || { q: "", qHi: "", a: "", aHi: "" };
    return {
      q: filled(f.q, fb.q),
      qHi: filled(f.qHi || f.q_hi, fb.qHi),
      a: filled(f.a, fb.a),
      aHi: filled(f.aHi || f.a_hi, fb.aHi),
    };
  });
}

function mapSearches(raw, fallback) {
  if (!Array.isArray(raw) || !raw.length) return fallback;
  return raw
    .map((t) => ({
      label: t.label || "",
      href: t.href || "",
    }))
    .filter((t) => t.label);
}

/**
 * Resolve runtime landing content from camelCased CMS page + code defaults.
 * @param {string} slug
 * @param {object} cmsPage - merged site.pages[cmsKey] (camelCase)
 */
export function resolveBoutiqueLanding(slug, cmsPage = {}) {
  const base = BOUTIQUE_LANDINGS[slug];
  if (!base) return null;
  const p = cmsPage || {};

  return {
    ...base,
    heroImage: filled(p.heroImage, base.heroImage),
    heroPosition: filled(p.landingHeroPosition, base.heroPosition || "object-[70%_center]"),
    eyebrow: filled(p.landingEyebrow || p.headerEyebrow, base.eyebrow),
    eyebrowHi: filled(p.landingEyebrowHi || p.headerEyebrowHi, base.eyebrowHi),
    h1: filled(p.landingH1 || p.headerTitle, base.h1),
    h1Hi: filled(p.landingH1Hi || p.headerTitleHi, base.h1Hi),
    tagline: filled(p.landingTagline || p.headerTagline, base.tagline),
    taglineHi: filled(p.landingTaglineHi || p.headerTaglineHi, base.taglineHi),
    primaryCta: filled(p.heroCtaPrimaryLabel, base.primaryCta),
    primaryCtaHi: filled(p.heroCtaPrimaryLabelHi, base.primaryCtaHi),
    secondaryCta: filled(p.heroCtaSecondaryLabel, "Chat on WhatsApp"),
    secondaryCtaHi: filled(p.heroCtaSecondaryLabelHi, "WhatsApp पर चैट करें"),
    bookMsg: filled(p.ctaWaMessage || p.landingBookMsg, base.bookMsg),
    bookMsgHi: filled(p.landingBookMsgHi, base.bookMsgHi),
    heroQuote: filled(p.landingHeroQuote, base.heroQuote),
    heroQuoteHi: filled(p.landingHeroQuoteHi, base.heroQuoteHi),
    heroQuoteCta: filled(p.landingHeroQuoteCta, base.heroQuoteCta),
    heroQuoteCtaHi: filled(p.landingHeroQuoteCtaHi, base.heroQuoteCtaHi),
    usps: mapUsps(p.landingUsps, base.usps),
    galleryTitle: filled(p.landingGalleryTitle, base.galleryTitle),
    galleryTitleHi: filled(p.landingGalleryTitleHi, base.galleryTitleHi),
    galleryLead: filled(p.landingGalleryLead, base.galleryLead),
    galleryLeadHi: filled(p.landingGalleryLeadHi, base.galleryLeadHi),
    designs: mapDesigns(p.landingDesigns, base.designs),
    selectDesign: filled(p.landingSelectDesign, "Select This Design →"),
    selectDesignHi: filled(p.landingSelectDesignHi, "यह डिज़ाइन चुनें →"),
    servicesTitle: filled(p.landingServicesTitle, base.servicesTitle),
    servicesTitleHi: filled(p.landingServicesTitleHi, base.servicesTitleHi),
    services: mapServices(p.landingServices, base.services),
    pricesTitle: filled(p.landingPricesTitle, base.pricesTitle),
    pricesTitleHi: filled(p.landingPricesTitleHi, base.pricesTitleHi),
    prices: mapPrices(p.landingPrices, base.prices),
    priceCol: filled(p.landingPriceCol, "Starting Price (₹)"),
    priceColHi: filled(p.landingPriceColHi, "शुरुआती कीमत (₹)"),
    priceNote: filled(p.landingPriceNote, "*Final price depends on design, fabric and work complexity."),
    priceNoteHi: filled(p.landingPriceNoteHi, "*अंतिम कीमत डिज़ाइन, फैब्रिक और वर्क पर निर्भर करती है।"),
    formTitle: filled(p.landingFormTitle, base.formTitle),
    formTitleHi: filled(p.landingFormTitleHi, base.formTitleHi),
    typeLabel: filled(p.landingTypeLabel, base.typeLabel),
    typeLabelHi: filled(p.landingTypeLabelHi, base.typeLabelHi),
    typeOptions: mapOptions(p.landingTypeOptions, base.typeOptions),
    measureOptions: mapOptions(p.landingMeasureOptions, base.measureOptions),
    expressLabel: filled(p.landingExpressLabel, base.expressLabel),
    expressLabelHi: filled(p.landingExpressLabelHi, base.expressLabelHi),
    submitLabel: filled(p.landingSubmitLabel, "Submit Booking Request →"),
    submitLabelHi: filled(p.landingSubmitLabelHi, "बुकिंग अनुरोध भेजें →"),
    processTitle: filled(p.landingProcessTitle || p.processTitle, base.processTitle),
    processTitleHi: filled(p.landingProcessTitleHi || p.processTitleHi, base.processTitleHi),
    process: mapProcess(p.landingProcess, base.process),
    reviewsTitle: filled(p.landingReviewsTitle, "What Our Customers Say"),
    reviewsTitleHi: filled(p.landingReviewsTitleHi, "हमारे ग्राहक क्या कहते हैं"),
    faqTitle: filled(p.landingFaqTitle, "Frequently Asked Questions"),
    faqTitleHi: filled(p.landingFaqTitleHi, "अक्सर पूछे जाने वाले प्रश्न"),
    visitTitle: filled(p.landingVisitTitle, "Visit Our Boutique in Patna"),
    visitTitleHi: filled(p.landingVisitTitleHi, "पटना में हमारे बुटीक पर आएँ"),
    directionsLabel: filled(p.landingDirectionsLabel, "Get Directions"),
    directionsLabelHi: filled(p.landingDirectionsLabelHi, "दिशा-निर्देश पाएँ"),
    searchesTitle: filled(p.landingSearchesTitle, "Popular Searches"),
    searchesTitleHi: filled(p.landingSearchesTitleHi, "लोकप्रिय खोजें"),
    quote: filled(p.landingQuote, base.quote),
    quoteHi: filled(p.landingQuoteHi, base.quoteHi),
    faqs: mapFaqs(p.landingFaqs, base.faqs),
    popularSearches: mapSearches(p.landingPopularSearches, base.popularSearches),
  };
}
