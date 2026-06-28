"use client";

import Link from "next/link";
import { pickPage } from "@/lib/cms";

export function useCareerCtaProps(home = {}, lang = "en") {
  const label =
    pickPage(home, lang, "heroBoutiqueCta", "heroBoutiqueCtaHi") ||
    pickPage(home, lang, "heroCtaLabel", "heroCtaLabelHi") ||
    (lang === "hi" ? "आपका करियर यहीं से शुरू हो" : "Your Career Starts Here");

  const href =
    pickPage(home, lang, "heroCtaHref", "heroCtaHrefHi") ||
    home.hero_cta_href ||
    "/contact";

  return { label, href };
}

export function CareerCtaButton({ home = {}, lang = "en", className = "" }) {
  const { label, href } = useCareerCtaProps(home, lang);

  return (
    <Link
      href={href}
      className={`career-cta-section__btn${className ? ` ${className}` : ""}`}
    >
      <span className="career-cta-section__ribbon" aria-hidden />
      <span className="career-cta-section__text">
        {label}
        <span className="career-cta-section__arrow" aria-hidden>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </span>
    </Link>
  );
}

export default function CareerCtaSection({ home = {}, lang = "en" }) {
  return (
    <section
      className={`career-cta-section reveal${lang === "hi" ? " career-cta-section--hi" : ""}`}
      aria-label={lang === "hi" ? "करियर शुरू करें" : "Start your career"}
    >
      <div className="career-cta-section__inner page-container">
        <CareerCtaButton home={home} lang={lang} />
      </div>
    </section>
  );
}
