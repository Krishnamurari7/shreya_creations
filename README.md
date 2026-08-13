# Shreya Creations — 3D Couture Website

A portfolio + shop + courses showcase with a **3D animated hero** (Three.js / react-three-fiber), built on **Next.js 14 (App Router)** and **Supabase** (admin auth, database, image storage). Every Order / Stitch / Enroll / Enquire button opens **WhatsApp** with a prefilled message — there is no cart, checkout or on-site payment. The only login on the site is the **admin** (email + password).

> The site runs **out of the box in “demo mode”** using seed content in `src/lib/seed.js` when Supabase env vars are missing. With Supabase connected, **all content** (products, courses, portfolio, testimonials, trust wall, FAQs, policies, settings, lookbook, contact inquiries) is loaded from your database.

---

## 1. Quick start (local)

Requires **Node.js 18.18+** (Node 20 or 22 recommended).

```bash
npm install
cp .env.local.example .env.local   # then edit values (see below)
npm run dev
```

Open http://localhost:3000. The admin panel is at http://localhost:3000/admin.

### Environment variables (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210   # international format, no +, no spaces
```

If you leave the Supabase values as-is (or unset), the site stays in **demo mode**: it shows seed content and disables admin editing. The WhatsApp number still works from the env var.

---

## 2. Connect Supabase (enables admin + real content)

1. Create a free project at <https://supabase.com>.
2. In the dashboard go to **SQL Editor → New query**, paste the contents of [`supabase/schema.sql`](supabase/schema.sql), and **Run**. This creates the tables, security policies, a public `media` storage bucket, and a starter settings row.
3. Go to **Project Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Create your admin account: **Authentication → Users → Add user** (enter email + password, and tick “Auto Confirm User”). This is the account you’ll log in with at `/admin`. There is no public signup.
5. **Grant admin access:** in **SQL Editor**, run [`supabase/migrations/phase8_01_helpers_and_admins.sql`](supabase/migrations/phase8_01_helpers_and_admins.sql) (once), then [`supabase/scripts/grant_admin.sql`](supabase/scripts/grant_admin.sql) — edit the email in that file to match your login user. Without a row in the `admins` table, sign-in succeeds but `/admin` blocks you.
6. Restart `npm run dev`. Visit `/admin/login`, sign in, and start adding products, courses, portfolio images and testimonials.

That’s it — anything you add in `/admin` instantly replaces the demo content on the public site.

---

## 3. How content works

| Area | Demo mode (no Supabase) | Connected |
|---|---|---|
| Products / Courses / Portfolio / Testimonials | from `src/lib/seed.js` | Supabase tables |
| Trust wall / FAQs / Policies / Lookbook | from `seed.js` | `trust_stats`, `faqs`, `policy_pages`, `lookbook_posts` |
| Settings (WhatsApp, contact, socials, marquee, services) | from `seed.js` + env | `settings` + `/admin/content` |
| Contact form | WhatsApp only | Saved to `contact_inquiries` + WhatsApp |
| Admin login & editing | disabled | enabled |
| Images | placeholders | Supabase Storage `media` bucket |
| Hindi / English | UI toggle (client) | Bilingual DB fields + toggle |

**Images:** in the admin forms, the uploader sends files to the public `media` bucket and stores their URLs. Replace every placeholder with your own photos this way.

---

## 4. About the Instagram content

The seed text is based on the real **@shreya.creationss** business (Patna boutique — custom stitching, lehengas, gowns, blouses, bridal wear, jewellery, and fashion courses, with a “stitching in 24 hours” promise). The **photos are placeholders**, because Instagram images can’t be scraped and belong to the business. Add your real product, portfolio and testimonial photos through the admin panel.

To show a live Instagram feed on the site later, you can embed it with a widget such as Behold, EmbedSocial or LightWidget — drop the embed into `src/app/page.jsx`.

---

## 5. Deploy to Vercel

1. Push this folder to a GitHub repo.
2. At <https://vercel.com> → **New Project** → import the repo.
3. Add the three environment variables (same as `.env.local`) under **Settings → Environment Variables**.
4. Deploy. Vercel auto-detects Next.js — no extra config needed.

In Supabase, add your Vercel domain under **Authentication → URL Configuration** so admin login works in production.

---

## 6. Project structure

```
src/
├─ app/
│  ├─ page.jsx               # Home / portfolio (3D hero)
│  ├─ shop/                  # Shop list + [slug] product detail
│  ├─ courses/               # Courses list + [slug] course detail
│  ├─ portfolio/ about/ contact/ faq/
│  └─ admin/                 # login, dashboard, products, courses,
│                            #   portfolio, testimonials, settings
├─ components/
│  ├─ three/                 # 3D scenes (HeroScene, ThreeGem)
│  ├─ admin/                 # AdminShell, ResourceManager, ImageUploader
│  └─ ...                    # Navbar, Footer, cards, gallery, WhatsApp buttons
├─ lib/
│  ├─ supabase/              # browser, server & middleware clients
│  ├─ whatsapp.js            # builds wa.me links + prefilled messages
│  ├─ seed.js                # demo content (edit freely)
│  └─ data.js                # data layer: Supabase with seed fallback
└─ middleware.js             # refreshes session + gates /admin
supabase/schema.sql          # run this in Supabase SQL editor
```

---

## 7. Customising the look

- **Colours & fonts:** `tailwind.config.js` (palette) and `src/app/globals.css` (theme, fonts, effects). Fonts are self-hosted via `@fontsource` (Cormorant Garamond + Jost) — no Google Fonts fetch at build time.
- **3D hero:** `src/components/three/HeroScene.jsx` — the silk ribbons, fabric drape and gold-dust particles. Tweak colours, counts and motion speeds there.
- **WhatsApp messages:** `src/lib/whatsapp.js`.

---

## 8. What’s intentionally NOT included

- ❌ No customer accounts / customer login (admin only)
- ❌ No cart, checkout, or online payment (all via WhatsApp)
- ❌ No on-site order tracking or saved measurements

Built with Next.js 14, Supabase, Three.js / react-three-fiber, and Tailwind CSS.
