import fs from "fs";

const p = "src/app/globals.css";
let s = fs.readFileSync(p, "utf8");

// Patch luxury compact nav query to start at xl
s = s.replace(
  "@media (min-width: 1024px) and (max-width: 1279px) {\n  .nav-desktop-bar--luxury {",
  "@media (min-width: 1280px) and (max-width: 1399px) {\n  .nav-desktop-bar--luxury {"
);

// Soften 1024-1279 font squeeze for non-minimal (dead when desktop hidden, keep harmless)
s = s.replace(
  `.nav-desktop-bar--luxury .nav-desktop-links {
    gap: 0;
    padding: 0.2rem 0.35rem;
    font-size: 0.625rem;
    max-width: 100%;
    overflow: visible;
  }

  .nav-desktop-bar--luxury .nav-desktop-links a {
    padding: 0 0.5rem;
    white-space: nowrap;
  }

  .nav-desktop-actions--luxury {
    gap: 0.28rem;
    padding: 0.18rem;
  }

  .nav-lang-btn--luxury {
    min-height: 2rem;
    padding: 0 0.65rem;
    font-size: 0.625rem;
  }`,
  `.nav-desktop-bar--luxury .nav-desktop-links {
    gap: 0.1rem;
    padding: 0.3rem 0.4rem;
    font-size: 0.8125rem;
    max-width: 100%;
    overflow: visible;
  }

  .nav-desktop-bar--luxury .nav-desktop-links a {
    padding: 0.45rem 0.55rem;
    white-space: nowrap;
    min-height: 2.75rem;
    font-size: 0.8125rem;
  }

  .nav-desktop-actions--luxury {
    gap: 0.28rem;
    padding: 0.18rem;
  }

  .nav-lang-btn--luxury {
    min-height: 2.75rem;
    padding: 0 0.75rem;
    font-size: 0.75rem;
  }`
);

// Admission title heading inherits pill styles
if (!s.includes(".adm-doc__title-heading")) {
  s = s.replace(
    `.adm-doc__title-pill span {
  font-size: clamp(0.85rem, 2.2vw, 1.05rem);
  font-weight: 800;
  letter-spacing: 0.08em;
  color: var(--adm-ink);
}`,
    `.adm-doc__title-pill span,
.adm-doc__title-heading {
  margin: 0;
  font-size: clamp(0.85rem, 2.2vw, 1.05rem);
  font-weight: 800;
  letter-spacing: 0.08em;
  color: var(--adm-ink);
  font-family: inherit;
  line-height: 1.3;
}`
  );
}

// Contain poster background
if (!s.includes(".card-media--contain {")) {
  s = s.replace(
    `.card-media--contain img {
  object-fit: contain;
  object-position: center center;
}`,
    `.card-media--contain {
  background: var(--cream, #F5E8C8);
}

.card-media--contain img {
  object-fit: contain;
  object-position: center center;
}`
  );
}

// Register form clearance above mobile contact + WA
if (!s.includes(".register-page--form-only {")) {
  s += `

/* Keep admission submit clear of fixed WA + mobile contact bar */
@media (max-width: 767px) {
  .register-page--form-only {
    padding-bottom: calc(7.5rem + env(safe-area-inset-bottom, 0px));
  }
  .adm-doc__submit-wrap {
    padding-bottom: 0.5rem;
  }
}

.video-showcase-placeholder--button {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
  padding: 0;
  cursor: pointer;
  text-align: left;
  background: transparent;
  font: inherit;
  color: inherit;
}

/* Footer mobile collapsible groups */
@media (max-width: 639px) {
  .sf-col-collapse {
    border-bottom: 1px solid rgba(var(--orange-rgb), 0.12);
    padding-bottom: 0.75rem;
  }
  .sf-col-collapse > summary {
    list-style: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 2.75rem;
    gap: 0.75rem;
  }
  .sf-col-collapse > summary::-webkit-details-marker { display: none; }
  .sf-col-collapse:not([open]) .sf-col-collapse__body { display: none; }
}

@media (min-width: 640px) {
  .sf-col-collapse > summary { pointer-events: none; }
  .sf-col-collapse > summary .sf-col-collapse__chevron { display: none; }
}

/* Admission field surfaces — filled bordered inputs */
.adm-doc__line input,
.adm-doc__line select,
.adm-doc__line textarea,
.adm-doc__fee-box input,
.adm-doc input[type="text"],
.adm-doc input[type="tel"],
.adm-doc input[type="email"],
.adm-doc input[type="date"],
.adm-doc input[type="number"],
.adm-doc select,
.adm-doc textarea {
  min-height: 2.75rem;
  font-size: 16px;
  border: 1px solid rgba(var(--orange-rgb), 0.22);
  border-radius: 0.5rem;
  background: #fff;
  padding: 0.55rem 0.75rem;
}

.adm-doc__line input:focus,
.adm-doc__line select:focus,
.adm-doc__line textarea:focus,
.adm-doc__fee-box input:focus,
.adm-doc input:focus,
.adm-doc select:focus,
.adm-doc textarea:focus {
  outline: 2px solid rgba(var(--orange-text-rgb), 0.55);
  outline-offset: 2px;
  border-color: var(--orange);
}

@media (min-width: 768px) {
  .adm-doc__line-row,
  .adm-doc__addr-grid {
    column-gap: 1.25rem;
  }
}

@media print {
  .site-header,
  .wa-assistant-root,
  .mobile-contact-bar,
  .site-footer,
  .announcement-bar {
    display: none !important;
  }
  .adm-doc {
    box-shadow: none !important;
    border: 0 !important;
  }
  body {
    background: #fff !important;
  }
}
`;
}

fs.writeFileSync(p, s);
console.log("globals.css patched");
