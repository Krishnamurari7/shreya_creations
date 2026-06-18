"use client";

import { useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { waLink, enquiryMessage } from "@/lib/whatsapp";
import { Glass3DCard } from "@/components/Glass3DCard";
import { useLanguage } from "@/components/LanguageProvider";
import { UI } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const COPY = {
  en: {
    title: "Direct Boutique Desk",
    subtitle: "Send your custom order or course inquiry. We reply on WhatsApp.",
    name: "Your Name",
    phone: "Phone / WhatsApp",
    message: "Your message",
    namePh: "e.g. Priyanshi Sharma",
    phonePh: "e.g. 9876543210",
    messagePh: "Describe the dress, sizing, or course you want…",
    footnote: "Message is saved and WhatsApp opens with your details.",
    nameRequired: "Please enter your name.",
    phoneRequired: "Please enter your phone number.",
  },
  hi: {
    title: "बुटीक डेस्क",
    subtitle: "अपना ऑर्डर या कोर्स की जानकारी भेजें — हम WhatsApp पर जवाब देंगे।",
    name: "आपका नाम",
    phone: "फ़ोन / WhatsApp",
    message: "आपका संदेश",
    namePh: "उदा. प्रियांशी शर्मा",
    phonePh: "उदा. 9876543210",
    messagePh: "ड्रेस, माप या कोर्स के बारे में लिखें…",
    footnote: "संदेश सेव होता है और WhatsApp खुलता है।",
    nameRequired: "कृपया अपना नाम लिखें।",
    phoneRequired: "कृपया अपना फ़ोन नंबर लिखें।",
  },
};

function FieldIcon({ children }) {
  return (
    <span className="contact-field-icon" aria-hidden>
      {children}
    </span>
  );
}

export default function ContactForm({ number }) {
  const { lang } = useLanguage();
  const t = COPY[lang] || COPY.en;
  const ui = UI[lang];
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const send = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(t.nameRequired);
      return;
    }
    if (!phone.trim()) {
      setError(t.phoneRequired);
      return;
    }
    setError("");
    setSaving(true);
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.from("contact_inquiries").insert({
        name: name.trim(),
        phone: phone.trim(),
        message: msg.trim(),
        source: "contact_form",
      });
    }
    const href = waLink(number, enquiryMessage(name, msg, phone));
    window.open(href, "_blank");
    setSaving(false);
  };

  return (
    <Glass3DCard
      layered
      className="contact-form-card rounded-2xl sm:rounded-[2rem] p-5 sm:p-7 md:p-9 border-orange/20 shadow-2xl relative overflow-hidden reveal interactive-card"
    >
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-orange/8 blur-3xl pointer-events-none z-0" aria-hidden />
      <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-orange/6 blur-2xl pointer-events-none z-0" aria-hidden />

      <div className="relative z-[2]">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="text-center sm:text-left">
            <h3 className="font-display text-2xl sm:text-3xl text-ink">{t.title}</h3>
            <p className="text-xs sm:text-sm text-muted font-normal mt-1.5 leading-relaxed max-w-md">
              {t.subtitle}
            </p>
          </div>
          <span className="contact-response-badge shrink-0 mx-auto sm:mx-0">
            <span className="contact-response-dot" aria-hidden />
            {lang === "hi" ? "जवाब ~15 मिनट" : "~15 min reply"}
          </span>
        </div>

        <form onSubmit={send} className="space-y-4 sm:space-y-5" noValidate>
          <div>
            <label htmlFor="contact-name" className="contact-field-label">
              {t.name}
            </label>
            <div className="contact-field-wrap">
              <FieldIcon>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </FieldIcon>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError("");
                }}
                className="contact-field-input"
                placeholder={t.namePh}
                autoComplete="name"
              />
            </div>
          </div>

          <div>
            <label htmlFor="contact-phone" className="contact-field-label">
              {t.phone}
            </label>
            <div className="contact-field-wrap">
              <FieldIcon>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </FieldIcon>
              <input
                id="contact-phone"
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (error) setError("");
                }}
                className="contact-field-input"
                placeholder={t.phonePh}
                autoComplete="tel"
              />
            </div>
          </div>

          <div>
            <label htmlFor="contact-message" className="contact-field-label">
              {t.message}
            </label>
            <div className="contact-field-wrap contact-field-wrap--textarea">
              <FieldIcon>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </FieldIcon>
              <textarea
                id="contact-message"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                rows={4}
                className={cn("contact-field-input resize-none leading-relaxed", "min-h-[7.5rem] sm:min-h-[8.5rem]")}
                placeholder={t.messagePh}
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-orange font-medium text-center sm:text-left" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="btn-gold rounded-full px-8 py-3.5 sm:py-4 w-full text-center text-xs tracking-widest font-semibold transition-all duration-300 uppercase disabled:opacity-60"
          >
            {saving ? "…" : ui.enquireWhatsApp}
          </button>

          <p className="text-[11px] text-muted text-center font-normal">{t.footnote}</p>
        </form>
      </div>
    </Glass3DCard>
  );
}
