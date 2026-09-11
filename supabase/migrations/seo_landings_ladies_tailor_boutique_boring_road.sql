-- Seed SEO landing page keys into settings.pages + restore service_role grants.
-- Run in Supabase SQL Editor (Dashboard → SQL → New query → Run).
-- Safe: jsonb_set merges keys; does not wipe other pages.

-- 1) Allow service_role for scripts / edge tooling (anon already has public read via RLS)
GRANT SELECT, INSERT, UPDATE ON public.settings TO service_role;

-- 2) Ladies Tailor landing
UPDATE public.settings
SET pages = jsonb_set(
  coalesce(pages, '{}'::jsonb),
  '{ladiesTailor}',
  coalesce(pages->'ladiesTailor', '{}'::jsonb) || jsonb_build_object(
    'meta_title', 'Best Ladies Tailor in Patna | Shreya Creation',
    'meta_description', 'Looking for the best ladies tailor in Patna? Shreya Creation offers designer blouses, bridal wear, custom stitching, perfect fitting, and Aari-Zari handwork.',
    'header_eyebrow', 'Ladies Tailor · Boring Road, Patna',
    'header_title', 'Ladies Tailor in Patna: Where Every Stitch Is Designed Around You',
    'header_subtitle', 'Finding the best ladies tailor in Patna is not only about getting the cloth stitched but about choosing the perfect fit and a beautiful, unique design according to your choice.',
    'intro_body', E'We at Shreya Creation offer a wide range of stitching and designing services, including designer blouses, bridal wear, lehenga, suits, gowns, saree pre-stitching, custom outfits, and the best Aari & Zari work, based on your choice of measurements and design.\n\nBacked by a great experience of tailoring, our professional tailors provide you with the best-fitting clothes stitched right to you.',
    'hero_cta_primary_label', 'Book Your Custom Stitching',
    'hero_cta_secondary_label', 'Explore Our Designer Collection',
    'hero_cta_secondary_href', '/shop',
    'cta_title', 'Ready for a perfect fit?',
    'cta_subtitle', 'Book custom stitching or visit our Boring Road studio for a personalised consultation.',
    'cta_primary_label', 'Book Your Custom Stitching',
    'cta_secondary_href', '/shop',
    'cta_secondary_label', 'Explore Our Designer Collection',
    'cta_wa_message', 'Hi Shreya Creation! 👋 I''m looking for a ladies tailor in Patna for custom stitching. Please share design options, fitting, and timing.'
  ),
  true
),
updated_at = now()
WHERE id = 1;

-- 3) Boutique Boring Road landing
UPDATE public.settings
SET pages = jsonb_set(
  coalesce(pages, '{}'::jsonb),
  '{boutiqueBoringRoad}',
  coalesce(pages->'boutiqueBoringRoad', '{}'::jsonb) || jsonb_build_object(
    'meta_title', 'Boutique Boring Road | Shreya Creation',
    'meta_description', 'Discover Shreya Creation, a boutique Boring Road offering designer blouses, bridal wear, custom stitching, and designer collections. Your best boutique near me.',
    'header_eyebrow', 'Boutique · East Boring Canal Road, Patna',
    'header_title', 'Where Your Style Finds Its Perfect Address',
    'header_subtitle', 'Looking for Boutique Boring Road that understands your style beyond the standard stitch? Welcome to Shreya Creation, a fashion destination where personalised design and exquisite fitting meet.',
    'intro_body', E'From designer blouse, bridal wear to elegant suits, gowns, lehengas, and customised outfit are made according to your desired specifications and fit.\n\nFor those who have been searching for the best boutique near me can explore a range of designer clothes that are not picked off the rack but created for the customer.',
    'hero_cta_primary_label', 'Book Your Custom Stitching',
    'hero_cta_secondary_label', 'Explore Our Designer Collection',
    'hero_cta_secondary_href', '/shop',
    'cta_title', 'Visit our Boutique on Boring Road',
    'cta_subtitle', 'Explore designer collections or book custom stitching with a personalised boutique consultation.',
    'cta_primary_label', 'Book Your Custom Stitching',
    'cta_secondary_href', '/shop',
    'cta_secondary_label', 'Explore Our Designer Collection',
    'cta_wa_message', 'Hi Shreya Creation! 👋 I found your boutique on Boring Road and would like custom stitching / designer wear. Please share options and timings.'
  ),
  true
),
updated_at = now()
WHERE id = 1;
