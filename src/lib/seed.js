// Fallback content used when Supabase is not yet configured, so the site looks
// complete out of the box. Once you connect Supabase and add items in /admin,
// real data takes over automatically.
//
// Image URLs here use local /public assets — replace with real photos via admin.

import { BRAND_NAME } from "@/lib/brand";
import {
  buildSITE,
  buildTrustFromSite,
  computeYearsExperience,
  DEFAULT_FOUNDING_YEAR,
  DEFAULT_STUDENTS_TAUGHT,
  formatSiteStats,
} from "@/lib/site-config";

export const DEFAULT_TEAM = [
  {
    name: "Sanjay Kumar Mishra",
    nameHi: "संजय कुमार मिश्रा",
    role: "Founder",
    roleHi: "संस्थापक",
  },
  {
    name: "Sangi Shreya",
    nameHi: "संगी श्रेया",
    role: "Director & Lead Mentor",
    roleHi: "निदेशक और मुख्य मेंटर",
  },
];

const _years = computeYearsExperience(DEFAULT_FOUNDING_YEAR);
const _stats = formatSiteStats({
  foundingYear: DEFAULT_FOUNDING_YEAR,
  studentsTaught: DEFAULT_STUDENTS_TAUGHT,
  coursesCount: 0, // filled at runtime from published courses
  yearsExperience: _years,
});

/** Canonical site stats — prefer site.stats from getSiteSettings() at runtime. */
export const SITE_STATS = {
  yearsEn: _stats.yearsEn,
  yearsHi: _stats.yearsHi,
  studentsEn: _stats.studentsEn,
  studentsHi: _stats.studentsHi,
  // coursesEn/Hi are placeholders; use site.stats after coursesCount is known
  coursesEn: "Courses",
  coursesHi: "कोर्स",
  lineEn: _stats.lineEn,
  lineHi: _stats.lineHi,
};

export const SITE = {
  ...buildSITE(
    {
      brand: BRAND_NAME,
      boutique: "From Skill to Business",
      boutiqueHi: "कौशल से कारोबार तक",
      tagline: "Stitched outfits in 24 hours",
      taglineHi: "24 घंटे में सिले कपड़े",
      intro: `Shreya Creation — Patna's skill development boutique and job-oriented training institute with ${_years}+ Years of experience. We offer professional courses in boutique, blouse, suit, kids wear, fashion design and lehenga — and have trained ${DEFAULT_STUDENTS_TAUGHT}+ learners in stitching, fashion design, boutique management, and self-employment.`,
      introHi: `श्रेया क्रिएशन — ${_years}+ वर्ष के अनुभव के साथ पटना का कौशल विकास, बुटीक और रोज़गार-उन्मुख प्रशिक्षण संस्थान। हम बुटीक, ब्लाउज, सूट, किड्स वियर, फैशन डिज़ाइन और लहंगा में प्रोफेशनल कोर्स देते हैं — और सिलाई, फैशन डिज़ाइन, बुटीक प्रबंधन और स्वरोजगार में ${DEFAULT_STUDENTS_TAUGHT}+ छात्राओं को प्रशिक्षित कर चुके हैं।`,
      aboutBody:
        "Founded by Sanjay Kumar Mishra, Shreya Creation is dedicated to practical skills, self-employment, and job opportunities for women and youth. We don't just teach sewing — we prepare the path to self-reliance. Our specialties include practical training, fashion designing, boutique management, job-oriented courses, and business guidance.",
      aboutBodyHi:
        "संस्थापक संजय कुमार मिश्रा के नेतृत्व में श्रेया क्रिएशन महिलाओं और युवाओं को व्यावहारिक कौशल, स्वरोजगार और रोज़गार के अवसर प्रदान करने के लिए समर्पित है। हम केवल सिलाई नहीं सिखाते, हम आत्मनिर्भरता का मार्ग तैयार करते हैं। हमारी विशेषताएँ — प्रैक्टिकल ट्रेनिंग, फैशन डिज़ाइनिंग, बुटीक मैनेजमेंट, जॉब ओरिएंटेड कोर्स और बिज़नेस गाइडेंस।",
      city: "Patna",
      foundingYear: DEFAULT_FOUNDING_YEAR,
      studentsTaught: DEFAULT_STUDENTS_TAUGHT,
      mapEmbedUrl:
        "https://maps.google.com/maps?q=Shreya+Creation+Sisodiya+Place+East+Boring+Canal+Road+Patna+Bihar+800001&hl=en&z=16&output=embed",
      socials: {
        instagram: "https://www.instagram.com/shreya.creationss/",
        youtube: "https://www.youtube.com/@ShreyaCreations111/",
        facebook: "https://www.facebook.com/shreyascreation",
      },
    },
    { coursesCount: 0 }
  ),
};

export const TRUST = buildTrustFromSite(SITE);

// Fashion-design services / expertise
export const SERVICES = [
  {
    title: "Bespoke Tailoring",
    text: "Every garment cut and stitched to your exact measurements for a flawless, made-for-you fit.",
    accent: "orange",
  },
  {
    title: "Bridal & Couture",
    text: "Show-stopping lehengas, gowns and bridal ensembles designed for your big day.",
    accent: "gold",
  },
  {
    title: "Fashion Design Courses",
    text: "10 professional courses — boutique, blouse, suit, kids wear, fashion design & lehenga. Hands-on training in Hindi & English.",
    accent: "orange",
  },
  {
    title: "Pattern & Embroidery",
    text: "Custom motifs with zardozi, aari and mirror work that make each piece unique.",
    accent: "gold",
  },
  {
    title: "Styling Consultation",
    text: "Personal styling, fabric and silhouette advice to find what truly flatters you.",
    accent: "orange",
  },
  {
    title: "24-hour Express Stitching",
    text: "In a hurry? Many ready styles are stitched and delivered within a single day.",
    accent: "gold",
  },
];

// How an order / design comes together
export const PROCESS = [
  { step: "Consult", text: "Share your idea, occasion and budget with us on WhatsApp." },
  { step: "Design", text: "We sketch, choose fabrics and finalise the design together." },
  { step: "Stitch", text: "Expert tailoring and embroidery, fitted to your measurements." },
  { step: "Deliver", text: "Final fitting and delivery — many styles in just 24 hours." },
];

/** Local placeholder images — never use Unsplash on the public site. */
const LOCAL_IMGS = [
  "/slider1.webp",
  "/slider2.webp",
  "/slider3.webp",
  "/slider4.webp",
  "/hero_studio_banner.webp",
  "/boutique.webp",
  "/institute.webp",
  "/job.webp",
];
const img = (id = "0") => LOCAL_IMGS[Math.abs(String(id).length + String(id).charCodeAt(0) || 0) % LOCAL_IMGS.length];
const localPair = (a, b) => [LOCAL_IMGS[a % LOCAL_IMGS.length], LOCAL_IMGS[b % LOCAL_IMGS.length]];

export const PRODUCTS = [
  {
    id: "p1",
    slug: "royal-bridal-lehenga",
    title: "Royal Bridal Lehenga",
    category: "Lehenga",
    price: 18999,
    fabric: "Raw silk with zardozi work",
    sizes: "Custom (stitched to your measurements)",
    care: "Dry clean only. Store in a cool, dry place.",
    colours: "Maroon / Gold (customisable)",
    estimated_delivery: "7–14 days (express options on WhatsApp)",
    stitchable: true,
    published: true,
    description:
      "A hand-embroidered bridal lehenga with intricate zardozi and sequins. Made to order and stitched to your exact measurements for a flawless fit.",
    description_long:
      "Crafted for wedding ceremonies, this bridal lehenga features dense zardozi and sequin work on raw silk. We take your measurements at the studio or via WhatsApp guide, confirm the colourway and blouse style, then stitch to fit.",
    images: localPair(0, 4),
  },
  {
    id: "p2",
    slug: "designer-evening-gown",
    title: "Designer Evening Gown",
    category: "Gown",
    price: 8499,
    fabric: "Georgette with hand beadwork",
    sizes: "Custom fit",
    care: "Gentle dry clean. Avoid wringing.",
    colours: "Custom colour options",
    estimated_delivery: "5–10 days",
    stitchable: true,
    published: true,
    description:
      "A flowing floor-length gown with delicate beadwork along the bodice. Perfect for receptions and evening events.",
    description_long:
      "Floor-length georgette gown with hand beadwork on the bodice. Ideal for receptions and evening functions.",
    images: localPair(1, 5),
  },
  {
    id: "p3",
    slug: "embroidered-designer-blouse",
    title: "Embroidered Designer Blouse",
    category: "Blouse",
    price: 2499,
    fabric: "Silk blend",
    sizes: "Custom fit",
    care: "Dry clean recommended.",
    colours: "As per fabric choice",
    estimated_delivery: "24–72 hours for many styles",
    stitchable: true,
    published: true,
    description:
      "Statement saree blouse with mirror and thread embroidery. Choose your neckline and sleeve style.",
    description_long:
      "Boutique-finished saree blouse with mirror and thread embroidery. Many styles qualify for express stitching — confirm on WhatsApp.",
    images: localPair(2, 6),
  },
  {
    id: "p4",
    slug: "anarkali-suit-set",
    title: "Anarkali Suit Set",
    category: "Suit",
    price: 5999,
    fabric: "Chanderi cotton silk",
    sizes: "Custom fit",
    care: "Gentle wash or dry clean.",
    colours: "Festive palette — customisable",
    estimated_delivery: "5–12 days",
    stitchable: true,
    published: true,
    description:
      "Graceful floor-length Anarkali with churidar and dupatta. Light, breathable and festive-ready.",
    description_long:
      "Floor-length Anarkali set with churidar and dupatta in chanderi cotton silk. Custom length and flare available.",
    images: localPair(3, 7),
  },
  {
    id: "p5",
    slug: "bridal-jewellery-set",
    title: "Bridal Jewellery Set",
    category: "Jewellery",
    price: 3499,
    fabric: "Kundan & pearls",
    sizes: "One size",
    care: "Wipe with soft cloth. Keep dry.",
    colours: "Gold-tone kundan",
    estimated_delivery: "2–5 days (subject to stock)",
    stitchable: false,
    ready_made: true,
    published: true,
    description:
      "Statement kundan necklace with matching earrings and maang tikka to complete the bridal look.",
    description_long:
      "Kundan necklace with matching earrings and maang tikka. Confirm availability on WhatsApp before payment.",
    images: localPair(4, 0),
  },
  {
    id: "p6",
    slug: "potli-bag",
    title: "Embellished Potli Bag",
    category: "Accessories",
    price: 899,
    fabric: "Silk with tassels",
    sizes: "One size",
    care: "Spot clean only.",
    colours: "Assorted festive colours",
    estimated_delivery: "1–3 days",
    stitchable: false,
    ready_made: true,
    published: true,
    description:
      "Hand-finished potli bag with beads and tassels — the perfect finishing touch for festive wear.",
    description_long:
      "Hand-finished silk potli with beads and tassels for festive and bridal looks.",
    images: localPair(5, 1),
  },
];

export const PRODUCT_CATEGORIES = ["All", "Lehenga", "Gown", "Blouse", "Suit", "Jewellery", "Accessories"];

export const COURSES = [
  {
    id: "c1",
    slug: "basic-boutique-course",
    title: "Basic Boutique Mastery Course",
    titleHi: "बेसिक बुटीक मास्टरी कोर्स",
    category: "Boutique",
    price: 15000,
    price_confirmed: true,
    duration: "3 months",
    language: "Hindi",
    published: true,
    course_pdf: "/courses/pdfs/Basic Boutique Mastery Course 15000.pdf",
    description:
      "Complete 3-month programme from beginner to professional boutique owner — foundation, petticoat, salwar, kurti, frock, gown, blouse, lehenga & boutique business. 3 days/week, 3 hours/day.",
    description_hi:
      "शुरुआती स्तर से प्रोफेशनल बुटीक ओनर बनने तक का पूरा 3 महीने का प्रोग्राम — फाउंडेशन, पेटीकोट, सलवार, कुर्ती, फ्रॉक, गाउन, ब्लाउज, लहंगा और बुटीक बिज़नेस। सप्ताह में 3 दिन, दिन में 3 घंटे।",
    about:
      "Basic Boutique Mastery is Shreya Creation's flagship beginner programme — a complete training path from sewing basics to running your own boutique.\n\nOver 3 months (3 days per week, 3 hours per day), you will master foundation skills, petticoat making, salwar & bottom wear, kurti with 10 neck and 10 sleeve designs, frocks, gowns, western wear, basic and advanced blouses, lehenga, dupatta finishing, and boutique business — costing, pricing, order taking, alteration and customer handling.\n\nIdeal for beginners, homemakers, boutique owners upgrading their skills, and anyone who wants self-employment in fashion. After completion you will be ready to take boutique orders, work from home, or start your own boutique with confidence.",
    about_hi:
      "बेसिक बुटीक मास्टरी कोर्स श्रेया क्रिएशन का मुख्य शुरुआती प्रोग्राम है — सिलाई की बुनियाद से अपना बुटीक चलाने तक का पूरा मार्ग।\n\n3 महीने (सप्ताह में 3 दिन, दिन में 3 घंटे) में आप फाउंडेशन, पेटीकोट, सलवार व बॉटम वियर, 10 नेक और 10 स्लीव डिज़ाइन के साथ कुर्ती, फ्रॉक, गाउन, वेस्टर्न वियर, बेसिक और एडवांस ब्लाउज, लहंगा, दुपट्टा फिनिशिंग और बुटीक बिज़नेस — कॉस्टिंग, प्राइसिंग, ऑर्डर लेना, अल्टरेशन और ग्राहक संभालना सीखेंगे।\n\nशुरुआती छात्राओं, गृहिणियों, बुटीक मालिकों और फैशन में स्वरोजगार चाहने वालों के लिए उपयुक्त। कोर्स के बाद आप बुटीक ऑर्डर लेने, घर से काम करने या अपना बुटीक शुरू करने के लिए तैयार होंगी।",
    includes: [
      "3 months · 3 days/week · 3 hours/day",
      "Foundation to boutique business — all in one course",
      "Kurti, blouse, lehenga, frock, gown & western wear",
      "10 neck designs + 10 sleeve designs",
      "Boutique business training — costing, pricing & orders",
      "100% practical & job-oriented learning",
      "Certificate on course completion",
      "Personal guidance & small-batch attention",
    ],
    includes_hi: [
      "3 महीने · सप्ताह में 3 दिन · दिन में 3 घंटे",
      "फाउंडेशन से बुटीक बिज़नेस तक — सब कुछ एक कोर्स में",
      "कुर्ती, ब्लाउज, लहंगा, फ्रॉक, गाउन और वेस्टर्न वियर",
      "10 नेक डिज़ाइन + 10 स्लीव डिज़ाइन",
      "बुटीक बिज़नेस ट्रेनिंग — कॉस्टिंग, प्राइसिंग और ऑर्डर",
      "100% प्रैक्टिकल और जॉब ओरिएंटेड लर्निंग",
      "कोर्स पूरा करने पर सर्टिफिकेट",
      "पर्सनल गाइडेंस और छोटे बैच में ध्यान",
    ],
    syllabus: [
      "Week 1 — Foundation: boutique industry intro, sewing machine handling & maintenance, 6 hand stitches, hemming, fabric knowledge, measurement (3 methods)",
      "Week 2 — Drafting & petticoat: fabric calculation, body shape analysis, 6 kali, A-line, side hook & side zip petticoat",
      "Week 3 — Bottom wear: straight pant, half belt, half elastic pant, full elastic pant, side pocket making",
      "Week 4 — Salwar styles: palazzo, kali palazzo, patiala salwar, dori salwar, sharara",
      "Week 5 — Kurti basics: straight kurti, A-line kurti, pocket kurti",
      "Week 6 — Designer kurti: prince cut, umbrella kurti, half collar & shirt collar kurti",
      "Week 7 — Neck & sleeve design: 10 types neck design, 10 types sleeve design, piping making",
      "Week 8 — Frock designing: A-line frock, umbrella frock, prince cut frock, single layer anarkali",
      "Week 9 — Advanced frocks: double layer anarkali, 3 layer frock, 5 meter kali frock, 10 meter designer frock",
      "Week 10 — Gown designing: yoke pattern, gather, layer & jacket style gown",
      "Week 11 — Basic blouse: plain, lining, round neck, V neck & square neck blouse",
      "Week 12 — Blouse styles: boat neck, plus size, side cut & prince cut blouse",
      "Week 13 — Advanced blouse: collar, high neck, keyhole back & pattern blouse",
      "Week 14 — Bridal blouse & finishing: bridal prince cut, longline bridal blouse, dori (3 types) & latkan (10 types)",
      "Week 15 — Lehenga: simple circle, A-line, gather lehenga, can-can & buckram attachment",
      "Week 16 — Boutique skills & certification: dupatta finishing, lace & tassel, fabric belt, designer potli & clutch, alteration, costing, pricing, customer handling, order taking, final assessment",
    ],
    preview_video: "",
    image: LOCAL_IMGS[0],
  },
  {
    id: "c2",
    slug: "advanced-boutique-course",
    title: "Advanced Boutique Course",
    titleHi: "एडवांस्ड बुटीक कोर्स",
    category: "Boutique",
    price: 45000,
    price_tbd: true, // TODO(owner): confirm starting price
    duration: "12 months",
    language: "Hindi",
    published: true,
    description:
      "A complete year-long boutique programme covering advanced cutting, designer garments, boutique management, and business skills to run your own fashion outlet.",
    syllabus: [
      "Advanced pattern making & designer cuts",
      "Bridal, ethnic & party-wear construction",
      "Embroidery, piping & boutique embellishments",
      "Inventory, pricing & client management",
      "Boutique set-up, branding & marketing basics",
    ],
    preview_video: "",
    image: LOCAL_IMGS[5],
  },
  {
    id: "c3",
    slug: "western-boutique-course",
    title: "Western Boutique Course",
    titleHi: "वेस्टर्न बुटीक कोर्स",
    category: "Boutique",
    price: 45000, // TODO(owner): confirm starting price
    duration: "12 months",
    language: "Hindi & English",
    published: true,
    description:
      "Master western wear for boutique clients — tops, skirts, dresses, trousers, and fusion styles with professional finishing and fit.",
    syllabus: [
      "Western measurement & block patterns",
      "Tops, tunics, skirts & dresses",
      "Trousers, palazzos & western bottoms",
      "Lining, darts & professional finishing",
      "Fusion & Indo-western boutique pieces",
    ],
    preview_video: "",
    image: LOCAL_IMGS[0],
  },
  {
    id: "c4",
    slug: "blouse-suit-making-course",
    title: "Blouse & Suit Making Course",
    titleHi: "ब्लाउज और सूट मेकिंग कोर्स",
    category: "Blouse Making",
    price: 4995,
    compare_price: 7999,
    price_confirmed: true,
    badge: "bestseller",
    duration: "3 months",
    language: "Hindi",
    published: true,
    course_pdf: "/courses/pdfs/Basic suit and  Blouse Course.pdf",
    description:
      "If you want to learn sewing to make your own clothes or start working in a boutique, this course is for you. Build a strong foundation in salwar, kurti, and blouse cutting & stitching — and start earning with basic orders.",
    about:
      "In today's time, just learning stitching is not enough — if you want to become a professional blouse designer, you need to understand the complete process from designing to business.\n\nWith this in mind, we bring you the Blouse & Suit Making Course, where you will get step-by-step training from basic to advanced level. Learn measurement, cutting, designer necks, boutique finishing, and how to take orders and start earning.",
    about_hi:
      "आज के समय में सिर्फ stitching सीखना काफी नहीं है — अगर आप एक Professional Blouse Designer बनना चाहते हैं, तो आपको designing से लेकर business तक पूरा process समझना जरूरी है।\n\nइसी को ध्यान में रखते हुए हम आपके लिए लेकर आए हैं Blouse & Suit Making Course, जिसमें आपको basic से advanced level तक step-by-step training दी जाएगी।",
    includes: [
      "8+ weeks of structured modules",
      "10+ blouse neck & sleeve styles",
      "Salwar, kurti & designer blouse training",
      "100% hands-on practical learning",
      "Certificate on completion",
      "Expert faculty guidance",
    ],
    includes_hi: [
      "8+ सप्ताह की संरचित ट्रेनिंग",
      "10+ ब्लाउज नेक और स्लीव स्टाइल",
      "सलवार, कुर्ती और डिज़ाइनर ब्लाउज ट्रेनिंग",
      "100% प्रैक्टिकल हैंड्स-ऑन लर्निंग",
      "कोर्स पूरा करने पर सर्टिफिकेट",
      "एक्सपर्ट फैकल्टी गाइडेंस",
    ],
    syllabus: [
      "Week 1 — Foundation & Machine Training: tailoring tools, sewing machine handling, measurement practice, hemming, hook & eye, basic stitching",
      "Week 2 — Salwar Making: basic mayani salwar, dori salwar, half elastic half belt pant, finishing techniques",
      "Week 3 — Plazo & Kurti Basics: plazo pant, straight fit kurti, neck finishing practice",
      "Week 4 — Designer Kurti Module: A-line kurti, A-line frock, deep neck lining kurti, 6 types of neck patterns",
      "Week 5 — Advanced Kurti Module: straight fit half collar kurti, princess cut kurti, piping application, kurti finishing",
      "Week 6 — Basic Blouse Module: plain blouse measurement, cutting & stitching, round shape lining blouse, V shape lining blouse",
      "Week 7 — Designer Blouse Module: princess cut blouse, sweetheart neck blouse, plus size blouse taking, 10 types of blouse neck styles",
      "Week 8 — Boutique Finishing Skills: dori making, latkan making, piping making & attaching, final garment finishing, practice & assessment",
      "Final Project: 1 Salwar/Pant, 1 Kurti, 1 Designer Kurti, 1 Blouse",
    ],
    preview_video: "",
    image: LOCAL_IMGS[0],
  },
  {
    id: "c5",
    slug: "advanced-blouse-making-course",
    title: "Advanced Blouse Making Course",
    titleHi: "एडवांस्ड ब्लाउज मेकिंग कोर्स",
    category: "Blouse Making",
    price: 7999, // TODO(owner): confirm starting price
    duration: "3 months",
    language: "Hindi",
    published: true,
    description:
      "Take your blouse skills to the next level — designer necks, princess cuts, padding, linings, and boutique-quality finishing for saree and lehenga blouses.",
    syllabus: [
      "Advanced blouse measurement & drafting",
      "10+ designer neck & sleeve styles",
      "Princess cut, sweetheart & padded blouses",
      "Lining, piping & latkan attachment",
      "Bridal & party-wear blouse finishing",
    ],
    preview_video: "",
    image: LOCAL_IMGS[0],
  },
  {
    id: "c6",
    slug: "kids-wear-course",
    title: "Kids Wear Course",
    titleHi: "किड्स वियर कोर्स",
    category: "Stitching",
    price: 12000, // TODO(owner): confirm starting price
    duration: "6 months",
    language: "Hindi",
    published: true,
    description:
      "Learn to stitch adorable, comfortable kids' outfits — frocks, ethnic sets, western wear, and seasonal styles with safe finishing for children.",
    syllabus: [
      "Kids measurement & sizing basics",
      "Frocks, frock suits & ethnic sets",
      "Kids kurti, salwar & ethnic wear",
      "Western tops, shorts & casual wear",
      "Fabric selection, comfort & finishing",
    ],
    preview_video: "",
    image: LOCAL_IMGS[0],
  },
  {
    id: "c7",
    slug: "western-blouse-making-course",
    title: "Western Blouse Making Course",
    titleHi: "वेस्टर्न ब्लाउज मेकिंग कोर्स",
    category: "Blouse Making",
    price: 9999, // TODO(owner): confirm starting price
    duration: "6 months",
    language: "Hindi & English",
    published: true,
    description:
      "Specialised training in western-style blouses, crop tops, jackets, and fusion tops — perfect for boutique clients who love contemporary silhouettes.",
    syllabus: [
      "Western blouse blocks & dart manipulation",
      "Crop tops, peplum & structured tops",
      "Jackets, shrugs & layered styles",
      "Collars, cuffs & western finishing",
      "Fusion tops for saree & lehenga pairing",
    ],
    preview_video: "",
    image: LOCAL_IMGS[0],
  },
  {
    id: "c8",
    slug: "suit-making-course",
    title: "Suit Making Course",
    titleHi: "सूट मेकिंग कोर्स",
    category: "Stitching",
    price: 6999, // TODO(owner): confirm starting price
    duration: "3 months",
    language: "Hindi",
    published: true,
    description:
      "Focused programme on salwar suits, churidar sets, Anarkali, and designer ethnic suits — from cutting to boutique-ready finishing.",
    syllabus: [
      "Suit measurement & pattern drafting",
      "Straight, A-line & Anarkali suits",
      "Churidar, palazzo & salwar variations",
      "Dupatta finishing & set coordination",
      "Designer suit cuts & boutique finishing",
    ],
    preview_video: "",
    image: LOCAL_IMGS[0],
  },
  {
    id: "c9",
    slug: "fashion-designing-course",
    title: "Fashion Designing Course",
    titleHi: "फैशन डिज़ाइनिंग कोर्स",
    category: "Fashion Design",
    price: 55000,
    price_tbd: true, // TODO(owner): confirm starting price
    duration: "1.5 years",
    language: "Hindi & English",
    published: true,
    description:
      "Our flagship fashion design programme — sketching, draping, pattern making, garment construction, embroidery, and portfolio building for a career in fashion.",
    syllabus: [
      "Fashion illustration & design fundamentals",
      "Fabric science, draping & pattern making",
      "Ethnic, western & fusion garment construction",
      "Embroidery, surface ornamentation & detailing",
      "Portfolio, boutique internship & career guidance",
    ],
    preview_video: "",
    image: LOCAL_IMGS[5],
  },
  {
    id: "c10",
    slug: "lehenga-making-course",
    title: "Lehenga Making Course",
    titleHi: "लहंगा मेकिंग कोर्स",
    category: "Fashion Design",
    price: 15000,
    price_tbd: true, // TODO(owner): confirm starting price
    duration: "6 months",
    language: "Hindi",
    published: true,
    description:
      "Learn to design and stitch bridal and festive lehengas — flared, A-line, panelled, and designer styles with can-can, lining, and heavy finishing.",
    syllabus: [
      "Lehenga measurement & style selection",
      "Flared, panelled & A-line lehenga cutting",
      "Choli / blouse pairing for lehenga sets",
      "Can-can, lining & heavy finishing",
      "Bridal & festive lehenga embellishment basics",
    ],
    preview_video: "",
    image: LOCAL_IMGS[0],
  },
  {
    id: "c11",
    slug: "collar-design-blouse-course",
    title: "Collar Design Blouse Course",
    titleHi: "कॉलर डिज़ाइन ब्लाउज कोर्स",
    category: "Blouse Making",
    price: 2999, // TODO(owner): confirm starting price
    duration: "2 weeks",
    language: "Hindi",
    published: true,
    is_addon: true,
    addon_for: ["blouse-suit-making-course", "advanced-blouse-making-course"],
    badge: "addon",
    course_pdf: "/courses/pdfs/Collar Design Blouse Course.pdf",
    description:
      "Specialised add-on module — master shirt collar, mandarin, lapel and embroidered collar blouses with boutique-quality cutting, stitching and finishing.",
    description_hi:
      "विशेष ऐड-ऑन मॉड्यूल — शर्ट कॉलर, मैंडरिन, लैपेल और कढ़ाई वाले कॉलर ब्लाउज की बुटीक-लेवल कटिंग, सिलाई और फिनिशिंग सीखें।",
    about:
      "The Collar Design Blouse Course is a focused add-on programme for students who already know basic blouse making and want to specialise in structured collar blouses — one of the highest-demand categories in boutique and bridal work.\n\nBased on Shreya Creation's Collar Blouse Design Collection brochure, you will learn measurement, drafting and stitching for shirt-collar button-down blouses, mandarin stand-up collars with keyhole cutouts, notched lapel collars with contrast embroidery, brocade shawl-collar styles, bandhani collared blouses, denim shirt-collar designs, high-neck sheer panel collars, zip-front pointed collars, blazer-style waistcoat collars, and gold-embroidered stand collars with multiple cutouts.\n\nIdeal as an add-on after Blouse & Suit Making or Advanced Blouse Making. After completion you will be ready to take premium collar-blouse orders for sarees, lehengas and festive wear.",
    about_hi:
      "कॉलर डिज़ाइन ब्लाउज कोर्स उन छात्राओं के लिए एक फोकस्ड ऐड-ऑन प्रोग्राम है जो बेसिक ब्लाउज जानती हैं और स्ट्रक्चर्ड कॉलर ब्लाउज में स्पेशलाइज़ करना चाहती हैं — बुटीक और ब्राइडल वर्क में सबसे ज़्यादा डिमांड वाली कैटेगरी।\n\nश्रेया क्रिएशन के Collar Blouse Design Collection ब्रोशर के अनुसार आप शर्ट-कॉलर बटन-डाउन, मैंडरिन स्टैंड-अप कॉलर विद कीहोल, नॉच्ड लैपेल कॉलर विद कंट्रास्ट एम्ब्रॉयडरी, ब्रोकेड शॉल-कॉलर, बांधनी कॉलर, डेनिम शर्ट-कॉलर, हाई-नेक शीयर पैनल, ज़िप-फ्रंट पॉइंटेड कॉलर, ब्लेज़र-स्टाइल वेस्टकोट कॉलर और गोल्ड-कढ़ाई स्टैंड कॉलर सीखेंगी।\n\nब्लाउज और सूट मेकिंग या एडवांस ब्लाउज मेकिंग के बाद ऐड-ऑन के रूप में उपयुक्त।",
    includes: [
      "2-week specialised add-on module",
      "15+ collar blouse styles from our design collection",
      "Shirt, mandarin, lapel & embroidered collar techniques",
      "Keyhole, cutout & front-opening collar constructions",
      "100% hands-on practical learning",
      "Certificate on module completion",
      "Best after Blouse & Suit or Advanced Blouse Making",
    ],
    includes_hi: [
      "2 सप्ताह का विशेष ऐड-ऑन मॉड्यूल",
      "डिज़ाइन कलेक्शन से 15+ कॉलर ब्लाउज स्टाइल",
      "शर्ट, मैंडरिन, लैपेल और कढ़ाई कॉलर तकनीक",
      "कीहोल, कटआउट और फ्रंट-ओपनिंग कॉलर कंस्ट्रक्शन",
      "100% प्रैक्टिकल हैंड्स-ऑन लर्निंग",
      "मॉड्यूल पूरा करने पर सर्टिफिकेट",
      "ब्लाउज और सूट या एडवांस ब्लाउज के बाद सर्वोत्तम",
    ],
    syllabus: [
      "Module 1 — Collar blouse fundamentals: measurement, drafting blocks & collar types overview",
      "Module 2 — Shirt collar button-down blouse: pointed collar, placket & cap sleeve finish",
      "Module 3 — Mandarin stand-up collar: keyhole cutout, brocade collar band & waistband",
      "Module 4 — Notched lapel collar: contrast embroidery, deep V-neck & princess seams",
      "Module 5 — Brocade shawl/lapel collar: front-opening, sleeveless & structured fit",
      "Module 6 — Bandhani & ethnic print collared blouse: embroidered collar border",
      "Module 7 — Denim fusion collar blouse: shirt collar, diamond cutout & puff sleeve",
      "Module 8 — High-neck sheer panel collar: puff sleeve, cold-shoulder & scalloped border",
      "Module 9 — Zip-front pointed collar blouse: cap sleeve & cropped designer finish",
      "Module 10 — Blazer-style waistcoat collar: full sleeve, tailored princess cut",
      "Module 11 — Gold embroidered stand collar: multi-cutout neckline & bead trim",
      "Module 12 — Navy embroidered lapel collar: three-quarter sleeve boutique blouse",
      "Module 13 — Mustard mandarin collar with brocade waistband & keyhole detail",
      "Module 14 — Off-white embroidered mandarin collar with short sleeve cuff work",
      "Module 15 — Geometric print lapel collar full-sleeve blouse & final assessment",
    ],
    preview_video: "",
    image: LOCAL_IMGS[0],
  },
  {
    id: "c12",
    slug: "madhubala-blouse-course",
    title: "Madhubala Blouse Course",
    titleHi: "मधुबाला ब्लाउज कोर्स",
    category: "Blouse Making",
    price: 2999, // TODO(owner): confirm starting price
    duration: "2 weeks",
    language: "Hindi",
    published: true,
    is_addon: true,
    addon_for: ["blouse-suit-making-course", "advanced-blouse-making-course"],
    badge: "addon",
    course_pdf: "/courses/pdfs/Madhubala Blouse Course.pdf",
    description:
      "Add-on course inspired by timeless Madhubala-era elegance — sweetheart necks, zari borders, dori backs, puff sleeves and vintage boutique finishing.",
    description_hi:
      "टाइमलेस मधुबाला-एरा एलिगेंस पर आधारित ऐड-ऑन — स्वीटहार्ट नेक, ज़री बॉर्डर, डोरी बैक, पफ स्लीव और विंटेज बुटीक फिनिशिंग।",
    about:
      "The Madhubala Blouse Course celebrates the timeless charm of classic Indian cinema-inspired blouse design — where tradition meets grace in every thread.\n\nThis add-on module covers vintage-style blouses from our Madhubala design collection: sweetheart necklines with zari border sleeves, deep U-back blouses with dori ties, square-back dori styles, backless criss-cross string backs, circular cutout backs with dual ties, halter-neck gold striped blouses, puff-sleeve circular back cutouts, checkered heritage backs, corset-style longline blouses with chain straps, and heavily embroidered festive finishes.\n\nPerfect for boutique owners and designers who want to offer nostalgic, high-value bridal and party-wear blouses. Recommended after basic or advanced blouse training.",
    about_hi:
      "मधुबाला ब्लाउज कोर्स क्लासिक भारतीय सिनेमा-इंस्पायर्ड ब्लाउज डिज़ाइन की टाइमलेस चार्म को सेलिब्रेट करता है — जहाँ परंपरा हर धागे में ग्रेस से मिलती है।\n\nयह ऐड-ऑन मॉड्यूल हमारे Madhubala डिज़ाइन कलेक्शन से विंटेज स्टाइल कवर करता है: ज़री बॉर्डर स्लीव के साथ स्वीटहार्ट नेक, डोरी वाला डीप यू-बैक, स्क्वायर बैक डोरी, बैकलेस क्रिस-क्रॉस स्ट्रिंग, सर्कुलर कटआउट डुअल टाई, हाल्टर नेक गोल्ड स्ट्राइप, पफ स्लीव सर्कुलर बैक, चेकरड हेरिटेज बैक, चेन स्ट्रैप कोर्सेट लॉन्गलाइन और हेवी एम्ब्रॉयडरी फेस्टिव फिनिश।\n\nब्राइडल और पार्टी-वियर ब्लाउज ऑफर करने वाली बुटीक ओनर्स के लिए उपयुक्त।",
    includes: [
      "2-week vintage blouse add-on module",
      "20+ Madhubala-inspired designer styles",
      "Sweetheart, halter, puff sleeve & corset constructions",
      "Dori, latkan & circular back cutout finishing",
      "100% practical boutique training",
      "Certificate on module completion",
      "Add-on after Blouse & Suit or Advanced Blouse Making",
    ],
    includes_hi: [
      "2 सप्ताह का विंटेज ब्लाउज ऐड-ऑन मॉड्यूल",
      "20+ मधुबाला-इंस्पायर्ड डिज़ाइनर स्टाइल",
      "स्वीटहार्ट, हाल्टर, पफ स्लीव और कोर्सेट कंस्ट्रक्शन",
      "डोरी, लटकन और सर्कुलर बैक कटआउट फिनिशिंग",
      "100% प्रैक्टिकल बुटीक ट्रेनिंग",
      "मॉड्यूल पूरा करने पर सर्टिफिकेट",
      "ब्लाउज और सूट या एडवांस ब्लाउज के बाद ऐड-ऑन",
    ],
    syllabus: [
      "Module 1 — Madhubala blouse heritage: style overview, measurement & vintage fit basics",
      "Module 2 — Sweetheart neck blouse with zari border short sleeves",
      "Module 3 — Deep U-back blouse with shoulder dori tie-up",
      "Module 4 — Square-back classic dori blouse (checkered & solid fabrics)",
      "Module 5 — Backless criss-cross string back blouse",
      "Module 6 — Circular cutout back with dual dori ties & beaded border",
      "Module 7 — Halter-neck gold striped blouse with deep back opening",
      "Module 8 — Puff-sleeve blouse with circular back cutout",
      "Module 9 — Corset-style longline blouse with chain strap detail",
      "Module 10 — Pink sweetheart blouse with zari sleeve border",
      "Module 11 — Red circular open-back blouse with latkan finishing",
      "Module 12 — Purple backless multi-string designer blouse",
      "Module 13 — Gold puff-sleeve heritage blouse with scalloped border",
      "Module 14 — Heavy embroidery vintage blouse & boutique finishing",
      "Module 15 — Final Madhubala-style designer blouse project",
    ],
    preview_video: "",
    image: LOCAL_IMGS[0],
  },
  {
    id: "c13",
    slug: "rajwadi-blouse-course",
    title: "Rajwadi Blouse Course",
    titleHi: "राजवाड़ी ब्लाउज कोर्स",
    category: "Blouse Making",
    price: 2999, // TODO(owner): confirm starting price
    duration: "2 weeks",
    language: "Hindi",
    published: true,
    is_addon: true,
    addon_for: ["blouse-suit-making-course", "advanced-blouse-making-course"],
    badge: "addon",
    course_pdf: "/courses/pdfs/Rajwadi Blouse Course.pdf",
    description:
      "Royal heritage add-on — mirror work, heavy zari, cowrie shell embellishment, criss-cross backs and Rajwadi boutique blouse construction.",
    description_hi:
      "रॉयल हेरिटेज ऐड-ऑन — मिरर वर्क, हेवी ज़री, कौड़ी शेल एम्बेलिशमेंट, क्रिस-क्रॉस बैक और राजवाड़ी बुटीक ब्लाउज कंस्ट्रक्शन।",
    about:
      "The Rajwadi Blouse Course is a premium add-on for designers who want to master royal heritage blouse styles — where tradition, mirror work and timeless elegance come together.\n\nFrom our Rajwadi design collection you will learn: mirror-work one-shoulder backless blouses, halter keyhole necks with X-cross strap backs, boat-neck blouses with lace-up criss-cross backs, multi-colour geometric mirror blouses, heavy zari lattice criss-cross back designs, cowrie shell and mirror-work panel blouses, elephant-charm tassel back details, ethnic halter blouses with embroidered borders, and festive Rajwadi finishing with latkan and piping.\n\nIdeal for bridal, festive and high-value boutique orders. Best taken after Blouse & Suit Making or Advanced Blouse Making.",
    about_hi:
      "राजवाड़ी ब्लाउज कोर्स प्रीमियम ऐड-ऑन है उन डिज़ाइनर्स के लिए जो रॉयल हेरिटेज ब्लाउज स्टाइल में मास्टर बनना चाहती हैं — जहाँ परंपरा, मिरर वर्क और टाइमलेस एलिगेंस मिलते हैं।\n\nहमारे Rajwadi कलेक्शन से आप सीखेंगी: मिरर-वर्क वन-शोल्डर बैकलेस, हाल्टर कीहोल विद एक्स-क्रॉस स्ट्रैप बैक, बोट नेक लेस-अप क्रिस-क्रॉस बैक, मल्टी-कलर ज्योमेट्रिक मिरर, हेवी ज़री लैटिस क्रिस-क्रॉस बैक, कौड़ी शेल पैनल, हाथी चार्म टसेल बैक, एथनिक हाल्टर एम्ब्रॉयडरी बॉर्डर और लटकन-पाइपिंग फिनिशिंग।\n\nब्राइडल, फेस्टिव और हाई-वैल्यू बुटीक ऑर्डर के लिए उपयुक्त।",
    includes: [
      "2-week Rajwadi heritage add-on module",
      "25+ royal blouse styles from our collection",
      "Mirror work, zari lattice & cowrie shell techniques",
      "One-shoulder, halter & boat-neck Rajwadi cuts",
      "Criss-cross dori & lattice back constructions",
      "Certificate on module completion",
      "Add-on after Blouse & Suit or Advanced Blouse Making",
    ],
    includes_hi: [
      "2 सप्ताह का राजवाड़ी हेरिटेज ऐड-ऑन मॉड्यूल",
      "कलेक्शन से 25+ रॉयल ब्लाउज स्टाइल",
      "मिरर वर्क, ज़री लैटिस और कौड़ी शेल तकनीक",
      "वन-शोल्डर, हाल्टर और बोट नेक राजवाड़ी कट",
      "क्रिस-क्रॉस डोरी और लैटिस बैक कंस्ट्रक्शन",
      "मॉड्यूल पूरा करने पर सर्टिफिकेट",
      "ब्लाउज और सूट या एडवांस ब्लाउज के बाद ऐड-ऑन",
    ],
    syllabus: [
      "Module 1 — Rajwadi heritage intro: royal styles, fabrics & measurement basics",
      "Module 2 — Mirror-work one-shoulder backless ethnic blouse",
      "Module 3 — Halter keyhole neck with X-cross strap back",
      "Module 4 — Boat-neck blouse with lace-up criss-cross back",
      "Module 5 — Multi-colour geometric mirror-work blouse",
      "Module 6 — Heavy zari lattice criss-cross back design",
      "Module 7 — Cowrie shell & mirror-work panel blouse",
      "Module 8 — Elephant-charm tassel back detail blouse",
      "Module 9 — Blue halter ethnic blouse with embroidered border",
      "Module 10 — Orange heavy embroidery Rajwadi V-neck blouse",
      "Module 11 — Sweetheart zari border with lattice back blouse",
      "Module 12 — Festive multi-colour striped backless blouse",
      "Module 13 — Deep V ethnic print Rajwadi blouse",
      "Module 14 — Royal finishing: latkan, piping & boutique polish",
      "Module 15 — Final Rajwadi designer blouse project",
    ],
    preview_video: "",
    image: LOCAL_IMGS[0],
  },
  {
    id: "c14",
    slug: "sleeveless-blouse-course",
    title: "Sleeveless Blouse Course",
    titleHi: "स्लीवलेस ब्लाउज कोर्स",
    category: "Blouse Making",
    price: 2499, // TODO(owner): confirm starting price
    duration: "10 days",
    language: "Hindi",
    published: true,
    is_addon: true,
    addon_for: ["blouse-suit-making-course", "advanced-blouse-making-course"],
    badge: "addon",
    course_pdf: "/courses/pdfs/sleevless Blouse  Course.pdf",
    description:
      "Focused add-on for sleeveless blouses — V-neck, scoop, spaghetti strap, wide strap, teardrop back and boutique armhole finishing.",
    description_hi:
      "स्लीवलेस ब्लाउज के लिए फोकस्ड ऐड-ऑन — वी-नेक, स्कूप, स्पेगेटी स्ट्रैप, वाइड स्ट्रैप, टियरड्रॉप बैक और बुटीक आर्महोल फिनिशिंग।",
    about:
      "The Sleeveless Blouse Course is a short, practical add-on for students who want to specialise in sleeveless choli construction — one of the most requested styles for sarees, lehengas and summer festive wear.\n\nFrom our Sleeveless Blouse design brochure you will master: V-neck sleeveless basics, wide-strap scoop neck blouses, spaghetti-strap sweetheart styles, deep V-back sleeveless cuts, teardrop keyhole back designs, round neck blouses with bead trim, vertical embroidered sleeveless patterns, brocade strapless blouses, patchwork ethnic sleeveless styles, and floral brocade sweetheart blouses with dori-back finishing.\n\nIncludes clean armhole finishing, strap placement, lining options and boutique-quality fit. Recommended after basic blouse training.",
    about_hi:
      "स्लीवलेस ब्लाउज कोर्स एक छोटा, प्रैक्टिकल ऐड-ऑन है उन छात्राओं के लिए जो स्लीवलेस चोली कंस्ट्रक्शन में स्पेशलाइज़ करना चाहती हैं — साड़ी, लहंगा और समर फेस्टिव वियर की सबसे ज़्यादा डिमांड वाली स्टाइल।\n\nहमारे Sleeveless Blouse ब्रोशर से आप सीखेंगी: वी-नेक बेसिक, वाइड-स्ट्रैप स्कूप नेक, स्पेगेटी स्ट्रैप स्वीटहार्ट, डीप वी-बैक, टियरड्रॉप कीहोल बैक, बीड ट्रिम राउंड नेक, वर्टिकल एम्ब्रॉयडरी, ब्रोकेड स्ट्रैपलेस, पैचवर्क एथनिक और फ्लोरल ब्रोकेड डोरी-बैक फिनिशिंग।\n\nक्लीन आर्महोल, स्ट्रैप प्लेसमेंट, लाइनिंग और बुटीक फिट शामिल।",
    includes: [
      "10-day sleeveless blouse add-on module",
      "10+ sleeveless styles from our design collection",
      "V-neck, scoop, sweetheart & strapless cuts",
      "Clean armhole & strap finishing techniques",
      "Teardrop & deep V-back sleeveless designs",
      "Certificate on module completion",
      "Add-on after Blouse & Suit or Advanced Blouse Making",
    ],
    includes_hi: [
      "10 दिन का स्लीवलेस ब्लाउज ऐड-ऑन मॉड्यूल",
      "कलेक्शन से 10+ स्लीवलेस स्टाइल",
      "वी-नेक, स्कूप, स्वीटहार्ट और स्ट्रैपलेस कट",
      "क्लीन आर्महोल और स्ट्रैप फिनिशिंग तकनीक",
      "टियरड्रॉप और डीप वी-बैक स्लीवलेस डिज़ाइन",
      "मॉड्यूल पूरा करने पर सर्टिफिकेट",
      "ब्लाउज और सूट या एडवांस ब्लाउज के बाद ऐड-ऑन",
    ],
    syllabus: [
      "Day 1 — Sleeveless blouse fundamentals: measurement, armhole drafting & strap types",
      "Day 2 — V-neck sleeveless blouse: wide strap & clean armhole finish",
      "Day 3 — Scoop neck blouse with bead-trim border",
      "Day 4 — Spaghetti-strap sweetheart sleeveless blouse",
      "Day 5 — Deep V-back sleeveless blouse with dori tie",
      "Day 6 — Teardrop keyhole back sleeveless blouse with tassels",
      "Day 7 — Vertical embroidered sleeveless pattern blouse",
      "Day 8 — Brocade strapless & patchwork ethnic sleeveless blouse",
      "Day 9 — Floral brocade sweetheart with dori-back finishing",
      "Day 10 — Final sleeveless designer blouse project & assessment",
    ],
    preview_video: "",
    image: LOCAL_IMGS[0],
  },
  {
    id: "c15",
    slug: "backless-blouse-course",
    title: "Backless Blouse Course",
    titleHi: "बैकलेस ब्लाउज कोर्स",
    category: "Blouse Making",
    price: 2499, // TODO(owner): confirm starting price
    duration: "2 weeks",
    language: "Hindi",
    published: true,
    is_addon: true,
    addon_for: ["blouse-suit-making-course", "advanced-blouse-making-course"],
    badge: "addon",
    course_pdf: "/courses/pdfs/Backless Blouse Course.pdf",
    description:
      "Premium add-on for backless designer blouses — halter, circular cutout, criss-cross dori, keyhole neck, latkan finishing and bridal-ready backs.",
    description_hi:
      "बैकलेस डिज़ाइनर ब्लाउज के लिए प्रीमियम ऐड-ऑन — हाल्टर, सर्कुलर कटआउट, क्रिस-क्रॉस डोरी, कीहोल नेक, लटकन फिनिशिंग और ब्राइडल-रेडी बैक।",
    about:
      "The Backless Blouse Course is a premium add-on for boutique designers who want to confidently create fearless, elegant backless blouses — handcrafted heritage with timeless beauty.\n\nFrom our Backless Blouse Designs brochure you will learn: halter teardrop backs with chain accents, circular open-back cutouts, bralette-style thin-strap X-backs, deep scoop U-backs with dori and latkan, keyhole neck with circular back openings, criss-cross dori lattice backs, velvet choker collar with circular cutout, teardrop window backs with peacock embroidery, sheer-panel halter backs with bow tassels, boat-neck deep back windows, cold-shoulder net sleeve backless styles, and multi-string horizontal lace-up backs.\n\nCelebrate tradition, embrace elegance — perfect for bridal, reception and designer boutique orders after basic blouse training.",
    about_hi:
      "बैकलेस ब्लाउज कोर्स प्रीमियम ऐड-ऑन है बुटीक डिज़ाइनर्स के लिए जो फियरलेस, एलिगेंट बैकलेस ब्लाउज बनाना चाहती हैं — हैंडक्राफ्टेड हेरिटेज, टाइमलेस ब्यूटी।\n\nहमारे Backless Blouse Designs ब्रोशर से आप सीखेंगी: हाल्टर टियरड्रॉप चेन एक्सेंट, सर्कुलर ओपन-बैक, ब्रालेट थिन-स्ट्रैप एक्स-बैक, डीप स्कूप डोरी-लटकन, कीहोल नेक सर्कुलर बैक, क्रिस-क्रॉस डोरी लैटिस, वेल्वेट चोकर कॉलर कटआउट, पीकॉक एम्ब्रॉयडरी टियरड्रॉप विंडो, शीयर हाल्टर बो टसेल, बोट नेक डीप बैक विंडो, कोल्ड-शोल्डर नेट स्लीव और मल्टी-स्ट्रिंग लेस-अप बैक।\n\nब्राइडल, रिसेप्शन और डिज़ाइनर बुटीक ऑर्डर के लिए उपयुक्त।",
    includes: [
      "2-week backless blouse add-on module",
      "20+ backless designer styles from our collection",
      "Halter, circular cutout, lattice & lace-up backs",
      "Dori, latkan, chain & tassel finishing",
      "Bridal-ready backless construction techniques",
      "Certificate on module completion",
      "Add-on after Blouse & Suit or Advanced Blouse Making",
    ],
    includes_hi: [
      "2 सप्ताह का बैकलेस ब्लाउज ऐड-ऑन मॉड्यूल",
      "कलेक्शन से 20+ बैकलेस डिज़ाइनर स्टाइल",
      "हाल्टर, सर्कुलर कटआउट, लैटिस और लेस-अप बैक",
      "डोरी, लटकन, चेन और टसेल फिनिशिंग",
      "ब्राइडल-रेडी बैकलेस कंस्ट्रक्शन तकनीक",
      "मॉड्यूल पूरा करने पर सर्टिफिकेट",
      "ब्लाउज और सूट या एडवांस ब्लाउज के बाद ऐड-ऑन",
    ],
    syllabus: [
      "Module 1 — Backless blouse fundamentals: support, fit & back opening types",
      "Module 2 — Halter teardrop back with chain accent detail",
      "Module 3 — Circular open-back cutout blouse",
      "Module 4 — Bralette thin-strap X-cross back blouse",
      "Module 5 — Deep scoop U-back with dori tie & latkan",
      "Module 6 — Keyhole neck with circular back opening",
      "Module 7 — Criss-cross dori lattice back design",
      "Module 8 — Velvet choker collar with circular cutout back",
      "Module 9 — Teardrop window back with peacock embroidery",
      "Module 10 — Sheer-panel halter back with bow tassel finishing",
      "Module 11 — Boat-neck deep back window blouse",
      "Module 12 — Cold-shoulder net sleeve backless blouse",
      "Module 13 — Multi-string horizontal lace-up back",
      "Module 14 — Royal blue zari deep U-back with latkan",
      "Module 15 — Final backless designer blouse project & assessment",
    ],
    preview_video: "",
    image: LOCAL_IMGS[0],
  },
];

export const COURSE_CATEGORIES = ["All", "Boutique", "Blouse Making", "Stitching", "Fashion Design"];

export const COURSE_WA_OPTIONS = [
  ...COURSES.map((c) => ({ en: c.title, hi: c.titleHi || c.title })),
  { en: "Not sure — need guidance", hi: "पक्का नहीं — गाइडेंस चाहिए" },
];

export const PORTFOLIO = [
  { id: "g1", title: "Bridal Lehenga — Maroon & Gold", slug: "bridal-lehenga-maroon-gold", category: "Bridal", image: LOCAL_IMGS[0], sort_order: 1, featured: true },
  { id: "g2", title: "Reception Gown", slug: "reception-gown", category: "Gowns", image: LOCAL_IMGS[1], sort_order: 2, featured: true },
  { id: "g3", title: "Mirror-work Blouse", slug: "mirror-work-blouse", category: "Blouses", image: LOCAL_IMGS[2], sort_order: 3, featured: true },
  { id: "g4", title: "Festive Anarkali", slug: "festive-anarkali", category: "Suits", image: LOCAL_IMGS[3], sort_order: 4, featured: true },
  { id: "g5", title: "Kundan Bridal Set", slug: "kundan-bridal-set", category: "Jewellery", image: LOCAL_IMGS[4], sort_order: 5, featured: true },
  { id: "g6", title: "Silk Saree Drape", slug: "silk-saree-drape", category: "Sarees", image: LOCAL_IMGS[5], sort_order: 6, featured: true },
  { id: "g7", title: "Embroidered Dupatta", slug: "embroidered-dupatta", category: "Bridal", image: LOCAL_IMGS[6], sort_order: 7, featured: true },
  { id: "g8", title: "Designer Blouse Back", slug: "designer-blouse-back", category: "Blouses", image: LOCAL_IMGS[7], sort_order: 8, featured: true },
  { id: "g9", title: "Pastel Mehendi Lehenga", slug: "pastel-mehendi-lehenga", category: "Bridal", image: LOCAL_IMGS[0], sort_order: 9, featured: true },
  { id: "g10", title: "Indo-Western Fusion Gown", slug: "indo-western-fusion-gown", category: "Gowns", image: LOCAL_IMGS[1], sort_order: 10, featured: true },
  { id: "g11", title: "Zardozi Potli Bag", slug: "zardozi-potli-bag", category: "Accessories", image: LOCAL_IMGS[2], sort_order: 11 },
  { id: "g12", title: "Hand-embroidered Cape Blouse", slug: "hand-embroidered-cape-blouse", category: "Blouses", image: LOCAL_IMGS[3], sort_order: 12, featured: true },
];

/**
 * Placeholder testimonials shown only when the DB is empty. `source` stays
 * "manual" so these never render the "Verified Google Review" badge — that
 * badge is reserved for rows imported from the real Google Business profile.
 */
export const TESTIMONIALS = [
  {
    id: "t1",
    name: "Ananya Sharma",
    text: "My bridal lehenga was stitched to perfection and delivered on time. The fit was flawless — I felt like a queen!",
    photo: null,
    rating: 5,
    source: "manual",
    review_url: null,
    category: "boutique",
  },
  {
    id: "t2",
    name: "Pooja Verma",
    text: "I took the fashion designing course and now run my own small boutique. The mentorship was incredible.",
    photo: null,
    rating: 5,
    source: "manual",
    review_url: null,
    category: "institute",
  },
  {
    id: "t3",
    name: "Ritu Singh",
    text: "Ordered an Anarkali on WhatsApp, got it stitched in 24 hours. So convenient and the quality is wonderful.",
    photo: null,
    rating: 5,
    source: "manual",
    review_url: null,
    category: "boutique",
  },
  {
    id: "t4",
    name: "Neha Kumari",
    text: "The training is fully practical and the faculty gives personal attention. Best decision for my career.",
    photo: null,
    rating: 5,
    source: "manual",
    review_url: null,
    category: "institute",
  },
];

export const POLICIES = {
  // TODO(owner): legal review before treating as binding
  privacy: {
    slug: "privacy",
    title: "Privacy Policy",
    titleHi: "गोपनीयता नीति",
    body: `Last updated: 2026

Shreya Creation (“we”, “us”) operates a fashion boutique and stitching institute in Patna, Bihar. This policy explains how we handle personal information when you contact us, enquire about courses, or place boutique orders via WhatsApp, phone, email, or our website forms.

1. Information we collect
We may collect your name, phone/WhatsApp number, email, preferred visit or demo date, measurements or order notes you share, and messages you send through our contact or demo forms.

2. How we use information
We use it to respond to enquiries, schedule demos/studio visits, fulfil stitching or boutique orders, share course admission details, and improve our services. We do not sell your personal data.

3. Sharing
We may share details only with service providers needed to deliver an order (e.g. courier) or when required by law. WhatsApp messages are processed under Meta’s terms when you chat with us on that platform.

4. Retention
Enquiry records may be kept for follow-up and business records. You may request correction or deletion by contacting us.

5. Contact
For privacy requests: use the email and phone listed on our Contact page, or message us on WhatsApp.`,
    bodyHi: `अंतिम अपडेट: 2026

श्रेया क्रिएशन पटना में बुटीक और सिलाई संस्थान चलाता है। WhatsApp, फोन, ईमेल या वेबसाइट फॉर्म से संपर्क करने पर हम नाम, फोन, ईमेल और आपके संदेश एकत्र कर सकते हैं — केवल पूछताछ, डेमो, ऑर्डर और कोर्स प्रवेश के लिए। हम आपका डेटा नहीं बेचते। गोपनीयता अनुरोध के लिए Contact पेज या WhatsApp से संपर्क करें।`,
  },
  shipping: {
    slug: "shipping",
    title: "Shipping & Delivery",
    titleHi: "शिपिंग और डिलीवरी",
    body: `Last updated: 2026

1. Boutique & custom stitching
Delivery or pickup timelines are confirmed on WhatsApp after we agree design, fabric, measurements, and payment terms. Express stitching (often within 24 hours for eligible styles) depends on design complexity and fabric availability — we will confirm before starting work.

2. Local pickup
You may collect finished garments from our Patna studio during studio hours. Bring a booking reference or WhatsApp confirmation.

3. Courier / outstation
Where courier is arranged, charges, packing, and estimated transit time are shared before dispatch. Report transit damage promptly with photos.

4. Courses
Course materials (if any) are provided at the institute unless separately agreed.`,
    bodyHi: `अंतिम अपडेट: 2026

बुटीक/कस्टम सिलाई की डिलीवरी या पिकअप का समय माप, डिज़ाइन और पेमेंट तय होने के बाद WhatsApp पर कन्फर्म होता है। पात्र स्टाइल के लिए अक्सर 24 घंटे एक्सप्रेस सिलाई संभव है। पटना स्टूडियो से पिकअप स्टूडियो समय में कर सकते हैं।`,
  },
  returns: {
    slug: "returns",
    title: "Returns & Refunds",
    titleHi: "रिटर्न और रिफंड",
    body: `Last updated: 2026

1. Made-to-measure / bespoke garments
Custom-stitched outfits are made to your measurements and design choices. They are generally not returnable for a refund once cutting/stitching has begun, except where we made a clear error (wrong design agreed in chat, or defective workmanship).

2. Alterations
Minor fit adjustments may be offered within 7 days of delivery/pickup for items we stitched, subject to fabric limits.

3. Ready / display pieces
If a non-custom piece is sold as-is, return eligibility (if any) will be stated in your WhatsApp order confirmation.

4. Refunds
Where a refund is agreed, it is processed via the original payment method or UPI within a reasonable period after inspection.

5. How to raise a request
Message us on WhatsApp with order details and photos within the timelines above.`,
    bodyHi: `अंतिम अपडेट: 2026

माप पर सिले कपड़े आमतौर पर कटिंग/सिलाई शुरू होने के बाद रिफंड के लिए वापस नहीं होते — सिवाय स्पष्ट गलती या खराब कारीगरी के। मामूली अल्टरेशन अक्सर डिलीवरी/पिकअप के 7 दिनों के भीतर संभव हैं।`,
  },
  terms: {
    slug: "terms",
    title: "Terms & Conditions",
    titleHi: "नियम और शर्तें",
    body: `Last updated: 2026

// TODO(owner): legal review before treating as binding

1. About us
Shreya Creation is a fashion boutique and stitching/fashion training institute in Patna, Bihar. Website content is for information; orders and admissions are confirmed via WhatsApp, phone, or in person.

2. No online checkout
Product pages and course pages do not process card/UPI payments on this website. Pricing, deposits, and fees are agreed in chat or at the studio.

3. Accurate information
You agree to provide accurate contact and measurement details. Delays or remakes caused by incorrect information may incur extra charges.

4. Intellectual property
Photos, course outlines, and site copy belong to Shreya Creation. Do not reuse without permission.

5. Limitation
We are not liable for delays caused by fabric shortage, courier failure, or force majeure. Liability for boutique work is limited to repair, remake, or refund as agreed for that order.

6. Governing law
These terms are governed by the laws of India. Disputes are subject to courts in Patna, Bihar, unless otherwise required by law.

7. Contact
Use the Contact page details or WhatsApp for questions about these terms.`,
    bodyHi: `अंतिम अपडेट: 2026

श्रेया क्रिएशन पटना का बुटीक और प्रशिक्षण संस्थान है। वेबसाइट पर ऑनलाइन चेकआउट नहीं है — ऑर्डर और फीस WhatsApp/स्टूडियो पर तय होते हैं। कानून भारत के अनुसार; विवाद पटना क्षेत्राधिकार।`,
  },
  "course-cancellation": {
    slug: "course-cancellation",
    title: "Course Cancellation & Refund",
    titleHi: "कोर्स रद्दीकरण और रिफंड",
    body: `Last updated: 2026

// TODO(owner): confirm deposit %, notice period, and batch-transfer rules before publishing as final.

1. Enrolment
A seat is confirmed after counselling, form submission, and fee/deposit payment as communicated at admission.

2. Cancellation by student
- Before batch start: write to us (WhatsApp/email) at least 7 days before the stated start date. Deposit handling will be confirmed in writing for your enrolment.
- After batch start: fees are generally non-refundable once classes have begun, except at management discretion for documented medical or exceptional cases.

3. Batch transfer
Subject to availability, you may request transfer to a later batch of the same course.

4. Cancellation by institute
If we cancel a batch, you may choose a full refund of fees paid for that batch or transfer to another batch/date.

5. Demo class
Free demo sessions do not create an enrolment obligation. Demo slots may be limited.

6. Certificates
Certificates (where offered) are issued after successful completion of attendance/assessment requirements stated for that course.`,
    bodyHi: `अंतिम अपडेट: 2026

बैच शुरू होने से कम से कम 7 दिन पहले लिखित रद्दीकरण पर जमा/फीस की स्थिति लिखित में बताई जाएगी। कक्षाएँ शुरू होने के बाद फीस आमतौर पर वापस नहीं होती। संस्थान द्वारा बैच रद्द होने पर रिफंड या ट्रांसफर का विकल्प मिलेगा।`,
  },
};

/** Blog / lookbook posts — used when Supabase has none published yet. */
export const LOOKBOOK = [
  {
    id: "lb0",
    title: "Shreya Creation: Fashion Designing Institute & Designer Boutique in Patna",
    title_hi: "श्रेया क्रिएशन: पटना में फैशन डिजाइनिंग इंस्टीट्यूट और डिजाइनर बुटीक",
    slug: "fashion-designing-institute-designer-boutique-patna",
    excerpt:
      "Looking for a fashion designing institute or designer boutique in Patna? Discover Shreya Creation for practical fashion courses, boutique training, bridal wear, designer blouse, lehenga stitching, custom outfits and NRI fashion services.",
    excerpt_hi:
      "पटना में फैशन डिजाइनिंग इंस्टीट्यूट या डिजाइनर बुटीक खोज रहे हैं? श्रेया क्रिएशन में प्रैक्टिकल फैशन डिजाइनिंग कोर्स, बुटीक ट्रेनिंग, ब्राइडल वियर, डिजाइनर ब्लाउज, लहंगा स्टिचिंग और कस्टम आउटफिट सेवाएं उपलब्ध हैं.",
    body: "Fashion is not only about wearing beautiful clothes. A perfect outfit is a combination of good design, accurate fitting, comfort and confidence.\n\nAt Shreya Creation on Boring Road, Patna, we run a fashion designing institute and designer boutique — practical courses, boutique training, bridal wear, designer blouses, lehenga stitching, custom outfits and NRI fashion services.\n\nWhether you want to learn fashion designing or get a custom outfit stitched, our atelier connects skills training with real boutique work.",
    body_hi:
      "फैशन सिर्फ सुंदर कपड़े पहनना नहीं है। परफेक्ट आउटफिट अच्छे डिज़ाइन, सही फिटिंग, आराम और कॉन्फिडेंस का मेल है।\n\nबोरिंग रोड, पटना पर श्रेया क्रिएशन फैशन डिजाइनिंग इंस्टीट्यूट और डिजाइनर बुटीक दोनों चलाता है — प्रैक्टिकल कोर्स, बुटीक ट्रेनिंग, ब्राइडल वियर, डिजाइनर ब्लाउज, लहंगा स्टिचिंग, कस्टम आउटफिट और NRI सेवाएँ।\n\nचाहे आप फैशन डिजाइनिंग सीखना चाहें या कस्टम आउटफिट सिलवाना चाहें, हमारा एटेलियर स्किल ट्रेनिंग को असली बुटीक काम से जोड़ता है।",
    image: LOCAL_IMGS[3],
    image_alt: "Fashion designing institute and designer boutique in Patna – Shreya Creation",
    focus_keyword: "fashion designing institute designer boutique Patna",
    published: true,
    created_at: "2026-08-22T05:51:22.000Z",
  },
  {
    id: "lb1",
    title: "Independence Day Special: Fashion, Boutiques & Women’s Freedom",
    title_hi: "स्वतंत्रता दिवस विशेष: फैशन, बुटीक और महिलाओं की आज़ादी",
    slug: "independence-day-fashion-boutiques-womens-freedom",
    excerpt:
      "This Independence Day, explore how fashion boutiques, ladies tailors and women entrepreneurs are turning creativity and stitching skills into confidence, self-reliance and new opportunities in Patna.",
    excerpt_hi:
      "इस स्वतंत्रता दिवस जानिए कि कैसे फैशन बुटीक, लेडीज टेलर और महिला उद्यमी सिलाई व डिजाइनिंग के हुनर को आत्मविश्वास, आत्मनिर्भरता और नए अवसरों में बदल रही हैं।",
    body: "Independence Day reminds us that freedom is not only political — it is also economic, creative and personal.\n\nAcross Patna and India, boutique owners, ladies tailors and fashion designers help women build skills, earn with dignity and express identity through clothing. From custom blouses and bridal lehengas to fashion designing courses, local ateliers turn talent into livelihood.\n\nAt Shreya Creation on Boring Road, we see students and clients choose fashion as a path to self-reliance — learning stitching, starting small orders on WhatsApp, and growing into confident creators.\n\nThis Independence Day, celebrate the women who stitch, design and lead — and explore how boutique fashion and practical training can support your own journey.",
    body_hi:
      "स्वतंत्रता दिवस हमें याद दिलाता है कि आज़ादी सिर्फ राजनीतिक नहीं — आर्थिक, रचनात्मक और व्यक्तिगत भी है।\n\nपटना और पूरे भारत में बुटीक मालिक, ladies tailors और fashion designers महिलाओं को skill, सम्मानजनक कमाई और कपड़ों से पहचान बनाने में मदद करते हैं। कस्टम ब्लाउज और ब्राइडल लहंगे से लेकर fashion designing courses तक, local ateliers प्रतिभा को रोज़गार में बदलते हैं।\n\nShreya Creation, Boring Road पर हम देखते हैं कि छात्राएँ और clients fashion को आत्मनिर्भरता का रास्ता चुनती हैं — सिलाई सीखना, WhatsApp पर छोटे orders और confident creator बनना।\n\nइस स्वतंत्रता दिवस, उन महिलाओं का सम्मान करें जो सिलती, डिज़ाइन करती और lead करती हैं — और जानें कि boutique fashion और practical training आपकी journey में कैसे मदद कर सकते हैं।",
    image: LOCAL_IMGS[2],
    image_alt: "Fashion boutique and women's freedom Independence Day special Patna",
    focus_keyword: "fashion boutique women's freedom Independence Day Patna",
    published: true,
    created_at: "2026-06-01T10:00:00.000Z",
  },
  {
    id: "lb2",
    title: "How we take NRI measurements on WhatsApp",
    title_hi: "NRI क्लाइंट्स के माप WhatsApp पर कैसे लेते हैं",
    slug: "nri-whatsapp-measurements",
    excerpt:
      "A simple photo + tape guide so families abroad can order bridal and festive wear from our Boring Road atelier with confidence.",
    excerpt_hi:
      "सरल फोटो और टेप गाइड — विदेश में परिवार बोरिंग रोड एटेलियर से ब्राइडल और फेस्टिव वियर आत्मविश्वास से ऑर्डर कर सकें।",
    body: "NRI clients often order bridal and festive wear without visiting the studio. We guide measurements over WhatsApp with clear photo angles and a soft tape.\n\nYou send front, side and back photos plus bust, waist, hip and blouse length. We confirm fabric, design and timeline before stitching begins.\n\nFamilies in India can also collect or ship the finished piece — ask us for the current process.",
    body_hi:
      "NRI क्लाइंट अक्सर स्टूडियो आए बिना ब्राइडल और फेस्टिव वियर ऑर्डर करते हैं। हम WhatsApp पर फोटो एंगल और सॉफ्ट टेप से माप गाइड करते हैं।\n\nसामने, साइड और बैक फोटो के साथ बस्ट, कमर, हिप और ब्लाउज लंबाई भेजें। सिलाई से पहले कपड़ा, डिज़ाइन और टाइमलाइन कन्फर्म होती है।\n\nभारत में परिवार कलेक्ट या शिप भी कर सकते हैं — वर्तमान प्रोसेस पूछें।",
    image: LOCAL_IMGS[0],
    image_alt: "NRI WhatsApp measurement guide for custom stitching Patna",
    focus_keyword: "NRI measurements WhatsApp stitching Patna",
    published: true,
    created_at: "2026-05-18T10:00:00.000Z",
  },
  {
    id: "lb3",
    title: "24-hour express stitching: what qualifies",
    title_hi: "24 घंटे एक्सप्रेस सिलाई: किन स्टाइल पर लागू",
    slug: "24-hour-express-stitching",
    excerpt:
      "Which blouse, suit and lehenga styles we can often finish in a day — and when you should allow extra time for heavy embroidery.",
    excerpt_hi:
      "कौन से ब्लाउज, सूट और लहंगा अक्सर एक दिन में तैयार — और भारी कढ़ाई के लिए कब अतिरिक्त समय रखें।",
    body: "Many blouse and suit styles can be finished within 24 hours when fabric is ready and the design is clear.\n\nHeavy zardozi, dense aari panels or multi-piece bridal sets need more time. Share your event date early so we can plan express slots honestly.\n\nConfirm express availability on WhatsApp with your reference look and measurements.",
    body_hi:
      "कई ब्लाउज और सूट स्टाइल 24 घंटे में तैयार हो सकते हैं जब कपड़ा तैयार हो और डिज़ाइन साफ हो।\n\nभारी ज़रदोज़ी, घनी आरी या मल्टी-पीस ब्राइडल सेट को ज़्यादा समय लगता है। इवेंट डेट जल्दी बताएँ ताकि एक्सप्रेस स्लॉट सही प्लान हो।\n\nरेफरेंस लुक और माप के साथ WhatsApp पर एक्सप्रेस उपलब्धता कन्फर्म करें।",
    image: LOCAL_IMGS[1],
    image_alt: "24-hour express stitching at Shreya Creation Patna",
    focus_keyword: "24 hour stitching Patna",
    published: true,
    created_at: "2026-05-02T10:00:00.000Z",
  },
  {
    id: "lb4",
    title: "Reception gown silhouettes for Indian weddings",
    title_hi: "भारतीय शादियों के लिए रिसेप्शन गाउन सिल्हूट",
    slug: "reception-gown-silhouettes",
    excerpt:
      "Floor-length, cape, and Indo-western fusion options we craft for reception nights — fabric picks that move well on the dance floor.",
    excerpt_hi:
      "फ्लोर-लेंथ, केप और इंडो-वेस्टर्न फ़्यूज़न — रिसेप्शन के लिए गाउन, और डांस फ्लोर पर अच्छे लगने वाले कपड़े।",
    body: "Reception nights call for movement — floor-length gowns, cape overlays and Indo-western fusion cuts that photograph well under lights.\n\nWe help pick fabrics that drape without clinging, and finishes that survive a long evening of dance and photos.\n\nBring your jewellery plan; neckline and sleeve choices should balance the rest of the look.",
    body_hi:
      "रिसेप्शन रात में मूवमेंट ज़रूरी है — फ्लोर-लेंथ गाउन, केप और इंडो-वेस्टर्न कट जो लाइट में अच्छे फोटो आएँ।\n\nहम ऐसे कपड़े चुनने में मदद करते हैं जो चिपकें नहीं, और लंबी शाम की डांस-फोटो के लिए फिनिश टिके।\n\nज्वेलरी प्लान साथ लाएँ; नेकलाइन और स्लीव बाकी लुक से मैच करें।",
    image: LOCAL_IMGS[4],
    image_alt: "Reception gown silhouettes for Indian weddings Patna",
    focus_keyword: "reception gown Indian wedding Patna",
    published: true,
    created_at: "2026-04-12T10:00:00.000Z",
  },
  {
    id: "lb5",
    title: "From first stitch to first client: student stories",
    title_hi: "पहली सिलाई से पहले क्लाइंट तक: छात्राओं की कहानियाँ",
    slug: "student-success-stories",
    excerpt:
      "How boutique course graduates turn practice pieces into paid orders — and the mentorship path we follow at the institute.",
    excerpt_hi:
      "बुटीक कोर्स ग्रेजुएट प्रैक्टिस पीस से पेड ऑर्डर तक कैसे पहुँचते हैं — और संस्थान में मेंटरशिप का रास्ता।",
    body: "Boutique course students start with practice pieces, then learn fittings, finishing and client communication.\n\nMany graduates take small WhatsApp orders while still training, with mentor feedback on fit and pricing.\n\nIf you want a job or your own boutique, ask about current batches and the free demo on WhatsApp.",
    body_hi:
      "बुटीक कोर्स की छात्राएँ प्रैक्टिस पीस से शुरू करती हैं, फिर फिटिंग, फिनिशिंग और क्लाइंट कम्युनिकेशन सीखती हैं।\n\nकई ग्रेजुएट ट्रेनिंग के दौरान छोटे WhatsApp ऑर्डर लेती हैं, फिट और प्राइसिंग पर मेंटर फीडबैक के साथ।\n\nजॉब या अपना बुटीक चाहिए तो वर्तमान बैच और मुफ़्त डेमो WhatsApp पर पूछें।",
    image: LOCAL_IMGS[6],
    image_alt: "Boutique course student success stories Patna",
    focus_keyword: "boutique course Patna student stories",
    published: true,
    created_at: "2026-03-28T10:00:00.000Z",
  },
  {
    id: "lb6",
    title: "Zardozi vs aari: choosing embroidery for bridal wear",
    title_hi: "ज़रदोज़ी बनाम आरी: ब्राइडल कढ़ाई कैसे चुनें",
    slug: "zardozi-vs-aari-embroidery",
    excerpt:
      "Weight, shine and timeline differences — so you pick the right handwork for lehenga panels, blouses and dupattas.",
    excerpt_hi:
      "वज़न, चमक और टाइमलाइन का फर्क — लहंगा पैनल, ब्लाउज और दुपट्टे के लिए सही हैंडवर्क चुनें।",
    body: "Zardozi brings heavier metallic shine; aari is often finer and faster on large panels. The right choice depends on fabric weight, budget and event timeline.\n\nFor blouses we often mix both — denser work near the neckline, lighter fill on sleeves.\n\nShare your fabric and date; we will recommend handwork that will not overpower the silhouette.",
    body_hi:
      "ज़रदोज़ी में भारी मेटैलिक चमक होती है; आरी अक्सर बड़े पैनल पर बारीक और तेज़ होती है। सही चुनाव कपड़े के वज़न, बजट और इवेंट टाइमलाइन पर निर्भर करता है।\n\nब्लाउज पर अक्सर दोनों मिलाते हैं — नेकलाइन के पास घना काम, स्लीव पर हल्का।\n\nकपड़ा और डेट बताएँ; हम ऐसा हैंडवर्क सुझाएँगे जो सिल्हूट पर भारी न पड़े।",
    image: LOCAL_IMGS[5],
    image_alt: "Zardozi vs aari embroidery for bridal wear Patna",
    focus_keyword: "zardozi vs aari bridal embroidery",
    published: true,
    created_at: "2026-03-10T10:00:00.000Z",
  },
];

export const FAQS = [
  {
    q: "How do I enroll in a course?",
    a: "Our 7-step admission process: (1) Counseling & course selection, (2) Fill the admission form with your details, (3) Submit 2 passport photos, Aadhaar copy, and educational certificate if required, (4) Pay fees via cash, UPI, bank transfer, or EMI if available, (5) Receive your admission number and student ID, (6) Attend orientation & starter kit briefing, (7) Regular training begins in your assigned batch.",
    qHi: "कोर्स में एडमिशन कैसे लें?",
    aHi: "7-चरणीय प्रवेश प्रक्रिया: (1) काउंसलिंग और कोर्स चयन, (2) एडमिशन फॉर्म भरें, (3) 2 पासपोर्ट फोटो, आधार कॉपी और शैक्षणिक प्रमाणपत्र जमा करें, (4) नकद, UPI, बैंक ट्रांसफर या EMI से फीस जमा करें, (5) एडमिशन नंबर और स्टूडेंट ID प्राप्त करें, (6) ओरिएंटेशन और स्टार्टर किट, (7) निर्धारित बैच में कक्षाएँ शुरू।",
  },
  {
    q: "What are the batch timings?",
    a: "We offer three batches: Morning (9:00 AM – 12:00 PM), Afternoon (12:00 PM – 3:00 PM), and Evening (3:00 PM – 6:00 PM). Timings may vary — confirm your preferred slot on WhatsApp.",
    qHi: "बैच का समय क्या है?",
    aHi: "तीन बैच — सुबह (9:00 – 12:00), दोपहर (12:00 – 3:00), शाम (3:00 – 6:00)। WhatsApp पर अपना बैच कन्फर्म करें।",
  },
  {
    q: "What courses do you offer?",
    a: "We offer professional courses including Basic Boutique Mastery, Advanced Boutique, Western Boutique, Blouse & Suit Making, Advanced Blouse Making, Kids Wear, Western Blouse Making, Suit Making, Fashion Designing, and Lehenga Making — plus specialised blouse add-on modules. Contact us on WhatsApp for the current catalogue and fees.",
    qHi: "आप कौन-कौन से कोर्स देते हैं?",
    aHi: "हम प्रोफेशनल कोर्स देते हैं: बेसिक बुटीक मास्टरी, एडवांस्ड बुटीक, वेस्टर्न बुटीक, ब्लाउज और सूट मेकिंग, एडवांस्ड ब्लाउज मेकिंग, किड्स वियर, वेस्टर्न ब्लाउज मेकिंग, सूट मेकिंग, फैशन डिज़ाइनिंग, और लहंगा मेकिंग — साथ ही विशेष ब्लाउज ऐड-ऑन। वर्तमान सूची और फीस के लिए WhatsApp पर संपर्क करें।",
  },
  {
    q: "How do I place a boutique order?",
    a: "Browse the shop, open any product, and tap “Order on WhatsApp”. A prefilled message opens with the item details — we finish the order, measurements and payment right there in chat.",
    qHi: "बुटीक ऑर्डर कैसे करें?",
    aHi: "शॉप में प्रोडक्ट खोलें और “Order on WhatsApp” टैप करें — चैट में माप, पेमेंट और डिलीवरी तय हो जाती है।",
  },
  {
    q: "Is 24-hour express delivery really available?",
    a: "For many ready styles, yes. Express timelines depend on the design and customisation — confirm with us on WhatsApp.",
    qHi: "24 घंटे में डिलीवरी संभव है?",
    aHi: "कई स्टाइल के लिए हाँ। डिज़ाइन और कस्टमाइज़ेशन पर निर्भर — WhatsApp पर कन्फर्म करें।",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept cash, UPI, bank transfer, and EMI (if available). Course fees can be paid at the institute or via digital payment.",
    qHi: "भुगतान के कौन से विकल्प हैं?",
    aHi: "नकद, UPI, बैंक ट्रांसफर और EMI (यदि उपलब्ध)। कोर्स फीस संस्थान में या डिजिटल पेमेंट से।",
  },
];
