-- Standardize brand founding year to 2012 across settings + CMS copy.
-- yearsExperience = current_year - founding_year (e.g. 2026 → 14+)

ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS founding_year int DEFAULT 2012;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS founded_hi text;

UPDATE public.settings
SET
  founding_year = 2012,
  founded = '14+ Years',
  founded_hi = '14+ वर्ष',
  hero_marquee = (
    SELECT coalesce(jsonb_agg(
      CASE
        WHEN elem::text ~* '2007|2005|17\\+' THEN to_jsonb(('14+ वर्षों का अनुभव | Since 2012'::text))
        ELSE elem
      END
    ), '[]'::jsonb)
    FROM jsonb_array_elements(coalesce(hero_marquee, '[]'::jsonb)) AS elem
  ),
  pages = pages
    || jsonb_build_object(
      'home', coalesce(pages->'home', '{}'::jsonb) || jsonb_build_object(
        'hero_badge', 'Shreya creation · Patna · Since 2012',
        'hero_badge_hi', 'श्रेया क्रिएशन · पटना · 2012 से',
        'hero_since_badge', 'Since 2012',
        'hero_since_badge_hi', '2012 से',
        'hero_since_text', '14+ Years Experience',
        'hero_since_text_hi', '14+ वर्षों का अनुभव',
        'atelier_title', '14+ Years of tailoring dreams into reality.',
        'atelier_title_hi', '14+ वर्ष — सिलाई की परंपरा।',
        'hero_boutique_title_highlight', 'in Patna Bihar, since 2012',
        'hero_boutique_title_highlight_hi', 'पटना बिहार में, 2012 से',
        'hero_title_highlight', 'in Patna Bihar, since 2012',
        'hero_title_highlight_hi', 'पटना बिहार में, 2012 से',
        'founder_quote', replace(coalesce(pages->'home'->>'founder_quote', ''), 'in 2005', 'in 2012'),
        'founder_quote_hi', replace(coalesce(pages->'home'->>'founder_quote_hi', ''), '2005 में', '2012 में')
      ),
      'about', coalesce(pages->'about', '{}'::jsonb) || jsonb_build_object(
        'hero_title_highlight', '14+ Years.',
        'hero_title_highlight_hi', '14+ वर्ष।'
      )
    ),
  updated_at = now()
WHERE id = 1;
