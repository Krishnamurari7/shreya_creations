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

          <div className="nav-mobile-highlights">
            <span className="nav-highlight-box">{t.highlightStitching}</span>
            <span className="nav-highlight-box">{t.highlightSkill}</span>
          </div>

          <div className="nav-mobile-actions">
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

          <div className="nav-desktop-highlights">
            <span className="nav-highlight-box">{t.highlightStitching}</span>
            <span className="nav-highlight-box">{t.highlightSkill}</span>
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
          <span className="nav-logo-float-card nav-logo-float-card--drawer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_SRC} alt={brandName} className="nav-mobile-drawer-logo" />
          </span>
          <div className="nav-mobile-drawer-highlights">
            <span className="nav-highlight-box">{t.highlightStitching}</span>
            <span className="nav-highlight-box">{t.highlightSkill}</span>
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
            <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.436.002 9.861-4.417 9.864-9.858.002-2.636-1.02-5.115-2.879-6.978-1.859-1.862-4.331-2.887-6.974-2.889-5.439 0-9.864 4.417-9.868 9.86-.001 1.57.418 3.101 1.21 4.47l-.995 3.633 3.738-.979c1.378.75 2.766 1.139 4.239 1.14z" />
            </svg>
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
