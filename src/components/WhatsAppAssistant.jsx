"use client";

import { waLink, greetingMessage } from "@/lib/whatsapp";
import { useLanguage } from "@/components/LanguageProvider";
import { UI } from "@/lib/i18n";

export default function WhatsAppAssistant({ number }) {
  const { lang } = useLanguage();
  const t = UI[lang];
  const href = waLink(number, greetingMessage());

  return (
    <div className="wa-assistant-root fixed z-50 flex flex-col items-end max-w-[calc(100vw-2rem)]">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t.chatWhatsApp}
        className="grid place-items-center h-14 w-14 rounded-full shadow-lift transition-all duration-300 hover:scale-110 hover:shadow-glow relative group"
        style={{ background: "linear-gradient(135deg,#25D366,#128C7E)" }}
      >
        <span className="wa-fab-pulse" aria-hidden />
        <svg viewBox="0 0 32 32" width="26" height="26" fill="#fff" aria-hidden="true">
          <path d="M16 .5C7.4.5.5 7.4.5 16c0 2.8.8 5.5 2.2 7.9L.2 31.8l8.1-2.4c2.3 1.3 4.9 1.9 7.7 1.9 8.6 0 15.5-6.9 15.5-15.5S24.6.5 16 .5zm0 28.3c-2.5 0-4.9-.7-7-1.9l-.5-.3-4.8 1.4 1.4-4.7-.3-.5c-1.4-2.2-2.1-4.7-2.1-7.3C2.6 8.6 8.6 2.6 16 2.6S29.4 8.6 29.4 16 23.4 28.8 16 28.8zm7.4-9.6c-.4-.2-2.4-1.2-2.7-1.3-.4-.1-.6-.2-.9.2-.3.4-1 1.3-1.2 1.5-.2.2-.4.3-.8.1-.4-.2-1.7-.6-3.2-2-1.2-1-2-2.3-2.2-2.7-.2-.4 0-.6.2-.8.2-.2.4-.4.5-.7.2-.2.2-.4.4-.6.1-.3 0-.5 0-.7s-.9-2.1-1.2-2.9c-.3-.8-.6-.7-.9-.7h-.7c-.2 0-.6.1-.9.5-.3.4-1.2 1.2-1.2 2.9s1.2 3.4 1.4 3.6c.2.2 2.5 3.8 6 5.3.8.4 1.5.6 2 .8.8.3 1.6.2 2.2.1.7-.1 2.4-1 2.7-1.9.3-.9.3-1.7.2-1.9-.1-.2-.3-.2-.7-.4z" />
        </svg>
      </a>
    </div>
  );
}
