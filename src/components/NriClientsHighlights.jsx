"use client";

import { PAGE_CONTAINER, PAGE_SECTION, PAGE_SECTION_BORDERED } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/LanguageProvider";
import LocalizedSectionHeader from "@/components/LocalizedSectionHeader";

const DEFAULT_HIGHLIGHTS = [
  {
    title: "WhatsApp measurements",
    titleHi: "WhatsApp माप",
    body: "Share photos, reference looks and body measurements — we guide you step by step from abroad.",
    bodyHi: "फ़ोटो, रेफ़रेंस लुक और माप भेजें — विदेश से भी हम स्टेप-बाय-स्टेप गाइड करेंगे।",
  },
  {
    title: "Bridal & custom stitching",
    titleHi: "ब्राइडल और कस्टम सिलाई",
    body: "Lehengas, blouses, suits and designer wear stitched in Patna for your wedding or festive dates.",
    bodyHi: "लहंगा, ब्लाउज, सूट और डिज़ाइनर वियर — शादी या त्योहार की डेट के हिसाब से पटना में सिले।",
  },
  {
    title: "Secure shipping support",
    titleHi: "सुरक्षित शिपिंग सपोर्ट",
    body: "Packaging and courier coordination so your outfit reaches family in India or abroad safely.",
    bodyHi: "पैकेजिंग और कूरियर कोऑर्डिनेशन — आउटफ़िट भारत या विदेश में परिवार तक सुरक्षित पहुँचे।",
  },
];

const DEFAULT_STEPS = [
  {
    step: "01",
    title: "Share your brief",
    titleHi: "अपना ब्रीफ भेजें",
    desc: "Occasion date, city for delivery/pickup, budget and reference photos on WhatsApp.",
    descHi: "अवसर की डेट, डिलीवरी/पिकअप शहर, बजट और रेफ़रेंस फ़ोटो WhatsApp पर।",
  },
  {
    step: "02",
    title: "Confirm design & fit",
    titleHi: "डिज़ाइन और फिट कन्फर्म",
    desc: "We guide measurements, fabric options and timeline before we start stitching.",
    descHi: "सिलाई शुरू करने से पहले माप, कपड़ा और टाइमलाइन गाइड करते हैं।",
  },
  {
    step: "03",
    title: "Stitch in Patna",
    titleHi: "पटना में सिलाई",
    desc: "Your outfit is cut and finished at our Boring Road atelier to the agreed plan.",
    descHi: "आउटफ़िट बोरिंग रोड एटेलियर में तय प्लान के अनुसार कट और फिनिश होता है।",
  },
  {
    step: "04",
    title: "Ship or family pickup",
    titleHi: "शिप या परिवार पिकअप",
    desc: "Secure packaging with courier support — or family collects from the studio.",
    descHi: "सुरक्षित पैकेजिंग व कूरियर — या परिवार स्टूडियो से ले जाएँ।",
  },
];

function normalizeHighlights(raw) {
  if (!Array.isArray(raw) || !raw.length) return DEFAULT_HIGHLIGHTS;
  return raw.map((item, i) => {
    const fallback = DEFAULT_HIGHLIGHTS[i] || DEFAULT_HIGHLIGHTS[0];
    return {
      title: item.title || fallback.title,
      titleHi: item.titleHi || item.title_hi || fallback.titleHi,
      body: item.body || fallback.body,
      bodyHi: item.bodyHi || item.body_hi || fallback.bodyHi,
    };
  });
}

function normalizeSteps(raw) {
  if (!Array.isArray(raw) || !raw.length) return DEFAULT_STEPS;
  return raw.map((item, i) => {
    const fallback = DEFAULT_STEPS[i] || DEFAULT_STEPS[0];
    return {
      step: item.step || fallback.step,
      title: item.title || fallback.title,
      titleHi: item.titleHi || item.title_hi || fallback.titleHi,
      desc: item.desc || fallback.desc,
      descHi: item.descHi || item.desc_hi || fallback.descHi,
    };
  });
}

export default function NriClientsHighlights({
  highlights,
  highlightEyebrow,
  highlightEyebrowHi,
  highlightTitle,
  highlightTitleHi,
  highlightSubtitle,
  highlightSubtitleHi,
  processEyebrow,
  processEyebrowHi,
  processTitle,
  processTitleHi,
  processSubtitle,
  processSubtitleHi,
  processSteps,
}) {
  const { lang } = useLanguage();
  const hi = lang === "hi";
  const items = normalizeHighlights(highlights);
  const steps = normalizeSteps(processSteps);

  return (
    <>
      <section id="nri-support" className={cn(PAGE_CONTAINER, PAGE_SECTION, "nri-block max-w-6xl")}>
        <LocalizedSectionHeader
          eyebrow={highlightEyebrow || "For families abroad"}
          eyebrowHi={highlightEyebrowHi || "विदेश में परिवारों के लिए"}
          title={highlightTitle || "Stitching Support Built for NRI Clients"}
          titleHi={highlightTitleHi || "NRI क्लाइंट्स के लिए सिलाई सपोर्ट"}
          subtitle={
            highlightSubtitle ||
            "Measurements, bridal wear and shipping — planned around your travel and wedding dates."
          }
          subtitleHi={highlightSubtitleHi}
        />
        <ul className="nri-highlights">
          {items.map((item, index) => (
            <li key={item.title} className="nri-card">
              <span className="nri-card__index" aria-hidden>
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="nri-card__title">{hi && item.titleHi ? item.titleHi : item.title}</h3>
              <p className="nri-card__body">{hi && item.bodyHi ? item.bodyHi : item.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="nri-process" className={cn(PAGE_CONTAINER, PAGE_SECTION, PAGE_SECTION_BORDERED, "nri-block max-w-6xl")}>
        <LocalizedSectionHeader
          eyebrow={processEyebrow || "How it works"}
          eyebrowHi={processEyebrowHi || "कैसे काम करता है"}
          title={processTitle || "From WhatsApp to doorstep"}
          titleHi={processTitleHi || "WhatsApp से डोरस्टेप तक"}
          subtitle={
            processSubtitle ||
            "A clear process so NRI families can plan outfits around travel and wedding dates."
          }
          subtitleHi={processSubtitleHi}
        />
        <ol className="nri-steps">
          {steps.map((item) => (
            <li key={item.step} className="nri-step">
              <span className="nri-step__no">{item.step}</span>
              <h3 className="nri-card__title">{hi && item.titleHi ? item.titleHi : item.title}</h3>
              <p className="nri-card__body">{hi && item.descHi ? item.descHi : item.desc}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
