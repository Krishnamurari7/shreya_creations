-- Split testimonials into the two audiences the homepage shows side by side:
-- boutique stitching clients and fashion-institute students. Existing rows
-- default to 'boutique' because that is the larger, safer bucket — the keyword
-- backfill below moves the obvious course reviews across, and anything it
-- misses can be corrected from the admin panel.
--
-- Also records the headline Google Business numbers. These are entered by hand
-- (no Places API sync), so the rating card stays hidden until an owner fills
-- them in rather than shipping an invented rating.

alter table public.testimonials
  add column if not exists category text not null default 'boutique';

alter table public.testimonials
  drop constraint if exists testimonials_category_check;

alter table public.testimonials
  add constraint testimonials_category_check check (category in ('boutique', 'institute'));

update public.testimonials
set category = 'institute'
where category = 'boutique'
  and (
    text ilike '%course%'
    or text ilike '%institute%'
    or text ilike '%training%'
    or text ilike '%faculty%'
    or text ilike '%कोर्स%'
    or text ilike '%संस्थान%'
    or text ilike '%प्रशिक्षण%'
  );

alter table public.settings
  add column if not exists google_rating numeric(2, 1),
  add column if not exists google_review_count int;
