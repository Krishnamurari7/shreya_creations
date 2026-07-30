-- The nav label and the route now both read "Lookbook" (there is no /blog route),
-- so drop the "Blog &" prefix from the page eyebrow. The <title> keeps the word
-- "Blog" for search intent; only the on-page label changes.
UPDATE public.settings
SET
  pages = jsonb_set(coalesce(pages, '{}'::jsonb), '{lookbook,header_eyebrow}', to_jsonb('Lookbook'::text), true),
  updated_at = now()
WHERE id = 1;
