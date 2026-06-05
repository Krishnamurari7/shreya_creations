"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { waLink, greetingMessage } from "@/lib/whatsapp";
import { useLanguage } from "@/components/LanguageProvider";
import { UI } from "@/lib/i18n";

const ROUTES = [
  { href: "/", key: "home" },
  { href: "/shop", key: "shop" },
  { href: "/courses", key: "courses" },
  { href: "/portfolio", key: "portfolio" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
  { href: "/faq", key: "faq" },
];

function MenuIcon({ open }) {
  if (open) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
        <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
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

  const closeMenu = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (prevPath.current !== pathname) {
      closeMenu();
      prevPath.current = pathname;
    }
  }, [pathname, closeMenu]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
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

  const barClass = scrolled ? "is-scrolled" : "";

  return (
    <header className={`site-header ${barClass}`}>
      <div className="site-header-inner">
        {/* Mobile logo bar */}
        <div className="nav-mobile-bar">
          <Link href="/" onClick={closeMenu} className="nav-mobile-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Shreya Creations" className="nav-mobile-logo" />
            <span className="nav-mobile-text">
              <span className="nav-mobile-title">
                Shreya <span className="text-gold-gradient">Creations</span>
              </span>
              <span className="nav-mobile-tagline">The Fashion Boutique</span>
            </span>
          </Link>
        </div>

        {/* Menu button — fixed, NOT inside any lg:hidden parent */}
        <button
          type="button"
          className="nav-menu-btn"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav-panel"
          onClick={() => setOpen((o) => !o)}
        >
          <MenuIcon open={open} />
        </button>

        {/* Desktop nav */}
        <nav className="nav-desktop-bar" aria-label="Main navigation">
          <Link href="/" className="nav-desktop-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Shreya Creations" className="nav-desktop-logo" />
            <span className="nav-desktop-text">
              <span className="nav-desktop-title">
                Shreya <span className="text-gold-gradient">Creations</span>
              </span>
              <span className="nav-desktop-tagline">The Fashion Boutique</span>
            </span>
          </Link>

          <ul className="nav-desktop-links">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={pathname === l.href ? "is-active" : undefined}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={toggle}
            className="btn-ghost rounded-full px-3 py-1.5 text-xs uppercase tracking-wider shrink-0"
            aria-label="Toggle language"
          >
            {t.language}
          </button>

          <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-gold nav-desktop-wa">
            {t.chatWhatsApp}
          </a>
        </nav>
      </div>

      {open && (
        <div
          id="mobile-nav-panel"
          className="nav-mobile-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <button type="button" aria-label="Close menu" className="nav-mobile-drawer-backdrop" onClick={closeMenu} />

          <nav className="nav-mobile-drawer-panel" aria-label="Mobile navigation links">
            <ul className="nav-mobile-drawer-list">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} onClick={closeMenu} className={pathname === l.href ? "is-active" : undefined}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="nav-mobile-drawer-footer flex flex-col gap-3">
              <button type="button" onClick={toggle} className="btn-ghost rounded-full py-2.5 text-sm">
                {t.language}
              </button>
              <a href={wa} target="_blank" rel="noopener noreferrer" onClick={closeMenu} className="btn-gold nav-mobile-drawer-wa">
                {t.chatWhatsApp}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
