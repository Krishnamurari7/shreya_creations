"use client";

import { INTERACTIVE_CARD, REVEAL } from "@/lib/ui";
import { Glass3DCard } from "@/components/Glass3DCard";
import { useLanguage } from "@/components/LanguageProvider";
import { staggerDelay } from "@/lib/motion";
import { telLink } from "@/lib/whatsapp";
import { formatPhoneDisplay, telHref } from "@/lib/site-config";
import MapFacade from "@/components/MapFacade";
import { cn } from "@/lib/utils";

const COPY = {
  en: {
    whatsapp: "WhatsApp",
    whatsappDesc: "Instant boutique support & sizing consultations.",
    whatsappCta: "Chat with us instantly",
    phone: "Phone",
    email: "Email",
    address: "Studio Address",
    hours: "Hours",
    closed: "Closed",
    instagram: "Instagram",
    instagramDesc: "Latest custom bridal fittings and atelier reels.",
    instagramCta: "Follow us",
    facebook: "Facebook",
    facebookDesc: "Course updates, student stories & studio news.",
    facebookCta: "Like our page",
  },
  hi: {
    whatsapp: "WhatsApp",
    whatsappDesc: "तुरंत सहायता और माप की सलाह।",
    whatsappCta: "अभी चैट करें",
    phone: "फ़ोन",
    email: "ईमेल",
    address: "स्टूडियो पता",
    hours: "समय",
    closed: "बंद",
    instagram: "Instagram",
    instagramDesc: "नवीनतम ब्राइडल फिटिंग और एटेलियर रील्स।",
    instagramCta: "फ़ॉलो करें",
    facebook: "Facebook",
    facebookDesc: "कोर्स अपडेट, छात्रों की कहानियाँ और स्टूडियो न्यूज़।",
    facebookCta: "पेज लाइक करें",
  },
};

function IconBox({ children, className }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center text-orange shrink-0 group-hover:scale-110 transition-transform duration-300",
        className
      )}
    >
      {children}
    </div>
  );
}

export default function ContactInfoCards({ site, wa, directionsUrl, directionsLabel }) {
  const { lang } = useLanguage();
  const t = COPY[lang] || COPY.en;

  const instagramHandle = site.socials?.instagram
    ? site.socials.instagram.replace(/.*instagram\.com\//, "@").replace(/\/$/, "")
    : "@shreya.creationss";

  const phonePrimary = site.phonePrimary || null;
  const phoneSecondary = site.phoneSecondary || null;
  const phoneHref = telHref(phonePrimary) || telLink(site.phone);
  const phoneLabel = [phonePrimary, phoneSecondary]
    .filter(Boolean)
    .map(formatPhoneDisplay)
    .join(" / ") || site.phone;

  return (
    <div className="contact-bento" data-stagger>
      <Glass3DCard
        layered
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(REVEAL, INTERACTIVE_CARD, "contact-bento-whatsapp", "rounded-2xl", "sm:rounded-3xl", "p-5", "sm:p-6", "md:p-7", "group")}
        style={staggerDelay(0, 80)}
      >
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
          <IconBox className="h-14 w-14 rounded-2xl bg-orange/12 border border-orange/20">
            <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.436.002 9.861-4.417 9.864-9.858.002-2.636-1.02-5.115-2.879-6.978-1.859-1.862-4.331-2.887-6.974-2.889-5.439 0-9.864 4.417-9.868 9.86-.001 1.57.418 3.101 1.21 4.47l-.995 3.633 3.738-.979c1.378.75 2.766 1.139 4.239 1.14zm9.955-6.858c-.27-.135-1.594-.787-1.84-.877-.246-.089-.427-.135-.607.135-.18.27-.697.877-.852 1.057-.155.18-.311.202-.58.067-.27-.135-1.14-.42-2.172-1.34-.803-.717-1.345-1.603-1.502-1.873-.158-.27-.017-.417.118-.552.121-.121.27-.315.405-.472.135-.158.18-.27.27-.45.09-.18.045-.337-.022-.472-.068-.135-.607-1.463-.832-2.003-.22-.527-.44-.455-.607-.464-.158-.008-.338-.01-.518-.01-.18 0-.472.067-.72.337-.247.27-.945.922-.945 2.249 0 1.327.965 2.609 1.099 2.79.135.18 1.9 2.9 4.602 4.07.642.278 1.144.444 1.534.569.645.205 1.233.176 1.698.107.518-.077 1.594-.652 1.819-1.282.225-.63.225-1.17.157-1.282-.068-.113-.247-.18-.518-.315z" />
            </svg>
          </IconBox>
          <div className="flex-1 min-w-0">
            <h3 className="contact-card-label">{t.whatsapp}</h3>
            <p className="text-sm text-muted font-normal mt-1 leading-relaxed">{t.whatsappDesc}</p>
            <span className="contact-card-link mt-3 inline-flex">
              {t.whatsappCta} <span aria-hidden>→</span>
            </span>
          </div>
        </div>
      </Glass3DCard>

      <div className="contact-bento-grid">
        {(phoneHref || phoneSecondary) && (
          <Glass3DCard
            layered
            className={cn(REVEAL, INTERACTIVE_CARD, "rounded-2xl", "sm:rounded-3xl", "p-5", "sm:p-6", "flex", "flex-col", "group", "min-h-[8.5rem]")}
            style={staggerDelay(1, 80)}
          >
            <IconBox className="h-11 w-11 rounded-xl bg-orange/10 mb-4">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </IconBox>
            <h3 className="contact-card-label">{t.phone}</h3>
            <div className="text-ink text-sm font-medium mt-auto pt-2 flex flex-col gap-1">
              {phonePrimary && (
                <a href={telHref(phonePrimary)} className="hover:text-orange transition-colors">
                  {formatPhoneDisplay(phonePrimary)}
                </a>
              )}
              {phoneSecondary && (
                <a href={telHref(phoneSecondary)} className="hover:text-orange transition-colors">
                  {formatPhoneDisplay(phoneSecondary)}
                </a>
              )}
              {!phonePrimary && !phoneSecondary && phoneHref && (
                <a href={phoneHref} className="hover:text-orange transition-colors">
                  {phoneLabel}
                </a>
              )}
            </div>
          </Glass3DCard>
        )}

        {site.email && (
          <Glass3DCard
            layered
            href={`mailto:${site.email}`}
            className={cn(REVEAL, INTERACTIVE_CARD, "rounded-2xl", "sm:rounded-3xl", "p-5", "sm:p-6", "flex", "flex-col", "group", "min-h-[8.5rem]")}
            style={staggerDelay(2, 80)}
          >
            <IconBox className="h-11 w-11 rounded-xl bg-orange/10 mb-4">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </IconBox>
            <h3 className="contact-card-label">{t.email}</h3>
            <span className="text-ink group-hover:text-orange transition-colors text-sm font-medium mt-auto pt-2 break-all">
              {site.email}
            </span>
          </Glass3DCard>
        )}
      </div>

      {site.address && (
        <Glass3DCard
          layered
          className={cn(REVEAL, INTERACTIVE_CARD, "contact-bento-address", "rounded-2xl", "sm:rounded-3xl", "p-5", "sm:p-6", "group")}
          style={staggerDelay(3, 80)}
        >
          <div className="flex gap-4 sm:gap-5">
            <IconBox className="h-12 w-12 rounded-2xl bg-orange/10 shrink-0">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </IconBox>
            <div className="min-w-0 flex-1">
              <h3 className="contact-card-label">{t.address}</h3>
              <p className="text-sm text-ink font-normal leading-relaxed mt-1">{site.address}</p>
              <span className="contact-hours-chip mt-3">
                {t.hours}: {site.studioHours || "Mon–Sat, 11 AM–8 PM"}
                {site.closedDays ? ` (${t.closed} ${site.closedDays})` : ""}
              </span>
            </div>
          </div>

          {(site.mapEmbedUrl || site.address) && (
            <MapFacade
              embedUrl={site.mapEmbedUrl}
              address={site.address}
              className="mt-4 sm:mt-5"
            />
          )}

          {directionsUrl && (
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card-link mt-3 inline-flex text-sm"
            >
              {directionsLabel || "Directions"} <span aria-hidden>→</span>
            </a>
          )}
        </Glass3DCard>
      )}

      {(site.socials?.instagram || site.socials?.facebook) && (
        <div className="contact-bento-grid">
          {site.socials?.instagram && (
            <Glass3DCard
              layered
              href={site.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(REVEAL, INTERACTIVE_CARD, "rounded-2xl", "sm:rounded-3xl", "p-5", "sm:p-6", "flex", "flex-col", "group", "min-h-[8.5rem]")}
              style={staggerDelay(4, 80)}
            >
              <IconBox className="h-11 w-11 rounded-xl bg-orange/10 mb-4">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </IconBox>
              <h3 className="contact-card-label">{t.instagram}</h3>
              <p className="text-sm text-muted font-normal mt-1 leading-relaxed">{t.instagramDesc}</p>
              <span className="contact-card-link mt-auto pt-3 inline-flex">
                {instagramHandle} <span aria-hidden>→</span>
              </span>
            </Glass3DCard>
          )}

          {site.socials?.facebook && (
            <Glass3DCard
              layered
              href={site.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(REVEAL, INTERACTIVE_CARD, "rounded-2xl", "sm:rounded-3xl", "p-5", "sm:p-6", "flex", "flex-col", "group", "min-h-[8.5rem]")}
              style={staggerDelay(5, 80)}
            >
              <IconBox className="h-11 w-11 rounded-xl bg-orange/10 mb-4">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </IconBox>
              <h3 className="contact-card-label">{t.facebook}</h3>
              <p className="text-sm text-muted font-normal mt-1 leading-relaxed">{t.facebookDesc}</p>
              <span className="contact-card-link mt-auto pt-3 inline-flex">
                {t.facebookCta} <span aria-hidden>→</span>
              </span>
            </Glass3DCard>
          )}
        </div>
      )}
    </div>
  );
}
