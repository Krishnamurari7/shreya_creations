"use client";

import { BTN_PRIMARY, FIELD_SURFACE, GLASS, POPUP_PANEL } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "@/components/LanguageProvider";
import { INQUIRY_OPEN_EVENT } from "@/lib/inquiryPopup";
import { enquiryMessage, waLink } from "@/lib/whatsapp";
import { trackLead, trackWhatsAppClick } from "@/lib/analytics";

const DISMISS_HOURS = 24;

function dismissKey(source) {
  return `sc_inquiry_popup_${source}`;
}

function wasRecentlyDismissed(source) {
  if (typeof window === "undefined") return true;
  const raw = localStorage.getItem(dismissKey(source));
  if (!raw) return false;
  const ts = Number(raw);
  if (!Number.isFinite(ts)) return false;
  return Date.now() - ts < DISMISS_HOURS * 60 * 60 * 1000;
}

function markDismissed(source) {
  localStorage.setItem(dismissKey(source), String(Date.now()));
}

const COPY = {
  en: {
    title: "Get in touch",
    subtitle: "Share your details — we'll reply on WhatsApp or call you back.",
    demoTitle: "Book Free Demo",
    demoSubtitle: "Share your name, phone and preferred date — we save it and open WhatsApp.",
    name: "Your name",
    phone: "Phone / WhatsApp",
    message: "What are you looking for?",
    preferredDate: "Preferred demo date",
    namePh: "e.g. Priyanshi Sharma",
    phonePh: "e.g. 9876543210",
    messagePh: "Course, custom dress, or any question…",
    submit: "Send inquiry",
    demoSubmit: "Book demo",
    success: "Thank you! We received your message and will contact you soon.",
    close: "Close",
    nameRequired: "Please enter your name.",
    phoneRequired: "Please enter your phone number.",
  },
  hi: {
    title: "संपर्क करें",
    subtitle: "अपनी जानकारी भेजें — हम WhatsApp या कॉल पर जवाब देंगे।",
    demoTitle: "मुफ़्त डेमो बुक करें",
    demoSubtitle: "नाम, फोन और पसंदीदा तारीख भेजें — हम सेव करके WhatsApp खोलेंगे।",
    name: "आपका नाम",
    phone: "फ़ोन / WhatsApp",
    message: "आप क्या चाहते हैं?",
    preferredDate: "पसंदीदा डेमो तारीख",
    namePh: "उदा. प्रियांशी शर्मा",
    phonePh: "उदा. 9876543210",
    messagePh: "कोर्स, ड्रेस या कोई सवाल…",
    submit: "जानकारी भेजें",
    demoSubmit: "डेमो बुक करें",
    success: "धन्यवाद! आपका संदेश मिल गया — हम जल्द संपर्क करेंगे।",
    close: "बंद करें",
    nameRequired: "कृपया अपना नाम लिखें।",
    phoneRequired: "कृपया अपना फ़ोन नंबर लिखें।",
  },
};

function isDemoSource(src) {
  return /demo/i.test(src || "");
}

export default function InquiryPopup({ source = "home_popup", delayMs = 4000, whatsapp }) {
  const { lang } = useLanguage();
  const t = COPY[lang] || COPY.en;
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [formError, setFormError] = useState("");
  const [activeSource, setActiveSource] = useState(source);
  const userOpenedRef = useRef(false);

  const close = useCallback(() => {
    setOpen(false);
    if (!userOpenedRef.current) {
      markDismissed(source);
    }
    userOpenedRef.current = false;
  }, [source]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (wasRecentlyDismissed(source)) return undefined;
    const id = setTimeout(() => setOpen(true), delayMs);
    return () => clearTimeout(id);
  }, [source, delayMs]);

  useEffect(() => {
    const onOpen = (event) => {
      const detail = event.detail || {};
      setActiveSource(detail.source || source);
      setMessage(typeof detail.message === "string" ? detail.message : "");
      setDone(false);
      userOpenedRef.current = true;
      setOpen(true);
    };

    window.addEventListener(INQUIRY_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(INQUIRY_OPEN_EVENT, onOpen);
  }, [source]);

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError(t.nameRequired);
      return;
    }
    if (!phone.trim()) {
      setFormError(t.phoneRequired);
      return;
    }
    setFormError("");
    setSaving(true);
    const demo = isDemoSource(activeSource);
    const msgParts = [message.trim()];
    if (demo && preferredDate) {
      msgParts.push(`Preferred demo date: ${preferredDate}`);
    }
    const fullMessage = msgParts.filter(Boolean).join("\n");
    try {
      await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          message: fullMessage,
          source: activeSource,
          source_page: window.location.pathname,
          inquiry_type: demo ? "demo" : "contact",
          locale: lang,
          preferred_date: preferredDate || undefined,
        }),
      });
    } catch {
      // best-effort
    }
    const href = waLink(whatsapp, enquiryMessage(name, fullMessage, phone));
    const leadType = demo ? "demo_booking" : "contact_form";
    trackLead(leadType, {
      cta_label: demo ? "demo_booking" : "inquiry_popup",
      source_page: window.location.pathname,
    });
    trackWhatsAppClick(null, {
      cta_label: demo ? "demo_booking" : "inquiry_popup",
      source_page: window.location.pathname,
    });
    window.open(href, "_blank", "noopener,noreferrer");
    setSaving(false);
    setDone(true);
    if (!userOpenedRef.current) {
      markDismissed(source);
    }
  };

  if (!mounted || !open) return null;

  const demoMode = isDemoSource(activeSource);

  const fieldClass = cn(
    FIELD_SURFACE,
    "w-full rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 text-base sm:text-sm min-h-[2.75rem]"
  );

  return createPortal(
    <div
      className="inquiry-popup-root fixed inset-0 z-[10060] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="inquiry-popup-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-label={t.close}
        onClick={close}
      />
      <div
        className={cn(
          GLASS,
          POPUP_PANEL,
          "inquiry-popup-panel",
          "relative w-full sm:max-w-md",
          "border border-orange/25",
          "rounded-t-3xl sm:rounded-3xl shadow-lift",
          "p-4 sm:p-8",
          "max-h-[min(92dvh,calc(100dvh-env(safe-area-inset-top)-0.5rem))]",
          "overflow-y-auto overscroll-contain",
          "pb-[max(1.25rem,env(safe-area-inset-bottom))]"
        )}
      >
        <button
          type="button"
          onClick={close}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 h-11 w-11 min-h-11 min-w-11 rounded-full border border-ink/15 text-ink/70 hover:text-ink hover:border-orange/40 transition-colors grid place-items-center text-sm touch-manipulation"
          aria-label={t.close}
        >
          ✕
        </button>

        {done ? (
          <div className="text-center py-3 sm:py-4 pr-10 sm:pr-8">
            <span className="text-3xl" aria-hidden>
              ✓
            </span>
            <p className="mt-4 text-ink font-normal leading-relaxed text-sm sm:text-base text-pretty">{t.success}</p>
            <button
              type="button"
              onClick={close}
              className={cn(BTN_PRIMARY, "mt-6 w-full sm:w-auto")}
            >
              {t.close}
            </button>
          </div>
        ) : (
          <>
            <h2 id="inquiry-popup-title" className="font-display text-xl sm:text-2xl text-ink pr-10 sm:pr-8 text-balance leading-tight">
              {demoMode ? t.demoTitle : t.title}
            </h2>
            <p className="text-sm text-muted mt-2 leading-relaxed text-pretty">
              {demoMode ? t.demoSubtitle : t.subtitle}
            </p>

            <form onSubmit={submit} className="mt-5 sm:mt-6 space-y-3.5 sm:space-y-4" aria-describedby={formError ? "inquiry-form-error" : undefined} noValidate>
              <div>
                <label htmlFor="inquiry-name" className="block text-[10px] uppercase tracking-[0.2em] text-orange-text font-semibold mb-2">
                  {t.name}
                </label>
                <input
                  id="inquiry-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (formError) setFormError("");
                  }}
                  className={fieldClass}
                  placeholder={t.namePh}
                  autoComplete="name"
                  required
                />
              </div>

              <div>
                <label htmlFor="inquiry-phone" className="block text-[10px] uppercase tracking-[0.2em] text-orange-text font-semibold mb-2">
                  {t.phone}
                </label>
                <input
                  id="inquiry-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (formError) setFormError("");
                  }}
                  className={fieldClass}
                  placeholder={t.phonePh}
                  autoComplete="tel"
                  inputMode="tel"
                  required
                />
              </div>

              {demoMode ? (
                <div>
                  <label htmlFor="inquiry-date" className="block text-[10px] uppercase tracking-[0.2em] text-orange-text font-semibold mb-2">
                    {t.preferredDate}
                  </label>
                  <input
                    id="inquiry-date"
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className={fieldClass}
                  />
                </div>
              ) : (
                <div>
                  <label htmlFor="inquiry-message" className="block text-[10px] uppercase tracking-[0.2em] text-orange-text font-semibold mb-2">
                    {t.message}
                  </label>
                  <textarea
                    id="inquiry-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    className={cn(fieldClass, "resize-none leading-relaxed min-h-[5.5rem]")}
                    placeholder={t.messagePh}
                  />
                </div>
              )}

              {formError && (
                <p id="inquiry-form-error" className="text-xs text-orange-text font-medium" role="alert">
                  {formError}
                </p>
              )}

              <button
                type="submit"
                disabled={saving}
                className={cn(BTN_PRIMARY, "w-full touch-manipulation")}
              >
                {saving ? "…" : demoMode ? t.demoSubmit : t.submit}
              </button>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
