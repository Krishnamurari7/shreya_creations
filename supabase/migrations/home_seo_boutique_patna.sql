-- Add homepage SEO meta + on-page copy (jsonb_set — does not replace other pages/home keys).
-- Run in Supabase SQL Editor: Dashboard → SQL → New query → paste → Run.

UPDATE public.settings
SET
  pages = jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            jsonb_set(
              jsonb_set(
                jsonb_set(
                  jsonb_set(
                    jsonb_set(
                      jsonb_set(
                        coalesce(pages, '{}'::jsonb),
                        '{home,meta_title}',
                        to_jsonb('Best Boutique in Patna | Shreya Creation'::text),
                        true
                      ),
                      '{home,meta_description}',
                      to_jsonb(
                        'Discover Shreya Creation, the best boutique in Patna, offering designer bridal wear, custom stitching, stylish outfits, exquisite detailing, and personalised fashion solutions.'::text
                      ),
                      true
                    ),
                    '{home,category_eyebrow}',
                    to_jsonb('Where Fashion Meets Creativity, Craft, & Opportunity'::text),
                    true
                  ),
                  '{home,category_title_before}',
                  to_jsonb(''::text),
                  true
                ),
                '{home,category_title_highlight}',
                to_jsonb('Best Boutique in Patna | Best Bridal Boutique in Patna'::text),
                true
              ),
              '{home,category_title_after}',
              to_jsonb(''::text),
              true
            ),
            '{home,category_subtitle}',
            to_jsonb(
              'Experience the best in designer fashion, quality bridal stitching, and a fashion design institute, all in one place at the best boutique in Patna. Be it crafting your dream wedding outfit or acquiring skills in fashion design, Shreya Creation can be your guide to all things fashion-related.'::text
            ),
            true
          ),
          '{home,academy_heading}',
          to_jsonb('Boutique Courses & Stitching Classes in Patna'::text),
          true
        ),
        '{home,academy_heading_highlight}',
        to_jsonb(''::text),
        true
      ),
      '{home,courses_script_tagline}',
      to_jsonb('Learn It. Create It. Make It Yours.'::text),
      true
    ),
    '{home,courses_subtitle}',
    to_jsonb(
      'Whether you seek to develop a career in fashion or create an outfit that feels truly yours, Shreya Creation provides you with the excellence, craftsmanship, and mentorship to make it happen. If you are searching for the best boutique near me, explore our custom stitching services at Boutique Boring Road, Patna.'::text
    ),
    true
  ),
  updated_at = now()
WHERE id = 1;
