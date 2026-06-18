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

export const SITE = {
  brand: "Shreya creation",
  boutique: "From Skill to Business",
  boutiqueHi: "कौशल से कारोबार तक",
  tagline: "Stitched outfits in 24 hours",
  taglineHi: "24 घंटे में सिले कपड़े",
  intro:
    "Shreya creation — Patna's fashion boutique & training institute. From skill to business: bespoke stitching, bridal couture, and 50+ job-oriented fashion courses. Get stitched outfits in just 24 hours.",
  introHi:
    "श्रेया क्रिएशन — पटना की फैशन बुटीक और ट्रेनिंग इंस्टिट्यूट। कौशल से कारोबार तक — कस्टम सिलाई, ब्राइडल कउचर और 50+ रोज़गार-उन्मुख फैशन कोर्स। मात्र 24 घंटे में सिले कपड़े प्राप्त करें।",
  city: "Patna, Bihar, India",
  founded: "15+ Years Experience",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919031105666",
  email: "hello@shreyacreations.in",
  phone: "+91 90311 05666 / 79031 55125",
  address: "Shreya creation, Sisodiya Place, East Boring Canal Road, Patna, Bihar 800001",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=Shreya+Creation+Sisodiya+Place+East+Boring+Canal+Road+Patna+Bihar+800001&hl=en&z=16&output=embed",
  socials: {
    instagram: "https://www.instagram.com/shreya.creationss/",
    youtube: "",
    facebook: "",
  },
  heroMarquee: [
    "24 घंटे में सिले कपड़े",
    "कौशल से कारोबार तक",
    "मात्र 24 घंटे में सिले कपड़े प्राप्त करें",
    "PREMIUM QUALITY",
    "FREE SHIPPING ON ORDERS ABOVE ₹999",
    "EASY RETURNS",
    "SECURE PAYMENTS",
  ],
};

export const TRUST = [
  { label: "Outfits delivered", labelHi: "आउटफिट डिलीवर", value: "5,000+" },
  { label: "Students taught", labelHi: "छात्र प्रशिक्षित", value: "300+" },
  { label: "Years of experience", labelHi: "वर्षों का अनुभव", value: "15+" },
  { label: "Express delivery", labelHi: "एक्सप्रेस डिलीवरी", value: "24 hrs" },
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
    text: "Hands-on, mentor-led courses in design, stitching and embroidery — in Hindi & English.",
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
    slug: "fashion-designing-fundamentals",
    title: "Fashion Designing Fundamentals",
    category: "Fashion Design",
    price: 9999,
    duration: "3 months",
    language: "Hindi & English",
    published: true,
    description:
      "From sketching to fabric selection — learn the foundations of fashion design with hands-on projects.",
    syllabus: [
      "Design sketching & illustration",
      "Fabric science & selection",
      "Colour theory & mood boards",
      "Building your first collection",
    ],
    preview_video: "",
    image: img("1556905055-8f358a7a47b2"),
  },
  {
    id: "c2",
    slug: "professional-stitching-tailoring",
    title: "Professional Stitching & Tailoring",
    category: "Stitching",
    price: 7499,
    duration: "2 months",
    language: "Hindi",
    published: true,
    description:
      "Master measurement, cutting and finishing techniques to stitch blouses, suits and gowns professionally.",
    syllabus: [
      "Taking accurate measurements",
      "Pattern making & cutting",
      "Machine & hand finishing",
      "Stitching a complete outfit",
    ],
    preview_video: "",
    image: img("1581655353564-df123a1eb820"),
  },
  {
    id: "c3",
    slug: "bridal-embroidery-masterclass",
    title: "Bridal Embroidery Masterclass",
    category: "Embroidery",
    price: 11999,
    duration: "6 weeks",
    language: "Hindi & English",
    published: true,
    description:
      "Learn zardozi, aari and mirror work to create showstopping bridal pieces clients will love.",
    syllabus: [
      "Zardozi & aari basics",
      "Mirror & bead work",
      "Designing motifs",
      "Finishing a bridal panel",
    ],
    preview_video: "",
    image: img("1528747045269-390fe33c19f2"),
  },
  {
    id: "c4",
    slug: "boutique-business-fashion-entrepreneurship",
    title: "Boutique Business & Fashion Entrepreneurship",
    category: "Fashion Design",
    price: 8999,
    duration: "4 weeks",
    language: "Hindi & English",
    published: true,
    description:
      "Turn your stitching skills into a thriving boutique — pricing, client handling, branding and selling online.",
    syllabus: [
      "Pricing & costing your work",
      "Building a brand & portfolio",
      "Finding & keeping clients",
      "Selling on Instagram & WhatsApp",
    ],
    preview_video: "",
    image: img("1542060748-10c28b62716f"),
  },
];

export const COURSE_CATEGORIES = ["All", "Fashion Design", "Stitching", "Embroidery"];

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
    q: "How do I place an order?",
    a: "Browse the shop, open any product, and tap “Order on WhatsApp”. A prefilled message opens with the item details — we finish the order, measurements and payment right there in chat.",
  },
  {
    q: "Do you stitch to my exact measurements?",
    a: "Yes! Most outfits are stitchable. Open a stitchable product and tap “Stitch to my size” — we’ll guide you through sharing your measurements over WhatsApp.",
  },
  {
    q: "Is 24-hour express delivery really available?",
    a: "For many ready styles, yes. Express timelines depend on the design and customisation — confirm with us on WhatsApp.",
  },
  {
    q: "How do the courses work?",
    a: "Pick a course, tap “Enroll on WhatsApp”, and we’ll share batch timings, access and payment details directly.",
  },
];
