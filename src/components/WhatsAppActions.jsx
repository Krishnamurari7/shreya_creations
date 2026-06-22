"use client";

import { waLink, productMessage, stitchMessage, courseMessage } from "@/lib/whatsapp";
import { useLanguage } from "@/components/LanguageProvider";
import { UI } from "@/lib/i18n";

function useUrl() {
  if (typeof window !== "undefined") return window.location.href;
  return "";
}

export function ProductActions({ product, number }) {
  const { lang } = useLanguage();
  const t = UI[lang];
  const url = useUrl();
  const order = waLink(number, productMessage(product, url));
  const stitch = waLink(number, stitchMessage(product, url));
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <a href={order} target="_blank" rel="noopener noreferrer" className="btn-gold rounded-full px-7 py-3 text-center w-full sm:w-auto">
        {t.orderWhatsApp}
      </a>
      {product.stitchable && (
        <a href={stitch} target="_blank" rel="noopener noreferrer" className="btn-ghost rounded-full px-7 py-3 text-center w-full sm:w-auto">
          {t.stitchWhatsApp}
        </a>
      )}
    </div>
  );
}

export function CourseActions({ course, number }) {
  const { lang } = useLanguage();
  const t = UI[lang];
  const url = useUrl();
  const enroll = waLink(number, courseMessage(course, url, lang));
  return (
    <a href={enroll} target="_blank" rel="noopener noreferrer" className="btn-gold rounded-full px-7 py-3 inline-block text-center w-full sm:w-auto">
      {t.enrollWhatsApp}
    </a>
  );
}
