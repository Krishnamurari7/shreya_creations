"use client";

import Link from "next/link";
import { waLink, greetingMessage } from "@/lib/whatsapp";
import { useLanguage } from "@/components/LanguageProvider";
import { UI, pickLocalized, pickTeamMember } from "@/lib/i18n";
import { DEFAULT_TEAM } from "@/lib/seed";

const NAV_ROUTES = [
  { href: "/", key: "home" },
  { href: "/shop", key: "shop" },
  { href: "/courses", key: "courses" },
  { href: "/portfolio", key: "portfolio" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
  { href: "/faq", key: "faq" },
  { href: "/lookbook", key: "lookbook" },
];

const POLICY_ROUTES = [
  { href: "/policies/privacy", key: "privacy" },
  { href: "/policies/shipping", key: "shipping" },
  { href: "/policies/returns", key: "returns" },
];

function SocialIcon({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group flex h-10 w-10 items-center justify-center rounded-full border border-orange/20 bg-surface text-ink transition-all duration-300 hover:border-purple/40 hover:bg-orange/5 hover:text-orange hover:shadow-md hover:shadow-orange/10"
    >
      {children}
    </a>
  );
}

export default function Footer({ site }) {
  const { lang } = useLanguage();
  const t = UI[lang];
  const navLinks = NAV_ROUTES.map((r) => ({ href: r.href, label: t[r.key] }));
  const policyLinks = POLICY_ROUTES.map((r) => ({ href: r.href, label: t[r.key] }));
  const wa = waLink(site?.whatsapp, greetingMessage());
  const boutique = pickLocalized(site, lang, "boutique", "boutiqueHi");
  const tagline = pickLocalized(site, lang, "tagline", "taglineHi");
  const intro = pickLocalized(site, lang, "intro", "introHi");
  const teamMembers = (site?.pages?.about?.teamMembers?.length
    ? site.pages.about.teamMembers
    : DEFAULT_TEAM
  ).map((m) => pickTeamMember(m, lang));
  const marqueeText = [boutique, tagline].filter(Boolean).join("  ·  ");
  const brandName = site?.brand || "Shreya creation";
  const [brandFirst, ...brandRest] = brandName.split(" ");
  const brandSecond = brandRest.join(" ") || "creation";

  return (
    <footer className="relative z-[2] overflow-hidden">
      {/* Top glow & gradient edge */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/50 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-32 left-1/4 h-64 w-64 rounded-full bg-orange/10 blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-24 right-1/4 h-56 w-56 rounded-full bg-purple/10 blur-[90px]"
        aria-hidden
      />

      {/* Tagline marquee */}
      {marqueeText && (
        <div className="footer-marquee-bar border-y border-ink/15 bg-cream/40 py-3 backdrop-blur-sm">
          <div className="marquee-container">
            <div className="marquee-content text-[11px] uppercase tracking-[0.35em] text-ink font-normal">
              {[...Array(4)].map((_, i) => (
                <span key={i} className="inline-flex items-center gap-3">
                  <span className="text-orange">✦</span>
                  {marqueeText}
                  <span className="text-purple-dark">✦</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="relative border-t border-gold/20 bg-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-5 pt-8 pb-4 sm:pt-12 sm:pb-6 lg:pt-16 lg:pb-8">
          <div className="grid gap-8 sm:gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
            {/* Brand column */}
            <div className="sm:col-span-2 lg:col-span-5 text-center sm:text-left">
              <div className="flex items-center gap-3 sm:gap-4 justify-center sm:justify-start">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt={brandName}
                  className="h-14 sm:h-16 w-auto max-w-[10rem] object-contain transition-transform duration-500 hover:scale-105 shrink-0"
                />
                <div>
                  <h3 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-none text-balance break-words">
                    <span className="text-brand-gold">{brandFirst}</span>{" "}
                    <span className="text-brand-purple">{brandSecond}</span>
                  </h3>
                  <span className="mt-1 block text-[10px] uppercase tracking-[0.28em] text-purple">
                    {boutique || "From Skill to Business"}
                  </span>
                </div>
              </div>

              <p className="mt-6 max-w-md mx-auto sm:mx-0 text-ink font-normal leading-relaxed">
                {intro ||
                  "Couture stitching, bespoke fashion design & courses. Every order, enrolment and enquiry happens on WhatsApp."}
              </p>

              {tagline && (
                <p className="mt-4 inline-block rounded-full border border-orange/20 bg-orange/5 px-4 py-1.5 text-xs tracking-wide text-orange-dark">
                  {tagline}
                </p>
              )}

              {teamMembers.length > 0 && (
                <div className="mt-5 space-y-1.5 text-sm text-ink">
                  {teamMembers.map((member) => (
                    <p key={member.name}>
                      <span className="font-medium">{member.name}</span>
                      <span className="text-muted"> — {member.role}</span>
                    </p>
                  ))}
                </div>
              )}

              {/* WhatsApp CTA */}
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold mt-6 sm:mt-8 inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full px-6 py-3 text-xs"
              >
                <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.436.002 9.861-4.417 9.864-9.858.002-2.636-1.02-5.115-2.879-6.978-1.859-1.862-4.331-2.887-6.974-2.889-5.439 0-9.864 4.417-9.868 9.86-.001 1.57.418 3.101 1.21 4.47l-.995 3.633 3.738-.979c1.378.75 2.766 1.139 4.239 1.14z" />
                </svg>
                {t.chatWhatsApp}
              </a>
            </div>

            {/* Explore */}
            <div className="lg:col-span-3">
              <h4 className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] sm:tracking-[0.22em] text-orange">
                <span className="h-px w-8 bg-gradient-to-r from-orange to-transparent" aria-hidden />
                Explore
              </h4>
              <ul className="space-y-3 font-normal">
                {navLinks.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="group relative inline-block text-ink transition-colors duration-300 hover:text-orange"
                    >
                      {l.label}
                      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-orange transition-all duration-300 group-hover:w-full" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Reach us */}
            <div className="lg:col-span-4">
              <h4 className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] sm:tracking-[0.22em] text-orange">
                <span className="h-px w-8 bg-gradient-to-r from-orange to-transparent" aria-hidden />
                Reach us
              </h4>
              <ul className="space-y-4 text-sm font-normal text-ink">
                {site?.address && (
                  <li className="flex gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange/10 text-orange">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </span>
                    <span className="leading-relaxed">{site.address}</span>
                  </li>
                )}
                {site?.phone && (
                  <li className="flex gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange/10 text-orange">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </span>
                    <a href={`tel:${site.phone}`} className="hover:text-orange transition-colors">
                      {site.phone}
                    </a>
                  </li>
                )}
                {site?.email && (
                  <li className="flex gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange/10 text-orange">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <a href={`mailto:${site.email}`} className="break-all hover:text-orange transition-colors">
                      {site.email}
                    </a>
                  </li>
                )}
              </ul>

              <p className="mt-6 text-[10px] uppercase tracking-[0.2em] text-purple-dark">Follow our atelier</p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {site?.socials?.instagram && (
                  <SocialIcon href={site.socials.instagram} label="Instagram">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </SocialIcon>
                )}
                {site?.socials?.youtube && (
                  <SocialIcon href={site.socials.youtube} label="YouTube">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </SocialIcon>
                )}
                {site?.socials?.facebook && (
                  <SocialIcon href={site.socials.facebook} label="Facebook">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </SocialIcon>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="hairline" />

        <div className="site-footer-bottom mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 sm:px-5 py-4 sm:py-5 sm:flex-row sm:gap-4">
          <p className="text-center text-[11px] sm:text-xs text-ink sm:text-left leading-relaxed max-w-full break-words px-1 sm:px-0">
            © {new Date().getFullYear()} {brandName}
            {site?.founded ? ` · ${site.founded}` : ""}
            {site?.city ? ` · ${site.city}` : ""}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:gap-x-5 text-[11px] sm:text-xs text-ink max-w-full">
            {policyLinks.map((p) => (
              <Link key={p.href} href={p.href} className="hover:text-orange transition-colors">
                {p.label}
              </Link>
            ))}
            <span className="hidden md:inline text-ink" aria-hidden>
              |
            </span>
            <span className="hidden md:inline text-[10px] uppercase tracking-[0.18em] text-purple-dark whitespace-nowrap">
              Couture · Courses · WhatsApp
            </span>
            <Link href="/admin" className="transition-colors hover:text-orange/70">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
