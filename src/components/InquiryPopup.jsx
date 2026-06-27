"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useLanguage } from "@/components/LanguageProvider";
import { INQUIRY_OPEN_EVENT } from "@/lib/inquiryPopup";

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
    name: "Your name",
    phone: "Phone / WhatsApp",
    message: "What are you looking for?",
    namePh: "e.g. Priyanshi Sharma",
    phonePh: "e.g. 9876543210",
    messagePh: "Course, custom dress, or any question…",
    submit: "Send inquiry",
    success: "Thank you! We received your message and will contact you soon.",
    close: "Close",
    nameRequired: "Please enter your name.",
    phoneRequired: "Please enter your phone number.",
  },
  hi: {
    title: "संपर्क करें",
    subtitle: "अपनी जानकारी भेजें — हम WhatsApp या कॉल पर जवाब देंगे।",
    name: "आपका नाम",
    phone: "फ़ोन / WhatsApp",
    message: "आप क्या चाहते हैं?",
    namePh: "उदा. प्रियांशी शर्मा",
    phonePh: "उदा. 9876543210",
    messagePh: "कोर्स, ड्रेस या कोई सवाल…",
    submit: "जानकारी भेजें",
    success: "धन्यवाद! आपका संदेश मिल गया — हम जल्द संपर्क करेंगे।",
    close: "बंद करें",
    nameRequired: "कृपया अपना नाम लिखें।",
    phoneRequired: "कृपया अपना फ़ोन नंबर लिखें।",
  },
};

export default function InquiryPopup({ source = "home_popup", delayMs = 4000 }) {
  const { lang } = useLanguage();
  const t = COPY[lang] || COPY.en;
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
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
      alert(t.nameRequired);
      return;
    }
    if (!phone.trim()) {
      alert(t.phoneRequired);
      return;
    }
    setSaving(true);
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.from("contact_inquiries").insert({
        name: name.trim(),
        phone: phone.trim(),
        message: message.trim(),
        source: activeSource,
      });
    }
    setSaving(false);
    setDone(true);
    if (!userOpenedRef.current) {
      markDismissed(source);
    }
  };

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[10060] flex items-end sm:items-center justify-center p-0 sm:p-4"
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
      <div className="inquiry-popup-panel relative w-full sm:max-w-md glass border border-orange/25 rounded-t-3xl sm:rounded-3xl shadow-lift p-6 sm:p-8 popup-panel">
        <button
          type="button"
          onClick={close}
          className="absolute top-4 right-4 h-9 w-9 rounded-full border border-ink/15 text-ink/70 hover:text-ink hover:border-orange/40 transition-colors grid place-items-center text-sm"
          aria-label={t.close}
        >
          ✕
        </button>

        {done ? (
          <div className="text-center py-4 pr-8">
            <span className="text-3xl" aria-hidden>
              ✓
            </span>
            <p className="mt-4 text-ink font-normal leading-relaxed">{t.success}</p>
            <button type="button" onClick={close} className="btn-primary rounded-full px-8 py-3 mt-6 text-xs tracking-widest uppercase">
              {t.close}
            </button>
          </div>
        ) : (
          <>
            <h2 id="inquiry-popup-title" className="font-display text-2xl text-ink pr-8">
              {t.title}
            </h2>
            <p className="text-sm text-muted mt-2 leading-relaxed">{t.subtitle}</p>

            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-orange font-semibold mb-2">
                  {t.name}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full field-surface rounded-2xl px-5 py-3.5 text-sm"
                  placeholder={t.namePh}
                  autoComplete="name"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-orange font-semibold mb-2">
                  {t.phone}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full field-surface rounded-2xl px-5 py-3.5 text-sm"
                  placeholder={t.phonePh}
                  autoComplete="tel"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-orange font-semibold mb-2">
                  {t.message}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="w-full field-surface rounded-2xl px-5 py-3.5 text-sm resize-none leading-relaxed"
                  placeholder={t.messagePh}
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="btn-gold rounded-full px-8 py-3.5 w-full text-center text-xs tracking-widest font-semibold uppercase disabled:opacity-60"
              >
                {saving ? "…" : t.submit}
              </button>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
