"use client";

import {
  PAGE_CONTAINER,
  PAGE_SECTION_BORDERED,
  REVEAL,
  SECTION_LEAD,
} from "@/lib/ui";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/LanguageProvider";
import { pickPage } from "@/lib/cms";
import { PAGE_DEFAULTS } from "@/lib/cms/defaults";
import { openInquiryPopup } from "@/lib/inquiryPopup";
import SeoDisclosure from "@/components/SeoDisclosure";

const DEFAULTS = PAGE_DEFAULTS.courses;

function splitParagraphs(text = "") {
  return String(text)
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function scrollToCourses() {
  document.getElementById("courses-list")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function openDemo(message) {
  openInquiryPopup({ source: "courses_demo", message });
}

const SEO_BLOCK_TITLE =
  "institute-seo-block__title font-sans text-balance font-bold leading-snug tracking-tight text-ink";

function SeoBlock({ title, paragraphs, tagline, steps, cta, ctaAction, className, lang }) {
  return (
    <article className={cn("institute-seo-block", REVEAL, className)}>
      <h2 className={SEO_BLOCK_TITLE}>{title}</h2>
      {paragraphs.length > 0 && (
        <SeoDisclosure lang={lang}>
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 48)} className={cn(SECTION_LEAD, "institute-seo-block__body text-pretty")}>
              {paragraph}
            </p>
          ))}
        </SeoDisclosure>
      )}
      {tagline && <p className="institute-seo-block__tagline">{tagline}</p>}
      {steps && <p className="institute-seo-block__steps">{steps}</p>}
      {cta && (
        <div className="institute-seo-block__cta-wrap">
          {ctaAction === "demo" ? (
            <button type="button" className="institute-seo-block__cta" onClick={() => openDemo()}>
              {cta}
              <span aria-hidden>→</span>
            </button>
          ) : (
            <button type="button" className="institute-seo-block__cta" onClick={scrollToCourses}>
              {cta}
              <span aria-hidden>→</span>
            </button>
          )}
        </div>
      )}
    </article>
  );
}

function useCoursesSeoContent(coursesPage = {}) {
  const { lang } = useLanguage();
  const hi = lang === "hi";

  const introBody =
    pickPage(coursesPage, lang, "introBody", "introBodyHi") || DEFAULTS.intro_body;
  const introCtaPrimary =
    pickPage(coursesPage, lang, "introCtaPrimary", "introCtaPrimaryHi") || DEFAULTS.intro_cta_primary;
  const introCtaSecondary = lang === "hi" ? DEFAULTS.intro_cta_secondary_hi : DEFAULTS.intro_cta_secondary;

  const sections = [
    {
      key: "practical",
      title:
        pickPage(coursesPage, lang, "seoPracticalTitle", "seoPracticalTitleHi") ||
        DEFAULTS.seo_practical_title,
      body: pickPage(coursesPage, lang, "seoPracticalBody", "seoPracticalBodyHi") || DEFAULTS.seo_practical_body,
      tagline:
        pickPage(coursesPage, lang, "seoPracticalTagline", "seoPracticalTaglineHi") ||
        DEFAULTS.seo_practical_tagline,
      cta:
        pickPage(coursesPage, lang, "seoPracticalCta", "seoPracticalCtaHi") || DEFAULTS.seo_practical_cta,
      ctaAction: "courses",
    },
    {
      key: "classes",
      title:
        pickPage(coursesPage, lang, "seoClassesTitle", "seoClassesTitleHi") || DEFAULTS.seo_classes_title,
      body: pickPage(coursesPage, lang, "seoClassesBody", "seoClassesBodyHi") || DEFAULTS.seo_classes_body,
      tagline:
        pickPage(coursesPage, lang, "seoClassesTagline", "seoClassesTaglineHi") ||
        DEFAULTS.seo_classes_tagline,
      cta: pickPage(coursesPage, lang, "seoClassesCta", "seoClassesCtaHi") || DEFAULTS.seo_classes_cta,
      ctaAction: "demo",
    },
    {
      key: "stitching",
      title:
        pickPage(coursesPage, lang, "seoStitchingTitle", "seoStitchingTitleHi") ||
        DEFAULTS.seo_stitching_title,
      body: pickPage(coursesPage, lang, "seoStitchingBody", "seoStitchingBodyHi") || DEFAULTS.seo_stitching_body,
      tagline:
        pickPage(coursesPage, lang, "seoStitchingTagline", "seoStitchingTaglineHi") ||
        DEFAULTS.seo_stitching_tagline,
      cta:
        pickPage(coursesPage, lang, "seoStitchingCta", "seoStitchingCtaHi") || DEFAULTS.seo_stitching_cta,
      ctaAction: "courses",
    },
    {
      key: "boutique",
      title:
        pickPage(coursesPage, lang, "seoBoutiqueTitle", "seoBoutiqueTitleHi") || DEFAULTS.seo_boutique_title,
      body: pickPage(coursesPage, lang, "seoBoutiqueBody", "seoBoutiqueBodyHi") || DEFAULTS.seo_boutique_body,
      steps:
        pickPage(coursesPage, lang, "seoBoutiqueSteps", "seoBoutiqueStepsHi") || DEFAULTS.seo_boutique_steps,
    },
    {
      key: "closing",
      title:
        pickPage(coursesPage, lang, "seoClosingTitle", "seoClosingTitleHi") || DEFAULTS.seo_closing_title,
      body: pickPage(coursesPage, lang, "seoClosingBody", "seoClosingBodyHi") || DEFAULTS.seo_closing_body,
      className: "institute-seo-block--closing",
    },
  ];

  return { hi, introBody, introCtaPrimary, introCtaSecondary, sections };
}

export function CoursesIntroStrip({ coursesPage = {} }) {
  const { hi, introBody, introCtaSecondary } = useCoursesSeoContent(coursesPage);

  if (!introBody) return null;

  return (
    <div className={cn(PAGE_CONTAINER, "institute-seo-intro", "relative", "z-20", "max-w-3xl", REVEAL)}>
      <SeoDisclosure lang={hi ? "hi" : "en"}>
        <p className={cn(SECTION_LEAD, "text-center text-pretty mx-auto max-w-2xl")}>{introBody}</p>
      </SeoDisclosure>
      <div className="institute-seo-intro__ctas">
        <button
          type="button"
          className="institute-seo-block__cta institute-seo-block__cta--secondary institute-seo-block__cta--demo-pulse"
          onClick={() =>
            openDemo(
              hi
                ? "नमस्ते! मैं Shreya Creation में मुफ़्त डेमो क्लास बुक करना चाहती/चाहता हूँ।"
                : "Hi! I'd like to book a free demo class at Shreya Creation."
            )
          }
        >
          {introCtaSecondary}
        </button>
      </div>
    </div>
  );
}

export function InstituteSeoBlocks({ coursesPage = {} }) {
  const { sections, hi } = useCoursesSeoContent(coursesPage);

  return (
    <section
      className={cn(
        PAGE_SECTION_BORDERED,
        "institute-seo",
        "institute-seo--content",
        "relative",
        "z-20",
        "min-w-0"
      )}
    >
      <div className={cn(PAGE_CONTAINER, "institute-seo__inner", "max-w-3xl")}>
        <div className="institute-seo__sections">
          {sections.map((section, index) => (
            <SeoBlock
              key={section.key}
              title={section.title}
              lang={hi ? "hi" : "en"}
              paragraphs={splitParagraphs(section.body)}
              tagline={section.tagline}
              steps={section.steps}
              cta={section.cta}
              ctaAction={section.ctaAction}
              className={cn(section.className, index % 2 === 1 && "institute-seo-block--alt")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function InstituteSeoSections({ coursesPage = {} }) {
  return (
    <>
      <CoursesIntroStrip coursesPage={coursesPage} />
      <InstituteSeoBlocks coursesPage={coursesPage} />
    </>
  );
}
