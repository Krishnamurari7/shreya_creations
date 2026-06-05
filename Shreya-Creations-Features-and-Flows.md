# Shreya Creations — Features & Working Flows

A portfolio-style showcase website with a **Shop** and a **Courses** section. Visitors browse freely; **all ordering/enrolling/enquiry happens via WhatsApp**. **No customer login** — only the **admin logs in (email + password)** to manage content.

**Stack:** Next.js + Supabase (admin auth, database, image storage) + Vercel.

### Model in one line
> Public site = **portfolio + shop + courses showcase** → every action button **opens WhatsApp** with a prefilled message. Backend = a simple **admin panel** to add/edit what's shown.

---

## PART A — FEATURES

### 1. Public site — no login needed
- **Home / Portfolio:** hero, brand intro, featured work gallery, highlighted products & courses, testimonials, trust wall (orders delivered, students taught, years), Instagram feed, social links, floating WhatsApp button.
- **Portfolio gallery:** showcase of stitched/designed work (images, optional category filter, lightbox view) — the "look at my work" section.
- **Shop (showcase):** product grid with categories, search/filter; product detail page with image gallery, price, description, fabric/size info — and an **"Order on WhatsApp"** button (no cart/checkout).
- **Courses (showcase):** course grid by category; course detail with overview, syllabus, duration, language, price, optional preview video — and an **"Enroll on WhatsApp"** button.
- **About** and **Contact** pages (address, map, phone, email, WhatsApp, social).
- **FAQ** + policy pages.
- Bilingual (Hindi/English), mobile-first, PWA-installable.

### 2. WhatsApp redirect (replaces cart/checkout/payment)
- Every action — **Order**, **Stitch to my size**, **Enroll**, **Enquire** — opens WhatsApp (`wa.me`) with a **prefilled message** containing the item name, price, and page link.
  - Product → *"Hi, I'm interested in [Product] (₹[price]). [link]"*
  - Custom stitch → *"Hi, I want this stitched to my size: [Product]. Please share details."*
  - Course → *"Hi, I want to enroll in [Course] (₹[price])."*
- Floating WhatsApp button + header WhatsApp button on every page.
- No on-site payment, no order tracking, no measurement storage — all handled in the WhatsApp chat directly.

### 3. Trust & content (display only)
- **Testimonials / success stories** (text + photo/video).
- **Achievements / trust wall** counters & badges.
- Optional **blog / lookbook** for reach.
- Social links: Instagram, YouTube, Facebook.

### 4. Admin — login + content management (the only login on the site)
- **Login:** **email + password** (Supabase Auth). Single admin/owner account (staff accounts optional). No public sign-up; admin routes are gated.
- **Dashboard:** quick overview (counts of products, courses, portfolio items) + the WhatsApp number setting.
- **Portfolio manager:** add/edit/delete gallery images, captions, categories, ordering.
- **Shop manager:** add/edit/delete products — images, price, description, fabric/size, category, mark stitchable, publish/unpublish, set per-item WhatsApp message text.
- **Courses manager:** add/edit/delete courses & categories — thumbnail, price, description, syllabus, duration, language, optional preview video.
- **Testimonials manager:** add/edit/delete testimonials.
- **Trust wall / banners / about-contact content:** editable text & numbers.
- **Settings:** WhatsApp number, social links, contact details, languages.
- All images stored in Supabase Storage.

---

## PART B — WORKING FLOWS

### Flow 1 — Visitor browses & orders a product
1. Visitor opens the site (often from Instagram) → lands on **Home/Portfolio**.
2. Goes to **Shop** → filters/searches → opens a **product**.
3. Reviews images, price, fabric/size → taps **"Order on WhatsApp"**.
4. WhatsApp opens with a **prefilled message** (product name + price + link).
5. Owner and customer finish the order, measurements, and payment **inside WhatsApp**.

### Flow 2 — Custom stitching enquiry
1. Open a stitchable product → tap **"Stitch to my size."**
2. WhatsApp opens prefilled (design name + "stitch to my size").
3. Owner collects measurements / shares 24‑hr express details over chat.

### Flow 3 — Course enrollment
1. Open **Courses** → browse by category → open a **course**.
2. (Optional) watch preview video → tap **"Enroll on WhatsApp."**
3. WhatsApp opens prefilled (course name + price) → owner shares access/payment details in chat.

### Flow 4 — View portfolio / build trust
1. Visitor browses **Portfolio gallery**, **testimonials**, and **trust wall**.
2. Taps the floating **WhatsApp** button anytime to ask a question (prefilled greeting).

### Flow 5 — General enquiry / contact
1. Open **Contact** → tap WhatsApp / call / email, or use a simple contact form.
2. (If form) message is sent and the visitor is offered a WhatsApp redirect too.

### Flow 6 — Admin manages the site
1. Admin goes to `/admin` → **logs in with email + password**.
2. Adds/edits **products**, **courses**, **portfolio images**, **testimonials**, and **trust-wall numbers**.
3. Publishes/unpublishes items; updates the **WhatsApp number** and social links in **Settings**.
4. Changes appear instantly on the public site. Logs out.

---

## What is NOT in this version
- ❌ No customer accounts / customer login (only admin logs in).
- ❌ No cart, checkout, or online payment (all via WhatsApp).
- ❌ No on-site order tracking or saved measurements.
- ✅ Login method: **email + password**, **admin only**.

---

*Features & flows only — portfolio + shop + courses showcase with WhatsApp ordering and admin-only login.*

---

## Implementation status (Supabase)

| Feature | Supabase table / storage | Admin route |
|--------|-------------------------|-------------|
| Settings, WhatsApp, socials | `settings` | `/admin/settings` |
| Hero marquee, services, process, about copy | `settings` (JSON fields) | `/admin/content` |
| Products | `products` | `/admin/products` |
| Courses | `courses` | `/admin/courses` |
| Portfolio gallery | `portfolio` | `/admin/portfolio` |
| Testimonials | `testimonials` | `/admin/testimonials` |
| Trust wall | `trust_stats` | `/admin/trust` |
| FAQs | `faqs` | `/admin/faqs` |
| Policy pages | `policy_pages` | `/admin/policies` |
| Lookbook / blog | `lookbook_posts` | `/admin/lookbook` |
| Contact form log | `contact_inquiries` | `/admin/inquiries` |
| Images | Storage bucket `media` | Image uploader in forms |

**Public routes:** `/`, `/shop`, `/courses`, `/portfolio`, `/about`, `/contact`, `/faq`, `/lookbook`, `/policies/[slug]`, `/admin/login`

**Bilingual:** Hindi/English toggle in navbar; bilingual fields in settings, FAQs, trust stats, and policies.
