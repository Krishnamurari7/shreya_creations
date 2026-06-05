"use client";

import { useEffect } from "react";

export default function AdminModal({ open, onClose, title, children, footer }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="admin-modal-title">
      <button type="button" className="admin-modal__backdrop" aria-label="Close" onClick={onClose} />
      <div className="admin-modal__panel">
        <div className="admin-modal__head">
          <h2 id="admin-modal-title" className="admin-modal__title">
            {title}
          </h2>
          <button type="button" onClick={onClose} className="admin-modal__close" aria-label="Close">
            ✕
          </button>
        </div>
        <div className="admin-modal__body">{children}</div>
        {footer && <div className="admin-modal__foot">{footer}</div>}
      </div>
    </div>
  );
}
