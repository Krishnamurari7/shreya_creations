"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { waLink, greetingMessage } from "@/lib/whatsapp";
import { useLanguage } from "@/components/LanguageProvider";
import { useTheme } from "@/components/ThemeProvider";
import { UI, pickLocalized } from "@/lib/i18n";
import AnnouncementBar from "@/components/AnnouncementBar";

const ROUTES = [
  { href: "/", key: "home" },
  { href: "/shop", key: "shop" },
  { href: "/courses", key: "courses" },
  { href: "/portfolio", key: "portfolio" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
];

function ThemeIcon({ dark }) {
  if (dark) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <circle cx="12" cy="12" r="4" />
        <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
    </svg>
  );
}

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
  const { isDark, toggle: toggleTheme } = useTheme();
  const t = UI[lang];
  const links = ROUTES.map((r) => ({ href: r.href, label: t[r.key] }));
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const prevPath = useRef(pathname);
  const wa = waLink(site?.whatsapp, greetingMessage());
  const boutiqueTagline = pickLocalized(site, lang, "boutique", "boutiqueHi") || "From Skill to Business";
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
    scrolled ? "is-scrolled" : "",
    open ? "is-menu-open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
    <header className={headerClass}>
      <AnnouncementBar items={site?.heroMarquee} />

      <div className="site-header-inner">
        {/* Mobile header */}
        <div className="nav-mobile-bar">
          <Link href="/" onClick={closeMenu} className="nav-mobile-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt={brandName} className="nav-mobile-logo" />
            <span className="nav-mobile-text">
              <span className="nav-mobile-tagline">{boutiqueTagline}</span>
            </span>
          </Link>

          <div className="nav-mobile-actions">
            <button
              type="button"
              onClick={toggleTheme}
              className="nav-icon-btn"
              aria-label={isDark ? t.lightMode : t.darkMode}
              title={isDark ? t.lightMode : t.darkMode}
            >
              <ThemeIcon dark={isDark} />
            </button>
            <button
              type="button"
              className="nav-icon-btn nav-icon-btn--menu"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-nav-panel"
              onClick={() => setOpen((o) => !o)}
            >
              <MenuIcon open={open} />
            </button>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="nav-desktop-bar" aria-label="Main navigation">
          <Link href="/" className="nav-desktop-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt={brandName} className="nav-desktop-logo" />
            <span className="nav-desktop-text">
              <span className="nav-desktop-tagline">{boutiqueTagline}</span>
            </span>
          </Link>

          <ul className="nav-desktop-links">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={pathname === l.href ? "is-active" : undefined}>
                  <span className="nav-link-label">{l.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="nav-desktop-icons">
            <button
              type="button"
              onClick={toggleTheme}
              className="nav-icon-btn nav-icon-btn--desktop"
              aria-label={isDark ? t.lightMode : t.darkMode}
              title={isDark ? t.lightMode : t.darkMode}
            >
              <ThemeIcon dark={isDark} />
            </button>
            <button
              type="button"
              onClick={toggle}
              className="nav-lang-btn hidden xl:inline-flex"
              aria-label="Toggle language"
            >
              {t.language}
            </button>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-purple nav-desktop-wa nav-wa-cta hidden lg:inline-flex">
              <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.436.002 9.861-4.417 9.864-9.858.002-2.636-1.02-5.115-2.879-6.978-1.859-1.862-4.331-2.887-6.974-2.889-5.439 0-9.864 4.417-9.868 9.86-.001 1.57.418 3.101 1.21 4.47l-.995 3.633 3.738-.979c1.378.75 2.766 1.139 4.239 1.14z" />
              </svg>
              {t.chatWhatsApp}
            </a>
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt={brandName} className="nav-mobile-drawer-logo" />
          <p className="nav-mobile-drawer-tagline">{boutiqueTagline}</p>
        </div>

        <ul className="nav-mobile-drawer-list">
          {links.map((l, i) => (
            <li key={l.href} style={{ "--nav-item-delay": `${i * 45}ms` }}>
              <Link href={l.href} onClick={closeMenu} className={pathname === l.href ? "is-active" : undefined} tabIndex={open ? 0 : -1}>
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
            className="btn-purple nav-mobile-drawer-wa"
            tabIndex={open ? 0 : -1}
          >
            <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.436.002 9.861-4.417 9.864-9.858.002-2.636-1.02-5.115-2.879-6.978-1.859-1.862-4.331-2.887-6.974-2.889-5.439 0-9.864 4.417-9.868 9.86-.001 1.57.418 3.101 1.21 4.47l-.995 3.633 3.738-.979c1.378.75 2.766 1.139 4.239 1.14z" />
            </svg>
            {t.chatWhatsApp}
          </a>
        </div>
      </nav>
    </div>
    </>
  );
}
