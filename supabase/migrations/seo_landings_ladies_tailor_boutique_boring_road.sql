-- Seed SEO landing page keys into settings.pages + restore service_role grants.
-- Run in Supabase SQL Editor (Dashboard → SQL → New query → Run).
-- Safe: jsonb_set merges keys; does not wipe other pages.
-- Source of truth: src/lib/seo-landing-content.js + PAGE_DEFAULTS.ladiesTailor / boutiqueBoringRoad

-- 1) Allow service_role for scripts / edge tooling (anon already has public read via RLS)
GRANT SELECT, INSERT, UPDATE ON public.settings TO service_role;

-- 2) Ladies Tailor landing (exact meta + hero copy — written once)
UPDATE public.settings
SET pages = jsonb_set(
  coalesce(pages, '{}'::jsonb),
  '{ladiesTailor}',
  coalesce(pages->'ladiesTailor', '{}'::jsonb) || jsonb_build_object(
    'meta_title', 'Best Ladies Tailor in Patna | Shreya Creation',
    'meta_description', 'Looking for the best ladies tailor in Patna? Shreya Creation offers designer blouses, bridal wear, custom stitching, perfect fitting, and Aari-Zari handwork.',
    'header_eyebrow', 'Ladies Tailor in Patna',
    'header_eyebrow_hi', 'पटना में लेडीज़ टेलर',
    'header_title', 'Ladies Tailor in Patna: Where Every Stitch Is Designed Around You',
    'header_title_hi', 'पटना में लेडीज़ टेलर: हर टांका आपके लिए',
    'header_subtitle', 'Looking for the best ladies tailor in Patna? Shreya Creation offers designer blouses, bridal wear, custom stitching, perfect fitting, and Aari-Zari handwork.',
    'header_subtitle_hi', 'पटना में बेस्ट लेडीज़ टेलर ढूँढ रहे हैं? Shreya Creation — डिज़ाइनर ब्लाउज, ब्राइडल वियर, कस्टम सिलाई, परफेक्ट फिटिंग और आरी-ज़री हैंडवर्क।',
    'intro_body', E'Finding the best ladies tailor in Patna is not only about getting the cloth stitched but about choosing the perfect fit and a beautiful, unique design according to your choice. We at Shreya Creation offer a wide range of stitching and designing services, including designer blouses, bridal wear, lehenga, suits, gowns, saree pre-stitching, custom outfits, and the best Aari & Zari work, based on your choice of measurements and design.\n\nBacked by a great experience of tailoring, our professional tailors provide you with the best-fitting clothes stitched right to you.',
    'hero_cta_primary_label', 'Book Your Custom Stitching',
    'hero_cta_secondary_label', 'Explore Our Designer Collection',
    'hero_cta_secondary_href', '/shop',
    'cta_title', 'Ready to Wear Something Made Just for You?',
    'cta_subtitle', 'Step into the world of Shreya Creation, the best ladies tailor in Patna, where your style comes first, every measurement matters, and every stitch has a purpose. You Imagine; We Will Shape It for You.',
    'cta_primary_label', 'Book Your Custom Stitching',
    'cta_secondary_href', '/shop',
    'cta_secondary_label', 'Explore Our Designer Collection',
    'cta_wa_message', 'Hi Shreya Creation! 👋 I''m looking for a ladies tailor in Patna for custom stitching. Please share design options, fitting, and timing.'
  ),
  true
),
updated_at = now()
WHERE id = 1;

-- 3) Boutique Boring Road landing (exact meta + hero + CTA — written once)
UPDATE public.settings
SET pages = jsonb_set(
  coalesce(pages, '{}'::jsonb),
  '{boutiqueBoringRoad}',
  coalesce(pages->'boutiqueBoringRoad', '{}'::jsonb) || jsonb_build_object(
    'meta_title', 'Boutique Boring Road | Shreya Creation',
    'meta_description', 'Discover Shreya Creation, a boutique Boring Road offering designer blouses, bridal wear, custom stitching, and designer collections. Your best boutique near me.',
    'header_eyebrow', 'Boutique · East Boring Canal Road, Patna',
    'header_title', 'Where Your Style Finds Its Perfect Address',
    'header_subtitle', 'Looking for Boutique Boring Road that understands your style beyond the standard stitch? Welcome to Shreya Creation, a fashion destination where personalised design and exquisite fitting meet. From designer blouse, bridal wear to elegant suits, gowns, lehengas, and customised outfit are made according to your desired specifications and fit.',
    'intro_body', 'For those who have been searching for the best boutique near me can explore a range of designer clothes that are not picked off the rack but created for the customer.',
    'hero_cta_primary_label', 'Book Your Custom Stitching',
    'hero_cta_secondary_label', 'Explore Our Designer Collection',
    'hero_cta_secondary_href', '/shop',
    'cta_title', 'Come With An Idea & Leave With The Creation',
    'cta_subtitle', 'Visit our boutique boring road destination for designer collections, customized stitching, designer bridal, and fashion designed around you.',
    'cta_primary_label', 'Book Your Custom Stitching',
    'cta_secondary_href', '/shop',
    'cta_secondary_label', 'Explore Our Designer Collection',
    'cta_wa_message', 'Hi Shreya Creation! 👋 I found your boutique on Boring Road and would like custom stitching / designer wear. Please share options and timings.'
  ),
  true
),
updated_at = now()
WHERE id = 1;
