/** Bilingual content for the NRI Clients premium landing page. */

export const NRI_FAQS = [
  {
    q: "Can NRI clients order custom stitching from abroad?",
    qHi: "क्या NRI क्लाइंट विदेश से कस्टम सिलाई ऑर्डर कर सकते हैं?",
    a: "Yes — requirements and design can be discussed first on WhatsApp. We guide measurements remotely and stitch in Patna before shipping or family pickup.",
    aHi: "हाँ — requirement और design पहले WhatsApp पर discuss किए जा सकते हैं। हम दूर से माप गाइड करते हैं और पटना में सिलाई के बाद शिपिंग या परिवार पिकअप arrange करते हैं।",
  },
  {
    q: "Do you offer 1-to-1 online fashion designing classes?",
    qHi: "क्या आप 1-to-1 online fashion designing classes देते हैं?",
    a: "Yes — personalised online training can be arranged for NRI learners, with live practical guidance tailored to your skill level and goals.",
    aHi: "हाँ — NRI learners के लिए personalised online training available हो सकती है, आपके skill level और goal के अनुसार live practical guidance के साथ।",
  },
  {
    q: "Can I join an offline 1-to-1 class when I visit Patna?",
    qHi: "क्या मैं Patna visit के दौरान offline 1-to-1 class join कर सकती हूँ?",
    a: "Yes — personalised offline sessions can be arranged in Patna subject to availability when you visit India.",
    aHi: "हाँ — India visit के दौरान availability के अनुसार Patna में personalised offline sessions arrange किए जा सकते हैं।",
  },
  {
    q: "Can I learn ready-to-wear saree making?",
    qHi: "क्या मैं ready-to-wear saree making सीख सकती हूँ?",
    a: "Yes — ready-to-wear and pre-stitched saree preparation can be included in practical training sessions.",
    aHi: "हाँ — ready-to-wear/pre-stitched saree preparation को practical training में शामिल किया जा सकता है।",
  },
  {
    q: "Can I learn box-pleated saree preparation?",
    qHi: "क्या मैं box-pleated saree preparation सीख सकती हूँ?",
    a: "Yes — this technique can be included in training based on your course or session requirements.",
    aHi: "हाँ — course/session requirements के अनुसार इस technique को training में शामिल किया जा सकता है।",
  },
  {
    q: "Can NRI brides get bridal blouse stitching?",
    qHi: "क्या NRI brides के लिए bridal blouse stitching available है?",
    a: "Yes — customised bridal blouse stitching is available for NRI brides and families, with design consultation before stitching begins.",
    aHi: "हाँ — NRI brides और families के लिए customised bridal blouse stitching available है, सिलाई से पहले design consultation के साथ।",
  },
];

export function nriServices(hi) {
  return hi
    ? [
        { emoji: "👗", title: "डिज़ाइनर ब्लाउज सिलाई", desc: "Custom neck, sleeve, back design और perfect fitting।" },
        { emoji: "💍", title: "ब्राइडल ब्लाउज और वेडिंग वियर", desc: "NRI brides और families के लिए customised bridal stitching।" },
        { emoji: "✨", title: "लहंगा और डिज़ाइनर आउटफ़िट", desc: "Wedding, reception और festive occasions के लिए।" },
        { emoji: "🌸", title: "सूट और कुर्ती सिलाई", desc: "Custom measurements और preferred design के अनुसार।" },
        { emoji: "👩‍🎨", title: "Ready-to-Wear Saree", desc: "Saree को convenient ready-to-wear / pre-stitched style में customise।" },
        { emoji: "🧵", title: "Box-Pleat / Box-Pleated Saree", desc: "Box-pleat और structured saree styling/customisation के लिए enquiry।" },
        { emoji: "✂️", title: "Alteration & Fitting", desc: "Existing Indian outfits की fitting और alteration।" },
        { emoji: "⚡", title: "Express Stitching", desc: "Selected requirements के लिए 24-hour express stitching।" },
      ]
    : [
        { emoji: "👗", title: "Designer Blouse Stitching", desc: "Custom neck, sleeve, back design and perfect fitting." },
        { emoji: "💍", title: "Bridal Blouse & Wedding Wear", desc: "Customised bridal stitching for NRI brides and families." },
        { emoji: "✨", title: "Lehenga & Designer Outfits", desc: "For wedding, reception and festive occasions." },
        { emoji: "🌸", title: "Suit & Kurti Stitching", desc: "Stitched to your custom measurements and preferred design." },
        { emoji: "👩‍🎨", title: "Ready-to-Wear Saree", desc: "Customise sarees into convenient ready-to-wear / pre-stitched styles." },
        { emoji: "🧵", title: "Box-Pleat / Box-Pleated Saree", desc: "Enquire for box-pleat and structured saree styling." },
        { emoji: "✂️", title: "Alteration & Fitting", desc: "Fitting and alteration for existing Indian outfits." },
        { emoji: "⚡", title: "Express Stitching", desc: "24-hour express stitching for selected requirements." },
      ];
}

export function nriLearnTopics(hi) {
  return hi
    ? [
        "Designer Blouse Making",
        "Blouse Pattern & Cutting",
        "Saree Designing",
        "Ready-to-Wear Saree Making",
        "How to Make a Ready-to-Wear Saree",
        "How to Prepare a Ready-to-Wear Saree",
        "Box-Pleated Saree Preparation",
        "Suit & Kurti Designing",
        "Lehenga Designing",
        "Basic Tailoring",
        "Boutique Techniques",
        "Custom Dress Designing",
      ]
    : [
        "Designer Blouse Making",
        "Blouse Pattern & Cutting",
        "Saree Designing",
        "Ready-to-Wear Saree Making",
        "How to Make a Ready-to-Wear Saree",
        "How to Prepare a Ready-to-Wear Saree",
        "Box-Pleated Saree Preparation",
        "Suit & Kurti Designing",
        "Lehenga Designing",
        "Basic Tailoring",
        "Boutique Techniques",
        "Custom Dress Designing",
      ];
}

export function nriClassSteps(hi) {
  return hi
    ? [
        { step: "01", title: "Enquiry", desc: "WhatsApp पर अपनी learning requirement बताइए।" },
        { step: "02", title: "Choose Online or Offline", desc: "Online class या Patna में offline 1-to-1 session चुनें।" },
        { step: "03", title: "Personalised Training Plan", desc: "आपके skill level और goal के अनुसार topics तय किए जाएँ।" },
        { step: "04", title: "Live Practical Training", desc: "Instructor के साथ one-to-one practical guidance।" },
        { step: "05", title: "Learn & Create", desc: "अपने designs और garments पर practical work करें।" },
      ]
    : [
        { step: "01", title: "Enquiry", desc: "Share your learning requirement on WhatsApp." },
        { step: "02", title: "Choose Online or Offline", desc: "Pick online classes or a personalised offline session in Patna." },
        { step: "03", title: "Personalised Training Plan", desc: "Topics are set based on your skill level and goals." },
        { step: "04", title: "Live Practical Training", desc: "One-to-one practical guidance with your instructor." },
        { step: "05", title: "Learn & Create", desc: "Work practically on your own designs and garments." },
      ];
}

export function nriWhyChoose(hi) {
  return hi
    ? [
        "India-based Boutique & Fashion Designing Studio",
        "Custom Indian Wear",
        "Personalised Design Consultation",
        "Designer & Bridal Stitching",
        "1-to-1 Online Classes",
        "1-to-1 Offline Classes in Patna",
        "Ready-to-Wear Saree Training",
        "Boutique & Fashion Designing Under One Roof",
      ]
    : [
        "India-based Boutique & Fashion Designing Studio",
        "Custom Indian Wear",
        "Personalised Design Consultation",
        "Designer & Bridal Stitching",
        "1-to-1 Online Classes",
        "1-to-1 Offline Classes in Patna",
        "Ready-to-Wear Saree Training",
        "Boutique & Fashion Designing Under One Roof",
      ];
}
