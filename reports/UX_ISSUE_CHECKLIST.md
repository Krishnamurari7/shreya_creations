# UX / correctness issue checklist — Shreya Creation (18 Sep 2026)

## Observed failures
| ID | Finding | Evidence |
|---|---|---|
| O1 | Footer course routes 404 | Live DB missing `fashion-designing-course` & `kids-wear-course`; `getCourseBySlug` returned null |
| O2 | Desktop nav ~9px | `.nav-desktop-links--minimal a { font-size: 0.5625rem }` |
| O3 | Enquiry opens on browse/scroll | `HomepageClient` scroll/timer + `InquiryPopup` `delayMs` |
| O4 | Course/blog posters crop text | `CardImage` default `fit="cover"` on CourseCard/BlogGrid |
| O5 | FAQ accordion missing ARIA | `FaqList` button lacked `aria-expanded` / controls |
| O6 | Admission page lacked H1 | Title was a `<span>` inside pill |

## Hypotheses (tested / mitigated)
| ID | Hypothesis | Result |
|---|---|---|
| H1 | CF Error 1102 = direct-request worker failure | **Intermittent / not reproduced** on 18 Sep 2026 recheck (faq/hi/privacy/portfolio returned 200). Needs CF logs + `wrangler` tail on incident. |
| H2 | Boutique `undefined+` from unbound `studentsTaught` | Hardened with `formatCountPlus` + site defaults (settings currently `2000`) |
| H3 | Fee inputs blank/editable = binding defect | **Owner decision** — form intentionally edits fee fields; left unchanged |

## Owner decisions / blockers
| ID | Item |
|---|---|
| D1 | Run `supabase/migrations/restore_footer_courses.sql` in Supabase SQL Editor (service_role lacks INSERT grant locally) |
| D2 | Confirm/publish course PDFs, fees, `coming_soon` for restored courses |
| D3 | Whether Final Payable on admission should be read-only |
| D4 | Reconcile trust-year / course-count claim inconsistencies across pages (left unchanged) |
| D5 | CF 1102: provide Worker logs / observability access for definitive root cause |

## Authorized fixes implemented
- Seed fallback for missing course slugs; SQL migration for DB restore
- Stats formatting guards; enquiry explicit-open only + focus trap
- Nav 14px+ / 44px targets; compact menu below 1280px
- Poster `object-fit: contain`; FAQ a11y; admission H1; footer collapsible cols
- VideoShowcase click-to-play; WA/register clearance; print CSS for admission
