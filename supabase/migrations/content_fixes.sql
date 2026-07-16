-- =============================================================
-- Content fixes: Prayagraj→Patna, portfolio typos, settings facts,
-- product rich fields, inquiries preferred_date, policies
-- Run in Supabase SQL Editor if MCP apply_migration is unavailable.
-- =============================================================

-- 0a. Scrub Prayagraj from settings JSON / text (About pillars etc.)
UPDATE public.settings
SET
  about_body = replace(coalesce(about_body, ''), 'Prayagraj', 'Patna'),
  about_body_hi = replace(coalesce(about_body_hi, ''), 'Prayagraj', 'Patna'),
  intro = replace(coalesce(intro, ''), 'Prayagraj', 'Patna'),
  intro_hi = replace(coalesce(intro_hi, ''), 'Prayagraj', 'Patna'),
  city = replace(coalesce(city, ''), 'Prayagraj', 'Patna'),
  address = replace(coalesce(address, ''), 'Prayagraj', 'Patna'),
  about_pillars = replace(about_pillars::text, 'Prayagraj', 'Patna')::jsonb,
  pages = replace(pages::text, 'Prayagraj', 'Patna')::jsonb,
  updated_at = now()
WHERE id = 1;

-- 0b. Portfolio category / title typos
UPDATE public.portfolio
SET category = 'Design'
WHERE lower(trim(category)) IN ('disign', 'design');

UPDATE public.portfolio
SET category = 'Bridal'
WHERE lower(trim(category)) = 'news';

UPDATE public.portfolio
SET title = 'Bridal Lehenga — Studio Collection', category = 'Bridal'
WHERE lower(trim(title)) = 'news';

UPDATE public.portfolio
SET title = 'Designer Blouse', category = 'Design'
WHERE lower(trim(title)) IN ('disign', 'design');

UPDATE public.portfolio
SET title = 'Designer Wear', category = 'Design'
WHERE lower(trim(title)) IN ('disiner', 'designer');

-- 1. Extend settings with site facts (single source of truth)
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS founding_year int DEFAULT 2007;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS students_taught int DEFAULT 2000;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS outfits_delivered int DEFAULT 5000;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS express_delivery_hours int DEFAULT 24;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS phone_primary text;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS phone_secondary text;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS address_line text;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS pincode text DEFAULT '800001';
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS studio_hours text DEFAULT 'Mon–Sat, 10 AM–8 PM';
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS closed_days text DEFAULT 'Sunday';
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS whatsapp_number text;

UPDATE public.settings
SET
  founding_year = coalesce(founding_year, 2007),
  students_taught = coalesce(students_taught, 2000),
  outfits_delivered = coalesce(outfits_delivered, 5000),
  express_delivery_hours = coalesce(express_delivery_hours, 24),
  phone_primary = coalesce(nullif(phone_primary, ''), '+91 91175 55125'),
  phone_secondary = coalesce(nullif(phone_secondary, ''), '+91 95073 63125'),
  address_line = coalesce(nullif(address_line, ''), address),
  pincode = coalesce(nullif(pincode, ''), '800001'),
  studio_hours = coalesce(nullif(studio_hours, ''), 'Mon–Sat, 10 AM–8 PM'),
  closed_days = coalesce(nullif(closed_days, ''), 'Sunday'),
  whatsapp_number = coalesce(nullif(whatsapp_number, ''), whatsapp),
  city = coalesce(nullif(city, ''), 'Patna'),
  updated_at = now()
WHERE id = 1;

-- 4/5. Product rich fields
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS care text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS colours text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS estimated_delivery text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS description_long text;

-- 4. Lead capture preferred date
ALTER TABLE public.contact_inquiries ADD COLUMN IF NOT EXISTS preferred_date date;

-- 7. Expanded + new policy pages
-- TODO(owner): legal review before treating as binding
INSERT INTO public.policy_pages (slug, title, title_hi, body, body_hi, updated_at)
VALUES
(
  'privacy',
  'Privacy Policy',
  'गोपनीयता नीति',
  E'Last updated: 2026\n\nShreya Creation (“we”, “us”) operates a fashion boutique and stitching institute in Patna, Bihar. This policy explains how we handle personal information when you contact us, enquire about courses, or place boutique orders via WhatsApp, phone, email, or our website forms.\n\n1. Information we collect\nWe may collect your name, phone/WhatsApp number, email, preferred visit or demo date, measurements or order notes you share, and messages you send through our contact or demo forms.\n\n2. How we use information\nWe use it to respond to enquiries, schedule demos/studio visits, fulfil stitching or boutique orders, share course admission details, and improve our services. We do not sell your personal data.\n\n3. Sharing\nWe may share details only with service providers needed to deliver an order (e.g. courier) or when required by law. WhatsApp messages are processed under Meta’s terms when you chat with us on that platform.\n\n4. Retention\nEnquiry records may be kept in our systems for follow-up and business records. You may request correction or deletion of enquiry data by contacting us.\n\n5. Contact\nFor privacy requests: use the email and phone listed on our Contact page, or message us on WhatsApp.\n\nThis policy may be updated; the version on this page is current.',
  E'अंतिम अपडेट: 2026\n\nश्रेया क्रिएशन पटना में बुटीक और सिलाई संस्थान चलाता है। यह नीति बताती है कि WhatsApp, फोन, ईमेल या वेबसाइट फॉर्म से संपर्क करने पर आपकी जानकारी कैसे संभाली जाती है।\n\nहम नाम, फोन/WhatsApp, ईमेल, पसंदीदा तारीख और आपके संदेश एकत्र कर सकते हैं — केवल पूछताछ, डेमो, ऑर्डर और कोर्स प्रवेश के लिए। हम आपका डेटा नहीं बेचते।\n\nगोपनीयता अनुरोध के लिए Contact पेज पर दिए गए ईमेल/फोन या WhatsApp से संपर्क करें।',
  now()
),
(
  'shipping',
  'Shipping & Delivery',
  'शिपिंग और डिलीवरी',
  E'Last updated: 2026\n\n1. Boutique & custom stitching\nDelivery or pickup timelines are confirmed on WhatsApp after we agree design, fabric, measurements, and payment terms. Express stitching (often within 24 hours for eligible styles) depends on design complexity and fabric availability — we will confirm before starting work.\n\n2. Local pickup\nYou may collect finished garments from our Patna studio during studio hours. Bring a booking reference or WhatsApp confirmation.\n\n3. Courier / outstation\nWhere courier is arranged, charges, packing, and estimated transit time are shared before dispatch. Risk of transit damage should be reported promptly with photos so we can help with courier claims where applicable.\n\n4. Courses\nCourse materials (if any) are provided at the institute; there is no shipping of course kits unless separately agreed.',
  E'अंतिम अपडेट: 2026\n\nबुटीक/कस्टम सिलाई की डिलीवरी या पिकअप का समय माप, डिज़ाइन और पेमेंट तय होने के बाद WhatsApp पर कन्फर्म होता है। पात्र स्टाइल के लिए अक्सर 24 घंटे एक्सप्रेस सिलाई संभव है — जटिलता पर निर्भर।\n\nपटना स्टूडियो से पिकअप स्टूडियो समय में कर सकते हैं। कूरियर शुल्क और समय पहले बताए जाते हैं।',
  now()
),
(
  'returns',
  'Returns & Refunds',
  'रिटर्न और रिफंड',
  E'Last updated: 2026\n\n1. Made-to-measure / bespoke garments\nCustom-stitched outfits are made to your measurements and design choices. They are generally not returnable for a refund once cutting/stitching has begun, except where we made a clear error (wrong design agreed in writing/chat, or defective workmanship).\n\n2. Alterations\nMinor fit adjustments may be offered within 7 days of delivery/pickup for items we stitched, subject to fabric limits. Alteration scope is confirmed at the studio.\n\n3. Ready / display pieces\nIf a non-custom piece is sold as-is, return eligibility (if any) will be stated in your WhatsApp order confirmation.\n\n4. Refunds\nWhere a refund is agreed (e.g. our error and item returned as instructed), it is processed via the original payment method or UPI within a reasonable period after inspection.\n\n5. How to raise a request\nMessage us on WhatsApp with order details and photos within the timelines above.',
  E'अंतिम अपडेट: 2026\n\nमाप पर सिले कपड़े आमतौर पर कटिंग/सिलाई शुरू होने के बाद रिफंड के लिए वापस नहीं होते — सिवाय स्पष्ट गलती या खराब कारीगरी के।\n\nमामूली अल्टरेशन अक्सर डिलीवरी/पिकअप के 7 दिनों के भीतर संभव हैं। अनुरोध WhatsApp पर ऑर्डर विवरण और फोटो के साथ भेजें।',
  now()
),
(
  'terms',
  'Terms & Conditions',
  'नियम और शर्तें',
  E'Last updated: 2026\n\n// TODO(owner): legal review before treating as binding\n\n1. About us\nShreya Creation is a fashion boutique and stitching/fashion training institute in Patna, Bihar. Website content is for information; orders and admissions are confirmed via WhatsApp, phone, or in person.\n\n2. No online checkout\nProduct pages and course pages do not process card/UPI payments on this website. Pricing, deposits, and fees are agreed in chat or at the studio.\n\n3. Accurate information\nYou agree to provide accurate contact and measurement details. Delays or remakes caused by incorrect information may incur extra charges.\n\n4. Intellectual property\nPhotos, course outlines, and site copy belong to Shreya Creation. Do not reuse without permission.\n\n5. Limitation\nWe are not liable for delays caused by fabric shortage, courier failure, or force majeure. Liability for boutique work is limited to repair, remake, or refund as agreed for that order.\n\n6. Governing law\nThese terms are governed by the laws of India. Disputes are subject to courts in Patna, Bihar, unless otherwise required by law.\n\n7. Contact\nUse the Contact page details or WhatsApp for questions about these terms.',
  E'अंतिम अपडेट: 2026\n\nश्रेया क्रिएशन पटना का बुटीक और प्रशिक्षण संस्थान है। वेबसाइट पर ऑनलाइन चेकआउट नहीं है — ऑर्डर और फीस WhatsApp/स्टूडियो पर तय होते हैं। गलत माप से देरी या रीमेक पर अतिरिक्त शुल्क लग सकता है। कानून भारत के अनुसार; विवाद पटना क्षेत्राधिकार।',
  now()
),
(
  'course-cancellation',
  'Course Cancellation & Refund',
  'कोर्स रद्दीकरण और रिफंड',
  E'Last updated: 2026\n\n// TODO(owner): confirm deposit %, notice period, and batch-transfer rules with ownership before publishing as final.\n\n1. Enrolment\nA seat is confirmed after counselling, form submission, and fee/deposit payment as communicated at admission.\n\n2. Cancellation by student\n- Before batch start: write to us (WhatsApp/email) at least 7 days before the stated start date. Deposit handling (partial refund vs credit toward a later batch) will be confirmed in writing for your enrolment.\n- After batch start: fees are generally non-refundable once classes have begun, except at management discretion for documented medical or exceptional cases.\n\n3. Batch transfer\nSubject to availability, you may request transfer to a later batch of the same course. One transfer may be allowed without extra fee if requested before mid-course; later transfers may require a fee.\n\n4. Cancellation by institute\nIf we cancel a batch, you may choose a full refund of fees paid for that batch or transfer to another batch/date.\n\n5. Demo class\nFree demo sessions do not create an enrolment obligation. Demo slots may be limited.\n\n6. Certificates\nCertificates (where offered) are issued after successful completion of attendance/assessment requirements stated for that course.',
  E'अंतिम अपडेट: 2026\n\nबैच शुरू होने से कम से कम 7 दिन पहले लिखित रद्दीकरण पर जमा/फीस की स्थिति लिखित में बताई जाएगी। कक्षाएँ शुरू होने के बाद फीस आमतौर पर वापस नहीं होती। संस्थान द्वारा बैच रद्द होने पर रिफंड या ट्रांसफर का विकल्प मिलेगा। मुफ़्त डेमो से प्रवेश अनिवार्य नहीं होता।',
  now()
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  title_hi = EXCLUDED.title_hi,
  body = EXCLUDED.body,
  body_hi = EXCLUDED.body_hi,
  updated_at = now();

-- 8. Hero copy: replace keyword-stuffed headline with cleaner brand messaging
UPDATE public.settings
SET
  pages = jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            jsonb_set(
              coalesce(pages, '{}'::jsonb),
              '{home,hero_boutique_title}',
              to_jsonb('Your Fashion Career'::text),
              true
            ),
            '{home,hero_boutique_title_hi}',
            to_jsonb('आपका फैशन करियर'::text),
            true
          ),
          '{home,hero_boutique_title_highlight}',
          to_jsonb('Starts in Patna'::text),
          true
        ),
        '{home,hero_boutique_title_highlight_hi}',
        to_jsonb('पटना से शुरू'::text),
        true
      ),
      '{home,hero_boutique_subtitle}',
      to_jsonb(
        'Boutique courses with real studio training — plus bridal lehengas & designer blouses stitched in 24 hours on Boring Road.'::text
      ),
      true
    ),
    '{home,hero_boutique_subtitle_hi}',
    to_jsonb(
      'असली स्टूडियो ट्रेनिंग के साथ बुटीक कोर्स — ब्राइडल लहंगा व डिज़ाइनर ब्लाउज 24 घंटे में, बोरिंग रोड पर।'::text
    ),
    true
  ),
  updated_at = now()
WHERE id = 1;
