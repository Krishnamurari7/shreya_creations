"use client";

import { TEXT_GOLD_GRADIENT } from "@/lib/ui";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { BRAND_NAME, LOGO_SRC } from "@/lib/brand";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "◆" },
  { href: "/admin/products", label: "Shop", icon: "✦" },
  { href: "/admin/courses", label: "Courses", icon: "❖" },
  { href: "/admin/portfolio", label: "Portfolio", icon: "▣" },
  { href: "/admin/lookbook", label: "Blog", icon: "✧" },
  { href: "/admin/testimonials", label: "Testimonials", icon: "❝" },
  { href: "/admin/trust", label: "Trust stats", icon: "◎" },
  { href: "/admin/faqs", label: "FAQs", icon: "?" },
  { href: "/admin/pages", label: "Pages", icon: "📄" },
  { href: "/admin/content", label: "Content", icon: "✎" },
  { href: "/admin/policies", label: "Policies", icon: "§" },
  { href: "/admin/inquiries", label: "Enquiries", icon: "✉" },
  { href: "/admin/media", label: "Media", icon: "🖼" },
  { href: "/admin/settings", label: "Settings", icon: "⚙" },
];

function MenuIcon({ open }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      {open ? (
        <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
      ) : (
        <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
      )}
    </svg>
  );
}

function NavLinks({ pathname, onNavigate }) {
  return (
    <nav className="admin-nav" aria-label="Admin navigation">
      <ul className="admin-nav__list">
        {NAV.map((n) => {
          const active = pathname === n.href;
          return (
            <li key={n.href}>
              <Link
                href={n.href}
                onClick={onNavigate}
                className={`admin-nav__link ${active ? "is-active" : ""}`}
              >
                <span className="admin-nav__icon" aria-hidden>
                  {n.icon}
                </span>
                <span className="admin-nav__label">{n.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentPage = NAV.find((n) => n.href === pathname)?.label || "Admin";

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  useEffect(() => {
    closeDrawer();
  }, [pathname, closeDrawer]);

  useEffect(() => {
    if (isLogin) return;
    document.body.classList.add("admin-mode");
    return () => document.body.classList.remove("admin-mode");
  }, [isLogin]);

  useEffect(() => {
    if (!drawerOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const logout = async () => {
    const supabase = createClient();
    if (supabase) await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  if (isLogin) {
    return (
      <div className="admin-login-wrap">
        {children}
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Desktop sidebar */}
      <aside className="admin-sidebar" aria-label="Admin sidebar">
        <Link href="/" className="admin-brand admin-brand--logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_SRC} alt={BRAND_NAME} className="admin-brand__logo" />
          <span className="admin-brand__text">
            Shreya <span className={TEXT_GOLD_GRADIENT}>Admin</span>
          </span>
        </Link>
        <NavLinks pathname={pathname} onNavigate={closeDrawer} />
        <div className="admin-sidebar__foot">
          <button type="button" onClick={logout} className="admin-btn-ghost w-full">
            Log out
          </button>
          <Link href="/" className="admin-view-site">
            View site →
          </Link>
        </div>
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="admin-drawer" role="dialog" aria-modal="true" aria-label="Admin menu">
          <button type="button" className="admin-drawer__backdrop" aria-label="Close menu" onClick={closeDrawer} />
          <aside className="admin-drawer__panel">
            <div className="admin-drawer__head">
              <Link href="/" className="admin-brand admin-brand--logo" onClick={closeDrawer}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={LOGO_SRC} alt={BRAND_NAME} className="admin-brand__logo" />
                <span className="admin-brand__text">
                  Shreya <span className={TEXT_GOLD_GRADIENT}>Admin</span>
                </span>
              </Link>
              <button type="button" className="admin-drawer__close" onClick={closeDrawer} aria-label="Close menu">
                <MenuIcon open />
              </button>
            </div>
            <NavLinks pathname={pathname} onNavigate={closeDrawer} />
            <div className="admin-sidebar__foot">
              <button type="button" onClick={logout} className="admin-btn-ghost w-full">
                Log out
              </button>
              <Link href="/" className="admin-view-site" onClick={closeDrawer}>
                View site →
              </Link>
            </div>
          </aside>
        </div>
      )}

      <div className="admin-main">
        <header className="admin-topbar">
          <button
            type="button"
            className="admin-topbar__menu md:hidden"
            onClick={() => setDrawerOpen(true)}
            aria-expanded={drawerOpen}
            aria-controls="admin-drawer"
            aria-label="Open menu"
          >
            <MenuIcon open={false} />
          </button>
          <div className="admin-topbar__title">
            <span className="admin-topbar__eyebrow">Admin</span>
            <span className="admin-topbar__page">{currentPage}</span>
          </div>
          <Link href="/" className="admin-topbar__site md:hidden text-xs text-gold">
            Site
          </Link>
        </header>

        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
