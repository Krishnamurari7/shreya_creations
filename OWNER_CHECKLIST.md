# Owner checklist — content & data to confirm

Run `supabase/migrations/content_fixes.sql` in the Supabase SQL Editor first (extends settings, products, inquiries, policies; fixes Prayagraj + portfolio typos).

## Must confirm (pick ONE value each)

1. **Students taught** — code default is **2000**. Site previously also showed 1000+, 30K+/30,000+. Edit in Admin → Site Settings → `students_taught`.
2. **Outfits delivered** — default **5000**. Confirm in Site Settings.
3. **Founding year** — default **2012** (`yearsExperience` = current year − this). Confirm in Site Settings.
4. **Studio hours** — default `Mon–Sat, 10 AM–8 PM`. Confirm (was also Mon–Sun 10–8 and 11 AM–8 Closed Tuesdays).
5. **Closed days** — default `Sunday`. Confirm.
6. **Email** — default `hello@shreyacreations.in`. Prefer `@shreyacreation.com` if that inbox exists.
7. **Course starting prices** — seed placeholders added for courses that had no price. Review every course in Admin → Courses and set real fees.
8. **Product details** — enrich Admin → Shop: multiple images, long description, fabric, care, colours, estimated delivery.
9. **Portfolio** — if live DB still has titles `News`, `disign`, `Disiner`, `design` after migration, rename in Admin → Portfolio. Categories: `disign` → `Design`; remove `news` if not a real category.
10. **Testimonials** — replace stock names/text with real reviews; upload real photos or leave photo empty (text-only).
11. **Policies** — review Privacy, Shipping, Returns, Terms, Course Cancellation before treating as legally binding (`// TODO(owner): legal review`).
12. **About pillars** — if “Prayagraj” still appears after SQL, edit Admin → Content / Pages About pillars to say **Patna**.

## SEO (run after content_fixes)

13. **Run migration** — execute `supabase/migrations/seo_fields.sql` in the Supabase SQL Editor (adds `meta_title`, `meta_description`, `og_image`, `image_alt`, `focus_keyword` to courses/products/portfolio, plus portfolio `slug`).
14. **Per-course SEO** — Admin → Courses → SEO tab: set meta title/description, image alt, optional OG image & focus keyword for each published course.
15. **Per-product SEO** — Admin → Shop → SEO tab: same fields; OG image should be the product photo when possible.
16. **Portfolio slugs & SEO** — Admin → Portfolio: ensure every piece has a readable slug (e.g. `reception-gown`) so `/portfolio/{slug}` is crawlable; fill meta + image alt.
17. **Page headers in CMS** — if Admin → Pages still stores old H1s (“Skill That Creates Income”, “Made-to-order couture”, etc.), update them to the SEO H1s (or clear fields so code defaults apply).
18. **Compress hero videos** — `public/video-1.mp4` (~24 MB) and `public/video-2.mp4` (~27 MB) hurt mobile CWV. Re-encode (e.g. 720p H.264, ~2–4 Mbps) and replace in place; site already uses `preload="none"`.
19. **Google Business Profile** — claim/optimize (category: Fashion Designer / Boutique), keep NAP identical to Site Settings, collect real Google reviews. Do **not** invent AggregateRating schema.

## Admin routes

- Public footer no longer links to `/admin`.
- `/admin` remains gated by Supabase auth (middleware) and is `noindex` + blocked in `robots.txt`.
