"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  BTN_PRIMARY,
  BTN_SECONDARY,
  PAGE_CONTAINER,
  PAGE_SECTION,
  PAGE_SECTION_BORDERED,
  SECTION_EYEBROW,
  SECTION_LEAD,
  SECTION_ORNAMENT,
  SECTION_TITLE,
  SPARKLE_PULSE,
} from "@/lib/ui";
import { cn } from "@/lib/utils";
import AmbientGlows from "@/components/AmbientGlows";
import { useLanguage } from "@/components/LanguageProvider";
import { pickPage } from "@/lib/cms";
import { localizedPath } from "@/lib/locale";
import { waLink } from "@/lib/whatsapp";
import SeoDisclosure from "@/components/SeoDisclosure";

const EASE = [0.16, 1, 0.3, 1];

function SectionHead({ eyebrow, title, subtitle, center = true, as: TitleTag = "h2" }) {
  return (
    <div className={cn("boutique-v2-head seo-landing__head", center && "boutique-v2-head--center")}>
      {eyebrow && (
        <span className={cn(SECTION_EYEBROW, "boutique-v2-eyebrow seo-landing__eyebrow")}>
          <span className={cn(SPARKLE_PULSE, "text-gold", "text-[10px]")} aria-hidden>
            ✦
          </span>
          {eyebrow}
        </span>
      )}
      {title && (
        <TitleTag
          className={cn(
            SECTION_TITLE,
            "boutique-v2-section-title seo-landing__section-title",
            "mt-2 text-[clamp(1.35rem,5.2vw,2.25rem)] md:text-4xl"
          )}
        >
          {title}
        </TitleTag>
      )}
      {subtitle && (
        <p className={cn(SECTION_LEAD, "mt-3", "max-w-2xl", "px-0.5", center && "mx-auto")}>
          {subtitle}
        </p>
      )}
      <div className={cn(SECTION_ORNAMENT, "mt-3 sm:mt-4")} aria-hidden>
        <span className="text-gold text-xs">✦</span>
      </div>
    </div>
  );
}

function Prose({ paragraphs, className, lang }) {
  return (
    <SeoDisclosure lang={lang} className={className} contentClassName="seo-landing__prose mx-auto max-w-3xl space-y-3.5 sm:space-y-4">
      {paragraphs.map((p) => (
        <p key={p.slice(0, 56)} className={cn(SECTION_LEAD, "text-pretty text-ink/80 text-[0.9375rem] sm:text-base md:text-lg")}>
          {p}
        </p>
      ))}
    </SeoDisclosure>
  );
}

function CtaRow({ stitchHref, shopHref, primaryCta, secondaryCta }) {
  return (
    <div className="seo-landing__ctas boutique-v2-hero-ctas mt-7 sm:mt-8">
      <a href={stitchHref} target="_blank" rel="noopener noreferrer" className={cn(BTN_PRIMARY, "seo-landing__cta")}>
        {primaryCta}
      </a>
      <Link href={shopHref} className={cn(BTN_SECONDARY, "seo-landing__cta")}>
        {secondaryCta}
      </Link>
    </div>
  );
}

export default function SeoLandingClient({ content, site, cmsPage = {} }) {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const page = cmsPage || {};

  const eyebrow =
    pickPage(page, lang, "headerEyebrow", "headerEyebrowHi") || content.eyebrow;
  const h1 = pickPage(page, lang, "headerTitle", "headerTitleHi") || content.h1;
  const headerLead =
    pickPage(page, lang, "headerSubtitle", "headerSubtitleHi") ||
    content.lead ||
    content.meta?.description ||
    "";
  const introBody = pickPage(page, lang, "introBody", "introBodyHi");
  const intro = introBody
    ? introBody
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean)
    : content.intro;

  const primaryCta =
    pickPage(page, lang, "heroCtaPrimaryLabel", "heroCtaPrimaryLabelHi") || content.primaryCta;
  const secondaryCta =
    pickPage(page, lang, "heroCtaSecondaryLabel", "heroCtaSecondaryLabelHi") ||
    content.secondaryCta;
  const secondaryHref = page.heroCtaSecondaryHref || page.hero_cta_secondary_href || "/shop";
  const waMessage = page.ctaWaMessage || page.cta_wa_message || content.waMessage;

  const stitchHref = waLink(site?.whatsapp, waMessage);
  const shopHref = localizedPath(secondaryHref, lang);

  const rise = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.65, delay, ease: EASE },
  });

  return (
    <div className="boutique-page boutique-page--v2 seo-landing relative min-w-0 w-full overflow-x-clip">
      <section
        className={cn(
          PAGE_CONTAINER,
          "boutique-v2-hero seo-landing__hero",
          "max-w-4xl",
          "pt-[calc(var(--header-offset)+0.5rem)]",
          "sm:pt-[calc(var(--header-offset)+1.25rem)]",
          "pb-7 sm:pb-10",
          "relative z-20 min-w-0 w-full text-center"
        )}
      >
        <AmbientGlows variant="header" />

        <motion.span
          className={cn(SECTION_EYEBROW, "boutique-v2-eyebrow seo-landing__eyebrow")}
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <span className={cn(SPARKLE_PULSE, "text-gold", "text-[10px]")} aria-hidden>
            ✦
          </span>
          {eyebrow}
        </motion.span>

        <motion.h1
          className="seo-landing__h1 mt-3 font-display text-balance break-words text-[clamp(1.45rem,6.2vw,2.75rem)] font-bold leading-[1.18] tracking-tight text-ink"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
        >
          {h1}
        </motion.h1>

        <motion.div
          className="seo-landing__intro mt-5 space-y-3.5 sm:mt-6 sm:space-y-4"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
        >
          {(headerLead || intro.length > 0) && (
            <SeoDisclosure lang={lang}>
              {headerLead && (
                <p
                  className={cn(
                    SECTION_LEAD,
                    "mx-auto max-w-2xl text-pretty text-ink/80 text-[0.9375rem] sm:text-base md:text-lg"
                  )}
                >
                  {headerLead}
                </p>
              )}
              {intro.map((p) => (
                <p
                  key={p.slice(0, 48)}
                  className={cn(
                    SECTION_LEAD,
                    "mx-auto max-w-2xl text-pretty text-ink/80 text-[0.9375rem] sm:text-base md:text-lg"
                  )}
                >
                  {p}
                </p>
              ))}
            </SeoDisclosure>
          )}
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.36, ease: EASE }}
        >
          <CtaRow
            stitchHref={stitchHref}
            shopHref={shopHref}
            primaryCta={primaryCta}
            secondaryCta={secondaryCta}
          />
        </motion.div>
      </section>

      <section
        className={cn(
          PAGE_CONTAINER,
          PAGE_SECTION,
          PAGE_SECTION_BORDERED,
          "seo-landing__section max-w-6xl py-8 sm:py-10 md:py-12"
        )}
      >
        <motion.div {...rise(0.05)}>
          <SectionHead title={content.story.title} />
          <Prose paragraphs={content.story.body} lang={lang} className="mt-5 sm:mt-6" />
        </motion.div>
      </section>

      <section
        className={cn(PAGE_CONTAINER, PAGE_SECTION, "seo-landing__section max-w-6xl py-10 sm:py-14 md:py-24")}
      >
        <motion.div {...rise(0.05)}>
          <SectionHead title={content.servicesTitle} />
          <ul className="seo-landing__services mx-auto mt-6 flex max-w-4xl flex-wrap justify-center gap-x-1.5 gap-y-2.5 sm:mt-8 sm:gap-x-2 sm:gap-y-3">
            {content.services.map((service) => (
              <li key={service} className="seo-landing__service">
                {service}
              </li>
            ))}
          </ul>
        </motion.div>
      </section>

      <section
        className={cn(
          PAGE_CONTAINER,
          PAGE_SECTION,
          PAGE_SECTION_BORDERED,
          "seo-landing__section max-w-6xl py-8 sm:py-10 md:py-12"
        )}
      >
        <motion.div {...rise(0.05)}>
          <SectionHead title={content.destination.title} />
          <Prose paragraphs={content.destination.body} lang={lang} className="mt-5 sm:mt-6" />
        </motion.div>
      </section>

      <section
        className={cn(PAGE_CONTAINER, PAGE_SECTION, "seo-landing__section max-w-6xl py-10 sm:py-14 md:py-24")}
      >
        <SectionHead title={content.offeringsTitle} />
        <motion.ul
          className="seo-landing__offerings mt-7 grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 sm:mt-10 sm:gap-4 lg:grid-cols-3"
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
        >
          {content.offerings.map((item) => (
            <motion.li
              key={item.title}
              className="seo-landing__card min-w-0 rounded-2xl border border-orange/15 bg-orange/[0.03] px-4 py-4 sm:px-6 sm:py-6"
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
              }}
            >
              <h3 className="font-display text-base text-ink break-words sm:text-xl">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/70 sm:mt-2 sm:text-[0.9375rem]">
                {item.desc}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </section>

      <section
        className={cn(
          PAGE_CONTAINER,
          PAGE_SECTION,
          PAGE_SECTION_BORDERED,
          "seo-landing__section max-w-6xl py-8 sm:py-10 md:py-12"
        )}
      >
        <motion.div {...rise(0.05)}>
          <SectionHead title={content.why.title} />
          <Prose paragraphs={content.why.body} lang={lang} className="mt-5 sm:mt-6" />
        </motion.div>

        {content.whyItemsTitle && (
          <h3
            className={cn(
              SECTION_TITLE,
              "boutique-v2-section-title seo-landing__section-title mt-9 text-center text-[clamp(1.2rem,4.5vw,1.75rem)] sm:mt-12"
            )}
          >
            {content.whyItemsTitle}
          </h3>
        )}

        <motion.ul
          className="seo-landing__why-items mt-6 grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 sm:mt-8 sm:gap-4 lg:grid-cols-3"
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        >
          {content.whyItems.map((item) => (
            <motion.li
              key={item.title}
              className="seo-landing__why-item min-w-0 border-l-2 border-orange/40 bg-white/40 pl-3.5 pr-2.5 py-2.5 sm:pl-4 sm:pr-3 sm:py-3 dark:bg-[rgba(20,16,28,0.35)]"
              variants={{
                hidden: { opacity: 0, x: -10 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE } },
              }}
            >
              <h3 className="font-display text-[0.95rem] text-ink break-words sm:text-lg">{item.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink/70 sm:mt-1.5">{item.desc}</p>
            </motion.li>
          ))}
        </motion.ul>
      </section>

      <section
        className={cn(
          PAGE_CONTAINER,
          PAGE_SECTION,
          "seo-landing__section seo-landing__closing max-w-4xl py-10 text-center sm:py-14 md:py-24"
        )}
      >
        <motion.div {...rise(0.05)}>
          <SectionHead title={content.closing.title} />
          <p
            className={cn(
              SECTION_LEAD,
              "mx-auto mt-4 max-w-2xl text-pretty text-ink/80 text-[0.9375rem] sm:mt-5 sm:text-base md:text-lg"
            )}
          >
            {content.closing.body}
          </p>
          {content.closing.tagline && (
            <p className="boutique-v2-script mt-3 text-base sm:mt-4 sm:text-xl">{content.closing.tagline}</p>
          )}
          <CtaRow
            stitchHref={stitchHref}
            shopHref={shopHref}
            primaryCta={primaryCta}
            secondaryCta={secondaryCta}
          />
        </motion.div>
      </section>
    </div>
  );
}
