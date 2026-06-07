"use client";

import { useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { waLink, enquiryMessage } from "@/lib/whatsapp";
import { Glass3DCard, Float3D } from "@/components/Glass3DCard";
import { useLanguage } from "@/components/LanguageProvider";
import { UI } from "@/lib/i18n";

export default function ContactForm({ number }) {
  const { lang } = useLanguage();
  const t = UI[lang];
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const send = async () => {
    if (!name.trim()) {
      alert(lang === "hi" ? "कृपया अपना नाम लिखें।" : "Please enter your name.");
      return;
    }
    setSaving(true);
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.from("contact_inquiries").insert({
        name: name.trim(),
        message: msg.trim(),
        source: "contact_form",
      });
    }
    const href = waLink(number, enquiryMessage(name, msg));
    window.open(href, "_blank");
    setSaving(false);
  };

  return (
    <Glass3DCard layered className="rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 md:p-10 border-orange/20 shadow-2xl relative overflow-hidden reveal interactive-card">
      <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-orange/5 blur-2xl pointer-events-none z-0" />

      <Float3D translateZ="50" className="mb-8">
        <h3 className="font-display text-2xl sm:text-3xl text-ink">Direct Boutique Desk</h3>
        <p className="text-xs text-ink font-normal mt-1.5 leading-relaxed">
          {lang === "hi"
            ? "अपना ऑर्डर या कोर्स की जानकारी भेजें — हम WhatsApp पर जवाब देंगे।"
            : "Send your custom order or course inquiry. We reply on WhatsApp."}
        </p>
      </Float3D>

      <Float3D translateZ="60" className="space-y-5">
        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] text-orange font-semibold mb-2">
            {lang === "hi" ? "आपका नाम" : "Your Name"}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-ink/5 border border-ink/15 hover:border-orange/35 rounded-2xl px-5 py-4 text-ink placeholder:text-ink/55 focus:border-orange focus:ring-1 focus:ring-orange/30 focus:outline-none transition-all duration-300 text-sm font-light"
            placeholder={lang === "hi" ? "उदा. प्रियांशी शर्मा" : "e.g. Priyanshi Sharma"}
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] text-orange font-semibold mb-2">
            {lang === "hi" ? "आपका संदेश" : "Your message"}
          </label>
          <textarea
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            rows={5}
            className="w-full bg-ink/5 border border-ink/15 hover:border-orange/35 rounded-2xl px-5 py-4 text-ink placeholder:text-ink/55 focus:border-orange focus:ring-1 focus:ring-orange/30 focus:outline-none transition-all duration-300 text-sm font-normal leading-relaxed resize-none"
            placeholder={
              lang === "hi"
                ? "ड्रेस, माप या कोर्स के बारे में लिखें..."
                : "Describe the dress, sizing, or course you want..."
            }
          />
        </div>

        <button
          onClick={send}
          disabled={saving}
          className="btn-gold rounded-full px-8 py-4 w-full text-center text-xs tracking-widest font-semibold transition-all duration-300 uppercase mt-2 disabled:opacity-60"
        >
          {saving ? "…" : t.enquireWhatsApp}
        </button>

        <p className="text-[11px] text-ink text-center font-normal mt-4">
          {lang === "hi"
            ? "संदेश सेव होता है और WhatsApp खुलता है।"
            : "Message is saved and WhatsApp opens with your details."}
        </p>
      </Float3D>
    </Glass3DCard>
  );
}
