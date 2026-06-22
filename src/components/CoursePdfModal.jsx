"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export const DEFAULT_COURSE_PDF =
  "/courses/pdfs/Basic suit and  Blouse Course.pdf";

function encodePdfPath(url = "") {
  if (!url) return url;
  const [path, ...hashParts] = url.split("#");
  const hash = hashParts.length ? `#${hashParts.join("#")}` : "";
  const encoded = path
    .split("/")
    .map((segment, index) => (index === 0 || !segment ? segment : encodeURIComponent(segment)))
    .join("/");
  return `${encoded}${hash}`;
}

export function coursePdfUrl() {
  return encodePdfPath(DEFAULT_COURSE_PDF);
}

export default function CoursePdfModal({ open, onClose, title, pdfUrl, lang = "en" }) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  const close = useCallback(() => {
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const onKey = (e) => {
      if (e.key === "Escape") close();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  useEffect(() => {
    if (open) setLoading(true);
  }, [open, pdfUrl]);

  if (!mounted || !open) return null;

  const t = {
    close: lang === "hi" ? "बंद करें" : "Close",
    heading: lang === "hi" ? "कोर्स विवरण PDF" : "Course Details PDF",
    loading: lang === "hi" ? "PDF लोड हो रही है…" : "Loading PDF…",
  };

  const viewerSrc = `${pdfUrl}#toolbar=0&navpanes=0&statusbar=0&messages=0&view=Fit`;

  return createPortal(
    <div
      className="course-pdf-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-pdf-modal-title"
    >
      <button type="button" className="course-pdf-modal__backdrop" aria-label={t.close} onClick={close} />

      <div className="course-pdf-modal__panel popup-panel">
        <header className="course-pdf-modal__head">
          <button type="button" className="course-pdf-modal__close" aria-label={t.close} onClick={close}>
            ✕
          </button>

          <div className="course-pdf-modal__head-copy">
            <p className="course-pdf-modal__eyebrow">{t.heading}</p>
            <h2 id="course-pdf-modal-title" className="course-pdf-modal__title">
              {title}
            </h2>
          </div>
        </header>

        <div className="course-pdf-modal__viewer">
          {loading && (
            <div className="course-pdf-modal__state course-pdf-modal__state--overlay">
              <span className="course-pdf-modal__spinner" aria-hidden />
              <p>{t.loading}</p>
            </div>
          )}

          <iframe
            src={viewerSrc}
            title={title}
            className="course-pdf-modal__iframe"
            onLoad={() => setLoading(false)}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
