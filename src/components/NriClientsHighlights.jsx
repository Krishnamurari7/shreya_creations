"use client";

import { PAGE_CONTAINER, REVEAL } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/LanguageProvider";

const HIGHLIGHTS = [
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

export default function NriClientsHighlights() {
  const { lang } = useLanguage();
  const hi = lang === "hi";

  return (
    <div className={cn(PAGE_CONTAINER, "mx-auto", "max-w-5xl", "pb-10", "sm:pb-14", "relative", "z-20")}>
      <ul className="grid gap-6 sm:grid-cols-3">
        {HIGHLIGHTS.map((item) => (
          <li key={item.title} className={cn(REVEAL, "border-t border-orange/20 pt-5")}>
            <h2 className="font-display text-lg text-ink sm:text-xl">
              {hi ? item.titleHi : item.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/70 sm:text-[0.9375rem]">
              {hi ? item.bodyHi : item.body}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
