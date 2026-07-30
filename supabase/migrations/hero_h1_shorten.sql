-- Shorten the homepage H1 and move the location/since line into the subheading.
-- Keeps the admin CMS values in sync with the copy HeroSection.jsx now renders.
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
              to_jsonb('Patna''s Best Fashion Designing Institute'::text),
              true
            ),
            '{home,hero_boutique_title_hi}',
            to_jsonb('पटना का बेस्ट फैशन डिज़ाइनिंग इंस्टिट्यूट'::text),
            true
          ),
          '{home,hero_boutique_title_highlight}',
          to_jsonb('& Designer Boutique'::text),
          true
        ),
        '{home,hero_boutique_title_highlight_hi}',
        to_jsonb('और डिज़ाइनर बुटीक'::text),
        true
      ),
      '{home,hero_boutique_subtitle}',
      to_jsonb(
        'Practical boutique & fashion designing courses since 2012 — plus bridal lehengas and designer blouses stitched in 24 hours on Boring Road.'::text
      ),
      true
    ),
    '{home,hero_boutique_subtitle_hi}',
    to_jsonb(
      '2012 से प्रैक्टिकल बुटीक और फैशन डिज़ाइनिंग कोर्स — साथ ही ब्राइडल लहंगा व डिज़ाइनर ब्लाउज 24 घंटे में, बोरिंग रोड पर।'::text
    ),
    true
  ),
  updated_at = now()
WHERE id = 1;
