-- Standardize the brand name to "Shreya Creation" (capital C) across stored CMS copy.
-- The settings row held "Shreya creation" in brand/address/intro and in nested pages JSON,
-- which leaked the lowercase spelling into the navbar, footer, and several section headings.
UPDATE public.settings
SET
  brand = 'Shreya Creation',
  address = replace(address, 'Shreya creation', 'Shreya Creation'),
  intro = replace(intro, 'Shreya creation', 'Shreya Creation'),
  pages = replace(coalesce(pages, '{}'::jsonb)::text, 'Shreya creation', 'Shreya Creation')::jsonb,
  updated_at = now()
WHERE id = 1;
