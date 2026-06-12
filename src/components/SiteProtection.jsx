"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

function isAdminPath(pathname) {
  return pathname?.startsWith("/admin");
}

function isFormField(target) {
  if (!(target instanceof Element)) return false;
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    target.isContentEditable
  );
}

function isMobileDevice() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(pointer: coarse)").matches ||
    window.matchMedia("(hover: none)").matches ||
    "ontouchstart" in window
  );
}

function isBlockedShortcut(event) {
  const key = event.key?.toLowerCase();
  const { ctrlKey, metaKey, shiftKey, altKey } = event;

  if (key === "f12") return true;
  if (key === "printscreen") return true;

  const mod = ctrlKey || metaKey;
  if (!mod) return false;

  if (shiftKey && (key === "i" || key === "j" || key === "c")) return true;
  if (key === "u") return true;
  if (shiftKey && key === "s") return true;
  if (altKey && metaKey && (key === "i" || key === "j" || key === "c" || key === "u"))
    return true;

  return false;
}

export default function SiteProtection() {
  const pathname = usePathname();
  const [shieldActive, setShieldActive] = useState(false);

  useEffect(() => {
    if (isAdminPath(pathname)) return;

    const mobile = isMobileDevice();
    let shieldTimer;

    const activateShield = () => {
      if (!mobile) return;
      window.clearTimeout(shieldTimer);
      setShieldActive(true);
    };

    const deactivateShield = () => {
      window.clearTimeout(shieldTimer);
      shieldTimer = window.setTimeout(() => setShieldActive(false), 120);
    };

    const onContextMenu = (event) => {
      event.preventDefault();
    };

    const onKeyDown = (event) => {
      if (isBlockedShortcut(event)) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const onDragStart = (event) => {
      if (event.target instanceof HTMLImageElement) {
        event.preventDefault();
      }
    };

    const onCopy = (event) => {
      if (isFormField(event.target)) return;
      event.preventDefault();
    };

    const onSelectStart = (event) => {
      if (isFormField(event.target)) return;
      event.preventDefault();
    };

    const onVisibilityChange = () => {
      if (document.hidden) activateShield();
      else deactivateShield();
    };

    const onTouchStart = (event) => {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    };

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("dragstart", onDragStart);
    document.addEventListener("copy", onCopy);
    document.addEventListener("cut", onCopy);
    document.addEventListener("selectstart", onSelectStart);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", activateShield);
    window.addEventListener("focus", deactivateShield);
    window.addEventListener("pagehide", activateShield);
    window.addEventListener("pageshow", deactivateShield);

    if (mobile) {
      document.addEventListener("touchstart", onTouchStart, { passive: false });
    }

    document.body.classList.add("site-protected");
    if (mobile) {
      document.body.classList.add("site-protected--mobile");
    }

    return () => {
      window.clearTimeout(shieldTimer);
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("dragstart", onDragStart);
      document.removeEventListener("copy", onCopy);
      document.removeEventListener("cut", onCopy);
      document.removeEventListener("selectstart", onSelectStart);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", activateShield);
      window.removeEventListener("focus", deactivateShield);
      window.removeEventListener("pagehide", activateShield);
      window.removeEventListener("pageshow", deactivateShield);

      if (mobile) {
        document.removeEventListener("touchstart", onTouchStart);
      }

      document.body.classList.remove("site-protected");
      document.body.classList.remove("site-protected--mobile");
      setShieldActive(false);
    };
  }, [pathname]);

  if (isAdminPath(pathname)) return null;

  return (
    <div
      className={`site-protection-shield${shieldActive ? " is-active" : ""}`}
      aria-hidden="true"
    />
  );
}
