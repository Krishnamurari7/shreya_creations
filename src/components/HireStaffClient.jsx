"use client";

import Image from "next/image";
import Link from "next/link";
import HiringForm from "@/components/HiringForm";
import { STAFF_ROLES } from "@/lib/hiring";
import { HIRING_COPY, hiringOptionLabel } from "@/lib/hiring-copy";

function Eyebrow({ children, light = false }) {
  return <p className={"flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] " + (light ? "text-[#e7b184]" : "text-orange")}>
    <span className={"h-px w-7 " + (light ? "bg-[#e7b184]" : "bg-orange")} aria-hidden="true" />{children}
  </p>;
}

export default function HireStaffClient({ contactHref, locale = "en" }) {
  const copy = HIRING_COPY[locale] || HIRING_COPY.en;
  const t = copy.page;
  return <div className="hiring-page text-ink">
    <section className="relative isolate overflow-hidden bg-[#251a15] text-[#fff8ef]" aria-labelledby="hiring-hero-title">
      <div className="pointer-events-none absolute -left-32 top-12 h-96 w-96 rounded-full bg-orange/10 blur-3xl" aria-hidden="true" />
      <div className="mx-auto grid max-w-[96rem] lg:min-h-[670px] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)]">
        <div className="relative z-10 flex min-w-0 flex-col justify-center px-5 pb-14 pt-32 sm:px-8 sm:pb-20 sm:pt-36 lg:pl-[max(3rem,calc((100vw-80rem)/2))] lg:pr-10 xl:pr-16">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Eyebrow light>{t.heroEyebrow}</Eyebrow>
            <nav aria-label={locale === "hi" ? "भाषा चुनें" : "Choose language"} className="flex shrink-0 items-center rounded-full border border-white/25 p-1 text-xs font-semibold">
              <Link href="/hire-trained-professionals" aria-current={locale === "en" ? "page" : undefined} className={"rounded-full px-3 py-1.5 transition " + (locale === "en" ? "bg-[#fff8ef] text-[#251a15]" : "text-[#fff8ef] hover:bg-white/10")}>English</Link>
              <Link href="/hi/hire-trained-professionals" aria-current={locale === "hi" ? "page" : undefined} className={"rounded-full px-3 py-1.5 transition " + (locale === "hi" ? "bg-[#fff8ef] text-[#251a15]" : "text-[#fff8ef] hover:bg-white/10")}>हिन्दी</Link>
            </nav>
          </div>
          <h1 id="hiring-hero-title" className="mt-7 max-w-3xl break-words font-display !text-[#fff8ef] text-[clamp(2.75rem,5.2vw,5.8rem)] font-semibold leading-[1.07] tracking-[-0.045em]">
            {t.heroTitle} <span className="text-[#e7b184]">{t.heroAccent}</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-[#efe1d2] sm:text-lg">{t.heroDescription}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href="#staff-requirement-form" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-orange px-7 py-3 font-semibold text-white shadow-[0_14px_32px_rgba(204,79,6,.24)] transition hover:bg-orange-light focus-visible:outline-white">{t.shareRequirement} <span aria-hidden="true">↗</span></a>
            {contactHref && <a href={contactHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-[#c9ac95] px-7 py-3 font-semibold text-[#fff8ef] transition hover:bg-white/10 focus-visible:outline-white">{t.talkToTeam} <span aria-hidden="true">↗</span></a>}
          </div>
          <div className="mt-11 flex flex-wrap items-center gap-x-7 gap-y-2 border-t border-white/15 pt-5 text-xs font-medium uppercase tracking-[0.15em] text-[#d9c2b0]">
            {t.heroTags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        </div>
        <div className="relative min-h-[340px] overflow-hidden sm:min-h-[440px] lg:min-h-full">
          <Image src="/slider4.webp" alt={t.imageAlt} fill sizes="(max-width: 1024px) 100vw, 48vw" className="object-cover object-[55%_center] lg:object-[58%_center]" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-[#251a15]/70 via-transparent to-transparent" aria-hidden="true" />
          <div className="absolute bottom-5 left-5 right-5 max-w-sm rounded-2xl border border-white/25 bg-[#251a15]/75 p-5 text-[#fff8ef] backdrop-blur-md sm:bottom-8 sm:left-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e7b184]">{t.imageEyebrow}</p>
            <p className="mt-2 font-display text-xl leading-snug">{t.imageCaption}</p>
          </div>
        </div>
      </div>
    </section>

    <div className="border-b border-ink/10 bg-[var(--surface-muted)]">
      <div className="mx-auto grid max-w-page px-5 sm:grid-cols-3 sm:px-8">
        {t.ribbon.map(([title, detail], index) => <div key={title} className="flex gap-4 border-b border-ink/10 py-5 last:border-b-0 sm:border-b-0 sm:border-r sm:px-6 sm:first:pl-0 sm:last:border-r-0 sm:last:pr-0">
          <span className="font-display text-xl text-orange">{String(index + 1).padStart(2, "0")}</span>
          <div><p className="font-semibold leading-6">{title}</p><p className="mt-0.5 text-sm text-muted">{detail}</p></div>
        </div>)}
      </div>
    </div>

    <section className="bg-bg py-20 sm:py-24" aria-labelledby="hiring-industries-title">
      <div className="mx-auto grid max-w-page gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,.36fr)_minmax(0,.64fr)] lg:gap-16">
        <div className="lg:pt-5"><Eyebrow>{t.industriesEyebrow}</Eyebrow>
          <h2 id="hiring-industries-title" className="mt-5 max-w-md font-display text-4xl leading-[1.15] sm:text-5xl">{t.industriesTitle}</h2>
          <p className="mt-5 max-w-md leading-7 text-muted">{t.industriesDescription}</p>
          <a href="#staff-requirement-form" className="mt-6 inline-flex items-center gap-2 font-semibold text-orange underline decoration-orange/40 underline-offset-4 hover:decoration-orange">{t.startBrief} <span aria-hidden="true">↗</span></a>
        </div>
        <div className="grid gap-x-9 sm:grid-cols-2">
          {t.categories.map(([title, detail], index) => <article key={title} className="flex min-w-0 gap-4 border-b border-ink/15 py-5 first:border-t sm:[&:nth-child(2)]:border-t">
            <span className="min-w-7 pt-1 text-xs font-semibold tracking-wider text-orange">{String(index + 1).padStart(2, "0")}</span>
            <div className="min-w-0"><h3 className="font-display text-xl leading-snug sm:text-2xl">{title}</h3><p className="mt-2 text-sm leading-6 text-muted">{detail}</p></div>
          </article>)}
        </div>
      </div>
    </section>

    <section className="bg-[#2d211b] py-20 text-[#fff8ef] sm:py-24" aria-labelledby="hiring-roles-title">
      <div className="mx-auto max-w-page px-5 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,.55fr)_minmax(0,.45fr)] lg:items-end">
          <div><Eyebrow light>{t.rolesEyebrow}</Eyebrow><h2 id="hiring-roles-title" className="mt-5 max-w-2xl font-display !text-[#fff8ef] text-4xl leading-[1.15] sm:text-5xl">{t.rolesTitle}</h2></div>
          <p className="max-w-lg leading-7 text-[#decbbd]">{t.rolesDescription}</p>
        </div>
        <div className="mt-11 grid border-t border-white/20 sm:grid-cols-2 lg:grid-cols-3">
          {STAFF_ROLES.filter((role) => role !== "Other").map((role) => <div key={role} className="flex min-w-0 items-center gap-4 border-b border-white/20 py-4 pr-4">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#e7b184]" aria-hidden="true" /><span className="font-medium leading-6 text-[#fff8ef]">{hiringOptionLabel(locale, role)}</span>
          </div>)}
        </div>
      </div>
    </section>

    <section className="bg-surface py-20 sm:py-24" aria-labelledby="hiring-process-title">
      <div className="mx-auto grid max-w-page gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,.36fr)_minmax(0,.64fr)] lg:gap-16">
        <div><Eyebrow>{t.processEyebrow}</Eyebrow><h2 id="hiring-process-title" className="mt-5 max-w-md font-display text-4xl leading-[1.15] sm:text-5xl">{t.processTitle}</h2><p className="mt-5 max-w-md leading-7 text-muted">{t.processDescription}</p></div>
        <ol className="border-t border-ink/15">
          {t.process.map(([title, detail], index) => <li key={title} className="grid gap-4 border-b border-ink/15 py-5 sm:grid-cols-[4rem_minmax(0,1fr)] sm:py-6">
            <span className="font-display text-3xl text-orange">{String(index + 1).padStart(2, "0")}</span>
            <div><h3 className="font-display text-2xl">{title}</h3><p className="mt-2 max-w-xl text-sm leading-7 text-muted sm:text-base">{detail}</p></div>
          </li>)}
        </ol>
      </div>
    </section>

    <HiringForm contactHref={contactHref} locale={locale} terms={t.terms} />

    <section id="employer-terms" className="scroll-mt-28 border-t border-ink/10 bg-bg py-16 sm:py-20" aria-labelledby="employer-terms-title">
      <div className="mx-auto grid max-w-page gap-8 px-5 sm:px-8 lg:grid-cols-[minmax(0,.36fr)_minmax(0,.64fr)] lg:gap-16">
        <div><Eyebrow>{t.termsEyebrow}</Eyebrow><h2 id="employer-terms-title" className="mt-5 font-display text-3xl sm:text-4xl">{t.termsTitle}</h2><p className="mt-4 leading-7 text-muted">{t.termsDescription}</p></div>
        <div className="rounded-3xl border border-ink/10 bg-surface p-6 shadow-card sm:p-8">
          <details className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold marker:hidden"><span>{t.termsSummary}</span><span className="text-2xl leading-none text-orange transition group-open:rotate-45" aria-hidden="true">+</span></summary>
            <ol className="mt-6 list-decimal space-y-3 border-t border-ink/10 pt-6 pl-5 text-sm leading-7 text-muted">{t.terms.map((term) => <li key={term}>{term}</li>)}</ol>
          </details>
          <p className="mt-5 border-t border-ink/10 pt-5 text-sm leading-6 text-muted">{t.privacyIntro} <Link href={locale === "hi" ? "/hi/policies/privacy" : "/policies/privacy"} className="font-semibold text-orange underline underline-offset-2">{t.privacyLabel}</Link>.</p>
        </div>
      </div>
    </section>

    <section className="bg-orange px-5 py-16 text-center text-white sm:px-8 sm:py-20" aria-labelledby="hiring-final-title">
      <div className="mx-auto max-w-3xl"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">{t.finalEyebrow}</p><h2 id="hiring-final-title" className="mt-4 font-display !text-white text-4xl leading-tight sm:text-5xl">{t.finalTitle}</h2><p className="mx-auto mt-4 max-w-2xl leading-7 text-white/90">{t.finalDescription}</p><a href="#staff-requirement-form" className="mt-8 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-white px-7 py-3 font-semibold text-orange-dark transition hover:bg-[#fff3e8]">{t.finalButton} <span aria-hidden="true">↗</span></a></div>
    </section>
  </div>;
}
