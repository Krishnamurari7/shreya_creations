# Handoff — UX & correctness implementation (not deployed)

**Date:** 18 Sep 2026  
**Stack:** Next.js 15 App Router + OpenNext Cloudflare + Supabase + Tailwind  
**Local verify:** `npx next start -p 3010` after `npm run build`

## Changed components / why

| Area | Files | Why |
|---|---|---|
| Course 404s | `src/lib/data.js`, `supabase/migrations/restore_footer_courses.sql`, `scripts/restore-footer-courses.mjs` | Footer slugs missing from DB; seed fallback restores intended seed content; SQL for owner DB insert |
| Stats `undefined+` | `src/lib/site-config.js` (`formatCountPlus`), `Sections.jsx`, `BoutiqueClient.jsx`, `TrustStats.jsx` | Never render null/undefined metrics; counters keep authoritative value without animation dependency |
| Enquiry modal | `InquiryPopup.jsx`, `HomepageClient.jsx` | Open only via `openInquiryPopup` / existing CTAs; Escape, focus trap, restore, scroll lock |
| Nav readability | `Navbar.jsx`, `globals.css` | ~14px labels, ≥44px hit targets; compact menu below 1280px |
| Posters | `CourseCard.jsx`, `BlogGrid.jsx`, `globals.css` | `object-fit: contain` + cream frame for text posters |
| FAQ a11y | `FaqList.jsx` | `aria-expanded`, `aria-controls`, region labelling, 44px controls |
| Admission | `StudentRegistrationForm.jsx`, `globals.css` | Existing title → H1; bordered inputs; print chrome hide; mobile clearance vs WA bar |
| Footer | `Footer.jsx`, `globals.css` | Same links/text; mobile `<details>` groups; desktop always expanded |
| Video | `VideoShowcase.jsx` | Poster-first, user-initiated play; pause when out of view |
| Regression | `scripts/regress-course-slugs.mjs`, `scripts/content-baseline.mjs`, `scripts/content-preservation-check.mjs` | Focused checks + content inventory |

## Build / test results

| Gate | Status |
|---|---|
| `npm run build` | **PASS** |
| `npm run lint` | **FAIL (pre-existing)** — ESLint not installed (`npm install --save-dev eslint` needed) |
| `node scripts/regress-course-slugs.mjs` | **PASS** |
| Content preservation vs baseline | **PASS** 30/30 (CMS records unchanged) |
| Local route smoke (3010) | **PASS** — all listed templates 200 including restored course slugs + `/hi` |
| OpenNext / Cloudflare runtime for 1102 | **NOT TESTED** (no deploy; CF logs unavailable) |
| Responsive 360–1440 / 200% zoom / real device | **NOT TESTED** (layout CSS updated; visual QA pending) |
| Form submit to production APIs | **NOT TESTED** (by design — no live leads) |
| Screenshots before/after | **NOT CAPTURED** — use local `http://127.0.0.1:3010` for review |

## Content preservation

- Baseline: `reports/content-baseline.json`
- After check: `reports/content-preservation.json` — **0 unauthorized CMS changes**
- Rendering restoration: course detail for `fashion-designing-course` / `kids-wear-course` now serves **seed** content when DB row absent (same wording as `src/lib/seed.js`). Not fabricating new courses.
- DB insert of those courses **blocked**: service_role lacks `GRANT` on `courses`. Owner must run `supabase/migrations/restore_footer_courses.sql`.

## Apparent content inconsistencies (unchanged)

1. Trust years / founding messaging vs other pages (owner checklist already notes variance).
2. Course-count statements differ by surface (e.g. trust wall “10” vs marketing “50+” claims in SEO copy).
3. Settings email in DB: `hello@shreyacreations.in` vs site host / checklist `hello@shreyacreation.com`.
4. Restored seed courses are **Coming Soon** until PDF + about / `coming_soon=false` are set in Admin.

## P0 Cloudflare 1102

- Rechecked production HEAD/GET: `/faq`, `/hi`, `/policies/privacy`, `/portfolio/bridal-lehenga-maroon-gold` returned **200** in this session.
- `/courses/fashion-designing-course` & `/courses/kids-wear-course` still **404 on production** until code + optional SQL are deployed/applied.
- **Cannot claim 1102 fixed** without Worker logs + a deploy exercising OpenNext. Need: Cloudflare dashboard → Workers metrics/logs, or `wrangler tail` on `shreyacreations`.

## Owner next steps

1. Review UI locally on port 3010 (or `npm run preview` for OpenNext).
2. Run `restore_footer_courses.sql` in Supabase; set fees/PDF/`coming_soon` in Admin.
3. Decide admission fee field editability (left as-is).
4. Deploy deliberately when ready — **not auto-deployed**.
