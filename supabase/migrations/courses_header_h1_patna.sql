-- Update /courses page H1 (settings.pages.courses.header_title).
UPDATE public.settings
SET
  pages = jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          coalesce(pages, '{}'::jsonb),
          '{courses,header_title}',
          to_jsonb('Fashion Designing Stitching & Boutique master Courses in Patna'::text),
          true
        ),
        '{courses,header_title_hi}',
        to_jsonb('पटना में फैशन डिजाइनिंग, सिलाई और बुटीक मास्टर कोर्स'::text),
        true
      ),
      '{courses,header_highlight}',
      to_jsonb(''::text),
      true
    ),
    '{courses,header_highlight_hi}',
    to_jsonb(''::text),
    true
  ),
  updated_at = now()
WHERE id = 1;
