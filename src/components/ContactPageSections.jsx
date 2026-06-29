"use client";

import { PAGE_CONTAINER } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import ContactForm from "@/components/ContactForm";
import ContactInfoCards from "@/components/ContactInfoCards";
import SectionHeading from "@/components/SectionHeading";
import { useLanguage } from "@/components/LanguageProvider";
import { fadeUp } from "@/lib/motion";
import { telLink } from "@/lib/whatsapp";

const COPY = {
  en: {
    quickWhatsApp: "WhatsApp",
    quickCall: "Call",
    quickEmail: "Email",
    quickDirections: "Directions",
    quickFacebook: "Facebook",
    reachEyebrow: "Get in touch",
    reachTitle: "We're here to help",
    reachSubtitle: "Choose your preferred channel — we typically reply within minutes during studio hours.",
  },
  hi: {
    quickWhatsApp: "WhatsApp",
    quickCall: "कॉल",
    quickEmail: "ईमेल",
    quickDirections: "रास्ता",
    quickFacebook: "Facebook",
    reachEyebrow: "संपर्क करें",
    reachTitle: "हम मदद के लिए यहाँ हैं",
    reachSubtitle: "अपना तरीका चुनें — स्टूडियो के समय में मिनटों में जवाब मिलता है।",
  },
};

function QuickAction({ href, icon, label, external }) {
  const linkProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <a href={href} className="contact-quick-action" {...linkProps}>
      <span className="contact-quick-action__icon" aria-hidden>
        {icon}
      </span>
      <span className="contact-quick-action__label">{label}</span>
    </a>
  );
}

export default function ContactPageSections({ site, wa }) {
  const { lang } = useLanguage();
  const t = COPY[lang] || COPY.en;
  const reduceMotion = useReducedMotion();

  const directionsUrl = site.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address)}`
    : site.mapEmbedUrl;

  const phoneHref = telLink(site.phone);

  const quickActions = [
    {
      key: "wa",
      show: true,
      href: wa,
      external: true,
      label: t.quickWhatsApp,
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.436.002 9.861-4.417 9.864-9.858.002-2.636-1.02-5.115-2.879-6.978-1.859-1.862-4.331-2.887-6.974-2.889-5.439 0-9.864 4.417-9.868 9.86-.001 1.57.418 3.101 1.21 4.47l-.995 3.633 3.738-.979c1.378.75 2.766 1.139 4.239 1.14zm9.955-6.858c-.27-.135-1.594-.787-1.84-.877-.246-.089-.427-.135-.607.135-.18.27-.697.877-.852 1.057-.155.18-.311.202-.58.067-.27-.135-1.14-.42-2.172-1.34-.803-.717-1.345-1.603-1.502-1.873-.158-.27-.017-.417.118-.552.121-.121.27-.315.405-.472.135-.158.18-.27.27-.45.09-.18.045-.337-.022-.472-.068-.135-.607-1.463-.832-2.003-.22-.527-.44-.455-.607-.464-.158-.008-.338-.01-.518-.01-.18 0-.472.067-.72.337-.247.27-.945.922-.945 2.249 0 1.327.965 2.609 1.099 2.79.135.18 1.9 2.9 4.602 4.07.642.278 1.144.444 1.534.569.645.205 1.233.176 1.698.107.518-.077 1.594-.652 1.819-1.282.225-.63.225-1.17.157-1.282-.068-.113-.247-.18-.518-.315z" />
        </svg>
      ),
    },
    {
      key: "phone",
      show: !!phoneHref,
      href: phoneHref,
      label: t.quickCall,
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
    },
    {
      key: "email",
      show: !!site.email,
      href: `mailto:${site.email}`,
      label: t.quickEmail,
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      key: "directions",
      show: !!directionsUrl,
      href: directionsUrl,
      external: true,
      label: t.quickDirections,
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
    {
      key: "facebook",
      show: !!site.socials?.facebook,
      href: site.socials?.facebook,
      external: true,
      label: t.quickFacebook,
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
  ].filter((a) => a.show);

  return (
    <>
      {quickActions.length > 0 && (
        <section className={cn(PAGE_CONTAINER, "max-w-6xl", "pb-4", "sm:pb-6", "relative", "z-20")}>
          <motion.div
            className="contact-quick-bar"
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
            custom={0}
            variants={fadeUp}
          >
            {quickActions.map((action) => (
              <QuickAction key={action.key} {...action} />
            ))}
          </motion.div>
        </section>
      )}

      <section className={cn(PAGE_CONTAINER, "max-w-6xl", "pb-10", "sm:pb-14", "lg:pb-16", "relative", "z-20")}>
        <SectionHeading
          eyebrow={t.reachEyebrow}
          title={t.reachTitle}
          subtitle={t.reachSubtitle}
          className="mb-6 sm:mb-8 lg:mb-12"
        />

        <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 xl:gap-12 items-start min-w-0 w-full">
          <motion.div
            className="lg:col-span-5 xl:col-span-5 order-1 min-w-0 w-full"
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            custom={0.15}
            variants={fadeUp}
          >
            <ContactInfoCards site={site} wa={wa} directionsUrl={directionsUrl} directionsLabel={t.quickDirections} />
          </motion.div>

          <motion.div
            className="lg:col-span-7 xl:col-span-7 order-2 lg:sticky lg:top-[calc(var(--header-offset)+1.5rem)] min-w-0 w-full"
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            custom={0.25}
            variants={fadeUp}
          >
            <ContactForm number={site.whatsapp} />
          </motion.div>
        </div>
      </section>
    </>
  );
}
