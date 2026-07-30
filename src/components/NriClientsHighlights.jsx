"use client";

import { PAGE_CONTAINER, REVEAL } from "@/lib/ui";
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
      <div className={cn(PAGE_CONTAINER, "mx-auto", "max-w-5xl", "pb-10", "sm:pb-14", "relative", "z-20")}>
        <ul className="grid gap-6 sm:grid-cols-3">
          {items.map((item) => (
            <li key={item.title} className={cn(REVEAL, "border-t border-orange/20 pt-5")}>
              <h2 className="font-display text-lg text-ink sm:text-xl">
                {hi && item.titleHi ? item.titleHi : item.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/70 sm:text-[0.9375rem]">
                {hi && item.bodyHi ? item.bodyHi : item.body}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <section className={cn(PAGE_CONTAINER, "mx-auto", "max-w-5xl", "pb-12", "sm:pb-16", "relative", "z-20")}>
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
        <ol className="mt-8 grid gap-6 sm:grid-cols-2">
          {steps.map((item) => (
            <li key={item.step} className={cn(REVEAL, "rounded-2xl border border-orange/15 bg-orange/[0.03] p-5 sm:p-6")}>
              <span className="font-display text-sm tracking-widest text-orange">{item.step}</span>
              <h3 className="mt-2 font-display text-lg text-ink sm:text-xl">
                {hi && item.titleHi ? item.titleHi : item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                {hi && item.descHi ? item.descHi : item.desc}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
