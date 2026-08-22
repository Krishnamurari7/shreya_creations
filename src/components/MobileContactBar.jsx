"use client";

import { waLink, greetingMessage } from "@/lib/whatsapp";
import { telHref, formatPhoneDisplay } from "@/lib/site-config";
import { useLanguage } from "@/components/LanguageProvider";

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.436.002 9.861-4.417 9.864-9.858.002-2.636-1.02-5.115-2.879-6.978-1.859-1.862-4.331-2.887-6.974-2.889-5.439 0-9.864 4.417-9.868 9.86-.001 1.57.418 3.101 1.21 4.47l-.995 3.633 3.738-.979c1.378.75 2.766 1.139 4.239 1.14z" />
    </svg>
  );
}

export default function MobileContactBar({ site }) {
  const { lang } = useLanguage();
  const hi = lang === "hi";
  const phoneHref = telHref(site?.phonePrimary || site?.phone1);
  const waHref = waLink(site?.whatsapp, greetingMessage(lang));
  const phoneLabel = formatPhoneDisplay(site?.phonePrimary || site?.phone1 || site?.phone);

  if (!phoneHref && !waHref) return null;

  return (
    <div className="mobile-contact-bar" role="navigation" aria-label={hi ? "तुरंत संपर्क" : "Quick contact"}>
      {phoneHref && (
        <a
          href={phoneHref}
          className="mobile-contact-bar__btn mobile-contact-bar__btn--call"
          data-track-cta="mobile_sticky_call"
          aria-label={hi ? `कॉल करें ${phoneLabel}` : `Call ${phoneLabel}`}
        >
          <PhoneIcon />
          <span>{hi ? "कॉल" : "Call"}</span>
          <span className="sr-only">{phoneLabel}</span>
        </a>
      )}
      {waHref && (
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mobile-contact-bar__btn mobile-contact-bar__btn--wa"
          data-track-cta="mobile_sticky_whatsapp"
          aria-label={hi ? "WhatsApp पर चैट करें" : "Chat on WhatsApp"}
        >
          <WhatsAppIcon />
          <span>WhatsApp</span>
        </a>
      )}
    </div>
  );
}
