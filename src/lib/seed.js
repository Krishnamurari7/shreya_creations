// Fallback content used when Supabase is not yet configured, so the site looks
// complete out of the box. Once you connect Supabase and add items in /admin,
// real data takes over automatically.
//
// Image URLs here are royalty-free Unsplash placeholders. Replace them with your
// own photos via the admin panel (stored in Supabase Storage).

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

/** Canonical site stats — keep identical wording everywhere on the site. */
export const SITE_STATS = {
  yearsEn: "17+ Years",
  yearsHi: "17+ वर्ष",
  studentsEn: "2000+ Students",
  studentsHi: "2000+ छात्र",
  coursesEn: "10 Courses",
  coursesHi: "10 कोर्स",
  lineEn: "17+ Years · 2000+ Students",
  lineHi: "17+ वर्ष · 2000+ छात्र",
};

export const SITE = {
  brand: "Shreya creation",
  boutique: "From Skill to Business",
  boutiqueHi: "कौशल से कारोबार तक",
  tagline: "Stitched outfits in 24 hours",
  taglineHi: "24 घंटे में सिले कपड़े",
  intro:
    "Shreya Creation — Patna's skill development boutique and job-oriented training institute with 17+ Years of experience. We offer 10 professional courses in boutique, blouse, suit, kids wear, fashion design and lehenga — and have trained 2000+ learners in stitching, fashion design, boutique management, and self-employment.",
  introHi:
    "श्रेया क्रिएशन — 17+ वर्ष के अनुभव के साथ पटना का कौशल विकास, बुटीक और रोज़गार-उन्मुख प्रशिक्षण संस्थान। हम बुटीक, ब्लाउज, सूट, किड्स वियर, फैशन डिज़ाइन और लहंगा में 10 प्रोफेशनल कोर्स देते हैं — और सिलाई, फैशन डिज़ाइन, बुटीक प्रबंधन और स्वरोजगार में 2000+ छात्राओं को प्रशिक्षित कर चुके हैं।",
  aboutBody:
    "Founded by Sanjay Kumar Mishra, Shreya Creation is dedicated to practical skills, self-employment, and job opportunities for women and youth. We don't just teach sewing — we prepare the path to self-reliance. Our specialties include practical training, fashion designing, boutique management, job-oriented courses, and business guidance.",
  aboutBodyHi:
    "संस्थापक संजय कुमार मिश्रा के नेतृत्व में श्रेया क्रिएशन महिलाओं और युवाओं को व्यावहारिक कौशल, स्वरोजगार और रोज़गार के अवसर प्रदान करने के लिए समर्पित है। हम केवल सिलाई नहीं सिखाते, हम आत्मनिर्भरता का मार्ग तैयार करते हैं। हमारी विशेषताएँ — प्रैक्टिकल ट्रेनिंग, फैशन डिज़ाइनिंग, बुटीक मैनेजमेंट, जॉब ओरिएंटेड कोर्स और बिज़नेस गाइडेंस।",
  city: "Patna, Bihar, India",
  founded: SITE_STATS.yearsEn,
  foundedHi: SITE_STATS.yearsHi,
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919031105666",
  email: "hello@shreyacreations.in",
  phone: "+91 91175 55125 / 95073 63125",
  address: "Shreya Creation, Sisodiya Place, East Boring Canal Road, Sri Krishna Puri, Patna, Bihar 800001",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=Shreya+Creation+Sisodiya+Place+East+Boring+Canal+Road+Patna+Bihar+800001&hl=en&z=16&output=embed",
  socials: {
    instagram: "https://www.instagram.com/shreya.creationss/",
    youtube: "",
    facebook: "https://www.facebook.com/shreyascreation",
  },
  heroMarquee: [
    SITE_STATS.yearsEn,
    SITE_STATS.yearsHi,
    "कौशल से कारोबार तक",
    SITE_STATS.yearsEn,
    "BEGINNER FRIENDLY",
    "100% PRACTICAL TRAINING",
    "24 घंटे में सिले कपड़े",
  ],
};

export const TRUST = [
  {
    value: "17+",
    valueHi: "17+",
    label: "Years Experience",
    labelHi: "वर्ष अनुभव",
  },
  {
    value: "2000+",
    valueHi: "2000+",
    label: "Students Trained",
    labelHi: "प्रशिक्षित छात्र",
  },
  {
    value: "100%",
    valueHi: "100%",
    label: "Practical Training",
    labelHi: "प्रैक्टिकल ट्रेनिंग",
  },
  {
    value: "Patna",
    valueHi: "पटना",
    label: "Based in Bihar",
    labelHi: "बिहार में स्थित",
  },
];

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

const img = (id, w = 1000) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const PRODUCTS = [
  {
    id: "p1",
    slug: "royal-bridal-lehenga",
    title: "Royal Bridal Lehenga",
    category: "Lehenga",
    price: 18999,
    fabric: "Raw silk with zardozi work",
    sizes: "Custom (stitched to your measurements)",
    stitchable: true,
    published: true,
    description:
      "A hand-embroidered bridal lehenga with intricate zardozi and sequins. Made to order and stitched to your exact measurements for a flawless fit.",
    images: [img("1610030469983-98e550d6193c"), img("1583391733956-6c78276477e2")],
  },
  {
    id: "p2",
    slug: "designer-evening-gown",
    title: "Designer Evening Gown",
    category: "Gown",
    price: 8499,
    fabric: "Georgette with hand beadwork",
    sizes: "Custom fit",
    stitchable: true,
    published: true,
    description:
      "A flowing floor-length gown with delicate beadwork along the bodice. Perfect for receptions and evening events.",
    images: [img("1566174053879-31528523f8ae"), img("1572804013309-59a88b7e92f1")],
  },
  {
    id: "p3",
    slug: "embroidered-designer-blouse",
    title: "Embroidered Designer Blouse",
    category: "Blouse",
    price: 2499,
    fabric: "Silk blend",
    sizes: "Custom fit",
    stitchable: true,
    published: true,
    description:
      "Statement saree blouse with mirror and thread embroidery. Choose your neckline and sleeve style.",
    images: [img("1610189019916-3b6f1f8c2f0a"), img("1594633312681-425c7b97ccd1")],
  },
  {
    id: "p4",
    slug: "anarkali-suit-set",
    title: "Anarkali Suit Set",
    category: "Suit",
    price: 5999,
    fabric: "Chanderi cotton silk",
    sizes: "Custom fit",
    stitchable: true,
    published: true,
    description:
      "Graceful floor-length Anarkali with churidar and dupatta. Light, breathable and festive-ready.",
    images: [img("1583391733981-3c5d96f3f1c4"), img("1610030469983-98e550d6193c")],
  },
  {
    id: "p5",
    slug: "bridal-jewellery-set",
    title: "Bridal Jewellery Set",
    category: "Jewellery",
    price: 3499,
    fabric: "Kundan & pearls",
    sizes: "One size",
    stitchable: false,
    published: true,
    description:
      "Statement kundan necklace with matching earrings and maang tikka to complete the bridal look.",
    images: [img("1599643478518-a784e5dc4c8f"), img("1535632066927-ab7c9ab60908")],
  },
  {
    id: "p6",
    slug: "potli-bag",
    title: "Embellished Potli Bag",
    category: "Accessories",
    price: 899,
    fabric: "Silk with tassels",
    sizes: "One size",
    stitchable: false,
    published: true,
    description:
      "Hand-finished potli bag with beads and tassels — the perfect finishing touch for festive wear.",
    images: [img("1591561954557-26941169b49e"), img("1584917865442-de89df76afd3")],
  },
];

export const PRODUCT_CATEGORIES = ["All", "Lehenga", "Gown", "Blouse", "Suit", "Jewellery", "Accessories"];

export const COURSES = [
  {
    id: "c1",
    slug: "basic-boutique-course",
    title: "Basic Boutique Course",
    titleHi: "बेसिक बुटीक कोर्स",
    category: "Boutique",
    duration: "3 months",
    language: "Hindi",
    published: true,
    description:
      "Start your boutique journey with hands-on training in measurement, cutting, stitching, and finishing — ideal for beginners who want to work in or run a small boutique.",
    syllabus: [
      "Tailoring tools & sewing machine basics",
      "Measurement & pattern marking",
      "Salwar, kurti & basic garment stitching",
      "Boutique finishing — hemming, hooks & finishing touches",
      "Client handling & basic order workflow",
    ],
    preview_video: "",
    image: img("1581655353564-df123a1eb820"),
  },
  {
    id: "c2",
    slug: "advanced-boutique-course",
    title: "Advanced Boutique Course",
    titleHi: "एडवांस्ड बुटीक कोर्स",
    category: "Boutique",
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
    image: img("1542060748-10c28b62716f"),
  },
  {
    id: "c3",
    slug: "western-boutique-course",
    title: "Western Boutique Course",
    titleHi: "वेस्टर्न बुटीक कोर्स",
    category: "Boutique",
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
    image: img("1515372039744-b5f53e845b7e"),
  },
  {
    id: "c4",
    slug: "blouse-suit-making-course",
    title: "Blouse & Suit Making Course",
    titleHi: "ब्लाउज और सूट मेकिंग कोर्स",
    category: "Blouse Making",
    price: 4995,
    compare_price: 7999,
    badge: "bestseller",
    duration: "3 months",
    language: "Hindi",
    published: true,
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
    image: img("1610189019916-3b6f1f8c2f0a"),
  },
  {
    id: "c5",
    slug: "advanced-blouse-making-course",
    title: "Advanced Blouse Making Course",
    titleHi: "एडवांस्ड ब्लाउज मेकिंग कोर्स",
    category: "Blouse Making",
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
    image: img("1594633312681-425c7b97ccd1"),
  },
  {
    id: "c6",
    slug: "kids-wear-course",
    title: "Kids Wear Course",
    titleHi: "किड्स वियर कोर्स",
    category: "Stitching",
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
    image: img("1503454536592-0602245e0fe8"),
  },
  {
    id: "c7",
    slug: "western-blouse-making-course",
    title: "Western Blouse Making Course",
    titleHi: "वेस्टर्न ब्लाउज मेकिंग कोर्स",
    category: "Blouse Making",
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
    image: img("1583292652858-d6e2e307e8f2"),
  },
  {
    id: "c8",
    slug: "suit-making-course",
    title: "Suit Making Course",
    titleHi: "सूट मेकिंग कोर्स",
    category: "Stitching",
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
    image: img("1583391733981-3c5d96f3f1c4"),
  },
  {
    id: "c9",
    slug: "fashion-designing-course",
    title: "Fashion Designing Course",
    titleHi: "फैशन डिज़ाइनिंग कोर्स",
    category: "Fashion Design",
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
    image: img("1558171813-886c6d4e4b4e"),
  },
  {
    id: "c10",
    slug: "lehenga-making-course",
    title: "Lehenga Making Course",
    titleHi: "लहंगा मेकिंग कोर्स",
    category: "Fashion Design",
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
    image: img("1610030469983-98e550d6193c"),
  },
];

export const COURSE_CATEGORIES = ["All", "Boutique", "Blouse Making", "Stitching", "Fashion Design"];

export const COURSE_WA_OPTIONS = [
  ...COURSES.map((c) => ({ en: c.title, hi: c.titleHi || c.title })),
  { en: "Not sure — need guidance", hi: "पक्का नहीं — गाइडेंस चाहिए" },
];

export const PORTFOLIO = [
  { id: "g1", title: "Bridal Lehenga — Maroon & Gold", category: "Bridal", image: img("1610030469983-98e550d6193c"), sort_order: 1 },
  { id: "g2", title: "Reception Gown", category: "Gowns", image: img("1566174053879-31528523f8ae"), sort_order: 2 },
  { id: "g3", title: "Mirror-work Blouse", category: "Blouses", image: img("1610189019916-3b6f1f8c2f0a"), sort_order: 3 },
  { id: "g4", title: "Festive Anarkali", category: "Suits", image: img("1583391733981-3c5d96f3f1c4"), sort_order: 4 },
  { id: "g5", title: "Kundan Bridal Set", category: "Jewellery", image: img("1599643478518-a784e5dc4c8f"), sort_order: 5 },
  { id: "g6", title: "Silk Saree Drape", category: "Sarees", image: img("1572804013766-19e3cd48a0a2"), sort_order: 6 },
  { id: "g7", title: "Embroidered Dupatta", category: "Bridal", image: img("1591561954557-26941169b49e"), sort_order: 7 },
  { id: "g8", title: "Designer Blouse Back", category: "Blouses", image: img("1594633312681-425c7b97ccd1"), sort_order: 8 },
  { id: "g9", title: "Pastel Mehendi Lehenga", category: "Bridal", image: img("1595776613210-9dd099e7f0a2"), sort_order: 9 },
  { id: "g10", title: "Indo-Western Fusion Gown", category: "Gowns", image: img("1515372039744-b5f53e845b7e"), sort_order: 10 },
  { id: "g11", title: "Zardozi Potli Bag", category: "Accessories", image: img("1601925260368-ae2f83b8b7a1"), sort_order: 11 },
  { id: "g12", title: "Hand-embroidered Cape Blouse", category: "Blouses", image: img("1583292652858-d6e2e307e8f2"), sort_order: 12 },
];

export const TESTIMONIALS = [
  {
    id: "t1",
    name: "Ananya Sharma",
    text: "My bridal lehenga was stitched to perfection and delivered on time. The fit was flawless — I felt like a queen!",
    photo: img("1494790108377-be9c29b29330", 200),
    rating: 5,
  },
  {
    id: "t2",
    name: "Pooja Verma",
    text: "I took the fashion designing course and now run my own small boutique. The mentorship was incredible.",
    photo: img("1438761681033-6461ffad8d80", 200),
    rating: 5,
  },
  {
    id: "t3",
    name: "Ritu Singh",
    text: "Ordered an Anarkali on WhatsApp, got it stitched in 24 hours. So convenient and the quality is wonderful.",
    photo: img("1544005313-94ddf0286df2", 200),
    rating: 5,
  },
];

export const POLICIES = {
  privacy: {
    slug: "privacy",
    title: "Privacy Policy",
    titleHi: "गोपनीयता नीति",
    body: "We only collect information you share via WhatsApp or our contact form. We do not sell your data.",
    bodyHi: "हम केवल WhatsApp या संपर्क फॉर्म से साझा जानकारी रखते हैं।",
  },
  shipping: {
    slug: "shipping",
    title: "Shipping & Delivery",
    titleHi: "शिपिंग और डिलीवरी",
    body: "Delivery timelines are agreed on WhatsApp after order confirmation.",
    bodyHi: "डिलीवरी का समय WhatsApp पर ऑर्डर के बाद तय होता है।",
  },
  returns: {
    slug: "returns",
    title: "Returns & Alterations",
    titleHi: "रिटर्न और अल्टरेशन",
    body: "Bespoke items are made to your measurements. Minor alterations may be offered within 7 days.",
    bodyHi: "कस्टम सिलाई आपके माप पर होती है।",
  },
};

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
    a: "We offer 10 professional courses: Basic Boutique (3 months), Advanced Boutique (12 months), Western Boutique (12 months), Blouse & Suit Making (3 months), Advanced Blouse Making (3 months), Kids Wear (6 months), Western Blouse Making (6 months), Suit Making (3 months), Fashion Designing (1.5 years), and Lehenga Making (6 months). Contact us on WhatsApp for fees and batch timings.",
    qHi: "आप कौन-कौन से कोर्स देते हैं?",
    aHi: "हम 10 प्रोफेशनल कोर्स देते हैं: बेसिक बुटीक (3 महीने), एडवांस्ड बुटीक (12 महीने), वेस्टर्न बुटीक (12 महीने), ब्लाउज और सूट मेकिंग (3 महीने), एडवांस्ड ब्लाउज मेकिंग (3 महीने), किड्स वियर (6 महीने), वेस्टर्न ब्लाउज मेकिंग (6 महीने), सूट मेकिंग (3 महीने), फैशन डिज़ाइनिंग (1.5 वर्ष), और लहंगा मेकिंग (6 महीने)। फीस और बैच के लिए WhatsApp पर संपर्क करें।",
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
