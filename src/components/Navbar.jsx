"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { waLink, greetingMessage } from "@/lib/whatsapp";
import { useLanguage } from "@/components/LanguageProvider";
import { UI } from "@/lib/i18n";
import { LOGO_SRC } from "@/lib/brand";
import AnnouncementBar from "@/components/AnnouncementBar";

const ROUTES = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/courses", key: "courses" },
  { href: "/portfolio", key: "gallery" },
  { href: "/contact", key: "contact" },
];

function MenuIcon({ open }) {
  return (
    <span className={`nav-menu-icon${open ? " is-open" : ""}`} aria-hidden>
      <span className="nav-menu-icon__line" />
      <span className="nav-menu-icon__line" />
      <span className="nav-menu-icon__line" />
    </span>
  );
}

function WhatsAppIcon({ className = "h-4 w-4 shrink-0" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function Navbar({ site }) {
  const { lang, toggle } = useLanguage();
  const t = UI[lang];
  const links = ROUTES.map((r) => ({ href: r.href, label: t[r.key] }));
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const prevPath = useRef(pathname);
  const wa = waLink(site?.whatsapp, greetingMessage());
  const enquireHref = "/contact";
  const brandName = site?.brand || "Shreya creation";

  const closeMenu = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (prevPath.current !== pathname) {
      closeMenu();
      prevPath.current = pathname;
    }
  }, [pathname, closeMenu]);

  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.classList.remove("nav-open");
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeMenu]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const headerClass = [
    "site-header",
    "site-header--luxury",
    scrolled ? "is-scrolled" : "",
    open ? "is-menu-open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const isActiveLink = (href) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
    <header className={headerClass}>
      <AnnouncementBar items={site?.heroMarquee} />

      <div className="site-header-inner">
        <div className="nav-mobile-bar lg:hidden">
          <Link href="/" onClick={closeMenu} className="nav-mobile-brand">
            <span className="nav-logo-float-card nav-logo-float-card--mobile">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={LOGO_SRC} alt={brandName} className="nav-mobile-logo" />
            </span>
          </Link>

          <div className="nav-mobile-actions">
            <button
              type="button"
              onClick={toggle}
              className="nav-lang-btn nav-lang-btn--mobile"
              aria-label={t.language}
            >
              {t.language}
            </button>
            <button
              type="button"
              className="nav-icon-btn nav-icon-btn--menu nav-icon-btn--luxury"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-nav-panel"
              onClick={() => setOpen((o) => !o)}
            >
              <MenuIcon open={open} />
            </button>
          </div>
        </div>

        <nav className="nav-desktop-bar nav-desktop-bar--luxury hidden lg:grid" aria-label="Main navigation">
          <Link href="/" className="nav-desktop-brand">
            <span className="nav-logo-float-card nav-logo-float-card--desktop">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={LOGO_SRC} alt={brandName} className="nav-desktop-logo" />
            </span>
          </Link>

          <ul className="nav-desktop-links nav-desktop-links--minimal">
            {links.map((l) => (
              <li key={`${l.href}-${l.label}`}>
                <Link
                  href={l.href}
                  className={isActiveLink(l.href) ? "is-active" : undefined}
                >
                  <span className="nav-link-label">{l.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="nav-desktop-end">
            <div className="nav-desktop-actions nav-desktop-actions--luxury">
              <button type="button" onClick={toggle} className="nav-lang-btn nav-lang-btn--luxury" aria-label={t.language}>
                {t.language}
              </button>
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-desktop-wa nav-wa-cta"
                aria-label={t.chatWhatsApp}
              >
                <WhatsAppIcon />
                <span className="nav-desktop-wa-label">{t.chatWhatsApp}</span>
              </a>
              <Link href={enquireHref} className="nav-enquire-btn nav-enquire-btn--desktop">
                {t.enquireNow}
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>

    <div
      id="mobile-nav-panel"
      className={`nav-mobile-drawer${open ? " is-open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      aria-label="Mobile navigation"
    >
      <button type="button" aria-label="Close menu" className="nav-mobile-drawer-backdrop" onClick={closeMenu} tabIndex={open ? 0 : -1} />

      <nav className="nav-mobile-drawer-panel" aria-label="Mobile navigation links">
        <div className="nav-mobile-drawer-head">
          <div className="nav-mobile-drawer-head-row">
            <span className="nav-logo-float-card nav-logo-float-card--drawer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={LOGO_SRC} alt={brandName} className="nav-mobile-drawer-logo" />
            </span>
            <button
              type="button"
              className="nav-icon-btn nav-icon-btn--luxury nav-drawer-close"
              aria-label="Close menu"
              onClick={closeMenu}
              tabIndex={open ? 0 : -1}
            >
              <MenuIcon open />
            </button>
          </div>
        </div>

        <ul className="nav-mobile-drawer-list">
          {links.map((l, i) => (
            <li key={`${l.href}-${l.label}`} style={{ "--nav-item-delay": `${i * 45}ms` }}>
              <Link href={l.href} onClick={closeMenu} className={isActiveLink(l.href) ? "is-active" : undefined} tabIndex={open ? 0 : -1}>
                <span className="nav-mobile-link-index">{String(i + 1).padStart(2, "0")}</span>
                <span className="nav-mobile-link-text">{l.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="nav-mobile-drawer-footer">
          <button
            type="button"
            onClick={toggle}
            className="nav-mobile-drawer-action"
            tabIndex={open ? 0 : -1}
          >
            {t.language}
          </button>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            className="btn-gold nav-mobile-drawer-wa"
            tabIndex={open ? 0 : -1}
          >
            <WhatsAppIcon />
            {t.chatWhatsApp}
          </a>
          <Link
            href={enquireHref}
            onClick={closeMenu}
            className="nav-enquire-btn w-full"
            tabIndex={open ? 0 : -1}
          >
            {t.enquireNow}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </nav>
    </div>
    </>
  );
}
