"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function isAdminPath(pathname) {
  return pathname?.startsWith("/admin");
}

function isBlockedShortcut(event) {
  const key = event.key?.toLowerCase();
  const { ctrlKey, metaKey, shiftKey, altKey } = event;

  if (key === "f12") return true;

  const mod = ctrlKey || metaKey;
  if (!mod) return false;

  if (shiftKey && (key === "i" || key === "j" || key === "c")) return true;
  if (key === "u") return true;
  if (altKey && metaKey && (key === "i" || key === "j" || key === "c" || key === "u"))
    return true;

  return false;
}

export default function SiteProtection() {
  const pathname = usePathname();

  useEffect(() => {
    if (isAdminPath(pathname)) return;

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

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("dragstart", onDragStart);

    document.body.classList.add("site-protected");

    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("dragstart", onDragStart);
      document.body.classList.remove("site-protected");
    };
  }, [pathname]);

  return null;
}
