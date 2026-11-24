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
import { normalizeBoutiqueNavItems } from "@/lib/boutique-services";
import { MORE_ROUTES } from "@/lib/more-routes";

const PRIMARY_ROUTES = [
  { href: "/", key: "home" },
  { href: "/shop", key: "boutique", dropdown: "boutique" },
  { href: "/student-store", key: "studentStore" },
  { href: "/courses", key: "institute" },
  { href: "/register", key: "register" },
  { href: "/contact", key: "contact" },
  { href: "/about", key: "more", dropdown: "more" },
];

const MOBILE_ROUTES = PRIMARY_ROUTES;

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
    case "studentStore":
      return <svg {...props}><path d="M4 8h16l-1 12H5L4 8Z"/><path d="M8 9V6a4 4 0 0 1 8 0v3"/><path d="M9 14h6"/></svg>;
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
    case "faq":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 9a2.5 2.5 0 1 1 4.3 1.7c-1.1 1-1.8 1.3-1.8 2.8" />
          <circle cx="12" cy="17" r="0.7" fill="currentColor" stroke="none" />
        </svg>
      );
    case "more":
      return (
        <svg {...props}>
          <circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none" />
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
    case "register":
      return (
        <svg {...props}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M8 13h8" />
          <path d="M8 17h5" />
        </svg>
      );
    case "hireStaff":
      return (
        <svg {...props}>
          <circle cx="9" cy="8" r="3" />
          <path d="M3 20v-2a6 6 0 0 1 12 0v2M17 8h5M19.5 5.5v5" />
        </svg>
      );
    default:
      return null;
  }
}

function DropItemIcon({ type }) {
  const props = {
    className: "nav-drop-item__icon",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };
  switch (type) {
    case "stitch":
      return (
        <svg {...props}>
          <rect x="4" y="10" width="16" height="8" rx="1.5" />
          <path d="M7 10V8.2a2 2 0 012-2h0a2 2 0 012 2V10" />
          <circle cx="16.5" cy="14" r="1.4" />
        </svg>
      );
    case "blouse":
      return (
        <svg {...props}>
          <path d="M8.5 4.5l3.5 2.2L15.5 4.5" />
          <path d="M8.5 4.5 6 8.5v9h12v-9L15.5 4.5" />
        </svg>
      );
    case "lehenga":
      return (
        <svg {...props}>
          <path d="M9 4.5h6l1 4.5H8z" />
          <path d="M8 9l-2.5 11h13L16 9" />
        </svg>
      );
    case "suit":
      return (
        <svg {...props}>
          <path d="M8 5.5h8v3H8z" />
          <path d="M7 8.5l-1.5 11h13L17 8.5" />
          <path d="M12 8.5v11" />
        </svg>
      );
    case "gown":
      return (
        <svg {...props}>
          <path d="M9.5 3.5l2.5 2 2.5-2" />
          <path d="M8.3 8.5 5.5 20.5h13L15.7 8.5" />
        </svg>
      );
    case "bridal":
      return (
        <svg {...props}>
          <path d="M12 3.5l1.8 3.6 4 .6-2.9 2.8.7 4L12 12.7l-3.6 1.8.7-4-2.9-2.8 4-.6z" />
        </svg>
      );
    case "spark":
      return (
        <svg {...props}>
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
          <path d="M6.2 6.2l2.8 2.8M15 15l2.8 2.8M17.8 6.2 15 9M9 15l-2.8 2.8" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
        </svg>
      );
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
  const [boutiqueOpen, setBoutiqueOpen] = useState(false);
  const [boutiquePinned, setBoutiquePinned] = useState(false);
  const [mobileBoutiqueOpen, setMobileBoutiqueOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [morePinned, setMorePinned] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const pathname = usePathname();
  const prevPath = useRef(pathname);
  const boutiqueRef = useRef(null);
  const moreRef = useRef(null);
  const wa = waLink(site?.whatsapp, greetingMessage(lang));
  const enquireHref = localizedPath("/contact", lang);
  const langToggleHref = alternateLanguagePath(pathname);
  const langToggleLabel = lang === "en" ? UI.en.language : UI.hi.language;
  const brandName = normalizeBrandName(site?.brand);

  const closeMenu = useCallback(() => {
    setOpen(false);
    setMobileBoutiqueOpen(false);
    setMobileMoreOpen(false);
  }, []);

  const closeBoutique = useCallback(() => {
    setBoutiqueOpen(false);
    setBoutiquePinned(false);
  }, []);

  const closeMore = useCallback(() => {
    setMoreOpen(false);
    setMorePinned(false);
  }, []);

  const pinBoutique = useCallback(() => {
    closeMore();
    setBoutiquePinned((pinned) => {
      if (pinned) {
        setBoutiqueOpen(false);
        return false;
      }
      setBoutiqueOpen(true);
      return true;
    });
  }, [closeMore]);

  const leaveBoutique = useCallback(() => {
    if (!boutiquePinned) setBoutiqueOpen(false);
  }, [boutiquePinned]);

  const pinMore = useCallback(() => {
    closeBoutique();
    setMorePinned((pinned) => {
      setMoreOpen(!pinned);
      return !pinned;
    });
  }, [closeBoutique]);

  const leaveMore = useCallback(() => {
    if (!morePinned) setMoreOpen(false);
  }, [morePinned]);

  useEffect(() => {
    if (prevPath.current !== pathname) {
      closeMenu();
      closeBoutique();
      closeMore();
      prevPath.current = pathname;
    }
  }, [pathname, closeMenu, closeBoutique, closeMore]);

  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.classList.remove("nav-open");
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open && !boutiqueOpen && !moreOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        closeMenu();
        closeBoutique();
        closeMore();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, boutiqueOpen, moreOpen, closeMenu, closeBoutique, closeMore]);

  useEffect(() => {
    if (!boutiqueOpen) return;
    const onPointer = (e) => {
      if (boutiqueRef.current && !boutiqueRef.current.contains(e.target)) {
        closeBoutique();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [boutiqueOpen, closeBoutique]);

  useEffect(() => {
    if (!moreOpen) return;
    const onPointer = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) closeMore();
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [moreOpen, closeMore]);

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
    if (href.includes("?")) return false;
    const localized = localizedPath(href.split("?")[0], lang);
    if (href === "/") return pathname === localized || pathname === "/hi";
    if (href.startsWith("/#")) return pathname === "/" || pathname === "/hi";
    return pathname === localized || pathname.startsWith(`${localized}/`);
  };

  const isBoutiqueActive =
    isActiveLink("/shop") ||
    pathname.includes("/boutique/") ||
    pathname.includes("/boutique-boring-road");
  const isMoreActive = MORE_ROUTES.some((route) => isActiveLink(route.href));

  const boutiqueItems = normalizeBoutiqueNavItems(site?.boutiqueNav);

  const labelFor = (item) => (lang === "hi" ? item.navLabelHi || item.navLabel : item.navLabel);
  const descFor = (item) => (lang === "hi" ? item.navDescHi || item.navDesc : item.navDesc);

  return (
    <>
    <header className={headerClass}>
      <AnnouncementBar items={site?.heroMarquee} />

      <div className="site-header-inner">
        <div className="nav-mobile-bar xl:hidden">
          <Link href={localizedPath("/", lang)} onClick={closeMenu} className="nav-brand nav-mobile-brand">
            <BrandLogo brandName={brandName} />
          </Link>

          <div className="nav-mobile-actions">
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-wa-circle nav-wa-circle--mobile navbar-wa-link"
              data-track-cta="navbar"
              aria-label={t.chatWhatsApp}
            >
              <WhatsAppIcon className="nav-wa-circle__icon" />
            </a>
            <Link
              href={enquireHref}
              className="nav-enquire-btn nav-enquire-btn--mobile nav-enquire-btn--shine"
            >
              <span className="nav-enquire-btn__text">{t.enquireNow}</span>
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

        <nav className="nav-desktop-bar nav-desktop-bar--luxury hidden xl:grid" aria-label="Main navigation">
          <Link href={localizedPath("/", lang)} className="nav-brand nav-desktop-brand">
            <BrandLogo brandName={brandName} />
          </Link>

          <div className="nav-links-glow-wrap">
            <ul className="nav-desktop-links nav-desktop-links--minimal nav-desktop-links--premium">
              {PRIMARY_ROUTES.map((r) => {
                if (r.dropdown === "boutique") {
                  return (
                    <li
                      key={r.href}
                      className={cn("nav-drop", boutiqueOpen && "is-open")}
                      ref={boutiqueRef}
                      onMouseEnter={() => { closeMore(); setBoutiqueOpen(true); }}
                      onMouseLeave={leaveBoutique}
                    >
                      <button
                        type="button"
                        className={cn("nav-drop__trigger", isBoutiqueActive && "is-active")}
                        aria-expanded={boutiqueOpen}
                        aria-haspopup="true"
                        aria-controls="boutique-nav-menu"
                        onClick={pinBoutique}
                      >
                        <NavLinkIcon type={r.key} />
                        <span className="nav-link-label">{t[r.key]}</span>
                        <ChevronDownIcon className="nav-drop__chevron" />
                      </button>
                      <div
                        id="boutique-nav-menu"
                        className={cn("nav-drop__panel", boutiqueOpen && "is-open")}
                        role="menu"
                        aria-label={t.boutique}
                        hidden={!boutiqueOpen}
                      >
                        <div className="nav-drop__panel-inner">
                          <p className="nav-drop__eyebrow">
                            <span aria-hidden>✦</span>
                            {lang === "hi" ? "बुटीक सेवाएँ" : "Boutique services"}
                          </p>
                          <ul className="nav-drop__grid">
                            {boutiqueItems.map((item) => {
                              const active = isActiveLink(item.href);
                              return (
                                <li key={item.href}>
                                  <Link
                                    href={localizedPath(item.href, lang)}
                                    role="menuitem"
                                    className={cn("nav-drop-item", active && "is-active")}
                                    onClick={closeBoutique}
                                  >
                                    <span className="nav-drop-item__icon-wrap">
                                      <DropItemIcon type={item.icon} />
                                    </span>
                                    <span className="nav-drop-item__copy">
                                      <span className="nav-drop-item__title">{labelFor(item)}</span>
                                      <span className="nav-drop-item__desc">{descFor(item)}</span>
                                    </span>
                                    <span className="nav-drop-item__arrow" aria-hidden>
                                      →
                                    </span>
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    </li>
                  );
                }

                if (r.dropdown === "more") {
                  return (
                    <li
                      key="more"
                      className={cn("nav-drop", "nav-drop--more", moreOpen && "is-open")}
                      ref={moreRef}
                      onMouseEnter={() => { closeBoutique(); setMoreOpen(true); }}
                      onMouseLeave={leaveMore}
                    >
                      <button
                        type="button"
                        className={cn("nav-drop__trigger", isMoreActive && "is-active")}
                        aria-expanded={moreOpen}
                        aria-haspopup="true"
                        aria-controls="more-nav-menu"
                        onClick={pinMore}
                      >
                        <NavLinkIcon type="more" />
                        <span className="nav-link-label">{t.more}</span>
                        <ChevronDownIcon className="nav-drop__chevron" />
                      </button>
                      <div
                        id="more-nav-menu"
                        className={cn("nav-drop__panel", moreOpen && "is-open")}
                        role="menu"
                        aria-label={t.more}
                        hidden={!moreOpen}
                      >
                        <div className="nav-drop__panel-inner">
                          <p className="nav-drop__eyebrow"><span aria-hidden>✦</span>{lang === "hi" ? "और देखें" : "Explore more"}</p>
                          <ul className="nav-drop__grid">
                            {MORE_ROUTES.map((item) => (
                              <li key={item.href}>
                                <Link
                                  href={localizedPath(item.href, lang)}
                                  role="menuitem"
                                  className={cn("nav-drop-item", isActiveLink(item.href) && "is-active")}
                                  onClick={closeMore}
                                >
                                  <span className="nav-drop-item__icon-wrap"><NavLinkIcon type={item.icon} className="nav-drop-item__icon" /></span>
                                  <span className="nav-drop-item__copy"><span className="nav-drop-item__title">{t[item.key]}</span></span>
                                  <span className="nav-drop-item__arrow" aria-hidden>→</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </li>
                  );
                }

                return (
                  <li key={r.href}>
                    <Link
                      href={localizedPath(r.href, lang)}
                      className={isActiveLink(r.href) ? "is-active" : undefined}
                    >
                      <NavLinkIcon type={r.key} />
                      <span className="nav-link-label">{t[r.key]}</span>
                    </Link>
                  </li>
                );
              })}
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
          {MOBILE_ROUTES.map((r, i) => {
            if (r.dropdown === "boutique") {
              return (
                <li key={r.href} style={{ "--nav-item-delay": `${i * 45}ms` }} className="nav-mobile-drop">
                  <button
                    type="button"
                    className={cn("nav-mobile-drop__trigger", isBoutiqueActive && "is-active")}
                    aria-expanded={mobileBoutiqueOpen}
                    onClick={() => { setMobileMoreOpen(false); setMobileBoutiqueOpen((v) => !v); }}
                    tabIndex={open ? 0 : -1}
                  >
                    <span className="nav-mobile-link-icon-wrap" aria-hidden>
                      <NavLinkIcon type={r.key} className="nav-mobile-link-icon" />
                    </span>
                    <span className="nav-mobile-link-text">{t[r.key]}</span>
                    <ChevronDownIcon className={cn("nav-mobile-drop__chevron", mobileBoutiqueOpen && "is-open")} />
                  </button>
                  <ul className={cn("nav-mobile-drop__list", mobileBoutiqueOpen && "is-open")} hidden={!mobileBoutiqueOpen}>
                    {boutiqueItems.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={localizedPath(item.href, lang)}
                          onClick={closeMenu}
                          className={isActiveLink(item.href) ? "is-active" : undefined}
                          tabIndex={open && mobileBoutiqueOpen ? 0 : -1}
                        >
                          <DropItemIcon type={item.icon} />
                          <span>
                            <span className="nav-mobile-drop__title">{labelFor(item)}</span>
                            <span className="nav-mobile-drop__desc">{descFor(item)}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            }

            if (r.dropdown === "more") {
              return (
                <li key="more" style={{ "--nav-item-delay": `${i * 45}ms` }} className="nav-mobile-drop">
                  <button
                    type="button"
                    className={cn("nav-mobile-drop__trigger", isMoreActive && "is-active")}
                    aria-expanded={mobileMoreOpen}
                    aria-controls="mobile-more-links"
                    onClick={() => { setMobileBoutiqueOpen(false); setMobileMoreOpen((v) => !v); }}
                    tabIndex={open ? 0 : -1}
                  >
                    <span className="nav-mobile-link-icon-wrap" aria-hidden><NavLinkIcon type="more" className="nav-mobile-link-icon" /></span>
                    <span className="nav-mobile-link-text">{t.more}</span>
                    <ChevronDownIcon className={cn("nav-mobile-drop__chevron", mobileMoreOpen && "is-open")} />
                  </button>
                  <ul id="mobile-more-links" className={cn("nav-mobile-drop__list", mobileMoreOpen && "is-open")} hidden={!mobileMoreOpen}>
                    {MORE_ROUTES.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={localizedPath(item.href, lang)}
                          onClick={closeMenu}
                          className={isActiveLink(item.href) ? "is-active" : undefined}
                          tabIndex={open && mobileMoreOpen ? 0 : -1}
                        >
                          <NavLinkIcon type={item.icon} className="nav-drop-item__icon" />
                          <span className="nav-mobile-drop__title">{t[item.key]}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            }

            return (
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
            );
          })}
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
