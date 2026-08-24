"use client";

import { BTN_PRIMARY } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import OptimizedImage from "@/components/OptimizedImage";
import { usePathname } from "next/navigation";
import { waLink, greetingMessage } from "@/lib/whatsapp";
import { useLanguage } from "@/components/LanguageProvider";
import { UI } from "@/lib/i18n";
import { alternateLanguagePath, localizedPath } from "@/lib/locale";
import { NAV_LOGO_SRC, normalizeBrandName } from "@/lib/brand";
import AnnouncementBar from "@/components/AnnouncementBar";

const ROUTES = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/shop", key: "boutique" },
  { href: "/courses", key: "institute" },
  { href: "/portfolio", key: "gallery" },
  { href: "/blog", key: "blog" },
  { href: "/nri-clients", key: "nriClients" },
  { href: "/contact", key: "contact" },
];

function NavLinkIcon({ type, className = "nav-link-icon" }) {
  const props = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  switch (type) {
    case "home":
      return (
        <svg {...props}>
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5 9.5V20h14V9.5" />
          <path d="M10 20v-6h4v6" />
        </svg>
      );
    case "about":
      return (
        <svg {...props}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "boutique":
      return (
        <svg {...props}>
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      );
    case "institute":
      return (
        <svg {...props}>
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      );
    case "gallery":
      return (
        <svg {...props}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
      );
    case "blog":
      return (
        <svg {...props}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          <path d="M8 7h8" />
          <path d="M8 11h8" />
          <path d="M8 15h5" />
        </svg>
      );
    case "nriClients":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
    case "contact":
      return (
        <svg {...props}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      );
    default:
      return null;
  }
}

function BrandLogo({ brandName, variant = "header" }) {
  const isDrawer = variant === "drawer";

  return (
    <span className={cn("nav-logo-3d", isDrawer && "nav-logo-3d--drawer")}>
      <span className="nav-logo-3d__body">
        <OptimizedImage
          src={NAV_LOGO_SRC}
          alt={brandName}
          width={150}
          height={60}
          sizes="150px"
          quality={65}
          loading="eager"
          fetchPriority="low"
          className={cn("nav-logo-img", isDrawer && "nav-logo-img--drawer")}
        />
      </span>
    </span>
  );
}

function ChevronDownIcon({ className = "nav-lang-chevron" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GlobeIcon({ className = "nav-lang-globe" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" strokeLinecap="round" />
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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

function WhatsAppIcon({ className = "h-4 w-4 shrink-0" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function Navbar({ site }) {
  const { lang } = useLanguage();
  const t = UI[lang];
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const prevPath = useRef(pathname);
  const wa = waLink(site?.whatsapp, greetingMessage(lang));
  const enquireHref = localizedPath("/contact", lang);
  const langToggleHref = alternateLanguagePath(pathname);
  const langToggleLabel = lang === "en" ? UI.en.language : UI.hi.language;
  const brandName = normalizeBrandName(site?.brand);

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

  const isHome = pathname === "/" || pathname === "/hi";

  const headerClass = [
    "site-header",
    "site-header--luxury",
    isHome ? "site-header--hero-overlay" : "",
    scrolled ? "is-scrolled" : "",
    open ? "is-menu-open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const isActiveLink = (href) => {
    const localized = localizedPath(href, lang);
    if (href === "/") return pathname === localized || pathname === "/hi";
    if (href.startsWith("/#")) return pathname === "/" || pathname === "/hi";
    return pathname === localized || pathname.startsWith(`${localized}/`);
  };

  return (
    <>
    <header className={headerClass}>
      <AnnouncementBar items={site?.heroMarquee} />

      <div className="site-header-inner">
        <div className="nav-mobile-bar lg:hidden">
          <Link href={localizedPath("/", lang)} onClick={closeMenu} className="nav-brand nav-mobile-brand">
            <BrandLogo brandName={brandName} />
          </Link>

          <div className="nav-mobile-actions">
            <Link
              href={langToggleHref}
              className="nav-lang-btn nav-lang-btn--mobile"
              aria-label={langToggleLabel}
            >
              <GlobeIcon />
              <span>{langToggleLabel}</span>
            </Link>
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
          <Link href={localizedPath("/", lang)} className="nav-brand nav-desktop-brand">
            <BrandLogo brandName={brandName} />
          </Link>

          <div className="nav-links-glow-wrap">
            <ul className="nav-desktop-links nav-desktop-links--minimal nav-desktop-links--premium">
              {ROUTES.map((r) => (
                <li key={r.href}>
                  <Link
                    href={localizedPath(r.href, lang)}
                    className={isActiveLink(r.href) ? "is-active" : undefined}
                  >
                    <NavLinkIcon type={r.key} />
                    <span className="nav-link-label">{t[r.key]}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="nav-desktop-end">
            <div className="nav-desktop-actions nav-desktop-actions--luxury">
              <Link href={langToggleHref} className="nav-lang-btn nav-lang-btn--luxury" aria-label={langToggleLabel}>
                <GlobeIcon />
                <span>{langToggleLabel}</span>
                <ChevronDownIcon />
              </Link>
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-wa-circle navbar-wa-link"
                data-track-cta="navbar"
                aria-label={t.chatWhatsApp}
              >
                <WhatsAppIcon className="nav-wa-circle__icon" />
              </a>
              <Link href={enquireHref} className="nav-enquire-btn nav-enquire-btn--desktop nav-enquire-btn--shine">
                <span className="nav-enquire-btn__text">{t.enquireNow}</span>
                <span className="nav-enquire-btn__arrow" aria-hidden>→</span>
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
          <p className="nav-mobile-drawer-eyebrow" aria-hidden>
            <span className="nav-mobile-drawer-eyebrow__sparkle">✦</span>
            {brandName}
          </p>
          <div className="nav-mobile-drawer-head-row">
            <BrandLogo brandName={brandName} variant="drawer" />
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
          {ROUTES.map((r, i) => (
            <li key={r.href} style={{ "--nav-item-delay": `${i * 45}ms` }}>
              <Link
                href={localizedPath(r.href, lang)}
                onClick={closeMenu}
                className={isActiveLink(r.href) ? "is-active" : undefined}
                tabIndex={open ? 0 : -1}
              >
                <span className="nav-mobile-link-icon-wrap" aria-hidden>
                  <NavLinkIcon type={r.key} className="nav-mobile-link-icon" />
                </span>
                <span className="nav-mobile-link-text">{t[r.key]}</span>
                <span className="nav-mobile-link-arrow" aria-hidden>→</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="nav-mobile-drawer-footer">
          <Link
            href={langToggleHref}
            className="nav-mobile-drawer-action"
            tabIndex={open ? 0 : -1}
            onClick={closeMenu}
          >
            <GlobeIcon className="nav-mobile-drawer-action__icon" />
            {langToggleLabel}
          </Link>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            data-track-cta="navbar"
            className={cn(BTN_PRIMARY, "nav-mobile-drawer-wa")}
            tabIndex={open ? 0 : -1}
          >
            <WhatsAppIcon />
            {t.chatWhatsApp}
          </a>
          <Link
            href={enquireHref}
            onClick={closeMenu}
            className="nav-enquire-btn nav-enquire-btn--shine w-full"
            tabIndex={open ? 0 : -1}
          >
            <span className="nav-enquire-btn__text">{t.enquireNow}</span>
            <span className="nav-enquire-btn__arrow" aria-hidden>→</span>
          </Link>
        </div>
      </nav>
    </div>
    </>
  );
}
