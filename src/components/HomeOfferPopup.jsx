"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "@/components/LanguageProvider";
import { DEFAULT_HOME_POPUP, validHomePopupLink } from "@/lib/home-popup";
import { resolveMediaSrc } from "@/lib/media";

const SEEN_PREFIX = "shreya_home_popup_seen_";

function copyForLanguage(config, lang, key) {
  const translated = config[`${key}Hi`];
  return lang === "hi" && translated ? translated : config[key];
}

export default function HomeOfferPopup({ settings, previewOpen = false, onPreviewClose, autoShow = true }) {
  const { lang } = useLanguage();
  const config = { ...DEFAULT_HOME_POPUP, ...(settings || {}) };
  const [mounted, setMounted] = useState(false);
  const [autoOpen, setAutoOpen] = useState(false);
  const panelRef = useRef(null);
  const previousFocusRef = useRef(null);
  const open = previewOpen || autoOpen;
  const href = typeof config.href === "string" ? config.href.trim() : "";
  const imageSrc = resolveMediaSrc(config.image);
  const title = copyForLanguage(config, lang, "title") || "Your popup title";
  const eyebrow = copyForLanguage(config, lang, "eyebrow") || (config.kind === "course" ? "New course" : "Special offer");
  const description = copyForLanguage(config, lang, "description");
  const buttonLabel = copyForLanguage(config, lang, "buttonLabel") || "View details";
  const imageAlt = copyForLanguage(config, lang, "imageAlt") || title;
  const campaignId = config.campaignId || `${config.kind}:${config.title}:${href}`;
  const seenKey = `${SEEN_PREFIX}${campaignId}`;

  const close = useCallback(() => {
    if (previewOpen) {
      onPreviewClose?.();
    } else {
      try { sessionStorage.setItem(seenKey, "1"); } catch { /* Storage can be unavailable. */ }
      setAutoOpen(false);
    }
    requestAnimationFrame(() => previousFocusRef.current?.focus?.());
  }, [onPreviewClose, previewOpen, seenKey]);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !autoShow || previewOpen || !config.enabled || !config.title?.trim() || !validHomePopupLink(href)) return;
    try { if (sessionStorage.getItem(seenKey)) return; } catch { /* Show the popup when storage is unavailable. */ }
    previousFocusRef.current = document.activeElement;
    setAutoOpen(true);
  }, [mounted, autoShow, previewOpen, config.enabled, config.title, href, seenKey]);

  useEffect(() => {
    if (!open) return undefined;
    if (previewOpen) previousFocusRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const panel = panelRef.current;
    const focusables = () => Array.from(panel?.querySelectorAll('button:not([disabled]), a[href]') || []);
    requestAnimationFrame(() => focusables()[0]?.focus());
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      } else if (event.key === "Tab") {
        const nodes = focusables();
        if (!nodes.length) return;
        if (event.shiftKey && document.activeElement === nodes[0]) {
          event.preventDefault();
          nodes[nodes.length - 1].focus();
        } else if (!event.shiftKey && document.activeElement === nodes[nodes.length - 1]) {
          event.preventDefault();
          nodes[0].focus();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, previewOpen, close]);

  if (!mounted || !open) return null;

  const linkClass = "inline-flex min-h-12 items-center justify-center rounded-full bg-[#d84c05] px-7 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition-colors hover:bg-[#ad3900] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d84c05]";

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center overflow-y-auto bg-black/75 p-3 sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
      <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="home-offer-title" aria-describedby={description ? "home-offer-description" : undefined} className="relative my-auto w-full max-w-2xl overflow-hidden rounded-[1.75rem] bg-[#fff9f3] text-[#24180f] shadow-2xl">
        <button type="button" onClick={close} aria-label={lang === "hi" ? "बंद करें" : "Close popup"} className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-2xl leading-none shadow-md hover:bg-[#fff0e5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d84c05]">×</button>
        {imageSrc && (
          validHomePopupLink(href) ? (
            <a href={href} onClick={(event) => { if (previewOpen) event.preventDefault(); else { try { sessionStorage.setItem(seenKey, "1"); } catch { /* Ignore unavailable storage. */ } } }} aria-label={`${title} — ${buttonLabel}`} className="relative block aspect-[1920/819] max-h-[48vh] bg-[#f8ede1]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageSrc} alt={imageAlt} fetchPriority="high" className="absolute inset-0 h-full w-full object-contain" />
            </a>
          ) : (
            <div className="relative aspect-[1920/819] max-h-[48vh] bg-[#f8ede1]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageSrc} alt={imageAlt} fetchPriority="high" className="absolute inset-0 h-full w-full object-contain" />
            </div>
          )
        )}
        <div className="px-6 pb-7 pt-6 text-center sm:px-10 sm:pb-9">
          <span className="inline-block rounded-full bg-[#f7decb] px-4 py-1 text-xs font-bold uppercase tracking-widest text-[#aa3c04]">{eyebrow}</span>
          <h2 id="home-offer-title" className="mt-4 font-serif text-3xl font-bold leading-tight sm:text-4xl">{title}</h2>
          {description && <p id="home-offer-description" className="mx-auto mt-3 max-w-xl whitespace-pre-line text-base leading-relaxed text-[#624f40]">{description}</p>}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {validHomePopupLink(href) && <a href={href} className={linkClass} onClick={(event) => { if (previewOpen) event.preventDefault(); else { try { sessionStorage.setItem(seenKey, "1"); } catch { /* Ignore unavailable storage. */ } } }}>{buttonLabel} →</a>}
            <button type="button" onClick={close} className="min-h-12 rounded-full border border-[#d8bfa9] px-6 py-3 text-sm font-semibold text-[#624f40] hover:bg-[#fff0e5]">{lang === "hi" ? "अभी नहीं" : "Maybe later"}</button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
